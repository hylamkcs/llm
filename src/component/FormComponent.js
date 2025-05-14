import React, { useRef } from "react";
import { Autocomplete } from '@react-google-maps/api';

const FormComponent = ({setStartPoint, setEndPoint}) => {
    const startRef = useRef();
    const endRef = useRef();
    const startAutocompleteRef = useRef();
    const endAutocompleteRef = useRef();
    return (
        <form style={containerStyle}>
            <table>
                <tr>
                    <td style={labelStyle}>
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
                            />
                        </Autocomplete>
                    </td>
                </tr>
                <tr>
                    <td style={labelStyle}>
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
                        />
                        </Autocomplete>
                    </td>
                </tr>
            </table>
        </form>
    );
}

export default FormComponent;

const containerStyle = {
    position: 'absolute',
    top: '40%',
    left: '5%',
    width: '400px',
    height: '50px'
};

const labelStyle = { textAlign: 'right', paddingRight: '10px' };