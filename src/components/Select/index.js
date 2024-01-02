import React, { useRef, useLayoutEffect } from "react";
import Select from "react-select";
import { FixedSizeList as List } from "react-window";

const height = 50;

const MenuList = (props) => {
  console.log("debug props", props);
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * height;

  return (
    <List
      height={maxHeight}
      itemCount={children.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  );
};

const SelectComponent = ({
  active,
  rowData,
  setRowData,
  focus,
  stopEditing,
  columnData,
}) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (focus) {
      ref.current?.focus();
    } else {
      ref.current?.blur();
    }
  }, [focus]);

  const renderValue = () => {
    if (columnData.choices.length > 0) {
      return columnData.choices.find(({ value }) => value === rowData);
    }

    return null;
  };

  const renderOptions = () => {
    if (columnData.choices.length > 0) {
      return columnData.choices;
    }

    return [];
  };

  return (
    <Select
      ref={ref}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1,
          alignSelf: "stretch",
          pointerEvents: focus ? undefined : "none",
        }),
        control: (provided) => ({
          ...provided,
          height: "100%",
          border: "none",
          boxShadow: "none",
          background: "none",
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: 0,
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
        placeholder: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
      }}
      isDisabled={columnData.disabled}
      value={renderValue()}
      menuPortalTarget={document.body}
      menuIsOpen={focus}
      onChange={(choice) => {
        if (choice === null) return;

        setRowData(choice.value);
        setTimeout(stopEditing, 0);
      }}
      onMenuClose={() => stopEditing({ nextRow: false })}
      options={renderOptions()}
      components={{ MenuList }}
    />
  );
};

const CustomStaticSelect = (options) => {
  return {
    component: SelectComponent,
    columnData: options,
    disableKeys: true,
    keepFocus: true,
    disabled: options.disabled,
    deleteValue: () => null,
    copyValue: ({ rowData }) =>
      options.choices.find((choice) => choice.value === rowData)?.label ?? null,
    pasteValue: ({ value }) =>
      options.choices.find((choice) => choice.label === value)?.value ?? null,
  };
};

export default CustomStaticSelect;
