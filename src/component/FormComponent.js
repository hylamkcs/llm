import React, { useRef } from "react";
import { Autocomplete } from '@react-google-maps/api';
import './component.css';

const FormComponent = ({setStartPoint, setEndPoint}) => {
    const startRef = useRef();
    const endRef = useRef();
    const startAutocompleteRef = useRef();
    const endAutocompleteRef = useRef();

    const resetFunc = () => {
        setStartPoint(null);
        setEndPoint(null);
        startRef.current = null;
        endRef.current = null;
        startAutocompleteRef.current = null;
        endAutocompleteRef.current = null;
    }

    const handleSubmit = () => {
        
    }
    return (
        <form style={containerStyle}>
            <table>
                <tbody>
                <tr>
                    <td>
                        <label>Starting Location: </label>
                    </td>
                    <td>
                        <Autocomplete
                            onLoad={(autocomplete) => {
                                startAutocompleteRef.current = autocomplete;
                            }}
                            onPlaceChanged={() => {
                                const place = startAutocompleteRef.current.getPlace();
                                if (place?.geometry) {
                                    // Retrieve the latitue and longitude for map marker
                                    const lat = place.geometry.location.lat();
                                    const lng = place.geometry.location.lng();
                                    setStartPoint({ lat: lat, lng: lng });
                                    console.log("Start Coordinates:", lat, lng);
                                }
                            }}
                        >
                            <input
                                type="text"
                                ref={startRef}
                                placeholder="Enter Origin"
                            />
                        </Autocomplete>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Drop-off Point: </label>
                    </td>
                    <td>
                        <Autocomplete
                            onLoad={(autocomplete) => {
                                endAutocompleteRef.current = autocomplete;
                            }}
                            onPlaceChanged={() => {
                                const place = endAutocompleteRef.current.getPlace();
                                if (place?.geometry) {
                                    // Retrieve the latitue and longitude for map marker
                                    const lat = place.geometry.location.lat();
                                    const lng = place.geometry.location.lng();
                                    setEndPoint({ lat: lat, lng: lng });
                                    console.log("Start Coordinates:", lat, lng);
                                }
                            }}
                        >
                        <input
                            type="text"
                            ref={endRef}
                            placeholder="Enter Destination"
                        />
                        </Autocomplete>
                    </td>
                </tr>
                </tbody>
            </table>
            <div className="buttonHorizontal">
                <button type="submit" onClick={handleSubmit}>Submit</button>
                <button type="button" onClick={resetFunc}>Reset</button>
            </div>
        </form>
    );
}

export default FormComponent;

const containerStyle = {
    position: 'absolute',
    top: '40%',
    left: '10%',
    width: '40%',
    height: '50px',
};
