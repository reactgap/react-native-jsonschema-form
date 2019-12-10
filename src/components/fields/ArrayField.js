import React from 'react';
import PropTypes from 'prop-types';

import UnsupportedField from './UnsupportedField';
import {
  getWidget,
  getUiOptions,
  optionsList,
  retrieveSchema,
  getDefaultRegistry,
} from '../../utils';

class ArrayField extends React.Component {
  static defaultProps = {
    uiSchema: {},
    formData: [],
    idSchema: {},
    required: false,
    disabled: false,
    readonly: false,
    autofocus: false,
  };

  get itemTitle() {
    const { schema } = this.props;
    return schema.items.title || schema.items.description || 'Item';
  }

  onSelectChange = _value => {
    const { onChange } = this.props;
    if (_value && _value.length) {
      onChange(_value);
      return;
    }

    onChange(undefined);
  };

  render() {
    const { schema, idSchema } = this.props;
    if (!schema.hasOwnProperty('items')) {
      return (
        <UnsupportedField schema={schema} idSchema={idSchema} reason="Missing items definition" />
      );
    }

    return this.renderMultiSelect();
  }

  renderMultiSelect() {
    const {
      schema,
      idSchema,
      uiSchema,
      formData,
      disabled,
      readonly,
      required,
      label,
      placeholder,
      autofocus,
      onBlur,
      onFocus,
      registry = getDefaultRegistry(),
      errorSchema,
    } = this.props;

    const items = this.props.formData;
    const { widgets, definitions, formContext } = registry;
    const itemsSchema = retrieveSchema(schema.items, definitions, formData);
    const enumOptions = optionsList(itemsSchema);
    const { widget = 'select', ...options } = {
      ...getUiOptions(uiSchema),
      enumOptions,
    };

    const Widget = getWidget(schema, widget, widgets);

    return (
      <Widget
        id={idSchema && idSchema.$id}
        multiple
        onChange={this.onSelectChange}
        onBlur={onBlur}
        onFocus={onFocus}
        options={options}
        schema={schema}
        registry={registry}
        value={items}
        disabled={disabled}
        readonly={readonly}
        required={required}
        label={label}
        placeholder={placeholder}
        formContext={formContext}
        autofocus={autofocus}
        errorSchema={errorSchema}
      />
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  ArrayField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.shape({
      'ui:options': PropTypes.shape({
        addable: PropTypes.bool,
        orderable: PropTypes.bool,
        removable: PropTypes.bool,
      }),
    }),
    idSchema: PropTypes.object,
    errorSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    formData: PropTypes.array,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object]))
        .isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired,
    }),
  };
}

export default ArrayField;
