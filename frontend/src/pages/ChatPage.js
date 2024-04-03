import React, { useState, useEffect } from 'react';

const ChatPage = () => {
    const chatSocket = new WebSocket("ws://" + window.location.host + "/");
    chatSocket.onopen = function (e) {
      console.log("The connection was setup successfully !");
    };
    chatSocket.onclose = function (e) {
      console.log("Something unexpected happened !");
    };
};

export default ChatPage;