import React from "react";
import "./index.css";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./views/homepage/homePage";
import Login from "./views/loginpage/loginPage";
import Register from "./views/registerpage/registerPage";
import ProtectedPage from "./views/protectedpage/ProtectedPage";
import EditMarker from "./views/editmarkerpage/editMarkerPage";
import EditEvent from "./views/editeventpage/EditEventPage";
import AlertPage from "./views/alertpage/AlertPage";
import aboutPage from "./views/aboutpage/aboutPage";

function App() {
  return (
    <Router>
        <AuthProvider>
          <Navbar />
          <Switch>
            <PrivateRoute component={ProtectedPage} path="/protected"/>
            <PrivateRoute component={EditMarker} path="/marker/:id" />
            <PrivateRoute component={EditEvent} path="/event/:id" />
            <PrivateRoute component={AlertPage} path = "/alert" />
            <Route component={Login} path="/login" />
            <Route component={Register} path="/register" />
            <Route component={Home} path="/" exact/>
            <Route component={aboutPage} path="/about" exact/>
          </Switch>
        </AuthProvider>
    </Router>
  );
}

export default App;
