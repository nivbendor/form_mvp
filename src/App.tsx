import React from 'react';
import MultiStepForm from './components/Form';
import './index.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Add your logo here */}
        {/* Render the MultiStepForm component */}
        <MultiStepForm />
        <div className="text-center text-red-500">
  <h1 className="text-4xl">Tailwind Test</h1>
</div>

      </header>
    </div>
  );
}

export default App;
