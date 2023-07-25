import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';


function App() {
  return (
    <div>
      hello
      <Formik
        initialValues={{ sampleSize: '' }}
        validate={values => {
          const errors: any = {};

          console.log(values.sampleSize);

          if (
            !Number.isInteger(values.sampleSize) ||
            parseInt(values.sampleSize) < 2
          ) {
            errors.sampleSize = 'Need a whole number >= 2'
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log('clicked me');
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
      {({ isSubmitting }) => (
        <Form>
          <Field 
            type='number' 
            name='sampleSize' 
          />
          <ErrorMessage 
            name='sampleSize' 
            component='div' 
          />
          
          <button
            className='bg-blue-300'
            type='submit' 
            disabled={isSubmitting}
          >
            OK
          </button>
        </Form>
       )}
     </Formik>
    </div>
  );
}

export default App;
