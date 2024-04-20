import React, { useState, useEffect, useCallback } from 'react';

const ChatRoom = () => {
    var roomName = Math.floor(Math.random()*100000)
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
    ws.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    ws.onmessage = function (e) {
        let data = JSON.parse(e.data);
        console.log(data, data.text, data.sender);
    }
    ws.onclose = () => {
        console.log("Nevermind it closed")
    }
    return (
        <div className="vw-100 justify-content-center align-items-center row d-flex">
            <form className="row d-flex mt-4 m-2 col-10 col-sm-10 col-md-8 col-lg-6">
                {ws.readyState}
                {(ws.readyState === WebSocket.OPEN) ? 
                <div className="form-group">
                    <h1>{ws.readyState}</h1>
                    <div>
                        <label htmlFor="id_text">message</label>
                        <input type="text" name="text" maxlength="320" className="form-control text-primary rounded shadow border border-primary p-2 my-2 my-2" required id="id_text" />  
                    </div>
                    <input type="submit" className="p-2 col-12 my-4 btn btn-success" value="Submit" />
                </div> : <h1>Nuh uh</h1>}
            </form>
        </div>
    );
}; 

export default ChatRoom;
