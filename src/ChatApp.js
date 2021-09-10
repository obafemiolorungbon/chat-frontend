import { Messages } from "./Messages";
import React, { useState } from "react";

export const ChatApp = ({ token, loading }) => {
  // route where all post requests to be published are posted to. this route takes care
  // of all requests that will be sent to backend plugin/application backend
  const url = "http://localhost:3000/client"; // there's a nodejs server running on this port, so react app should run on 3001
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(""); //simulate typing, does not work yet
  const user = localStorage.getItem("user"); // get the username
  const uploadMessages = async (message) => {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, message: message }),
    }).then((_) => {
      // response from backend, you can use this to perform graceful shutting down of the client
      // console.log(await response.json());
    });
  };

  return (
    <div className="Wrapper_Div">
      <p className="Header">Welcome to Chat Room</p>
      <div className="MainView">
        <p className="isTyping">{typing}</p>
        <div className="messages">
          {/* The client subscriber outputs what centrifugo sends through this component */}
          <Messages />
        </div>

        <div className="messageBox">
          <input
            className="messageInput"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setTyping("Someone is typing...........");
            }}
          />
          <button
            value="text"
            onClick={(e) => {
              e.preventDefault();
              uploadMessages(message);
              setTyping("");
            }}
          >
            Submit Message
          </button>
        </div>
      </div>
    </div>
  );
};
