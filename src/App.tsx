import React, {useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { number, object } from 'yup';


function App() {
  // document me!
  const formTemplate = [
    {
      label: 'Sample size',
      type: 'number', // Formik type
      validation: number().required().integer().min(2),
    },
    {
      label: 'Sample mean',
      type: 'number',
      validation: number().required(),
    },
    {
      label: 'Standard deviation',
      type: 'number',
      validation: number().required().min(0),
    },
    {
      label: 'Hypothesized mean',
      type: 'number',
      validation: number().required(), 
      toggleHeader: 'Perform hypothesis test',
    },
  ];

  const [table, setTable] = useState({});

  const [validations, setValidations] = useState(
    formTemplate.reduce((d: any, item: any) => {
      if (!('toggleHeader' in item)) {
        d[item.label] = item.validation;
      }
      return d;
    }, {})
  );

  const [enabled, setEnabled] = useState(
    formTemplate.reduce((d: any, item: any) => {
      d[item.label] = !('toggleHeader' in item);
      return d;
    }, {})
  )

  const FieldBundle = ({ ...props }: any) => {

    const toggleField = (e: any) => {
      let curValidations = { ...validations }

      if (props.label in validations) {
        delete curValidations[props.label];
      } else {
        curValidations[props.label] = props.validation;
      }

      setValidations(curValidations);
      setEnabled((enabled: any) => (
        {...enabled, [props.label]: e.target.checked}
      ));
    }

    return (
      <div>
        {props.toggleHeader &&
          <div>
            <input
              type='checkbox'
              checked={enabled[props.label]}
              onChange={(e) => { toggleField(e) }}
            />
            {props.toggleHeader}
          </div>
        }
        <div>
          <label>{`${props.label}:`}</label>
          <Field
            type={props.type}
            name={props.label}
            disabled={!enabled[props.label]}
          />
        </div>
        <ErrorMessage
          name={props.label}
          component='div'
          className='text-red-600'
        />
      </div>
    );
  };

  return (
    <>
      <Formik
        initialValues={
          formTemplate.reduce((vals: any, item: any) => {
            vals[item.label] = '';
            return vals;
          }, {})
        }
        validationSchema={object(validations)}
        onSubmit={(values: any, { setSubmitting }: any) => {
          setTable(
            Object.entries(values).reduce((d: any, [k, v]) => {
              if (v) {
                d[k] = v;
              }
              return d;
            }, {})
          );
          setSubmitting(false);
        }}
      >
        <Form>
          {formTemplate.map((item) =>
            <FieldBundle
              toggleHeader={('toggleHeader' in item) ? item.toggleHeader : null}
              label={item.label}
              type={item.type}
              validation={item.validation}
            />
          )}
          <button type='submit'>OK</button>
          <button type='reset'>Reset</button>
        </Form>
      </Formik>
      <table>
        <tbody>
          {Object.entries(table).map(([title, val]) => 
            <tr>
              <td>{title as string}</td>
              <td>{val as string}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default App;