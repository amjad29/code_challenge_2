import { Validator } from 'jsonschema';
import moment from 'moment';



export function grantValidator(requestBody) {
  Validator.prototype.customFormats.phoneNumberFormat = function (input) {   
    return (input.match(/^\d{11}$/)) ? true : false;
  };

  Validator.prototype.customFormats.test = function (input) {
   
    return moment(input).isValid(); 
  };

  const validator = new Validator();

  const schema = {
    properties: {
      period: {
        type: 'number',
        enum: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12 ]
      },
      number: {
         type: "string", 
        format: "phoneNumberFormat"
        },
        date: {
          type: "string",
          format: "test"
        }
    }
  };

  const errors = validator.validate(requestBody, schema).errors;

  return errors.map(error => ({
    message: error.stack,
    property: error.property,
    record:{
      ...requestBody
    }
  }));
}

export function revokeValidator(requestBody) {
  Validator.prototype.customFormats.phoneNumberFormat = function (input) {
    return (input.match(/^\d{11}$/)) ? true : false;
  };

  const validator = new Validator();

  const schema = {
    properties: {
      number: {
        type: "string",
        format: "phoneNumberFormat"
      },
      date: {
        type: "string",
        format: "date-time"
      }
    }
  };

  const errors = validator.validate(requestBody, schema).errors;

  return errors.map(error => ({
    message: error.stack,
    property: error.property,
    record: {
      ...requestBody
    }
  }));
}