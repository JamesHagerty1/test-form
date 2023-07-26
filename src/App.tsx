import React, {useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

type TableVals = { [key: string]: number };

function App() {
  const [tableVals, setTableVals] = useState<TableVals>({});
  const [doHypothesisTest, setDoHypothesisTest] = useState(false);

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    const table: TableVals = {};
    
    table['sample size'] = values.sampleSize;
    table['sample mean'] = values.sampleMean;
    table['standard deviation'] = values.standardDeviation;

    if (doHypothesisTest) {
      table['hypothesized mean'] = values.hypothesizedMean;
    }

    setTableVals(table);
    setSubmitting(false);
  };

  interface FormItemProps {
    name: string;
    labelText: string;
    disabled: boolean;
  }

  const FormItem: React.FC<FormItemProps> = ({ name, labelText, disabled }) => {
    return (
      <div>
        <div>
          <label htmlFor={name}>{labelText}</label>
          <Field
            className='border border-gray-400 rounded-sm' 
            type='number'
            name={name}
            disabled={disabled}
          />
        </div>
        <ErrorMessage
          className='text-red-600' 
          name={name}
          component='div' 
        />
      </div>
    );
  };

  return (
    <div>
      <Formik
        initialValues={{
          sampleSize: '',
          sampleMean: '',
          standardDeviation: '', 
          hypothesizedMean: '' 
        }}
        validate={values => {
          setTableVals({});

          const errors: any = {};

          if (
            !Number.isInteger(values.sampleSize) ||
            parseInt(values.sampleSize) < 2
          ) {
            errors.sampleSize = 'Need a whole number >= 2';
          }

          if (values.sampleMean === '') {
            errors.sampleMean = 'Need a numeric value';
          }

          if (
            values.standardDeviation === '' || 
            parseFloat(values.standardDeviation) <= 0
          ) {
            errors.standardDeviation = 'Need a numeric value > 0';
          }

          if (doHypothesisTest && values.hypothesizedMean === '') {
            errors.hypothesizedMean = 'Need a numeric value';
          }

          return errors;
        }}
        onSubmit={handleSubmit}
      >
      {({ isSubmitting }) => (
        <Form>
          <FormItem 
            name={'sampleSize'}
            labelText={'Sample size:'} 
            disabled={false}
          />
          
          <FormItem 
            name={'sampleMean'}
            labelText={'Sample mean:'} 
            disabled={false}
          />

          <FormItem 
            name={'standardDeviation'}
            labelText={'Standard deviation:'} 
            disabled={false}
          />

          <input                       // modularize this one too for generalization
            type='checkbox'
            checked={doHypothesisTest}
            onChange={(e) => setDoHypothesisTest(e.target.checked)}
          />
          <label>Perform hypothesis test</label>
          <FormItem
            name={'hypothesizedMean'}
            labelText={'Hypothesized mean:'}
            disabled={!doHypothesisTest}
          />

          <br></br>
          <button
            className='w-24 bg-blue-500 text-white border border-blue-500'
            type='submit' 
            disabled={isSubmitting}
          >
            OK
          </button>
          <button
            className='w-24 border border-gray-300'
            type='reset'
            onClick={ () => { setTableVals({}) } }
          >
            Reset
          </button>
        </Form>
      )}
      </Formik>
      {(Object.keys(tableVals).length > 0) && (
        <table>
          <tbody>
            {Object.keys(tableVals).map((title: string) =>
              <tr
                key={title}
              >
                <td>{title}</td>
                <td>{tableVals[title]}</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;