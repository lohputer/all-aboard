import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { useParams } from 'react-router-dom';
import '../App.css'

const GamePage = () => {
    let { gameId } = useParams();
    console.log(gameId);
    const { boardGames, currencies, spaces } = useContext(AuthContext);
    console.log(boardGames, currencies, spaces);
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
                    {currencies.map(curr => curr.currencyBoardID == gameId && (
                        <div className="align-items-center d-flex game-curr">
                            <span className="m-2">{curr.currencyType}</span>
                            {curr.currencyImage &&
                                <img 
                                    src={`http://127.0.0.1:8000${curr.currencyImage}`}  
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
                        {spaces.map(space => space.spaceName != "." && (
                            <tr>
                                <td>{space.spaceName}</td>
                                <td>{space.spaceDesc}</td>
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