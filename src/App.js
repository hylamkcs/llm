import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import MapComponent from './component/MapComponent';
import FormComponent from './component/FormComponent';
import { LoadScript } from '@react-google-maps/api';

function App() {
  const [ startPoint, setStartPoint ] = useState(null);
  const [ endPoint, setEndPoint ] = useState(null);
  return (
    <div className="App">
      <LoadScript googleMapsApiKey="AIzaSyCkJ3Sdk0nMhiW5tidgqffVBqaxLms2kio" libraries={["places"]}>
        <FormComponent setStartPoint={setStartPoint} setEndPoint={setEndPoint} />
        <MapComponent startPoint={startPoint} endPoint={endPoint} />
      </LoadScript>
    </div>
  );
}

export default App;
