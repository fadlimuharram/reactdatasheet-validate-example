import * as React from "react";
import { render } from "react-dom";
import { ReactGrid, Column,  } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { useInsurance } from "@/hooks/useGetInsurance";
import { useGetBankLists } from "@/hooks/useGetBanks";
import { getColumns } from "./helper";
import { DropdownCellTemplate } from "@/components/Select2";

const headerRow = {
  rowId: "header",
  cells: [
    { type: "header", text: "Member Name" },
    { type: "header", text: "Relation" },
    { type: "header", text: "Employee Name" },
    { type: "header", text: "Birth Date" },
    { type: "header", text: "Gender" },
    { type: "header", text: "Marital Status" },
    { type: "header", text: "Bank" },
    { type: "header", text: "Bank Branch" },
    { type: "header", text: "Bank Account Number" },
    { type: "header", text: "Email" },
    { type: "header", text: "Phone Number" },
    { type: "header", text: "NIK" },
    { type: "header", text: "Full Address" },
    { type: "header", text: "Employee ID" },
    { type: "header", text: "Departement" },
    { type: "header", text: "Job Level" },
    { type: "header", text: "Job Title" },
    { type: "header", text: "Notes" },
    { type: "header", text: "Insurance Provider" },
    { type: "header", text: "Plan 1" },
    { type: "header", text: "Plan 2" },
    { type: "header", text: "Plan 3" },
  ],
};

const mr = [
  {
    value: "",
    label: "",
  },
  {
    value: "mr",
    label: "Mr",
  },
];

const mrs = [
  {
    value: "",
    label: "",
  },
  {
    value: "mrs",
    label: "Mrs",
  },
  {
    value: "paijo",
    label: "paijo",
  },
];

const getRows = (people, isOpen, columnId) => {
  return [
    headerRow,
    ...people.map((person, idx) => {
      return {
        rowId: idx,
        cells: [
          { type: "text", text: person.memberName },
          {
            type: "dd",
            values: person.relation,
            isOpen: columnId == "relation" && isOpen[idx],
            selectedValue: person.selectedRelation,
          },
          { type: "text", text: person.employeeName },
          { type: "text", text: person.birthDate },
          {
            type: "dd",
            values: person.gender,
            isOpen: columnId == "gender" && isOpen[idx],
            selectedValue: person.selectedGender,
          },
          {
            type: "dd",
            values: person.maritalStatus,
            isOpen: columnId == "maritalStatus" && isOpen[idx],
            selectedValue: person.selectedMaritalStatus,
          },
          {
            type: "dd",
            values: person.bank,
            isOpen: columnId == "bank" && isOpen[idx],
            selectedValue: person.selectedBank,
          },
          { type: "text", text: person.bankBranch },
          { type: "text", text: person.bankAccountNumber },
          { type: "text", text: person.email },
          { type: "text", text: person.phoneNumber },
          { type: "text", text: person.nik },
          { type: "text", text: person.fullAddress },
          { type: "text", text: person.employeeId },
          { type: "text", text: person.department },
          { type: "text", text: person.jobLevel },
          { type: "text", text: person.jobTitle },
          { type: "text", text: person.notes },
          {
            type: "dd",
            values: person.insuranceProvider,
            isOpen: columnId == "insuranceProvider" && isOpen[idx],
            selectedValue: person.selectedInsuranceProvider,
          },
          { type: "text", text: person.plan1 },
          { type: "text", text: person.plan2 },
          { type: "text", text: person.plan3 },
          // {
          //   type: "dropdown",
          //   values: person.title,
          //   isOpen: columnId == "title" && isOpen[idx],
          //   selectedValue: person.selectedTitle,
          //   inputValue: person.selectedTitle,
          //   // isDisabled: true,
          //   // nonEditable: true,
          // },
        ],
      };
    }),
  ];
};

const applyChangesToPeople = (changes, prevPeople, setIsDropdownOpened) => {
  changes.forEach((change) => {
    const personIndex = change.rowId;
    const fieldName = change.columnId;

    if (change.type === "dropdown" || change.type === "dd") {
      if (change.previousCell.isOpen !== change.newCell.isOpen) {
        setIsDropdownOpened({
          [personIndex]: change.newCell.isOpen,
        });
      }
      if (change.previousCell.selectedValue !== change.newCell.selectedValue) {
        if (fieldName === "gender") {
          prevPeople[personIndex]["selectedGender"] = change.newCell.inputValue;
        } else if (fieldName === "bank") {
          prevPeople[personIndex]["selectedBank"] = change.newCell.inputValue;
        } else if (fieldName === "insuranceProvider") {
          prevPeople[personIndex]["selectedInsuranceProvider"] =
            change.newCell.inputValue;
        } else if (fieldName === "maritalStatus") {
          prevPeople[personIndex]["selectedMaritalStatus"] =
            change.newCell.inputValue;
        } else if (fieldName === "relation") {
          prevPeople[personIndex]["selectedRelation"] =
            change.newCell.inputValue;
        }
      }
    } else {
      prevPeople[personIndex][fieldName] = change.newCell.text;
    }
  });
  return [...prevPeople];
};

function App() {
  const [people, setPeople] = React.useState([]);
  const [isDropdownOpened, setIsDropdownOpened] = React.useState({});
  const [columns, setColumns] = React.useState(getColumns());
  const [addedRows, setAddRow] = React.useState(1);
  const [focusLocation, setFocusLocation] = React.useState({});

  const { data: insurance } = useInsurance();
  const { data: banks } = useGetBankLists();

  const rows = getRows(people, isDropdownOpened, focusLocation?.columnId);

  const handleChanges = (changes) => {
    setPeople((prevPeople) =>
      applyChangesToPeople(changes, prevPeople, setIsDropdownOpened)
    );
  };

  const handleAddRows = () => {
    setPeople((prevPeople) => [
      ...people,
      ...Array.from(
        {
          length: addedRows,
        },
        (val, idx) => ({
          memberName: "",
          employeeName: "",
          birthDate: "",
          bankAccountNumber: "",
          bankBranch: "",
          email: "",
          phoneNumber: "",
          nik: "",
          fullAddress: "",
          employeeId: "",
          department: "",
          jobLevel: "",
          jobTitle: "",
          notes: "",
          insuranceProvider: insurance.lists,
          plan1: "",
          plan2: "",
          plan3: "",
          bank: banks.lists.map((bank) => ({
            value: bank?.id,
            label: bank?.name,
          })),
          relation: [
            {
              label: "Employee",
              value: "employee",
            },
            {
              label: "Spouse",
              value: "spouse",
            },
            {
              label: "Children",
              value: "children",
            },
          ],
          maritalStatus: [
            {
              label: "single",
              value: "single",
            },
            {
              label: "marriage",
              value: "marriage",
            },
          ],
          gender: [
            {
              label: "male",
              value: "male",
            },
            {
              label: "female",
              value: "female",
            },
          ],
          title: [],
        })
      ),
    ]);
  };

  const handleColumnResize = (ci, width) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex((el) => el.columnId === ci);
      const resizedColumn = prevColumns[columnIndex];
      const updatedColumn = { ...resizedColumn, width };
      prevColumns[columnIndex] = updatedColumn;
      return [...prevColumns];
    });
  };

  return (
    <>
      <ReactGrid
        onCellsChanged={handleChanges}
        rows={rows}
        columns={columns}
        enableFillHandle
        onFocusLocationChanged={setFocusLocation}
        onColumnResized={handleColumnResize}
        customCellTemplates={{
          'dd': DropdownCellTemplate()
        }}
      />
      <div>
        <button onClick={handleAddRows}>Add record</button>
        <input value={addedRows} onChange={(e) => setAddRow(e.target.value)} />
      </div>
    </>
  );
}

export default App;
