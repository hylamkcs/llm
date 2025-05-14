import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import MapComponent from './component/MapComponent';
import FormComponent from './component/FormComponent';
import { LoadScript } from '@react-google-maps/api';
import data from './data/data.json'

function App() {
  const [ startPoint, setStartPoint ] = useState(null);
  const [ endPoint, setEndPoint ] = useState(null);
  const [ path, setPath ] = useState(null);
  return (
    <div className="App">
      <LoadScript googleMapsApiKey={data.API_KEY} libraries={["places"]}>
        <FormComponent setStartPoint={setStartPoint} setEndPoint={setEndPoint} setPath={setPath} />
        <MapComponent startPoint={startPoint} endPoint={endPoint} path={path} />
      </LoadScript>
    </div>
  );
}

export default App;
