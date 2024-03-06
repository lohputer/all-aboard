import React, {useState, useContext} from 'react'
import AuthContext from '../context/AuthContext'

const CreatePage = () => {
    const { user } = useContext(AuthContext);
    const [currencies, setCurrencies] = useState([{ id: 1, currencyType: '', currencyImage: null }]);
    const [spaces, setSpaces] = useState([{ id: 1, spaceName: 'Start', spaceColor: null, spaceType: "", spaceValue: '' }, { id: 2, spaceName: 'Finish', spaceColor: null, spaceType: "", spaceValue: '' }]);
    const [publicity, setPublicity] = useState(false);
    const [dimensions, setDimensions] = useState([1, 1]);
    const [layout, setLayout] = useState([[]]);
    let createCustom = async (e) => {
        e.preventDefault();
        console.log({ user: user , title : e.target.title.value, desc : e.target.desc.value, rules : e.target.rules.value, publicity : publicity, currencies : currencies, spaces : spaces })
        const response = await fetch('http://127.0.0.1:8000/api/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: user , title : e.target.title.value, desc : e.target.desc.value, rules : e.target.rules.value, publicity : publicity, currencies : currencies, spaces : spaces })
        });
        let data = await response.json();
        console.log(data);
        if (data['message'] === 'Board game created successfully.') {
            window.location = "/";
        } else {
            alert('oh dang something went wrong');
        }
    }
    const addCurrency = () => {
        const newId = currencies[currencies.length - 1].id + 1;
        setCurrencies([...currencies, { id: newId, currencyType: '', currencyImage: null }]);
    };
    const removeCurrency = (id) => {
        if (currencies.length > 1) {
            setCurrencies(currencies.filter(currency => currency.id !== id));
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
        const { value } = event.target;
        const updatedCurrencies = currencies.map(currency => {
            if (currency.id === id) {
                return {
                    ...currency,
                    currencyImage: value
                };
            }
            return currency;
        });
        setCurrencies(updatedCurrencies);
    };
    const addSpace = () => {
        const newId = spaces[spaces.length - 1].id + 1;
        setSpaces([...spaces, { id: newId, spaceColor: null, spaceType: null, spaceValue: null }]);
    };
    const removeSpace = (id) => {
        if (spaces.length > 1) {
            setSpaces(spaces.filter(space => space.id !== id));
        }
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
    const updateSpaceType = (id, event) => {
        const { value } = event.target;
        const updatedSpaces = spaces.map(space => {
            if (space.id === id) {
                if (["Add", "Remove"].includes(value)) {
                    return {
                        ...space,
                        spaceType: "Currency",
                        spaceValue: ["", 0]
                    }
                } else if (["Movement", "MoveTo"].includes(value)) {
                    if (value == "Movement") {
                        return {
                            ...space,
                            spaceType: "Movement",
                            spaceValue: 0
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
                } else {
                    return {
                        ...space,
                        spaceType: "",
                        spaceValue: ''
                    }
                }
            }
            return space;
        });
        setSpaces(updatedSpaces);
    }
    const updateSpaceValue = (id, event) => {
        console.log(event.target.value, typeof event.target.value)
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
        console.log(spaces);
    }
    return (
        <div className="vw-100 justify-content-center align-items-center row d-flex">
            <form className="row d-flex mt-4 m-2 col-10 col-sm-10 col-md-8 col-lg-6" onSubmit={createCustom}>
                <h1>Create your own game! :D</h1>
                <div className="form-group">
                    <div>
                        <label htmlFor="game_title">Title of Game:</label>
                        <input type="text" name="title" maxLength="100" className="form-control text-primary rounded shadow border border-primary p-2 my-2 my-2" required id="game_title" />  
                    </div>
                    <div>
                        <label htmlFor="game_desc">Description:</label>
                        <textarea name="desc" className="form-control text-primary rounded shadow border border-primary p-2 my-2 my-2" required id="game_desc" rows={5} />   
                    </div>
                    <div>
                        <label htmlFor="game_rules">Rules:</label>
                        <textarea name="rules" className="form-control text-primary rounded shadow border border-primary p-2 my-2 my-2" required id="game_rules" placeholder="Type your rules in point form like:&#10;- example rule 1&#10;- example rule 2" rows={5} />   
                    </div>
                    <h2>Currencies </h2>
                    {currencies.map(currency => (
                        <div className="input-group mb-3 border border-primary rounded">
                            <input
                                type="text"
                                className="form-control text-primary"
                                placeholder="Currency Name"
                                aria-label="Currency Name"
                                name={`currency-name-${currency.id}`}
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
                                type="button"
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
                    ))}
                    <h2>Spaces</h2>
                    {spaces.map(space => (
                        <div className="form-group border border-primary rounded mb-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control text-primary"
                                    placeholder="Space Name"
                                    aria-label="Space Name"
                                    name={`space-name-${space.id}`}
                                    defaultValue={space.spaceName}
                                     onChange={(e)=>updateSpaceName(space.id, e)}
                                />
                                <select defaultValue={
                                    !space.spaceValue && (
                                        (space.spaceType == "Currency") ?
                                            (parseInt(space.spaceValue[1]) >= 0) ? 
                                                "Add"
                                            : 
                                                "Remove"
                                        : (space.spaceType == "Movement") ? 
                                            (isNaN(parseInt(space.spaceValue))) ? "MoveTo" : "Movement"
                                        : (space.spaceType == "Turn") ? 
                                            "Turn"
                                        : "Nothing"
                                    )
                                } className="form-select" aria-label="Default select example" onChange={(e)=>updateSpaceType(space.id, e)}>
                                    <option value="Nothing" >Nothing</option>
                                    <option value="Add">Add (amt) to (currency)</option>
                                    <option value="Remove">Remove (amt) from (currency)</option>
                                    <option value="Movement">Move (amt) spaces</option>
                                    <option value="MoveTo">Move to (space)</option>
                                    <option value="Turn">Skip Turn</option>
                                </select>
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={addSpace}
                                    disabled={space.id !== spaces[spaces.length - 1].id}
                                >
                                    +
                                </button>
                                <button
                                    className="btn btn-danger"
                                    type="button"
                                    onClick={() => removeSpace(space.id)}
                                >
                                    -
                                </button>
                            </div>
                            {space.spaceType === "Currency" ?
                                <div className="input-group">
                                    <select className="form-select" onChange={(e) => updateSpaceValue(space.id, e)}>
                                        <option value="" >Please choose a currency.</option>
                                        {currencies.map(currency => currency.currencyType != '' && (
                                            <option value={currency.currencyType}>{currency.currencyType}</option>
                                        ))}
                                    </select>
                                    {space.spaceValue[0] != "" && 
                                        <input
                                            type="number"
                                            className="form-control text-primary"
                                            placeholder={`How much ${space.spaceValue[0]} will they get? (negative for remove)`}
                                            aria-label="Space Value"
                                            name={`space-value-${space.id}`}
                                            onChange={(e)=>updateSpaceValue(space.id, e)}
                                        />
                                    }
                                </div>
                            : ( space.spaceType === "Movement" ? 
                                <div className="input-group">
                                    { typeof space.spaceValue !== 'string' ? 
                                        <input
                                            type="number"
                                            placeholder="How many spaces will they move?"
                                            className="form-control text-primary"
                                            aria-label="Space Value"
                                            name={`space-value-${space.id}`}
                                            onChange={(e)=>updateSpaceValue(space.id, e)}
                                        />
                                    : 
                                        <select className="form-select" onChange={(e) => updateSpaceValue(space.id, e)}>
                                            <option value="" >Please choose a space.</option>
                                            {spaces.map(space2 => space2.spaceName != space.spaceName && (
                                                <option key={space2.id} value={space2.spaceName}>{space2.spaceName}</option>
                                            ))}
                                        </select>
                                    }
                                </div>
                            : 
                                <div className="input-group">
                                </div>
                            )}
                        </div>
                    ))}

                    <h1>Create your own layout!</h1>
                    <input
                        type="number"
                        min={1}
                        className="form-control text-primary"
                        placeholder="Rows"
                        aria-label="Rows"
                        onChange={(e)=>setDimensions(dims => {
                            if (e.target.value) {
                                dims[0] = e.target.value;
                            }
                        })}
                    />
                    <input
                        type="number"
                        min={1}
                        className="form-control text-primary"
                        placeholder="Columns"
                        aria-label="Columns"
                        onChange={(e)=>setDimensions(dims => {
                            if (e.target.value) {
                                dims[1] = e.target.value;
                            }
                        })}
                    />
                    <table>
                        <tbody>
                            <tr>
                                <td><p>test..</p></td>
                            </tr>
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