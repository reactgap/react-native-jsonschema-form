import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import CheckBoxesWidget from '../CheckBoxes/CheckBoxesWidget';

import { asNumber, guessType } from '../../../utils';

const nums = new Set(['number', 'integer']);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue(schema, value) {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type, items } = schema;
  if (value === '') {
    return undefined;
  } else if (type === 'array' && items && nums.has(items.type)) {
    return value.map(asNumber);
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return asNumber(value);
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every(x => guessType(x) === 'number')) {
      return asNumber(value);
    } else if (schema.enum.every(x => guessType(x) === 'boolean')) {
      return value === 'true';
    }
  }

  return value;
}

function getValue(result, multiple) {
  if (multiple) {
    return [].slice.call(result).filter(o => o.selected);
  } else {
    return result;
  }
}

function SelectWidget(props) {
  const { schema, options, multiple, value, onChange, required, id, errorSchema } = props;
  return (
    <View>
      {multiple && (
        <CheckBoxesWidget
          id={id}
          required={required}
          value={value}
          schema={schema}
          options={options}
          onChange={result => {
            const newValue = getValue(result, multiple);
            onChange(processValue(schema, newValue));
          }}
          errorSchema={errorSchema || {}}
        />
      )}
    </View>
  );
}

SelectWidget.defaultProps = {};

if (process.env.NODE_ENV !== 'production') {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default SelectWidget;
