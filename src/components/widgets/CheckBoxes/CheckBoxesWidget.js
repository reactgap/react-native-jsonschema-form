import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import CheckboxWidget from '../CheckBox/CheckBoxWidget';
import csstyles from '../../styles';

function schemaRequiresTrueValue(schema) {
  // Check if const is a truthy value
  if (schema.const) {
    return true;
  }

  // Check if an enum has a single value of true
  if (schema.enum && schema.enum.length === 1 && schema.enum[0] === true) {
    return true;
  }

  // If anyOf has a single value, evaluate the subschema
  if (schema.anyOf && schema.anyOf.length === 1) {
    return schemaRequiresTrueValue(schema.anyOf[0]);
  }

  // If oneOf has a single value, evaluate the subschema
  if (schema.oneOf && schema.oneOf.length === 1) {
    return schemaRequiresTrueValue(schema.oneOf[0]);
  }

  // Evaluate each subschema in allOf, to see if one of them requires a true
  // value
  if (schema.allOf) {
    return schema.allOf.some(schemaRequiresTrueValue);
  }
}

function selectValue(newSelectedItem, currentSelectedItems, all) {
  const at = (currentSelectedItems || []).findIndex((item) => item.id === newSelectedItem.id);
  let newItems = [...currentSelectedItems];
  if (at === -1) {
    newItems.push(newSelectedItem);
  } else {
    newItems = newItems.map((e) => {
      if (e.id === newSelectedItem.id) {
        return newSelectedItem;
      }
      return e;
    });
  }

  return newItems.sort((a, b) => {
    // const indexOfA = all.findIndex(item => item.id === a.id);
    // const indexOfB = all.findIndex(item => item.id === b.id);
    const valueA = a && a.value && a.value.length;
    const valueB = b && b.value && b.value.length;

    if (valueA && valueB) {
      return 0;
    }
    if (valueA) {
      return 1;
    }
    if (valueB) {
      return -1;
    }

    // return indexOfA > indexOfB;
    return 0;
  });
}

function deselectValue(deslectedItem, currentSelectedItems) {
  return currentSelectedItems.filter((v) => v.id !== deslectedItem.id);
}

function CheckboxesWidget(props) {
  const { options, onChange, value, schema, errorSchema, disabled } = props;
  const { enumOptions } = options;
  const required = schemaRequiresTrueValue(schema);
  return (
    <View>
      {enumOptions.map((option, index) => {
        const indexSelected = value ? value.findIndex((x) => x.id === option.value.id) : -1;
        let isSelected = false;
        let selectedValue = undefined;
        if (indexSelected !== -1) {
          isSelected = true;
          const objectValue = value[indexSelected];
          selectedValue = objectValue;
        }

        const itemIndexSchema = errorSchema && errorSchema[index];
        const itemGeneralErrors = itemIndexSchema && itemIndexSchema.__errors;
        const itemValueErrors =
          itemIndexSchema && itemIndexSchema.value && itemIndexSchema.value.__errors;
        let checkboxRawErrors = [];
        if (itemGeneralErrors && itemGeneralErrors.length) {
          checkboxRawErrors = itemGeneralErrors;
        }
        if (itemValueErrors && itemValueErrors.length) {
          checkboxRawErrors = itemValueErrors;
        }

        const checkBoxKey = `checkboxes${(option.value && option.value.id) || index}`;
        return (
          <CheckboxWidget
            key={checkBoxKey}
            required={required}
            label={option.value.label}
            value={selectedValue}
            disabled={disabled}
            selected={isSelected}
            itemOption={option.value}
            rawErrors={checkboxRawErrors}
            onChange={(item) => {
              const all = enumOptions.map((o) => o.value);
              if (item.selected) {
                onChange(selectValue({ ...option.value, ...item }, value, all));
              } else {
                onChange(deselectValue(option.value, value));
              }
            }}
          />
        );
      })}
    </View>
  );
}

CheckboxesWidget.defaultProps = {
  autofocus: false,
  options: {},
};

if (process.env.NODE_ENV !== 'production') {
  CheckboxesWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    readonly: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    rawErrors: PropTypes.array,
  };
}

export default CheckboxesWidget;

const styles = StyleSheet.create({
  errorText: {
    ...csstyles.text.medium,
    color: csstyles.vars.csDanger,
    fontStyle: 'italic',
    fontSize: 13,
  },
  errorWrapper: {
    marginTop: 3,
    paddingLeft: csstyles.vars.csInputHeight,
    marginBottom: csstyles.vars.csBoxSpacing,
  },
});
