// @flow

import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import Form from 'react-native-jsonschema-form';

import FormBasicSchema from './FormBasicSchema';

type Props = {};

class FormBasic extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.customerFormRef = React.createRef();
  }

  onSubmit = ({ formData }) => {
    // submit here
  };

  submit = () => {
    if (this.customerFormRef.current) {
      this.customerFormRef.current.onSubmit();
    }
  };

  transformErrors = errors => {
    return errors.map(error => {
      if (error.name === 'required') {
        error.message = 'Vui lòng nhập đầy đủ thông tin';
      } else if (error.name === 'format') {
        error.message = 'Vui lòng nhập đúng định dạng email';
      } else if (error.name === 'minLength') {
        const minLength = error.params.limit;
        if (error.property === '.phoneNumber') {
          error.message = `Vui lòng nhập ít nhất ${minLength} số`;
        } else {
          error.message = `Vui lòng nhập ít nhất ${minLength} ký tự`;
        }
      } else if (error.name === 'pattern') {
        error.message = 'Vui lòng chỉ nhập số';
      }
      return error;
    });
  };

  validate = (formData, errors) => {
    return errors;
  };

  onchange = formState => {};

  render() {
    const schema = FormBasicSchema.schema;
    const uiSchema = FormBasicSchema.uiSchema;
    const formData = null;
    return (
      <Form
        schema={schema}
        externalSubmit={false}
        formData={formData}
        validate={this.validate}
        transformErrors={this.transformErrors}
        styles={styles.form}
        uiSchema={uiSchema}
        onChange={this.onchange}
        onSubmit={this.onSubmit}
        ref={this.customerFormRef}
        onError={console.log('errors')}
      />
    );
  }
}

export default FormBasic;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
