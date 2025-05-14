// MapComponent.jsx
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, DirectionsService } from '@react-google-maps/api';

const MapComponent = ({startPoint, endPoint, path}) => {
    const [position, setPosition] = useState(null);
    const [directions, setDirections] = useState(null);
    const [waypoints, setWaypoints] = useState([]);
    const [hasRequested, setHasRequested] = useState(false);
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
              console.log(err.message);
            }
          );
        } else {
          console.log('Geolocation is not supported by this browser.');
        }
      };
      getLocation();
    }, []);
    
    useEffect(() => {
      setDirections(false);
      setHasRequested(false);
      setWaypoints([]);
      if (path?.length > 1) {
        // Extract waypoints
        const intermediatePoints = path.slice(1, -1);

        setWaypoints(intermediatePoints.map(point => ({
          location: new window.google.maps.LatLng(parseFloat(point[0]), parseFloat(point[1])),
          stopover: true
        })));
      }
    }, [path]);

    const directionsCallback = (response) => {
      if (response !== null && response.status === 'OK') {
        // Showing the path
        setDirections(response);
        // Avoid infinitely rendering
        setHasRequested(true);
      }
    };

    return (
      <GoogleMap
          mapContainerStyle={containerStyle}
          center={endPoint!==null?endPoint:startPoint!==null?startPoint:position}
          zoom={10}
      >
        {/* Displaying the location of chosen origin and destination */}
        { startPoint !== null && path === null && <Marker position={startPoint} /> }
        { endPoint !== null && path === null && <Marker position={endPoint} /> }  
      
        {path && path?.length > 1 && !hasRequested && (
          <DirectionsService
            options={{
              destination: new window.google.maps.LatLng(
                parseFloat(path[path.length - 1][0]),
                parseFloat(path[path.length - 1][1])
              ),
              origin: new window.google.maps.LatLng(
                parseFloat(path[0][0]),
                parseFloat(path[0][1])
              ),
              waypoints: waypoints,
              travelMode: window.google.maps.TravelMode.DRIVING,
              optimizeWaypoints: true,
            }}
            callback={directionsCallback}
          />
        )}
        {path && directions && (
          <DirectionsRenderer
            options={{
              directions: directions,
              suppressMarkers: false
            }}
          />
        )}
      </GoogleMap>
    );
};

export default MapComponent;

const containerStyle = {
    position: 'absolute',
    top: '20%',
    right: '10%',
    width: '40%',
    height: '400px'
};