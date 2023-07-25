import {useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';


function App() {
  const [doHypothesisTest, setDoHypothesisTest] = useState(false);

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    console.log(values.sampleSize);
    setSubmitting(false);
  };

  return (
    <div>
      <Formik
        initialValues={{ sampleSize: '' }}
        validate={values => {
          const errors: any = {};

          if (
            !Number.isInteger(values.sampleSize) ||
            parseInt(values.sampleSize) < 2
          ) {
            errors.sampleSize = 'Need a whole number >= 2'
          }

          return errors;
        }}
        onSubmit={handleSubmit}
      >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor='sampleSize'>Sample size:</label>
            <Field
              className='border border-gray-400 rounded-sm' 
              type='number' 
              name='sampleSize' 
            />
          </div>
          <ErrorMessage
            className='text-red-600' 
            name='sampleSize' 
            component='div' 
          />
          
          <div>
            <input
              type='checkbox'
              id='enableFields'
              checked={doHypothesisTest}
              onChange={(e) => setDoHypothesisTest(e.target.checked)}
            />
            <label htmlFor='enableFields'>Perform hypothesis test</label>
          </div>

          <button
            className='w-24 bg-blue-500 text-white border border-blue-500'
            type='submit' 
            disabled={isSubmitting}
          >
            OK
          </button>
          <button
            className='w-24 border border-gray-300'
          >
            Reset
          </button>
        </Form>
       )}
     </Formik>
     {

     }
    </div>
  );
}

export default App;
