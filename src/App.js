import "./App.css";
import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import Login from './Login'
import Maze from './Maze'
import { useState, useEffect } from 'react';
import { app } from './firebase'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
function App() {
  console.log(app)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const handleAction = () => {
    const authentication = getAuth();
    signInWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          navigate('/maze')
          sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
        })
  }

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token')

    if (authToken) {
      navigate('/maze')
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
