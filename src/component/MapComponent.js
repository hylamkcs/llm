// MapComponent.jsx
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = (startPoint ,endPoint) => {
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

    return (
        <LoadScript googleMapsApiKey="AIzaSyCkJ3Sdk0nMhiW5tidgqffVBqaxLms2kio">
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={15}
        >
            <Marker position={position} />
        </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;

const containerStyle = {
    position: 'absolute',
    top: '20%',
    right: '5%',
    width: '600px',
    height: '400px'
};