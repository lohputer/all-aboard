import React, { useState, useEffect, useContext } from 'react'
import { Link } from "react-router-dom";
import AuthContext from '../context/AuthContext';

const HomePage = () => {
    const { boardGames } = useContext(AuthContext);
    return (
        <div class="vw-100 row d-flex justify-content-center my-3">
            {boardGames.map(game => (
                <div className="col text-center board m-2 p-2 col-lg-3 col-md-3 col-sm-5 col-5">
                    <Link className="text-light text-decoration-none" to={{
                        pathname: `/game/${game.id}`,
                        state: { boardGame: game }
                    }}>
                        <h1>{ game.title }</h1>
                        <p>{ game.desc.length > 50 ? game.desc.slice(0, 50) + "..." : game.desc }</p>
                        <p>Made by { game.creator }</p>
                    </Link>
                </div> 
            ))}
        </div>
    );
}

export default HomePage