import { ADDITIONAL_PROPERTY_FLAG } from '../../utils';
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput } from 'react-native';
import styles from '../styles';

import {
  isMultiSelect,
  retrieveSchema,
  toIdSchema,
  getDefaultRegistry,
  mergeObjects,
  getUiOptions,
  isFilesArray,
  deepEquals,
  getSchemaType,
} from '../../utils';
import UnsupportedField from './UnsupportedField';

const REQUIRED_FIELD_SYMBOL = '*';
const COMPONENT_TYPES = {
  array: 'ArrayField',
  boolean: 'BooleanField',
  integer: 'NumberField',
  number: 'NumberField',
  object: 'ObjectField',
  string: 'StringField',
  flatList: 'ObjectFlatList',
  view: 'ObjectView',
};

function getFieldComponent(schema, uiSchema, idSchema, fields) {
  const field = uiSchema['ui:field'];
  if (typeof field === 'function') {
    return field;
  }
  if (typeof field === 'string' && field in fields) {
    return fields[field];
  }

  const componentName = COMPONENT_TYPES[getSchemaType(schema)];
  // if (componentName === 'view') {
  //   return null;
  // }
  return componentName in fields
    ? fields[componentName]
    : () => {
        return (
          <UnsupportedField
            schema={schema}
            idSchema={idSchema}
            reason={`Unknown field type ${schema.type}`}
          />
        );
      };
}

function Label(props) {
  const { label, required, id } = props;
  if (!label) {
    // See #312: Ensure compatibility with old versions of React.
    return null;
  }
  if (label.length === 0) {
    return null;
  }
  const labelValue = required ? label + REQUIRED_FIELD_SYMBOL : label;
  return <Text style={styles.component.titleInputStyle}>{labelValue}</Text>;
}

function LabelInput(props) {
  const { id, label, onChange } = props;
  return (
    <TextInput
      defaultValue={label}
      keyboardAppearance="light"
      autoCorrect={false}
      style={{ marginLeft: 10 }}
      // onBlur={onBlur && (event => onBlur(inputProps.id, event.target.value))}
    />
    // <input
    //   className="form-control"
    //   type="text"
    //   id={id}
    //   onBlur={event => onChange(event.target.value)}
    //   defaultValue={label}
    // />
  );
}

function Help(props) {
  const { help } = props;
  if (!help) {
    // See #312: Ensure compatibility with old versions of React.
    return <View />;
  }
  if (typeof help === 'string') {
    return <Text>{help}</Text>;
  }
  return <View>{help}</View>;
}

function ErrorList(props) {
  const { errors = [] } = props;
  if (errors.length === 0) {
    return <View />;
  }
  return (
    <View>
      <Text>Error</Text>
      {errors.map((error, index) => (
        <Text key={index}> {error}</Text>
      ))}
    </View>
  );
}

function DefaultTemplate(props) {
  const {
    id,
    classNames,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
    onKeyChange,
  } = props;
  if (hidden) {
    return children;
  }
  const additional = props.schema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);
  const keyLabel = `${label} Key`;

  return (
    <View>
      {additional && (
        <View>
          <Label label={keyLabel} required={required} id={`${id}-key`} />
          <LabelInput label={label} required={required} id={`${id}-key`} onChange={onKeyChange} />
        </View>
      )}
      {displayLabel && <Label label={label} required={required} id={id} />}
      {displayLabel && description ? description : null}
      {children}
      {/* {errors} */}
      {help}
    </View>
  );
}

if (process.env.NODE_ENV !== 'production') {
  DefaultTemplate.propTypes = {
    id: PropTypes.string,
    classNames: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.node.isRequired,
    errors: PropTypes.element,
    rawErrors: PropTypes.arrayOf(PropTypes.string),
    help: PropTypes.element,
    rawHelp: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    description: PropTypes.element,
    rawDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    hidden: PropTypes.bool,
    required: PropTypes.bool,
    readonly: PropTypes.bool,
    displayLabel: PropTypes.bool,
    fields: PropTypes.object,
    formContext: PropTypes.object,
  };
}

DefaultTemplate.defaultProps = {
  hidden: false,
  readonly: false,
  required: false,
  displayLabel: true,
};

function SchemaFieldRender(props) {
  const {
    uiSchema,
    formData,
    errorSchema,
    idPrefix,
    name,
    onKeyChange,
    required,
    onChangeReferKey,
    registry = getDefaultRegistry(),
  } = props;
  const { definitions, fields, formContext, FieldTemplate = DefaultTemplate } = registry;
  let idSchema = props.idSchema;
  const schema = retrieveSchema(props.schema, definitions, formData);
  idSchema = mergeObjects(toIdSchema(schema, null, definitions, formData, idPrefix), idSchema);
  const FieldComponent = getFieldComponent(schema, uiSchema, idSchema, fields);
  const { DescriptionField } = fields;
  const disabled = Boolean(props.disabled || uiSchema['ui:disabled']);
  const readonly = Boolean(props.readonly || uiSchema['ui:readonly']);
  const autofocus = Boolean(props.autofocus || uiSchema['ui:autofocus']);

  if (Object.keys(schema).length === 0) {
    // See #312: Ensure compatibility with old versions of React.
    return <View />;
  }

  const uiOptions = getUiOptions(uiSchema);
  let { label: displayLabel = true } = uiOptions;
  if (schema.type === 'array') {
    displayLabel =
      isMultiSelect(schema, definitions) || isFilesArray(schema, uiSchema, definitions);
  }
  if (schema.type === 'object') {
    displayLabel = false;
  }
  if (schema.type === 'flatList') {
    displayLabel = false;
  }
  if (schema.type === 'boolean' && !uiSchema['ui:widget']) {
    displayLabel = false;
  }
  if (uiSchema['ui:field']) {
    displayLabel = false;
  }
  if (uiSchema['ui:widget'] === 'avatar') {
    displayLabel = false;
  }

  if (uiSchema['ui:widget'] === 'TextFieldMaterial') {
    displayLabel = false;
  }

  if (uiSchema['ui:widget'] === 'AnimatedInput') {
    displayLabel = false;
  }
  if (schema.uiMode === 'material') {
    displayLabel = false;
  }
  let currentIndex = 0;
  if (uiSchema['ui:widget'] === 'PickerOption') {
    if (schema && schema.hasOwnProperty('currentIndex')) {
      currentIndex = schema['currentIndex'];
    }
  }

  const { __errors, ...fieldErrorSchema } = errorSchema;

  // See #439: uiSchema: Don't pass consumed class names to child components
  const field = (
    <FieldComponent
      {...props}
      idSchema={idSchema}
      schema={schema}
      uiSchema={{ ...uiSchema, classNames: undefined }}
      disabled={disabled}
      readonly={readonly}
      autofocus={autofocus}
      errorSchema={fieldErrorSchema}
      formContext={formContext}
      rawErrors={__errors}
      currentIndex={currentIndex}
      onChangeReferKey={onChangeReferKey}
    />
  );

  const { type } = schema;
  const id = idSchema.$id;
  const label = uiSchema['ui:title'] || props.schema.title || schema.title || name;
  const description = uiSchema['ui:description'] || props.schema.description || schema.description;
  const errors = __errors;
  const help = uiSchema['ui:help'];
  const hidden = uiSchema['ui:widget'] === 'hidden';
  const classNames = [
    'form-group',
    'field',
    `field-${type}`,
    errors && errors.length > 0 ? 'field-error has-error has-danger' : '',
    uiSchema.classNames,
  ]
    .join(' ')
    .trim();

  const fieldProps = {
    description: (
      <DescriptionField
        id={id + '__description'}
        description={description}
        formContext={formContext}
      />
    ),
    rawDescription: description,
    help: <Help help={help} />,
    rawHelp: typeof help === 'string' ? help : undefined,
    errors: <ErrorList errors={errors} />,
    rawErrors: errors,
    id,
    label,
    hidden,
    onKeyChange,
    required,
    disabled,
    readonly,
    displayLabel,
    classNames,
    formContext,
    fields,
    schema,
    uiSchema,
  };

  return <FieldTemplate {...fieldProps}>{field}</FieldTemplate>;
}

class SchemaField extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // if schemas are equal idSchemas will be equal as well,
    // so it is not necessary to compare
    return !deepEquals(
      { ...this.props, idSchema: undefined },
      { ...nextProps, idSchema: undefined },
    );
  }

  render() {
    return SchemaFieldRender(this.props);
  }
}

SchemaField.defaultProps = {
  uiSchema: {},
  errorSchema: {},
  idSchema: {},
  disabled: false,
  readonly: false,
  autofocus: false,
};

if (process.env.NODE_ENV !== 'production') {
  SchemaField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    idSchema: PropTypes.object,
    formData: PropTypes.any,
    errorSchema: PropTypes.object,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object]))
        .isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      ArrayFieldTemplate: PropTypes.func,
      ObjectFieldTemplate: PropTypes.func,
      FieldTemplate: PropTypes.func,
      formContext: PropTypes.object.isRequired,
    }),
  };
}

export default SchemaField;
