import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Login from "./Login";
import Maze from "./Maze";
import Error from "./Error";
import "./App.css";
import Particle from "./Particle";

function App() {
    const navigate = useNavigate();
    useEffect(() => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {navigate("/error404");} else {navigate("/");}
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
                            <>
                                <Particle />
                                <Login />
                            </>
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
