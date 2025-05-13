import React, { useState } from "react";

const FormComponent = (setStartPoint, setEndPoint) => {
    
    const [sloc, setsloc] = useState(null);
    const [eloc, seteloc] = useState(null);

    return (
        <form style={containerStyle}>
            <table>
                <tr>
                    <td>
                        <label>Starting Location: </label>
                    </td>
                    <td>
                        <input
                            type="text"
                            value={sloc}
                            onChange={(e) => {setsloc(e.target.value); setStartPoint(e.target.value);}}
                            required
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Drop-off Point: </label>
                    </td>
                    <td>
                        <input
                            type="text"
                            value={eloc}
                            onChange={(e) => {seteloc(e.target.value); setEndPoint(e.target.value)}}
                            required
                        />
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

const leftStyle = {
    textan
};