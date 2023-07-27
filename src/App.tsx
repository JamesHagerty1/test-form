import {useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { number, object } from 'yup';
import classnames from 'classnames';


function App() {
  // document me!
  /*
  {

  }
  */
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
      <div
        className='my-2'
      >
        {props.toggleHeader &&
          <div>
            <input
              type='checkbox'
              checked={enabled[props.label]}
              onChange={(e) => { toggleField(e) }}
              className='mr-2'
            />
            {props.toggleHeader}
          </div>
        }
        <div
          className=''
        >
          <label 
            className={
              classnames('', {
                'text-gray-300': (!enabled[props.label]),
              })
            }
          >
            {`${props.label}:`}
          </label>
          <Field
            type={props.type}
            name={props.label}
            disabled={!enabled[props.label]}
            className={
              classnames('float-right w-7/12 border pl-1 h-9 rounded-md', {
                'bg-neutral-100 border-neutral-200': (!enabled[props.label]),
              })
            }
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
    <div className='flex flex-col items-center' >
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
              if (enabled[k]) {
                d[k] = v;
              }
              return d;
            }, {})
          );
          setSubmitting(false);
        }}
      >
        <Form
          className='w-full md:w-2/3 lg:w-1/2 bg-zinc-50 p-3 m-6'
        >
          <div className='flex flex-col' >
            {formTemplate.map((item) =>
              <FieldBundle
                toggleHeader={
                  ('toggleHeader' in item) ? item.toggleHeader : null
                }
                label={item.label}
                type={item.type}
                validation={item.validation}
                key={item.label}
              />
            )}
            <div className='mt-8' >
              <button 
                type='reset' 
                className='float-right w-32 border border-gray-300 rounded-md 
                  bg-white h-8 text-gray-500 hover:opacity-70'
              >
                Reset
              </button>
              <button 
                type='submit' 
                className='float-right mr-2 w-32 border bg-blue-500 
                  border-blue-500 rounded-md h-8 text-white hover:opacity-90'
              >
                OK
              </button>
            </div>
          </div>
        </Form>
      </Formik>
      <div className='w-full md:w-2/3 lg:w-1/2' >
        <table>
          <tbody>
            {Object.entries(table).map(([title, val]) => 
              <tr>
                <td className='border border-black w-48 font-bold p-1' >{title as string}</td>
                <td className='border border-black w-48 p-1' >{val as string}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;