import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { app } from "./firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import Login from "./Login";
import Maze from "./Maze";
import Error from "./Error";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAction = () => {
    const authentication = getAuth();
    signInWithEmailAndPassword(authentication, email, password)
      .then((response) => {
        var uid = authentication.currentUser.uid;
        sessionStorage.setItem("UID", uid);
        sessionStorage.setItem(
          "Auth Token",
          response._tokenResponse.refreshToken
        );
        navigate("/maze");
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errordiv = document.getElementById('errortext')
        if (errorCode === "auth/wrong-password") {
          errordiv.innerHTML = "Wrong password"
        } else {
          errordiv.innerHTML = "Invalid Email or Password. Please Try Again"
        }
        
      });
  };
  useEffect(() => {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      // true for mobile device
      navigate("/error404");
    }else{
      // false for not mobile device
      navigate("/");
    }
  }, []);

  useEffect(() => {
    let authToken = sessionStorage.getItem("Auth Token");
    if (authToken) {
      navigate("/maze");
      
    }
  }, [navigate]);

  return (
    <div className="App">
      <>
        <Routes>
          <Route
            path="/"
            element={
              <Login
                setEmail={setEmail}
                setPassword={setPassword}
                handleAction={() => handleAction()}
              />
            }
          />
          
          <Route path="/maze" element={<Maze />} />
          <Route path="/error404" element={<Error />} />
        </Routes>
      </>
    </div>
  );
}
export default App;
