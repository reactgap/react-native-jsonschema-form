import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import {
  orderProperties,
  retrieveSchema,
  getDefaultRegistry,
  getUiOptions,
} from "../../utils";

function DefaultObjectFieldTemplate(props) {
  const canExpand = function canExpand() {
    const { formData, schema, uiSchema } = props;
    if (!schema.additionalProperties) {
      return false;
    }
    const { expandable } = getUiOptions(uiSchema);
    if (expandable === false) {
      return expandable;
    }
    // if ui:options.expandable was not explicitly set to false, we can add
    // another property if we have not exceeded maxProperties yet
    if (schema.maxProperties !== undefined) {
      return Object.keys(formData).length < schema.maxProperties;
    }
    return true;
  };

  const { TitleField, DescriptionField } = props;
  return (
    <View>
       {props.properties.map(prop => prop.content)}
    </View>
  );
}

class ObjectView extends Component {
  static defaultProps = {
    uiSchema: {},
    formData: {},
    errorSchema: {},
    idSchema: {},
    required: false,
    disabled: false,
    readonly: false,
  };

  state = {
    additionalProperties: {},
  };

  onPropertyChange = name => {
    return (value, errorSchema) => {
      const newFormData = { ...this.props.formData, [name]: value };
      this.props.onChange(
        newFormData,
        errorSchema &&
          this.props.errorSchema && {
            ...this.props.errorSchema,
            [name]: errorSchema,
          }
      );
    };
  };

  isRequired(name) {
    const schema = this.props.schema;
    return (
      Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
    );
  }

  getAvailableKey = (preferredKey, formData) => {
    var index = 0;
    var newKey = preferredKey;
    while (formData.hasOwnProperty(newKey)) {
      newKey = `${preferredKey}-${++index}`;
    }
    return newKey;
  };

  onKeyChange = oldValue => {
    return (value, errorSchema) => {
      if (oldValue === value) {
        return;
      }
      value = this.getAvailableKey(value, this.props.formData);
      const newFormData = { ...this.props.formData };
      const newKeys = { [oldValue]: value };
      const keyValues = Object.keys(newFormData).map(key => {
        const newKey = newKeys[key] || key;
        return { [newKey]: newFormData[key] };
      });
      const renamedObj = Object.assign({}, ...keyValues);
      this.props.onChange(
        renamedObj,
        errorSchema &&
          this.props.errorSchema && {
            ...this.props.errorSchema,
            [value]: errorSchema,
          }
      );
    };
  };

  getDefaultValue(type) {
    switch (type) {
      case "string":
        return "New Value";
      case "array":
        return [];
      case "boolean":
        return false;
      case "null":
        return null;
      case "number":
        return 0;
      case "object":
        return {};
      default:
        // We don't have a datatype for some reason (perhaps additionalProperties was true)
        return "New Value";
    }
  }

  handleAddClick = schema => () => {
    const type = schema.additionalProperties.type;
    const newFormData = { ...this.props.formData };
    newFormData[
      this.getAvailableKey("newKey", newFormData)
    ] = this.getDefaultValue(type);
    this.props.onChange(newFormData);
  };

  render() {
    const {
      uiSchema,
      formData,
      errorSchema,
      idSchema,
      name,
      required,
      disabled,
      readonly,
      idPrefix,
      onBlur,
      onFocus,
      registry = getDefaultRegistry(),
    } = this.props;

    const { definitions, fields, formContext } = registry;
    const { SchemaField, TitleField, DescriptionField } = fields;
    const schema = retrieveSchema(this.props.schema, definitions, formData);
    const title = schema.title === undefined ? name : schema.title;
    const description = uiSchema["ui:description"] || schema.description;
    let orderedProperties;

    try {
      const properties = Object.keys(schema.properties);
      orderedProperties = orderProperties(properties, uiSchema["ui:order"]);
    } catch (err) {
      return (
        <View>
          <Text style={{ color: "red" }}>
            Invalid {name || "root"} object field configuration:
          </Text>
          <Text> {err.message}</Text>
          <Text>{JSON.stringify(schema)}</Text>
        </View>
      );
    }
    console.log('ObjectField ObjectField ObjectField', );
    const Template = registry.ObjectFieldTemplate || DefaultObjectFieldTemplate;

    const templateProps = {
        title: uiSchema["ui:title"] || title,
        description,
        TitleField,
        DescriptionField,
        properties: orderedProperties.map(name => {
          return {
            content: (
              <SchemaField
                key={name}
                name={name}
                required={this.isRequired(name)}
                schema={schema.properties[name]}
                uiSchema={uiSchema[name]}
                errorSchema={errorSchema[name]}
                idSchema={idSchema[name]}
                idPrefix={idPrefix}
                formData={formData[name]}
                onKeyChange={this.onKeyChange(name)}
                onChange={this.onPropertyChange(name)}
                onBlur={onBlur}
                onFocus={onFocus}
                registry={registry}
                disabled={disabled}
                readonly={readonly}
              />
            ),
            name,
            readonly,
            disabled,
            required,
          };
        }),
        required,
        idSchema,
        uiSchema,
        schema,
        formData,
        formContext,
      };
      return <Template {...templateProps} onAddClick={this.handleAddClick} />;
    }
}

export default ObjectView;