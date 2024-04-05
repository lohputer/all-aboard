import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'

const RoomJoinPage = () => {
    const { user } = useContext(AuthContext);   
    const joinRoom = () => {
        var roomName = document.querySelector('#room-name-input').value;
        window.location.pathname = '/room/' + roomName + '/';
    }
    return (
        <div class="vw-100 row d-flex justify-content-center my-3">
            <form className="row align-items-center justify-content-center d-flex mt-4 m-2 col-10 col-sm-10 col-md-8 col-lg-6" onSubmit={joinRoom}>
                <h1 className="text-center mb-4">Would you like to join or create a room?</h1>
                <input className="form-control text-primary text-center" id="room-name-input" type="text" size="100" placeholder="Enter your own username to create your own room." /><br />
                <input className="p-2 col-6 my-4 btn btn-success" id="room-name-submit" type="button" value="Enter" />
            </form> 
        </div>
    );
}
export default RoomJoinPage