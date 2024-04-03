import React, {useState, useContext, useEffect} from "react"
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"

const CreatePage = () => {
    const { user } = useContext(AuthContext);
    const [currencies, setCurrencies] = useState([{ id: 1, currencyType: "", currencyImage: null, currencyDesc: "" }]);
    const [spaces, setSpaces] = useState([{id: 0, spaceName: ".", spaceColor : "#EEEEEE", spaceImage: null, spaceType: "", spaceValue: "", spaceDesc: "", spaceOption: "spaceColor"}, { id: 1, spaceName: "Start", spaceColor: "#EEEEEE", spaceImage: null, spaceType: "Start", spaceValue: "Start", spaceDesc: "This is the Start space.", spaceOption: "spaceColor"}, { id: 2, spaceName: "Finish", spaceColor: "#EEEEEE", spaceImage: null, spaceType: "Nothing", spaceValue: "", spaceDesc: "This is the Finish space.", spaceOption: "spaceColor" }]);
    const [publicity, setPublicity] = useState(false);
    const [layout, setLayout] = useState([
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]);
    const spaceIds = spaces.map(space => space.id);
    let createCustom = async (e) => {
        e.preventDefault();
        let convertedLayout = layout;
        for (let i=0; i<convertedLayout.length; i++) {
            for (let j=0; j<convertedLayout.length; j++) {
                convertedLayout[i][j] = spaces[spaceIds.indexOf(convertedLayout[i][j])].spaceName;
            }
        }
        const formData = new FormData();
        formData.append("user", JSON.stringify(user));
        formData.append("title", e.target.title.value);
        formData.append("desc", e.target.desc.value);
        formData.append("rules", e.target.rules.value);
        formData.append("publicity", JSON.stringify(publicity));
        formData.append("diceRoll", e.target.diceroll.value);
        currencies.forEach(currency => {
            formData.append("currencyImages[]", currency.currencyImage);
        });
        formData.append("currencies[]", JSON.stringify(currencies))
        const blanks = spaces.shift();
        spaces.forEach(space => {
            delete space["spaceOption"];
            formData.append("spaceImages[]", space.spaceImage);
        });
        console.log(formData["spaceImages"])
        formData.append("spaces", JSON.stringify(spaces));
        formData.append("layout", JSON.stringify(convertedLayout));
        try {
            const response = await fetch("http://127.0.0.1:8000/api/create/", {
                method: "POST",
                body: formData
            });
            let data = await response.json();
            console.log(data);
            spaces.unshift(blanks);
            if (data["message"] === "Board game created successfully.") {
                window.location = "/"
            } else {
                alert("oh dang something went wrong");
                for (let i=0; i<layout.length; i++) {
                    for (let j=0; j<layout.length; j++) {
                        for (let k=0; k<spaces.length; k++) {
                            if (layout[i][j] == spaces[k].spaceName) {
                                layout[i][j] = spaces[k].id;
                                break;
                            }
                        }
                        
                    }
                }
            }
        } catch (error) {
            console.log(error, spaces);
            for (let i=0; i<layout.length; i++) {
                for (let j=0; j<layout.length; j++) {
                    for (let k=0; k<spaces.length; k++) {
                        if (layout[i][j] == spaces[k].spaceName) {
                            layout[i][j] = spaces[k].id;
                            break;
                        }
                    }
                    
                }
            }
        }
    }
    const addCurrency = () => {
        const newId = currencies[currencies.length - 1].id + 1;
        setCurrencies([...currencies, { currencyName: "", id: newId, currencyType: "", currencyImage: null, currencyDesc: "" }]);
    };
    const removeCurrency = (id) => {
        if (currencies.length > 1) {
            const updatedCurrencies = currencies.filter(currency => currency.id !== id);
            setCurrencies(updatedCurrencies);
        }
    };
    const handleCurrencyTypeChange = (id, event) => {
        const { value } = event.target;
        const updatedCurrencies = currencies.map(currency => {
            if (currency.id === id) {
                return {
                    ...currency,
                    currencyType: value
                };
            }
            return currency;
        });
        setCurrencies(updatedCurrencies);
    };
    const handleCurrencyImageChange = (id, event) => {
        const { files } = event.target;
        console.log(files[0])
        const updatedCurrencies = currencies.map(currency => {
            if (currency.id === id) {
                return {
                    ...currency,
                    currencyImage: files[0]
                };
            }
            return currency;
        });
        setCurrencies(updatedCurrencies);
    };
    const updateCurrencyDesc = (id, event) => {
        let value = event.target.value
        console.log(value, typeof event.target.value)
        const updatedCurrencies = currencies.map(currency => {
            if (currency.id === id) {
                return {
                    ...currency,
                    currencyDesc: event.target.value
                }
            }
            return currency;
        });
        setCurrencies(updatedCurrencies);
    }
    const addSpace = () => {
        const newId = spaces[spaces.length - 1].id + 1;
        setSpaces([...spaces, { spaceName: "", id: newId, spaceColor: "#EEEEEE", spaceImage: null, spaceType: null, spaceValue: null, spaceDesc: "" }]);
    };
    const removeSpace = (id) => {
        if (spaces.length > 2) {
            const updatedSpaces = spaces.filter(space => space.id !== id);
            setSpaces(updatedSpaces);
        }
        const newLayout = [...layout];
        for (let i = 0; i < newLayout.length; i++) {
            for (let j = 0; j < newLayout[i].length; j++) {
                if (newLayout[i][j] == id) {
                    newLayout[i][j] = "0";
                }
            }
        }
        setLayout(newLayout);
    };
    const updateSpaceName = (id, event) => {
        const { value } = event.target;
        const updatedSpaces = spaces.map(space => {
            if (space.id === id) {
                return {
                    ...space,
                    spaceName: value
                }
            } 
            return space;
        });
        setSpaces(updatedSpaces);
        console.log(spaces);
    }
    const handleSpaceColorChange = (id, event) => {
        const { value } = event.target;
        const updatedSpaces = spaces.map(space => {
            if (space.id === id) {
                return {
                    ...space,
                    spaceColor: value, 
                    spaceImage: null
                };
            }
            return space;
        });
        setSpaces(updatedSpaces);
    };
    const handleSpaceImageChange = (id, event) => {
        const { files } = event.target;
        console.log(files[0])
        const updatedSpaces = spaces.map(space => {
            if (space.id === id) {
                return {
                    ...space,
                    spaceColor: null,
                    spaceImage: files[0]
                };
            }
            return space;
        });
        setSpaces(updatedSpaces);
    };
    const updateSpaceType = (id, event) => {
        const { value } = event.target;
        const updatedSpaces = spaces.map(space => {
            if (space.id === id) {
                if (["Add", "Remove"].includes(value)) {
                    if (value === "Add") {
                        return {
                            ...space,
                            spaceType: "Currency",
                            spaceValue: ["", 1]
                        }
                    } else {
                        return {
                            ...space,
                            spaceType: "Currency",
                            spaceValue: ["", -1]
                        }                        
                    }
                } else if (["Movement", "MoveTo"].includes(value)) {
                    if (value == "Movement") {
                        return {
                            ...space,
                            spaceType: "Movement",
                            spaceValue: 1
                        }
                    } else {
                        return {
                            ...space,
                            spaceType: "Movement",
                            spaceValue: "Start"
                        }
                    }
                } else if (value === "Turn") {
                    return {
                        ...space,
                        spaceType: "Turn",
                        spaceValue: true
                    }
                } else if (value === "Nothing") {
                    return {
                        ...space,
                        spaceType: value,
                        spaceValue: "Nothing"
                    }
                } else {
                    return {
                        ...space,
                        spaceType: "",
                        spaceValue: ""
                    }
                }
            }
            return space;
        });
        setSpaces(updatedSpaces);
    }
    const updateSpaceValue = (id, event) => {
        let value = event.target.value
        console.log(value, typeof event.target.value)
        const updatedSpaces = spaces.map(space => {
            if (space.id === id) {
                if (space.spaceType === "Currency") { 
                    if (isNaN(parseInt(event.target.value))) {
                        return {
                            ...space, 
                            spaceValue: [event.target.value, space.spaceValue[1]]
                        }
                    } else {
                        return {
                            ...space,
                            spaceValue: [space.spaceValue[0], parseInt(event.target.value)]
                        }
                    }
                } else {
                    if (isNaN(parseInt(event.target.value))) {
                        return {
                            ...space,
                            spaceValue: event.target.value
                        }
                    } else {
                        return {
                            ...space,
                            spaceValue: parseInt(event.target.value)
                        }
                    }
                }
            }
            return space;
        });
        setSpaces(updatedSpaces);
    }
    const updateSpaceDesc = (id, event) => {
        let value = event.target.value
        console.log(value, typeof event.target.value)
        const updatedSpaces = spaces.map(space => {
            if (space.id === id) {
                return {
                    ...space,
                    spaceDesc: event.target.value
                }
            }
            return space;
        });
        setSpaces(updatedSpaces);
    }
    const updateLayout = (rowIndex, cellIndex) => {
        const newLayout = [...layout];
        let cell = newLayout[rowIndex][cellIndex];
        if (spaceIds.indexOf(cell)+1 >= spaceIds.length) {
            cell = "";
        }
        newLayout[rowIndex][cellIndex] = spaceIds[spaceIds.indexOf(cell)+1];
        setLayout(newLayout);
    };
    const handleSpaceOptionChange = (id, event) => {
        const { value } = event.target;
        const updatedSpaces = spaces.map(space => {
            if (space.id === id) {
                return {
                    ...space,
                    spaceOption: value
                };
            }
            return space;
        });
        setSpaces(updatedSpaces);
    };
    return (
        <div className="vw-100 justify-content-center align-items-center row d-flex">
            <form className="row d-flex mt-4 m-2 col-10 col-sm-10 col-md-8 col-lg-6" onSubmit={createCustom}>
                <h1>Create your own game! :D</h1>
                <div id="form" className="form-group">
                    <div>
                        <label htmlFor="game_title">Title of Game:</label>
                        <input type="text" name="title" maxLength="100" className="form-control text-dark shadow p-2 my-2 my-2" required id="game_title" />  
                    </div>
                    <div>
                        <label htmlFor="game_desc">Description:</label>
                        <textarea name="desc" className="form-control text-dark shadow p-2 my-2 my-2" required id="game_desc" rows={5} />   
                    </div>
                    <div>
                        <label htmlFor="game_rules">Rules:</label>
                        <textarea name="rules" className="form-control text-dark shadow p-2 my-2 my-2" required id="game_rules" placeholder="Type your rules in point form like:&#10;- example rule 1&#10;- example rule 2" rows={5} />   
                    </div>
                    <div>
                        <label htmlFor="diceroll">Create your own dice! How many sides will this dice have?</label>
                        <input type="number" defaultValue={1} min={1} name="diceroll" maxLength="100" className="form-control text-dark shadow p-2 my-2 my-2" required id="diceroll" />  
                    </div>
                    <h2>Currencies</h2>
                    {currencies.map(currency => (
                        <div className="form-group mb-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control text-primary"
                                    placeholder="Currency Name"
                                    aria-label="Currency Name"
                                    value={currency.currencyType}
                                    onChange={(e) => handleCurrencyTypeChange(currency.id, e)}
                                />
                                <input
                                    type="file"
                                    className="form-control text-primary"
                                    aria-label="Currency Image"
                                    name={`currency-image-${currency.id}`}
                                    onChange={(e) => handleCurrencyImageChange(currency.id, e)}
                                />
                                <button
                                    className="btn btn-primary"
                                    
                                    
                                    onClick={addCurrency}
                                    disabled={currency.id !== currencies[currencies.length - 1].id}
                                >
                                    +
                                </button>
                                <button
                                    className="btn btn-danger"
                                    type="button"
                                    onClick={() => removeCurrency(currency.id)}
                                >
                                    - 
                                </button>
                            </div>
                            {currency.currencyType && 
                                <div className="input-group">
                                    <textarea value={currency.currencyDesc} onChange={(e) => updateCurrencyDesc(currency.id, e)} className="form-control text-dark p-2" required placeholder="Give a custom description for your currency that will be displayed on the game page :D" rows={2} />  
                                </div> 
                            }
                        </div>
                    ))}
                    <h2>Spaces</h2>
                    {spaces.map(space => (space.id != 0 && 
                        <div className="form-group mb-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Space Name"
                                    aria-label="Space Name"
                                    name={`space-name-${space.id}`}
                                    value={space.spaceName}
                                     onChange={(e)=>updateSpaceName(space.id, e)}
                                />
                                <select value={
                                    space.spaceValue ? (
                                        (space.spaceType == "Currency") ?
                                            (parseInt(space.spaceValue[1]) > 0) ? 
                                                "Add"
                                            : 
                                                "Remove"
                                        : (space.spaceType == "Movement") ? 
                                            (isNaN(parseInt(space.spaceValue))) ? "MoveTo" : "Movement"
                                        : (space.spaceType == "Turn") ? 
                                            "Turn"
                                        : (space.spaceType == "Start") ? 
                                            "Start" 
                                        : (space.spaceType == "Nothing") &&
                                            "Nothing"
                                    ) : ""
                                } disabled={space.id === 1 && true} className="form-select" aria-label="Default select example" onChange={(e)=>updateSpaceType(space.id, e)}>
                                    <option value="" >--Choose a function--</option>
                                    <option value="Add">Add (amt) to (currency)</option>
                                    <option value="Remove">Remove (amt) from (currency)</option>
                                    <option value="Movement">Move (amt) spaces</option>
                                    <option value="MoveTo">Move to (space)</option>
                                    <option value="Turn">Skip Turn</option>
                                    <option value="Nothing" >Nothing</option>
                                    <option value="Start">Start</option>
                                </select>
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={addSpace}
                                >
                                    +
                                </button>
                                <button disabled={space.id === 1 && true} 
                                    className="btn btn-danger"
                                    type="button"
                                    onClick={() => removeSpace(space.id)}
                                >
                                    - 
                                </button>
                            </div>
                            <div className="input-group">
                                {space.spaceType === "Currency" ?
                                    <>
                                        <select value={space.spaceValue[0]} className="form-select" onChange={(e) => updateSpaceValue(space.id, e)}>
                                            <option value="">Please choose a currency.</option>
                                            {currencies.map(currency => currency.currencyType != "" && (
                                                <option value={currency.currencyType}>{currency.currencyType}</option>
                                            ))}
                                        </select>
                                        {space.spaceValue[0] != "" && 
                                            <input
                                                type="number"
                                                className="form-control text-primary"
                                                aria-label="Space Value"
                                                name={`space-value-${space.id}`}
                                                value={space.spaceValue[1]}
                                                onChange={(e)=>{
                                                    if (e.target.value === "") {
                                                        e.target.value = 0;
                                                    }
                                                    updateSpaceValue(space.id, e);
                                                }}
                                            />
                                        }
                                    </>
                                : (space.spaceType === "Movement" &&
                                    (typeof space.spaceValue !== "string" ? 
                                        <input
                                            type="number"
                                            placeholder="How many spaces will they move?"
                                            className="form-control text-dark"
                                            aria-label="Space Value"
                                            name={`space-value-${space.id}`}
                                            value={space.spaceValue}
                                            onChange={(e)=>updateSpaceValue(space.id, e)}
                                        />
                                    : 
                                        <select value={space.spaceValue} className="form-select" onChange={(e) => updateSpaceValue(space.id, e)}>
                                            <option value="" >Please choose a space.</option>
                                            {spaces.map(space2 => space2.spaceName != space.spaceName && (
                                                <option key={space2.id} value={space2.spaceName}>{space2.spaceName}</option>
                                            ))}
                                        </select>
                                    ))
                                }
                            </div>
                            <div className="input-group">
                                <select 
                                    defaultValue={space.spaceOption}
                                    className="form-select" 
                                    onChange={(e) => handleSpaceOptionChange(space.id, e)}
                                >
                                    <option value="spaceColor">Space Color</option>
                                    <option value="spaceImage">Space Image</option>
                                </select>
                                {space.spaceOption === "spaceImage" ?
                                    <input files={space.spaceImage} type="file" className="form-control" onChange={(e) => handleSpaceImageChange(space.id, e)} />
                                : 
                                    <input value={space.spaceColor} type="color" className="form-control form-control-color" onChange={(e) => handleSpaceColorChange(space.id, e)} />
                                }
                            </div>
                            {space.spaceValue && !(typeof space.spaceValue == "object" && space.spaceValue.includes("")) && 
                                <>
                                    <div className="input-group">
                                        <textarea defaultValue={space.spaceValue && (
                                            `The ${space.spaceName} space` + (
                                                space.spaceValue && (
                                                    (space.spaceType == "Currency") ?
                                                        (parseInt(space.spaceValue[1]) > 0) ? 
                                                            ` adds ${space.spaceValue[1]} ${space.spaceValue[0]} to the player who lands on it.`
                                                        : 
                                                            ` removes ${Math.abs(space.spaceValue[1])} ${space.spaceValue[0]} from the player who lands on it.`
                                                    : (space.spaceType == "Movement") ? 
                                                        (isNaN(parseInt(space.spaceValue))) ? ` moves the player to the ${space.spaceValue} space.` : ` moves the player ${space.spaceValue} spaces.`
                                                    : (space.spaceType == "Turn") ? 
                                                        " skips the turn of the player who lands on it."
                                                    : (space.spaceType == "Start") ? 
                                                        " is..a start space." 
                                                    : 
                                                        " does nothing."
                                                )
                                            )
                                        )} value={space.spaceDesc} onChange={(e) => updateSpaceDesc(space.id, e)} className="form-control text-dark p-2" required placeholder="Give a custom description for your space that will be displayed on the game page :D" rows={2} />   
                                    </div>
                                    {space.spaceValue && (
                                        <button
                                            type="button"
                                            id={`desc-btn-${space.id}`}
                                            onClick={(e) => {
                                                const updatedSpaces = spaces.map(space2 => {
                                                    if (space2.id === space.id) {
                                                        return {
                                                            ...space2,
                                                            spaceDesc: e.target.innerHTML.replace('Set description to ', '').replace('"', '').replace('"', '')
                                                        };
                                                    }
                                                    return space2;
                                                });
                                                setSpaces(updatedSpaces);
                                            }}
                                            className="col-12 btn btn-success"
                                        >
                                            Set description to {
                                                `"The ${space.spaceName} space` + (
                                                    space.spaceValue && (
                                                        (space.spaceType == "Currency") ?
                                                            (parseInt(space.spaceValue[1]) > 0) ? 
                                                                ` adds ${space.spaceValue[1]} ${space.spaceValue[0]} to the player who lands on it."`
                                                            : 
                                                                ` removes ${Math.abs(space.spaceValue[1])} ${space.spaceValue[0]} from the player who lands on it."`
                                                        : (space.spaceType == "Movement") ? 
                                                            (isNaN(parseInt(space.spaceValue))) ? ` moves the player to the ${space.spaceValue} space."` : ` moves the player ${space.spaceValue} spaces."`
                                                        : (space.spaceType == "Turn") ? 
                                                           ' skips the turn of the player who lands on it."'
                                                        : (space.spaceType == "Start") ? 
                                                            ' is..a start space."'
                                                        : 
                                                            ' does nothing."'
                                                    )
                                                )
                                            }
                                        </button>
                                    )}
                                </>
                            }
                        </div>
                    ))}

                    <h1>Create your own layout!</h1>
                    <table className="table table-striped border">
                        <tbody className="border">
                            {layout.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        spaces[spaceIds.indexOf(cell)] ? 
                                            <td style={spaces[spaceIds.indexOf(cell)].spaceColor ? { backgroundColor: spaces[spaceIds.indexOf(cell)].spaceColor } : { backgroundImage: "url(" + spaces[spaceIds.indexOf(cell)].spaceImage + ")"}} key={cellIndex} className="border" onClick={() => updateLayout(rowIndex, cellIndex)}>
                                                {spaces[spaceIds.indexOf(cell)].spaceName}
                                            </td>
                                        : 
                                            <td key={cellIndex} className="border" onClick={() => updateLayout(rowIndex, cellIndex)}>

                                            </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="form-check">
                        <input className="form-check-input" name="publicity" type="checkbox" value="" id="publicity" onChange={() => setPublicity(!publicity)} />
                        <label className="form-check-label" htmlFor="publicity">
                         Publicity
                        </label>
                    </div>
                    <input type="submit" className="p-2 col-12 my-4 btn btn-success" value="Submit" />
                </div>
            </form>
        </div>
    )
}

export default CreatePage;