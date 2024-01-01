import React, { useState, useEffect } from "react";
import {
  DynamicDataSheetGrid,
  textColumn,
  keyColumn,
} from "react-datasheet-grid";
import _ from "lodash";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import "react-datasheet-grid/dist/style.css";
import CustomSelect from "@/components/Select";
import CustomDatePicker from "@/components/DatePicker";
import { useValidateData } from "../hooks/useValidate";
import { useGetBankLists } from "@/hooks/useGetBanks";
import DatePickerWrapper from "@/libs/DatePicker";
import { useInsurance } from "@/hooks/useGetInsurance";
import { usePlan1 } from "@/hooks/useGetPlan1";
import { usePlan2 } from "@/hooks/useGetPlan2";
import { usePlan3 } from "@/hooks/useGetPlan3";

import "react-datepicker/dist/react-datepicker.css";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const Example = () => {
  const { mutate, data: dataResponse } = useValidateData();
  const { data: dataBank, isFetched: isFetchedBank } = useGetBankLists();
  const { data: dataInsurance, isFetched: isFetchedInsurance } = useInsurance();
  const { data: dataPlan1 } = usePlan1();
  const { data: dataPlan2 } = usePlan2();
  const { data: dataPlan3 } = usePlan3();

  const [data, setData] = useState([]);
  const [clientErr, setClientErr] = useState([]);
  const [selectedActiveCell, setSelectedActiveCell] = useState(null);
  const [planCount, setPlanCount] = useState(1);

  const [columns, setColumns] = useState([
    { ...keyColumn("memberName", textColumn), title: "Member Name" },
    { ...keyColumn("relation", textColumn), title: "Relation" },
    { ...keyColumn("employeeName", textColumn), title: "Employee name" },
    { ...keyColumn("bod", { ...CustomDatePicker() }), title: "Birth Date" },
    {
      ...keyColumn("gender", {
        ...CustomSelect({
          choices: [
            {
              value: "M",
              label: "M",
            },
            {
              value: "F",
              label: "F",
            },
          ],
        }),
      }),
      title: "Gender",
    },
    {
      ...keyColumn("maritalStatus", {
        ...CustomSelect({
          choices: [
            {
              value: "single",
              label: "Single",
            },
            {
              value: "marriage",
              label: "Marriage",
            },
          ],
        }),
      }),
      title: "Marital Status",
    },
    {
      ...keyColumn("bank", {
        ...CustomSelect({
          choices: [],
        }),
      }),
      title: "Bank",
    },
    { ...keyColumn("bankBranch", textColumn), title: "Bank Branch" },
    {
      ...keyColumn("bankAccountNumber", textColumn),
      title: "Bank Account Number",
    },
    { ...keyColumn("email", textColumn), title: "Email" },
    { ...keyColumn("phoneNumber", textColumn), title: "Phone Number" },
    { ...keyColumn("nik", textColumn), title: "NIK" },
    { ...keyColumn("fullAddress", textColumn), title: "Full Address" },
    { ...keyColumn("employeeId", textColumn), title: "Employee ID" },
    { ...keyColumn("departement", textColumn), title: "Departement" },
    { ...keyColumn("jobLevel", textColumn), title: "Job Level" },
    { ...keyColumn("jobTitle", textColumn), title: "Job Title" },
    { ...keyColumn("notes", textColumn), title: "Notes" },
    {
      ...keyColumn("insuranceProvider", {
        ...CustomSelect({
          choices: [],
        }),
      }),

      title: "Provider",
    },
    // {
    //   ...keyColumn("plan", {
    //     ...AsyncSelectItems2({
    //       choices: [],
    //     }),
    //   }),

    //   title: "Plan",
    // },
  ]);



  useEffect(() => {
    if (isFetchedBank && dataBank.lists.length > 0) {
      const selectBank = dataBank.lists.map((bank) => {
        return { value: bank.id, label: bank.name };
      });

      
      setColumns((prev) => {
        
        return prev.map((v) => {
          if (v.id === "bank") {
            return {
              ...keyColumn("bank", {
                ...CustomSelect({
                  choices: selectBank,
                }),
              }),
              title: "Bank",
            };
          } else {
            return v;
          }
        });
      });
    }
  }, [dataBank, isFetchedBank]);

  useEffect(() => {
    if (isFetchedInsurance && dataInsurance.lists.length > 0) {
      setColumns((prev) => {
        return prev.map((v) => {
          if (v.id === "insuranceProvider") {
            return {
              ...keyColumn("insuranceProvider", {
                ...CustomSelect({
                  choices: dataInsurance.lists,
                }),
              }),
              title: "Insurance Provider",
            };
          } else {
            return v;
          }
        });
      });
    }
  }, [dataInsurance, isFetchedInsurance]);

  useEffect(() => {
    if (clientErr.length > 0) {
      let toastClientError = "";

      clientErr.forEach((err) => {
        const findRowNo = data.findIndex((row) => row.rowId === err.rowId);

        toastClientError += `${err.message} at Row ${findRowNo + 1} \n`;
      });

      toast.error(toastClientError);
    }
  }, [clientErr, toast]);

  useEffect(() => {
    if (dataResponse && dataResponse.errors.length > 0) {
      let toastServerError = "";

      dataResponse.errors.forEach((err) => {
        const findRowNo = data.findIndex((row) => row.rowId === err.rowId);

        toastServerError += `${err.message} at Row ${findRowNo + 1} \n`;
      });

      toast.error(toastServerError);
    }
  }, [dataResponse, toast]);

  const onAddPlanColumn = () => {
    const arrPlan = [dataPlan1.lists, dataPlan2.lists, dataPlan3.lists];
    if (planCount > 3) {
      alert("Maximal 3 Plan");
      return;
    }

    setColumns((prev) => {
      return [
        ...prev,
        {
          ...keyColumn(`plan${planCount}`, {
            ...CustomSelect({
              choices: arrPlan[planCount - 1],
            }),
          }),
          title: `Plan ${planCount}`,
        },
      ];
    });
    setPlanCount((prev) => prev + 1);
  };

  const genId = () => {
    return _.uniqueId();
  };

  const hasError = (opt) => {
    let isError = false;
    if (dataResponse && dataResponse.errors && dataResponse.errors.length > 0) {
      dataResponse.errors.find((err) => {
        if (err.rowId === opt.rowData.rowId && err.column === opt.columnId) {
          isError = true;
        }
      });
    }

    if (clientErr.length > 0) {
      clientErr.find((err) => {
        if (err.rowId === opt.rowData.rowId && err.column === opt.columnId) {
          isError = true;
        }
      });
    }

    return isError;
  };

  const onValidateClient = (value) => {
    let err = [];

    value.forEach((row) => {
      if (row.email) {
        if (!validateEmail(row.email))
          err.push({
            rowId: row.rowId,
            column: "email",
            message: "Must Be Valid Email",
          });
      }
    });

    setClientErr(err);

    if (err.length > 0) return false;

    return true;
  };

  const onChange = (value) => {

    const getListColumns = columns.map((col) => col.id);

    const changeVal = _.differenceBy(
      value,
      data,
      getListColumns
    );
 

    let isAnyValue = false;
    _.each(changeVal, (val, key) => {
      _.each(val, (valObj, keyObj) => {
        if (keyObj !== "rowId") {
          if (valObj !== "") isAnyValue = true;
        }
      });
    });


    if (isAnyValue && onValidateClient(value)) {
      mutate(changeVal);
    }

    setData(value);
  };

  const debouncedOnChange = debounce(onChange, 500);

  return (
    <div
      style={{
        height: "1200px",
      }}
    >
      <DatePickerWrapper
        sx={{
          zIndex: 99999,
        }}
      >
        <DynamicDataSheetGrid
          value={data}
          onChange={debouncedOnChange}
          columns={columns}
          columnData
          // addRowsComponent
          onActiveCellChange={(cell) => {
            // // console.log("[change] active", cell);
            // dispatch(saveSheetContext({ activeCell: cell }));
            // setSelectedActiveCell(cell)
          }}
          onSelectionChange={(opts) => {
            // // console.log("[change] selection", opts);
          }}
          cellClassName={(opt) => {
            // // console.log("opt", opt);

            return hasError(opt) ? "row-error" : null;
          }}
          // createRow={() => ({ id: genId() })}
          duplicateRow={({ rowData }) => ({ ...rowData, rowId: genId() })}
          createRow={() => {
            const obj = {};
            obj.rowId = genId();
            columns.forEach((val) => {
              obj[val.id] = "";
            });

            // // console.log("created row", obj);
            return obj;
          }}
        />
      </DatePickerWrapper>

      <button type="button" onClick={onAddPlanColumn}>
        Add Plan
      </button>
      <hr />
      <pre>
        {`Client Validation => email`} <br />
        {`Server Validation => Insurance Provider, Plan1, Plan2, Plan3`}
      </pre>
      <hr />
      <pre>
        {`Insurance Provider 1 => ["PL-1", "PL-4", "PL-7"]`} <br />
        {`Insurance Provider 2 => ["PL-2", "PL-5", "PL-8"]`} <br />
        {`Insurance Provider 3 => ["PL-3", "PL-6", "PL-9"]`}
      </pre>
      <hr />
    </div>
  );
};

export default Example;
