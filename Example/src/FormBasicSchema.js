

module.exports = {
  schema: {
    type: "object",
    required: [
      "lastName",
      "firstName",
      "gender",
      "idNumber",
      "phoneNumber"
    ],
    properties: {
      lastName: {
        type: "string",
        title: "First Name",
        keyboardAppearance: "light",
        placeholder: "Nguyễn Văn",
        maxLength: 50,
        autoCapitalize: 'words',
        icon: 'user'
      },
      firstName: {
        type: "string",
        title: "Last Name",
        placeholder: "A",
        keyboardAppearance: "light",
        maxLength: 50,
        autoCapitalize: 'words',
        icon: 'user'
      },
      email: {
        type: "string",
        title: "Email",
        keyboardAppearance: "light",
        keyboardType: "email-address",
        format: "email",
        placeholder: "holder@sample.com",
        icon: 'envelope'
      },
      password: {
        type: "string",
        title: "Password",
        keyboardAppearance: "light",
        placeholder: "Password",
        password: true,
        maxLength: 15,
        minLength: 6,
        icon: 'lock'
      },
      phoneNumber: {
        type: "string",
        fieldType: 'phone',
        title: "Phone",
        keyboardAppearance: "light",
        keyboardType: "number-pad",
        placeholder: "0999999999",
        maxLength: 15,
        minLength: 8,
        icon: 'phone'
      },
      idNumber: {
        type: "string",
        title: "Number",
        keyboardAppearance: "light",
        keyboardType: "number-pad",
        maxLength: 20,
        minLength: 9,
        placeholder: "191755555",
        pattern: "^\\d*$",
        icon: 'id-card',
      },
      gender: {
        type: "string",
        title: "Giới tính",
        data: [
          {
            id: 0,
            key: "1",
            name: "Nam",
          },
          {
            id: 1,
            key: "2",
            name: "Nữ",
          }
        ],
        default: "Nam",
        icon: "venus-mars",
        style: {
          height: 44,
          marginBottom: 5
        },
      },
      // addressForm: {
      //   "$ref": "#/definitions/AddressObj"
      // },
    },
    definitions: {
      AddressObj: {
        type: "object",
        properties: {
          AddressType: {
            title: 'Nơi ở hiện tại',
            type: "string",
            enum: [
              "Trùng với hộ khẩu",
              "Khác với hộ khẩu",
            ],
            data: [
              {
                "id": 0,
                "key": "0",
                "name": "Trùng với hộ khẩu",
              },
              {
                "id": 1,
                "key": "1",
                "name": "Khác với hộ khẩu",
              },
            ],
            style: {
              height: 44,
              marginBottom: 8,
            },
            default: "Trùng với hộ khẩu",
          }
        },
        dependencies: {
          AddressType: {
            oneOf: [
              {
                properties: {
                  AddressType: {
                    "enum": [
                      "Trùng với hộ khẩu"
                    ]
                  },
                  province: {
                    type: "string",
                    title: "Địa chỉ hộ khẩu",
                    mode: "provinces",
                    referKey: "district",
                    icon: 'warehouse',
                  },
                },
                required: [
                  "province"
                ]
              },
              {
                properties: {
                  AddressType: {
                    "enum": [
                      "Khác với hộ khẩu"
                    ]
                  },
                  province: {
                    type: "string",
                    title: "Địa chỉ hộ khẩu",
                    mode: "provinces",
                    referKey: "district",
                    icon: 'warehouse',
                  },
                  currentAddress: {
                    type: "string",
                    title: "Địa chỉ hiện tại",
                    mode: "provinces",
                    referKey: "currentDistrict",
                    icon: 'building',
                  }
                },
                required: [
                  "currentAddress",
                  "province"
                ]
              },
            ]
          }
        }
      }
    }
  },
  uiSchema: {
    AddressType: {
      "ui:widget": "PickerOption"
    },
    avatar: {
      "ui:widget": "avatar"
    },
    lastName: {
      "ui:widget": "TextField",
      "ui:autofocus": true,
    },
    firstName: {
      "ui:widget": "TextField",
    },
    password: {
      "ui:widget": "TextField",
    },
    idNumber: {
      "ui:widget": "TextField",
    },
    insurance: {
      "ui:widget": "RadioCheckBox",
    },
    addressForm: {
      "ui:style": {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        padding: 8,
        marginVertical: 8
      },
      province: {
        "ui:widget": "textFieldPicker"
      },
      currentAddress: {
        "ui:widget": "textFieldPicker"
      },
    },
    incomingAmount: {
      "ui:widget": "TextField",
    },
    phoneNumber: {
      "ui:widget": "TextField",
    },
    incomingType: {
      "ui:widget": "PickerOption"
    },
    gender: {
      "ui:widget": "PickerOption"
    }
  },
};