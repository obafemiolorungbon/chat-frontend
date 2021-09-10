import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Welcome } from "./Welcome";
import "./App.css";
import { ChatApp } from "./ChatApp";
function App() {
  useEffect(() => {
    // simulate user loggin in to the app and give assign them a token
    const url = "http://localhost:3000/auth";
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(async (data) => {
        // save the received info into the database
        localStorage.setItem("user", data.data.user.user);
        localStorage.setItem("fullName", data.data.user.userName);
        localStorage.setItem("token", data.data.token);
      });
  }, []);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/chat" component={ChatApp}></Route>
          <Route path="/" component={Welcome}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
