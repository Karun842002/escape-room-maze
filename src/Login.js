import * as React from "react";
import TextField from "@mui/material/TextField";
import Particle from "./Particle";
import "./login.css";

export default function BasicTextFields({
  setPassword,
  setEmail,
  handleAction,
}) {
  return (
    <div>
      <Particle />
      <div class="login-form">
        <div class="stars anim"></div>
        <div class="twinkling anim"></div>
        <div class="clouds anim"></div>

        <div id="textfield">
          <TextField
            id="email"
            label="Enter the Email"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ className: "textfield__label" }}
          />
        </div>
        <div id="textfield">
          <TextField
            type="password"
            id="password"
            label="Enter the Password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ className: "textfield__label" }}
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
