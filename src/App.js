import React from "react";
import "./index.css";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./views/homepage/homePage";
import Login from "./views/loginpage/loginPage";
import Register from "./views/registerpage/registerPage";
import ProtectedPage from "./views/protectedpage/ProtectedPage";
import EditMarker from "./views/editmarkerpage/editMarkerPage";

function App() {
  return (
    <Router>
        <AuthProvider>
          <Navbar />
          <Switch>
            <PrivateRoute component={ProtectedPage} path="/protected" exact />
            <PrivateRoute component={EditMarker} path="/marker/:id" />
            <Route component={Login} path="/login" />
            <Route component={Register} path="/register" />
            <Route component={Home} path="/" />
          </Switch>
        </AuthProvider>
        <Footer />
    </Router>
  );
}

export default App;
