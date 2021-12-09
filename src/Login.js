import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from './Button';
import Particle from "./Particle";
import Particle2 from './Particle2'
import './login.css'

export default function BasicTextFields({ setPassword, setEmail, handleAction }) {
    return (
        <div>
             <Particle/>
            <div class="login-form">
            <div class="stars anim"></div>
        <div class="twinkling anim"></div> 
       <div class="clouds anim"></div>
               
                <label>Email</label>
                <div id="textfield"><TextField placeholder="Email" id="email" label="Enter the Email" variant="outlined" onChange={(e) => setEmail(e.target.value)}/></div>
                <label>Password</label>
                <div id="textfield"><TextField placeholder="Password" id="password" label="Enter the Password" variant="outlined" onChange={(e) => setPassword(e.target.value)}/></div>
                <a href="#" class="btn" onClick={handleAction}>LOG IN</a>
            </div> 
        </div>
    );
}