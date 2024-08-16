// cakewalk-form\src\components\Form.tsx
import React, { ChangeEvent, useCallback, useState } from 'react';
import { UserCircle, Plus } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import '../index.css';


export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
] as const;

type USState = typeof US_STATES[number];

interface Employee {
  firstName: string;
  lastName: string;
  email: string;
}

interface FormData {
  agencyLegalName: string;
  ein: string;
  numberOfEmployees: string;
  BOFirstName: string;
  BOLastName: string;
  BOEmail: string;
  BOPhoneNumber: string;
  BOStreetAddress: string;
  BOStreetAddressLine2: string;
  BOCity: string;
  BOState: USState | '';
  BOZipCode: string;
  employees: Employee[];
  enrollmentWindow: string;
}

const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData & { errors: Partial<Record<keyof FormData, string>> }>({
    agencyLegalName: '',
    ein: '',
    numberOfEmployees: '1',
    BOFirstName: '',
    BOLastName: '',
    BOEmail: '',
    BOPhoneNumber: '',
    BOStreetAddress: '',
    BOStreetAddressLine2: '',
    BOCity: '',
    BOState: '',
    BOZipCode: '',
    employees: [{ firstName: '', lastName: '', email: '' }],
    enrollmentWindow: '',
    errors: {}
  });


  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateInput = useCallback((name: string, value: string) => {
    switch (name) {
      case 'BOZipCode':
        return /^\d{5}$/.test(value) ? null : 'Zip code must be 5 digits';
      case 'ein':
        return /^\d{2}-\d{7}$/.test(value) ? null : 'EIN must be in format xx-xxxxxxx';
      case 'BOEmail':
        return /\S+@\S+\.\S+/.test(value) ? null : 'Invalid email format';
      default:
        return null;
    }
  }, []);


  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const error = validateInput(name, value);
      return {
        ...prevData,
        [name]: value,
        errors: {
          ...prevData.errors,
          [name]: error
        }
      };
    });
  }, [validateInput]);

  const handleEmployeeChange = (index: number, field: keyof Employee, value: string) => {
    const newEmployees = [...formData.employees];
    newEmployees[index] = { ...newEmployees[index], [field]: value };
    setFormData({ ...formData, employees: newEmployees });
  };

  const addEmployee = () => {
    if (formData.employees.length < 10) {
      setFormData({
        ...formData,
        employees: [...formData.employees, { firstName: '', lastName: '', email: '' }]
      });
    }
  };

  const removeEmployee = (index: number) => {
    const newEmployees = formData.employees.filter((_, i) => i !== index);
    setFormData({ ...formData, employees: newEmployees });
  };

  const handleNext = () => {
    // Validate current step before proceeding
    const currentStepFields = getFieldsForStep(step);
    const stepErrors: Partial<Record<keyof FormData, string>> = {};
    currentStepFields.forEach(field => {
      const error = validateInput(field, formData[field as keyof FormData] as string);
      if (error) stepErrors[field as keyof FormData] = error;
    });

    if (Object.keys(stepErrors).length === 0) {
      setStep(prevStep => prevStep + 1);
    } else {
      setErrors(stepErrors);
    }
  };

  const handleSubmit = () => {
    // Implement final validation and API submission
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your API
    setStep(prevStep => prevStep + 1); // Move to thank you page
  };

  const getFieldsForStep = (stepNumber: number): (keyof FormData)[] => {
    switch (stepNumber) {
      case 0:
        return ['agencyLegalName', 'ein', 'numberOfEmployees'];
      case 1:
        return ['BOFirstName', 'BOLastName', 'BOEmail', 'BOPhoneNumber'];
      case 2:
        return ['BOStreetAddress', 'BOStreetAddressLine2', 'BOCity', 'BOState', 'BOZipCode'];
      case 3:
        return ['employees'];
      case 4:
        return ['enrollmentWindow'];
      default:
        return [];
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">About Your Business</h2>
            <Input
              label="Agency Legal Name"
              name="agencyLegalName"
              value={formData.agencyLegalName}
              onChange={handleInputChange}
              error={errors.agencyLegalName}
            />
            <Input
              label="EIN"
              name="ein"
              value={formData.ein}
              onChange={handleInputChange}
              error={errors.ein}
              placeholder="xx-xxxxxxx"
            />
            <div>
              <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Employees
                <span className="ml-1 text-sm text-gray-500">(Not including owner)</span>
              </label>
              <select
                id="numberOfEmployees"
                name="numberOfEmployees"
                value={formData.numberOfEmployees}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#333333]">About You</h2>
            <Input
              label="First Name"
              name="BOFirstName"
              value={formData.BOFirstName}
              onChange={handleInputChange}
              error={errors.BOFirstName}
            />
            <Input
              label="Last Name"
              name="BOLastName"
              value={formData.BOLastName}
              onChange={handleInputChange}
              error={errors.BOLastName}
            />
            <Input
              label="Email"
              name="BOEmail"
              type="email"
              value={formData.BOEmail}
              onChange={handleInputChange}
              error={errors.BOEmail}
            />
            <Input
              label="Phone Number"
              name="BOPhoneNumber"
              type="tel"
              value={formData.BOPhoneNumber}
              onChange={handleInputChange}
              error={errors.BOPhoneNumber}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#333333]">Where do you live?</h2>
            <Input
              label="Street Address"
              name="BOStreetAddress"
              value={formData.BOStreetAddress}
              onChange={handleInputChange}
              error={errors.BOStreetAddress}
            />
            <Input
              label="Street Address Line 2"
              name="BOStreetAddressLine2"
              value={formData.BOStreetAddressLine2}
              onChange={handleInputChange}
              error={errors.BOStreetAddressLine2}
            />
            <Input
              label="City"
              name="BOCity"
              value={formData.BOCity}
              onChange={handleInputChange}
              error={errors.BOCity}
            />
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">State</label>
              <select
                name="BOState"
                value={formData.BOState}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF1493] focus:ring focus:ring-[#FF1493] focus:ring-opacity-50"
              >
                <option value="">Select a state</option>
                {US_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <Input
              label="Zip Code"
              name="BOZipCode"
              value={formData.BOZipCode}
              onChange={handleInputChange}
              error={errors.BOZipCode}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#333333]">About Your Employees</h2>
            {formData.employees.map((employee, index) => (
              <div key={index} className="bg-white shadow overflow-hidden sm:rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <UserCircle size={40} className="text-[#FF1493]" />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeEmployee(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <Input
                  label="First Name"
                  value={employee.firstName}
                  onChange={(e) => handleEmployeeChange(index, 'firstName', e.target.value)} name={''}                />
                <Input
                  label="Last Name"
                  value={employee.lastName}
                  onChange={(e) => handleEmployeeChange(index, 'lastName', e.target.value)} name={''}                />
                <Input
                  label="Email"
                  type="email"
                  value={employee.email}
                  onChange={(e) => handleEmployeeChange(index, 'email', e.target.value)} name={''}                />
              </div>
            ))}
            {formData.employees.length < 10 && (
              <button
                type="button"
                onClick={addEmployee}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF1493] hover:bg-[#FF1493] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1493]"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Employee
              </button>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#333333]">What date did you have in mind to start the enrollment?</h2>
            <div className="flex flex-wrap gap-4">
              {['This week', 'Next week', 'Next month', 'Not sure'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData({ ...formData, enrollmentWindow: option })}
                  className={`px-4 py-2 rounded-md ${
                    formData.enrollmentWindow === option
                      ? 'bg-[#FF1493] text-white'
                      : 'bg-[#F0F0F0] text-[#333333] hover:bg-[#FFD700]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#333333] mb-4">Your benefits are in the making!</h2>
            <p className="text-[#333333]">Shortly you will receive an email with more information about the process.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const Input: React.FC<{
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
  }> = React.memo(({ label, name, type = 'text', value, onChange, error, placeholder }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
        } sm:text-sm`}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  ));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-12 w-auto" src="/cakewalk_logo.png" alt="Cakewalk" />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Progress bar */}
          <div className="mb-4">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${((step + 1) / 6) * 100}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              ></div>
            </div>
          </div>

          {renderStep()}

          {/* Navigation buttons */}
          <div className="mt-6 flex justify-between">
            {step > 0 && step < 5 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            ) : step === 4 ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;