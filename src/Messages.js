import React, { useEffect, useState } from "react";
import Centrifuge from "centrifuge";
import { config } from "./cent.config";
export const Messages = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [joined, setJoined] = useState("");
  useEffect(() => {
    // get the token from when the user was auth, ideally should be whatever auth was provided from
    // zccore
    const token = localStorage.getItem("token");
    const url = "http://localhost:3000/centrifuge/refresh"; // route to get token from backend plugin/backend application
    //to include in connection config for centrifugo
    fetch(url, {
      method: "GET",
      headers: {
        authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        //new instance of centrifugo
        const centrifuge = new Centrifuge(config.clientUrl, {
          // when the users token expires, this onRefresh hook kicks in to renew/refresh their token
          onRefresh: (ctx, cb) => {
            let promise = fetch("http://localhost:3000/centrifuge/refresh", {
              method: "POST",
              headers: {
                authorization: token,
              },
            }).then(function (resp) {
              resp.json().then(function (data) {
                // Data must be like {"status": 200, "data": {"token": "JWT"}} - see
                // type definitions in dist folder. Note that setting status to 200 is
                // required at moment. Any other status will result in refresh process
                // failure so client will eventually be disconnected by server.
                cb(data);
              });
            });
          },
        });
        // set token generated from backend
        centrifuge.setToken(data.token);
        // connect to the centrifugo
        centrifuge.connect();
        centrifuge.on("connect", (ctx) => {
          console.log(ctx);
          // here ctx contains
          // {
          //  client – client ID Centrifugo gave to this connection (string)
          // transport – name of transport used to establish connection with server (string)
          // latency – latency in milliseconds (int). This measures time passed between sending connect client protocol command and receiving connect response.
          //
          // }
        });
        centrifuge.on("disconnect", (ctx) => {
          // do something when user disconnects
          // this contains
          // {
          //     reason: "connection closed",
          //     reconnect: true
          // }
          // reason – the reason of client's disconnect (string)
          // reconnect – flag indicating if client will reconnect or not (boolean)
        });

        centrifuge.on("publish", (ctx) => {
          //console.log(ctx.data);
        });
        centrifuge
          .subscribe("myChat", (ctx) => {
            // subscribe to a channel and listen to events on that channel
            // ctx here refers to data published to that server from plugin backend
            setMessage(ctx.data.message);
            setUser(ctx.data.user);
          })
          .on("join", (ctx) => {
            const user = ctx.info.conn_info;
            setJoined(user);
          });
        // ideally, this should get the number of subscribers
        centrifuge.presence("myChat", (ctx) => {
          console.log(ctx);
        });
        // this should retrieve previous streams of publication
        centrifuge.history("myChat", { limit: 10 }, (ctx) => {
          console.log(ctx);
        });
      });
  }, []);

  return (
    <>
      <div className="wrapper">
        <p className="joinedEvent">{joined} Joined this conversation</p>

        <div className="profileBox">
          <div className="profilePic"></div>
          <div className="nameAndMessage">
            <div className="nameBox">
              <p className="Name">{user}</p>
            </div>
            <div>
              <p>{message}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
