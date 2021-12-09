import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate} from "react-router-dom";

import { app } from './firebase'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

import Login from './Login'
import Maze from './Maze'
import "./App.css";

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  
  const handleAction = () => {
    const authentication = getAuth();
    signInWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          console.log(authentication.currentUser.uid)
          var uid = authentication.currentUser.uid
          sessionStorage.setItem('UID', uid)
          sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
          navigate('/maze')
        })
  }

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token')
    if (authToken) {
      navigate('/maze')
      console.log(sessionStorage.getItem('UID'))
    }
  }, [navigate])

  return (
      <div className="App">
      <>
          <Routes>
            <Route path='/' element={<Login setEmail={setEmail} setPassword={setPassword} handleAction={() => handleAction()}/>} />
            <Route path='/maze' element ={<Maze />} />
          </Routes>
        </>
      </div>
  );
}
export default App;
