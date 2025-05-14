// MapComponent.jsx
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const MapComponent = ({startPoint ,endPoint}) => {
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setPosition({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => {
            setError(err.message);
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    };
        getLocation();
    }, []);
    console.log(startPoint,endPoint)
    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={endPoint!==null?endPoint:startPoint!==null?startPoint:position}
            zoom={15}
        >
          { (startPoint === null && endPoint === null) && <Marker position={position} /> }
          { startPoint !== null && <Marker position={startPoint} /> }
          { endPoint !== null && <Marker position={endPoint} /> }  
        </GoogleMap>
    );
};

export default MapComponent;

const containerStyle = {
    position: 'absolute',
    top: '20%',
    right: '5%',
    width: '40%',
    height: '400px'
};