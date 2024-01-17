import { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import {
  getCellProperty,
  getCharFromKey,
  isAlphaNumericKey,
  keyCodes,
} from "@silevis/reactgrid";

export const DropdownCellTemplate = () => ({
  getCompatibleCell(uncertainCell) {
    let selectedValue;

    try {
      selectedValue = getCellProperty(uncertainCell, "selectedValue", "string");
    } catch {
      selectedValue = undefined;
    }

    const values = getCellProperty(uncertainCell, "values", "object");
    const value = selectedValue ? parseFloat(selectedValue) : NaN;

    let isDisabled = true;
    try {
      isDisabled = getCellProperty(uncertainCell, "isDisabled", "boolean");
    } catch {
      isDisabled = false;
    }

    let inputValue;
    try {
      inputValue = getCellProperty(uncertainCell, "inputValue", "string");
    } catch {
      inputValue = undefined;
    }

    let isOpen;
    try {
      isOpen = getCellProperty(uncertainCell, "isOpen", "boolean");
    } catch {
      isOpen = false;
    }

    const text = selectedValue || "";

    return {
      ...uncertainCell,
      selectedValue,
      text,
      value,
      values,
      isDisabled,
      isOpen,
      inputValue,
    };
  },

  update(cell, cellToMerge) {
    const selectedValueFromText = cell.values.some(
      (val) => val.value === cellToMerge.text
    )
      ? cellToMerge.text
      : undefined;
    return this.getCompatibleCell({
      ...cell,
      selectedValue: selectedValueFromText,
      isOpen: cellToMerge.isOpen,
      inputValue: cellToMerge.inputValue,
    });
  },

  getClassName(cell, isInEditMode) {
    const isOpen = cell.isOpen ? "open" : "closed";
    return `${cell.className ? cell.className : ""}${isOpen}`;
  },

  handleKeyDown(cell, keyCode, ctrl, shift, alt, key) {
    if ((keyCode === keyCodes.SPACE || keyCode === keyCodes.ENTER) && !shift) {
      return {
        cell: this.getCompatibleCell({ ...cell, isOpen: !cell.isOpen }),
        enableEditMode: false,
      };
    }

    const char = getCharFromKey(key, shift);

    if (
      !ctrl &&
      !alt &&
      isAlphaNumericKey(keyCode) &&
      !(shift && keyCode === keyCodes.SPACE)
    )
      return {
        cell: this.getCompatibleCell({
          ...cell,
          inputValue: char,
          isOpen: !cell.isOpen,
        }),
        enableEditMode: false,
      };

    return { cell, enableEditMode: false };
  },

  handleCompositionEnd(cell, eventData) {
    return {
      cell: { ...cell, inputValue: eventData, isOpen: !cell.isOpen },
      enableEditMode: false,
    };
  },

  render(cell, isInEditMode, onCellChanged) {
    return (
      <DropdownInput
        onCellChanged={(cell) =>
          onCellChanged(this.getCompatibleCell(cell), true)
        }
        cell={cell}
      />
    );
  },
});

const DropdownInput = ({ onCellChanged, cell }) => {
  const selectRef = useRef(null);
  const [inputValue, setInputValue] = useState(cell.inputValue);
  const selectedValue = useMemo(
    () => cell.values.find((val) => val.value === cell.text),
    [cell.text, cell.values]
  );

  useEffect(() => {
    if (cell.isOpen && selectRef.current) {
      selectRef.current.focus();
      setInputValue(cell.inputValue);
    }
  }, [cell.isOpen, cell.inputValue]);

  return (
    <div
      style={{ width: "100%" }}
      onPointerDown={(e) => onCellChanged({ ...cell, isOpen: true })}
    >
      <Select
        {...(cell.inputValue && {
          inputValue,
          defaultInputValue: inputValue,
          onInputChange: (e) => setInputValue(e),
        })}
        isSearchable={true}
        ref={selectRef}
        {...(cell.isOpen !== undefined && { menuIsOpen: cell.isOpen })}
        onMenuClose={() =>
          onCellChanged({
            ...cell,
            isOpen: !cell.isOpen,
            inputValue: undefined,
          })
        }
        onMenuOpen={() => onCellChanged({ ...cell, isOpen: true })}
        onChange={(e) =>
          onCellChanged({
            ...cell,
            selectedValue: e.value,
            isOpen: false,
            inputValue: undefined,
          })
        }
        blurInputOnSelect={true}
        defaultValue={selectedValue}
        value={selectedValue}
        isDisabled={cell.isDisabled}
        options={cell.values}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Escape") {
            selectRef.current.blur();
            return onCellChanged({
              ...cell,
              isOpen: false,
              inputValue: undefined,
            });
          }
        }}
        components={{
          Option: CustomOption,
          Menu: CustomMenu,
        }}
        styles={{
          container: (provided) => ({
            ...provided,
            width: "100%",
            height: "100%",
          }),
          control: (provided) => ({
            ...provided,
            border: "none",
            borderColor: "transparent",
            minHeight: "25px",
            background: "transparent",
            boxShadow: "none",
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            paddingTop: "0px",
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            padding: "0px 4px",
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "inherit",
          }),
          indicatorSeparator: (provided) => ({
            ...provided,
            marginTop: "4px",
            marginBottom: "4px",
          }),
          input: (provided) => ({
            ...provided,
            padding: 0,
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: "0 8px",
          }),
        }}
      />
    </div>
  );
};

const CustomOption = ({
  innerProps,
  label,
  isSelected,
  isFocused,
  isDisabled,
}) => (
  <div
    {...innerProps}
    onPointerDown={(e) => e.stopPropagation()}
    className={`rg-dd-option${isSelected ? " selected" : ""}${
      isFocused ? " focused" : ""
    }${isDisabled ? " disabled" : ""}`}
  >
    {label}
  </div>
);

const CustomMenu = ({ innerProps, children }) => (
  <div {...innerProps} className="rg-dd-menu">
    {children}
  </div>
);
