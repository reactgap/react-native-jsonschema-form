import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from "prop-types";

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
  const at = (currentSelectedItems || []).findIndex(item => item.id === newSelectedItem.id);
  let newItems = [...currentSelectedItems];
  if (at === -1) {
    newItems.push(newSelectedItem);
  } else {
    newItems = newItems.map(e => {
      if (e.id === newSelectedItem.id) {
        return newSelectedItem;
      }
      return e;
    });
  }

  return newItems.sort((a, b) => {
    const indexOfA = all.findIndex(item => item.id === a.id);
    const indexOfB = all.findIndex(item => item.id === b.id);
    return indexOfA > indexOfB;
  });
}

function deselectValue(deslectedItem, currentSelectedItems) {
  return currentSelectedItems.filter(v => v.id !== deslectedItem.id);
}

function CheckboxesWidget(props) {
  const { options, onChange, value, schema, errorSchema } = props;
  const { enumOptions } = options;

  const required = schemaRequiresTrueValue(schema);
  return (
    <View>
      {enumOptions.map((option, index) => {
        const itemIndexSchema = errorSchema && errorSchema[index];
        const itemGeneralErrors = itemIndexSchema && itemIndexSchema.__errors;
        const itemValueErrors = itemIndexSchema && itemIndexSchema.value && itemIndexSchema.value.__errors;
        let checkboxRawErrors = [];
        if (itemGeneralErrors && itemGeneralErrors.length) {
          checkboxRawErrors = itemGeneralErrors;
        }
        if (itemValueErrors && itemValueErrors.length)  {
          checkboxRawErrors = itemValueErrors;
        }

        return (
            <CheckboxWidget
              key={`checkboxes${index}`}
              required={required}
              label={option.value.label}
              value={option.value.value}
              selected={option.value.selected}
              rawErrors={checkboxRawErrors}
              onChange={(item) => {
                const all = enumOptions.map(o =>o.value);
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

if (process.env.NODE_ENV !== "production") {
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