import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Particle from "./Particle";

import { app } from "./firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./login.css";

export default function BasicTextFields() {
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
                var errordiv = document.getElementById("errortext");
                if (errorCode === "auth/wrong-password") {
                    errordiv.innerHTML = "Wrong password";
                } else {
                    errordiv.innerHTML =
                        "Invalid Email or Password. Please Try Again";
                }
            });
    };
    useEffect(() => {
        const flickerLetter = (letter) =>
            `<span style="animation: text-flicker-in-glow ${
                Math.random() * 4
            }s linear both ">${letter}</span>`;
        const colorLetter = (letter) =>
            `<span class="neontext" id="neontext" style="color: hsla(${
                Math.random() * 360
            }, 100%, 80%, 1);">${letter}</span>`;
        const flickerAndColorText = (text) =>
            text.split("").map(flickerLetter).map(colorLetter).join("");
        const neonGlory = (target) =>
            (target.innerHTML = flickerAndColorText(target.textContent));
        const target1 = window.document.getElementsByClassName("neonhead")[0];
        neonGlory(target1);
        const target2 = window.document.getElementsByClassName("neonhead")[1];
        neonGlory(target2);
        const target3 = window.document.getElementsByClassName("neonhead")[2];
        neonGlory(target3);
    }, []);
    return (
        <div>
            <div className="heading-container">
                <h1 className="neonhead">THE</h1>
                <h1 className="neonhead">LABYRINTH</h1>
                <h1 className="neonhead">BREAKER</h1>
            </div>
            <div className="login-form">
                <div id="textfield">
                    <TextField
                        id="email"
                        label="Enter the Email"
                        variant="outlined"
                        onChange={(e) => setEmail(e.target.value)}
                        InputLabelProps={{ className: "textfield__label" }}
                        fullWidth
                    />
                </div>
                <div id="textfield">
                    <TextField
                        type="password"
                        id="password full-width-text-field"
                        label="Enter the Password"
                        variant="outlined"
                        onChange={(e) => setPassword(e.target.value)}
                        InputLabelProps={{ className: "textfield__label" }}
                        fullWidth
                    />
                </div>
                <button class="btn" onClick={handleAction}>
                    LOG IN
                </button>
                <div id="errortext"></div>
            </div>
        </div>
    );
}
