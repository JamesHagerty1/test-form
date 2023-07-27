import {useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { number, object } from 'yup';
import classnames from 'classnames';


function App() {
  /**
   * Can update the form just by editing formTemplate items!
   * See Formik docs for 'type:' and Yup docs for 'validation:'
   * {
   *   label:            <string label for your field>
   *   type:             <string Formik Field type>
   *   validation:       <Yup function (should correspond to above)>
   *   toggleHeader:     <[OPTIONAL] string label for a togglable field>
   * }
   */
  const formTemplate = [
    {
      label: 'Sample size',
      type: 'number',
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

  // Can add and remove togglable fields among those validated
  const [validations, setValidations] = useState(
    formTemplate.reduce((d: any, item: any) => {
      if (!('toggleHeader' in item)) {
        d[item.label] = item.validation;
      }
      return d;
    }, {})
  );

  // Togglable fields can change enabled-status, other fields always enabled
  const [enabled, setEnabled] = useState(
    formTemplate.reduce((d: any, item: any) => {
      d[item.label] = !('toggleHeader' in item);
      return d;
    }, {})
  )

  const [table, setTable] = useState<{[key: string]: number}>({});

  // Contains a field, its error message, and optional togglability
  const FieldBundle = ({ ...props }: any) => {

    // Enable or disable a field and its validation
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
      <div className='my-2' >
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
              classnames('w-7/12 h-9 pl-1 border rounded-md float-right', {
                'border-neutral-200 bg-neutral-100': (!enabled[props.label]),
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
          formTemplate.reduce((d: any, item: any) => {
            d[item.label] = '';
            return d;
          }, {})
        }
        validationSchema={object(validations)}
        onSubmit={(values: any, { setSubmitting }: any) => {
          // table excludes disabled form values
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
          className='w-full md:w-2/3 lg:w-1/2 m-6 p-3 bg-zinc-50'
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
                <td className='border border-black w-48 font-bold p-1' >
                  {title}
                </td>
                <td className='border border-black w-48 p-1' >
                  {val}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;