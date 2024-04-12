import React, { useState, useEffect, useCallback } from 'react';

const ChatRoom = () => {
    const [ws, setWs] = useState(null);
    const [readyState, setReadyState] = useState(WebSocket.CLOSED);
    useEffect(() => {
        const socket = new WebSocket("ws://" + window.location.host + '/ws/chat/');
        setReadyState(WebSocket.CONNECTING);
        socket.onopen = () => setReadyState(WebSocket.OPEN);
        socket.onclose = () => setReadyState(WebSocket.CLOSED);
        setWs(socket);
    }, []);
    useEffect(() => {
        console.log(`readyState: ${readyState}`);
    }, [readyState]);
    const onRender = useCallback(() => {
        if (ws === null) {
            return;
        }
        ws.onmessage = () => console.log('received a message!');
    }, [ws]);
    function sendMessage(e) {
        e.preventDefault();
        ws.onopen = () => ws.send(JSON.stringify({
            'message': e.target.value
        }))
    }
    return (
        <div className="vw-100 justify-content-center align-items-center row d-flex">
            <form className="row d-flex mt-4 m-2 col-10 col-sm-10 col-md-8 col-lg-6" onSubmit={sendMessage}>
                {(readyState === WebSocket.OPEN) ? 
                <div onRender={onRender} className="form-group">
                    <h1>{readyState}</h1>
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
/*
socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const message = data['message'];
    console.log(message, data)
}
socket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');   
}
 */
export default ChatRoom;
