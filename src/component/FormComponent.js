import React, { useRef, useState } from "react";
import { Autocomplete } from '@react-google-maps/api';
import './component.css';
import data from '../data/data.json'

const FormComponent = ({setStartPoint, setEndPoint, setPath}) => {
    const startRef = useRef();
    const endRef = useRef();
    const startAutocompleteRef = useRef();
    const endAutocompleteRef = useRef();
    const [ alertMsg, setAlertMsg ] = useState("");
    const [ dist, setDist ] = useState(null);
    const [ totalTime, setTotalTime ] = useState(null);

    // Reset all references and variable
    const resetFunc = () => {
        setStartPoint(null);
        setEndPoint(null);
        startRef.current.value = null;
        endRef.current.value = null;
        setAlertMsg("");
        setDist(null);
        setTotalTime(null);
        setPath(null)
    }

    const address = data.MOCK_API;

    // Handle the submit event
    const handleSubmit = (e) => {
        // Prevent reloading
        e.preventDefault();
        setAlertMsg("");
        setDist(null);
        setTotalTime(null);
        // Upload the data
        postData();
    }

    const postData = () => {
        // Get the origin and destination address
        const startPoint = startRef.current.value;
        const endPoint = endRef.current.value;
        const data = { origin: startPoint, destination: endPoint };
        try {
            // Post to the API with both point
            fetch(address + "/route", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then((res) => res.json())
            .then((data) => {
                // Retrieve the token from the response
                if (data && data.token){
                    // Get the Paths through API
                    getPath(data.token);
                }
            })
            .catch((e) => setAlertMsg("Error exists. Please try again."))
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const getPath = (token) => {
        try {
            fetch(address + "/route/" + token , { method: "get" })
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    const status = data.status;
                    if (status === "success") {
                        // Store the response
                        setDist(data?.total_distance);
                        setTotalTime(data?.total_time);
                        setPath(data?.path);
                    } else if (status === "failure") {
                        // Set the error Message if no way to go
                        setAlertMsg(data?.error);
                    } else if (status === "in progress") {
                        // Retry the logic
                        postData();
                    }
                }
            })
            .catch((e) => setAlertMsg("Error exists. Please try again."))
        } catch (error) {
            console.log("Error: " + error);
        }
    }

    return (
        <form style={containerStyle} onSubmit={handleSubmit}>
            <h2>Web Application</h2>
            <table>
                <tbody>
                <tr>
                    <td>
                        <label>Starting Location: </label>
                    </td>
                    <td>
                        <Autocomplete
                            // Prepare the latitude and longitude for Marker
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
                                }
                            }}
                        >
                            <input
                                type="text"
                                ref={startRef}
                                placeholder="Enter Origin*"
                                required
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
                            // Prepare the latitude and longitude for Marker
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
                                }
                            }}
                        >
                        <input
                            type="text"
                            ref={endRef}
                            placeholder="Enter Destination*"
                            required
                        />
                        </Autocomplete>
                    </td>
                </tr>
                </tbody>
            </table>
            {/* Alert Message */}
            {alertMsg !== "" && <label className="alert">{alertMsg}</label>}
            {/* Path GET response */}
            {dist && <label className="info">Total distance: {dist}</label>}
            {totalTime && <label className="info">Total time: {totalTime}</label>}
            <div className="buttonHorizontal">
                <button type="submit">Submit</button>
                <button type="button" onClick={resetFunc}>Reset</button>
            </div>
        </form>
    );
}

export default FormComponent;

const containerStyle = {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '40%',
    height: '50px',
};
