import React, {useState, useContext, useEffect } from "react"
import AuthContext from '../context/AuthContext'

const GenerateRoom = () => {
    const { boardGames, user } = useContext(AuthContext);
    const [ currCode, setCode ] = useState(user.username + "-")
    const GenerateCode = (e) => {
        e.preventDefault();
        var code = user.username + "-";
        const characters = "0123456789ABCDEFGHIJKLMNOPQSTUVWXYZ";
        for (let i=0; i<5; i++) {
            code += characters[Math.floor(Math.random()*characters.length)];
        }
        setCode(x => x = code);
    }
    const createRoom = (e) => {
        e.preventDefault();
        if (currCode) {
            window.location = "/room/" + currCode;
        } else {
            alert("HOLD ON YOU NEED TO MAKE A CODE");
        }
    }
    return (
        <div className="vw-100 justify-content-center align-items-center row d-flex">
            <form id="form" className="row d-flex mt-4 m-2 col-10 col-sm-10 col-md-8 col-lg-6">
                <div className="form-group p-2">
                    <h2 class="text-dark">Creating your own room..</h2>
                    <div className="input-group">
                        <input
                            type="text"
                            id="code"
                            className="form-control text-primary"
                            placeholder="Add custom room code"
                            value={currCode}
                            onChange={() => setCode(document.getElementById("code").value)}
                        />
                        <button onClick={GenerateCode}>Random</button>
                    </div>
                    <div className="input-group mt-2">
                        <select className="form-select">
                            <option value="" >Choose a game :D</option>
                            {boardGames.map(game => (
                                <option value={game.title}>{game.title}</option>
                            ))}
                        </select>
                    </div>
                    <button class="mt-2 btn btn-success" onClick={createRoom}>Create Room :D</button>
                </div>
                <div className="form-group p-2">
                    <h2 class="text-dark">OR join someone else's!</h2>
                    <input
                        type="text"
                        id="code"
                        className="form-control text-primary"
                        placeholder="Add custom room code"
                        value={currCode}
                        onChange={() => setCode(document.getElementById("code").value)}
                    />
                    <button class="mt-2 btn btn-success" onClick={createRoom}>Join the Room :D</button>
                </div>
            </form>
        </div>
    )
}

export default GenerateRoom;