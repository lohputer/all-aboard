import React, {useState, useContext, useEffect } from "react"
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext'

const Room = () => {
    let { roomCode } = useParams();
    const chatSocket = new WebSocket("ws://127.0.0.1:8000/ws/chat/" + roomCode + "/");
    console.log(chatSocket)
    useEffect(()=>{
        chatSocket.onopen = function (e) {
            console.log("The connection was setup successfully !");
        };
        chatSocket.onclose = function (e) {
            console.log("Something unexpected happened !");
        };
    });
    return (
        <div className="vw-100 justify-content-center align-items-center row d-flex">
            <h1>Welcome to your room {roomCode}!</h1>
        </div>
    )
}

export default Room;