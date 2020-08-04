import AddButton from '../AddButton';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { orderProperties, retrieveSchema, getDefaultRegistry, getUiOptions } from '../../utils';

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

  const groupProperties = function groupProperties() {
    let groups = {};
    const arrProperties = props.properties;
    for (let i = 0; i < arrProperties.length; i++) {
      let groupName = arrProperties[i].groupName;
      if (!groupName) {
        groups[`group${i}`] = [arrProperties[i].content];
        continue;
      }
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(arrProperties[i].content);
    }
    let groupProperties = [];
    for (let groupName in groups) {
      groupProperties.push({ group: groupName, contents: groups[groupName] });
    }
    return groupProperties;
  };

  const arrGroupProperties = groupProperties();

  const { TitleField, DescriptionField } = props;
  return (
    <View>
      {(props.uiSchema['ui:title'] || props.title) && (
        <TitleField
          id={`${props.idSchema.$id}__title`}
          title={props.title || props.uiSchema['ui:title']}
          required={props.required}
          formContext={props.formContext}
        />
      )}
      {props.description && (
        <DescriptionField
          id={`${props.idSchema.$id}__description`}
          description={props.description}
          formContext={props.formContext}
        />
      )}
      {arrGroupProperties.map((prop) => {
        const contents = prop.contents;
        if (contents.length > 0) {
          return <Row style={{ flex: 1 }}>{contents.map((content) => content)}</Row>;
        }
        return contents[0];
      })}
      {canExpand() && (
        <AddButton
          className="object-property-expand"
          onClick={props.onAddClick(props.schema)}
          disabled={props.disabled || props.readonly}
        />
      )}
    </View>
  );
}

class ObjectField extends Component {
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

  isRequired(name) {
    const schema = this.props.schema;
    return Array.isArray(schema.required) && schema.required.indexOf(name) !== -1;
  }

  onPropertyChange = (name) => {
    return (value, errorSchema) => {
      const newFormData = { ...this.props.formData, [name]: value };
      this.props.onChange(
        newFormData,
        errorSchema &&
          this.props.errorSchema && {
            ...this.props.errorSchema,
            [name]: errorSchema,
          },
      );
    };
  };

  getAvailableKey = (preferredKey, formData) => {
    var index = 0;
    var newKey = preferredKey;
    while (formData.hasOwnProperty(newKey)) {
      newKey = `${preferredKey}-${++index}`;
    }
    return newKey;
  };

  onKeyChange = (oldValue) => {
    return (value, errorSchema) => {
      if (oldValue === value) {
        return;
      }
      value = this.getAvailableKey(value, this.props.formData);
      const newFormData = { ...this.props.formData };
      const newKeys = { [oldValue]: value };
      const keyValues = Object.keys(newFormData).map((key) => {
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
          },
      );
    };
  };

  onReferPropertyChange = (name, value) => {
    const errorSchema = value ? {} : { __errors: ['is a require property'] };
    const newFormData = { ...this.props.formData, [name]: value };
    this.props.onChange(
      newFormData,
      errorSchema &&
        this.props.errorSchema && {
          ...this.props.errorSchema,
          [name]: errorSchema,
        },
    );
  };

  getDefaultValue(type) {
    switch (type) {
      case 'string':
        return 'New Value';
      case 'array':
        return [];
      case 'boolean':
        return false;
      case 'null':
        return null;
      case 'number':
        return 0;
      case 'object':
        return {};
      default:
        // We don't have a datatype for some reason (perhaps additionalProperties was true)
        return 'New Value';
    }
  }

  handleAddClick = (schema) => () => {
    const type = schema.additionalProperties.type;
    const newFormData = { ...this.props.formData };
    newFormData[this.getAvailableKey('newKey', newFormData)] = this.getDefaultValue(type);
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
    const title = schema.title === undefined ? null : schema.title;
    const description = uiSchema['ui:description'] || schema.description;
    let orderedProperties;

    try {
      const properties = Object.keys(schema.properties);
      orderedProperties = orderProperties(properties, uiSchema['ui:order']);
    } catch (err) {
      return (
        <View>
          <Text style={{ color: 'red' }}>Invalid {name || 'root'} object field configuration:</Text>
          <Text> {err.message}</Text>
          <Text>{JSON.stringify(schema)}</Text>
        </View>
      );
    }
    const Template = registry.ObjectFieldTemplate || DefaultObjectFieldTemplate;
    const styleObject = uiSchema['ui:style'] ? uiSchema['ui:style'] : null;
    const templateProps = {
      title: uiSchema['ui:title'] || title,
      description,
      TitleField,
      DescriptionField,
      properties: orderedProperties.map((name) => {
        const schemaField = schema.properties[name];
        const referName = schemaField.referKey ? schemaField.referKey : null;
        const groupName = schemaField.groupName;
        return {
          content: (
            <Wrapper>
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
                referValue={referName ? formData[referName] : ''}
                onKeyChange={this.onKeyChange(name)}
                onChangeReferKey={(name, value) => this.onReferPropertyChange(name, value)}
                onChange={this.onPropertyChange(name)}
                onBlur={onBlur}
                onFocus={onFocus}
                registry={registry}
                disabled={disabled}
                readonly={readonly}
              />
            </Wrapper>
          ),
          name,
          readonly,
          disabled,
          required,
          groupName,
        };
      }),
      required,
      idSchema,
      uiSchema,
      schema,
      formData,
      formContext,
    };
    return (
      <View style={styleObject}>
        <Template {...templateProps} onAddClick={this.handleAddClick} />
      </View>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  ObjectField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    errorSchema: PropTypes.object,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object]))
        .isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired,
    }),
  };
}

export default ObjectField;
