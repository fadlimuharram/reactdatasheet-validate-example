import React from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";

const DatePickerComponent = ({
  active,
  rowData,
  setRowData,
  focus,
  stopEditing,
  columnData,
}) => {
  const renderSelected = () => {
    if (rowData) {
      const valueArray = rowData.split("-");
      const newDate = valueArray[1] + "-" + valueArray[0] + "-" + valueArray[2];
      const validDate = new Date(newDate);
      if (!isNaN(Date.parse(validDate))) {
        return validDate;
      }
    }

    return null;
  };

  return (
    <DatePicker
      dateFormat="dd-MM-yyyy"
      popperClassName="react-datepicker-popper"
      selected={renderSelected()}
      scrollableMonthYearDropdown
      popperProps={{ strategy: "fixed" }}
      showYearDropdown
      onChange={(date) => {
        setRowData(format(new Date(date), "dd-MM-yyyy"));
      }}
    />
  );
};

const CustomDatePicker = () => {
  return {
    component: DatePickerComponent,
    copyValue: ({ rowData }) => {
      return format(new Date(rowData), "dd-MM-yyyy");
    },

    pasteValue: ({ value }) => {
      return value;
    },
  };
};

export default CustomDatePicker;
