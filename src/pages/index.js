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
  const { data: dataPlan1, isFetched: isFetchedPlan1 } = usePlan1();
  const { data: dataPlan2, isFetched: isFetchedPlan2 } = usePlan2();
  const { data: dataPlan3, isFetched: isFetchedPlan3 } = usePlan3();
  const [listsEmployee, setListsEmployee] = useState([]);

  const [data, setData] = useState([]);
  const [clientErr, setClientErr] = useState([]);
  const [selectedActiveCell, setSelectedActiveCell] = useState(null);


  const [columns, setColumns] = useState([
    {
      ...keyColumn("memberName", textColumn),
      title: "Member Name",
      minWidth: 200,
    },
    {
      ...keyColumn("relation", {
        ...CustomSelect({
          choices: [
            {
              value: "EMPLOYEE",
              label: "EMPLOYEE",
            },
            {
              value: "SPOUSE",
              label: "SPOUSE",
            },
            {
              value: "CHILDREN",
              label: "CHILDREN",
            },
          ],
        }),
      }),
      title: "Relation",
      minWidth: 200,
    },
    {
      ...keyColumn("employeeName", textColumn),
      title: "Employee name",
      minWidth: 200,
    },
    {
      ...keyColumn("bod", { ...CustomDatePicker() }),
      title: "Birth Date",
      minWidth: 200,
    },
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
      minWidth: 200,
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
      minWidth: 200,
    },
    {
      ...keyColumn("bank", {
        ...CustomSelect({
          choices: [],
        }),
      }),
      title: "Bank",
      minWidth: 200,
    },
    {
      ...keyColumn("bankBranch", textColumn),
      title: "Bank Branch",
      minWidth: 200,
    },
    {
      ...keyColumn("bankAccountNumber", textColumn),
      title: "Bank Account Number",
      minWidth: 200,
    },
    { ...keyColumn("email", textColumn), title: "Email", minWidth: 200 },
    {
      ...keyColumn("phoneNumber", textColumn),
      title: "Phone Number",
      minWidth: 200,
    },
    { ...keyColumn("nik", textColumn), title: "NIK", minWidth: 200 },
    {
      ...keyColumn("fullAddress", textColumn),
      title: "Full Address",
      minWidth: 200,
    },
    {
      ...keyColumn("employeeId", textColumn),
      title: "Employee ID",
      minWidth: 200,
    },
    {
      ...keyColumn("departement", textColumn),
      title: "Departement",
      minWidth: 200,
    },
    { ...keyColumn("jobLevel", textColumn), title: "Job Level", minWidth: 200 },
    { ...keyColumn("jobTitle", textColumn), title: "Job Title", minWidth: 200 },
    { ...keyColumn("notes", textColumn), title: "Notes", minWidth: 200 },
    {
      ...keyColumn("insuranceProvider", {
        ...CustomSelect({
          choices: [],
        }),
      }),

      title: "Provider",
      minWidth: 200,
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
              minWidth: 200,
            };
          } else {
            return v;
          }
        });
      });
    }
  }, [dataBank, isFetchedBank]);

  useEffect(() => {
    if (data) {
      const mappingEmployeeName = [];
      data.forEach((row) => {
        if (row.relation === "EMPLOYEE") {
          mappingEmployeeName.push({
            value: row.memberName,
            label: row.memberName,
          });
        }
      });

      setListsEmployee(mappingEmployeeName);
    }
  }, [data]);

  useEffect(() => {
    if (listsEmployee.length > 0) {
      console.log("listsEmployee", listsEmployee);
      setColumns((prevCol) => {
        return prevCol.map((col) => {
          if (col.id === "employeeName") {
            return {
              ...keyColumn("employeeName", {
                ...CustomSelect({
                  choices: listsEmployee,
                }),
              }),
              title: "Employee name",
              minWidth: 200,
            };
          }

          return col;
        });
      });
    }
  }, [listsEmployee]);

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
              minWidth: 200,
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

    const renderPlan = () => {
      return arrPlan.map((plan, idx)=>{
        return  {
          ...keyColumn(`plan${idx + 1}`, {
            ...CustomSelect({
              choices: arrPlan[idx],
            }),
          }),
          title: `Plan ${idx + 1}`,
          minWidth: 200,
        }
      })
    }
    
    setColumns((prev) => {
      return [
        ...prev,
        ...renderPlan()
       ,
      ];
    });
   
  };

  useEffect(()=>{
    if(isFetchedPlan1 && isFetchedPlan2 && isFetchedPlan3){
      onAddPlanColumn()
    }
  },[isFetchedPlan1, isFetchedPlan2, isFetchedPlan3])

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

    const changeVal = _.differenceBy(value, data, getListColumns);

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
