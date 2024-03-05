import React, {useState, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Routes, Route, useParams } from 'react-router-dom';
import '../App.css'

const GamePage = () => {
    let { gameId } = useParams();
    console.log(gameId);
    const { boardGames, currencies, spaces } = useContext(AuthContext);
    console.log(boardGames);
    return (
        <>
        {boardGames.map(game => game.id == gameId && (
            <div class="text-light m-2 p-2">
                <h1>{ game.title }</h1>
                <p>Made by { game.creator }</p>
                <h2>Description</h2>
                <p>{ game.desc }</p>
                <h2>Rules</h2>
                <ul>
                    {game.rules.split("\n").map(rule => (
                        <li>{rule.split("-")[1]}</li>
                    ))}
                </ul>
                <h2>Currencies</h2>
                    {currencies.map(curr => (
                        <div className="align-items-center d-flex game-curr">
                            <span className="m-2">{curr.currencyType}</span>
                            {curr.currencyImage &&
                                <img 
                                    src={`../${curr.currencyImage.replace("frontend/public/", "")}`}  
                                    alt="Currency Icon" 
                                />
                            }
                        </div>
                    ))}
                <h2 className="mt-4">Spaces</h2>
                <table className="table table-dark table-striped w-75">
                    <thead>
                        <tr>
                            <th>Space Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {spaces.map(space => (
                            <tr>
                                <td>{space.spaceName}</td>
                                <td>{space.spaceType == "Currency" ? 
                                    (parseInt(space.spaceValue[1]) > 0 ? 
                                        `It gives the player ${space.spaceValue[1]} ${space.spaceValue[0]}.`
                                    : 
                                        `It removes ${Math.abs(parseInt(space.spaceValue[1]))} of the player's ${space.spaceValue[0]}.`
                                    )
                                : (space.spaceType == "Movement") ? 
                                    (isNaN(parseInt(space.spaceValue)) ? 
                                        `It moves the player to a ${space.spaceValue} space.`
                                    : 
                                        (parseInt(space.spaceValue) < 0 ? 
                                            `It moves the player back ${Math.abs(space.spaceValue)} spaces.`
                                        : 
                                            `It moves the player forward ${Math.abs(space.spaceValue)} spaces.`
                                        )
                                    )
                                : (space.spaceType == "Turn") ? 
                                     `It skips the player's turn.`
                                : "It does nothing."}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ))}
        </>
    );
}

export default GamePage;