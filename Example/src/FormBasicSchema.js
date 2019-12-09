module.exports = {
  schema: {
    type: 'object',
    required: ['lastName', 'firstName', 'gender', 'idNumber', 'phoneNumber'],
    properties: {
      radio: {
        type: 'string',
        title: 'radio',
        maxLength: 50,
      },
      multipleChoicesList: {
        checkboxList: true,
        type: 'array',
        title: 'Danh sách tuỳ chọn',
        description: 'Yêu cầu nhập số tiền nếu chọn',
        uniqueItems: true,
        items: {
          type: 'object',
          required: ['id', 'selected', 'value'],
          properties: {
            value: { type: 'number', minimum: 1000000, maximum: 6000000 },
          },
          listItem: [
            {
              id: 'ENUM_1',
              label: 'Nhãn enum 1',
            },
            {
              id: 'ENUM_2',
              label: 'Nhãn enum 2',
            },
            {
              id: 'ENUM_3',
              label: 'Nhãn enum 3',
            },
          ],
        },
      },
      lastName: {
        type: 'string',
        title: 'First Name',
        keyboardAppearance: 'light',
        placeholder: 'Nguyễn Văn',
        maxLength: 50,
        autoCapitalize: 'words',
        icon: 'user',
      },
      firstName: {
        type: 'string',
        title: 'Last Name',
        placeholder: 'A',
        keyboardAppearance: 'light',
        maxLength: 50,
        autoCapitalize: 'words',
        icon: 'user',
      },
      email: {
        type: 'string',
        title: 'Email',
        keyboardAppearance: 'light',
        keyboardType: 'email-address',
        format: 'email',
        placeholder: 'holder@sample.com',
        icon: 'envelope',
      },
      password: {
        type: 'string',
        title: 'Password',
        keyboardAppearance: 'light',
        placeholder: 'Password',
        password: true,
        maxLength: 15,
        minLength: 6,
        icon: 'lock',
      },
      phoneNumber: {
        type: 'string',
        fieldType: 'phone',
        title: 'Phone',
        keyboardAppearance: 'light',
        keyboardType: 'number-pad',
        placeholder: '0999999999',
        maxLength: 15,
        minLength: 8,
        icon: 'phone',
      },
      dob: {
        type: 'string',
        title: 'Ngày sinh',
      },
      idNumber: {
        type: 'string',
        title: 'Number',
        keyboardAppearance: 'light',
        keyboardType: 'number-pad',
        maxLength: 20,
        minLength: 9,
        placeholder: '191755555',
        pattern: '^\\d*$',
        icon: 'id-card',
      },
      gender: {
        type: 'string',
        title: 'Giới tính',
        data: [
          {
            id: 0,
            key: '1',
            name: 'Nam',
          },
          {
            id: 1,
            key: '2',
            name: 'Nữ',
          },
        ],
        default: 'Nam',
        icon: 'venus-mars',
        style: {
          height: 44,
          marginBottom: 5,
        },
      },
      money: {
        type: 'number',
        title: 'Tiền',
        minValue: 0,
        maxValue: 20000000,
        value: 0,
        step: 1000000,
        currencyOptions: {
          symbol: 'VND',
          decimal: '.',
          thousand: ',',
          precision: 0,
          format: '%v %s',
        },
      },
      fee: {
        type: 'string',
        title: 'Phí thu',
        maxLength: 20,
        minLength: 7,
        currencyOptions: {
          symbol: 'VND',
          format: '%v',
        },
        placeholder: '0',
      },
      // addressForm: {
      //   "$ref": "#/definitions/AddressObj"
      // },
    },
    definitions: {
      AddressObj: {
        type: 'object',
        properties: {
          AddressType: {
            title: 'Nơi ở hiện tại',
            type: 'string',
            enum: ['Trùng với hộ khẩu', 'Khác với hộ khẩu'],
            data: [
              {
                id: 0,
                key: '0',
                name: 'Trùng với hộ khẩu',
              },
              {
                id: 1,
                key: '1',
                name: 'Khác với hộ khẩu',
              },
            ],
            style: {
              height: 44,
              marginBottom: 8,
            },
            default: 'Trùng với hộ khẩu',
          },
        },
        dependencies: {
          AddressType: {
            oneOf: [
              {
                properties: {
                  AddressType: {
                    enum: ['Trùng với hộ khẩu'],
                  },
                  province: {
                    type: 'string',
                    title: 'Địa chỉ hộ khẩu',
                    mode: 'provinces',
                    referKey: 'district',
                    icon: 'warehouse',
                  },
                },
                required: ['province'],
              },
              {
                properties: {
                  AddressType: {
                    enum: ['Khác với hộ khẩu'],
                  },
                  province: {
                    type: 'string',
                    title: 'Địa chỉ hộ khẩu',
                    mode: 'provinces',
                    referKey: 'district',
                    icon: 'warehouse',
                  },
                  currentAddress: {
                    type: 'string',
                    title: 'Địa chỉ hiện tại',
                    mode: 'provinces',
                    referKey: 'currentDistrict',
                    icon: 'building',
                  },
                },
                required: ['currentAddress', 'province'],
              },
            ],
          },
        },
      },
    },
  },
  uiSchema: {
    radio: {
      'ui:widget': 'radio',
    },
    AddressType: {
      'ui:widget': 'PickerOption',
    },
    avatar: {
      'ui:widget': 'avatar',
    },
    lastName: {
      'ui:widget': 'TextField',
      'ui:autofocus': true,
    },
    firstName: {
      'ui:widget': 'TextField',
    },
    password: {
      'ui:widget': 'TextField',
    },
    idNumber: {
      'ui:widget': 'TextField',
    },
    insurance: {
      'ui:widget': 'RadioCheckBox',
    },
    addressForm: {
      'ui:style': {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        padding: 8,
        marginVertical: 8,
      },
      province: {
        'ui:widget': 'textFieldPicker',
      },
      currentAddress: {
        'ui:widget': 'textFieldPicker',
      },
    },
    incomingAmount: {
      'ui:widget': 'TextField',
    },
    phoneNumber: {
      'ui:widget': 'TextField',
    },
    incomingType: {
      'ui:widget': 'PickerOption',
    },
    gender: {
      'ui:widget': 'PickerOption',
      'ui:disabled': true,
    },
    money: {
      'ui:widget': 'SliderWidget',
    },
    fee: {
      'ui:widget': 'MoneyField',
    },
    dob: {
      'ui:widget': 'datetime',
    },
  },
};
