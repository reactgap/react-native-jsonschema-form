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
      } else if (error.name === 'minimum') {
        const minimum = error.params.limit;
        error.message = `Vui lòng nhập giá trị tối thiểu là ${minimum}`;
      } else if (error.name === 'maximum') {
        const maximum = error.params.limit;
        error.message = `Vui lòng nhập giá trị tối đa là ${maximum}`;
      }

      return error;
    });
  };

  getCustomKeywords = () => {
    return [
      {
        keyword: 'checkboxList',
        config: {
          type: 'array',
          validate: function(_schema, results) {
            for (let i = 0; i < results.length; i++) {
              const data = results[i];
              if (!data.hasOwnProperty('value') || !data.hasOwnProperty('selected')) {
                return false;
              }

              if (typeof data.value !== 'number') {
                return false;
              }

              if (data.selected && !data.value) {
                return false;
              }
            }

            return true;
          },
          errors: true,
        },
      },
    ];
  };

  validate = (formData, errors) => {
    return errors;
  };

  onchange = formState => {
    // console.log(formState);
  };

  render() {
    const schema = FormBasicSchema.schema;
    const uiSchema = FormBasicSchema.uiSchema;
    const formData = {
      multipleChoicesList: [
        {
          id: 'ENUM_1',
          label: 'Nhãn enum 1',
          selected: true,
          value: 123456,
        },
      ],
    };

    const keywords = this.getCustomKeywords();
    return (
      <Form
        schema={schema}
        externalSubmit={false}
        formData={formData}
        validate={this.validate}
        customKeywords={keywords}
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
