import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import MapComponent from './component/MapComponent';
import FormComponent from './component/FormComponent';

function App() {
  const [ startPoint, setStartPoint ] = useState(null);
  const [ endPoint, setEndPoint ] = useState(null);
  return (
    <div className="App">
      <FormComponent setStartPoint={setStartPoint} setEndPoint={setEndPoint} />
      <MapComponent startPoint={startPoint} endPoint={endPoint} />
    </div>
  );
}

export default App;
