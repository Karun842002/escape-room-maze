import React, { useEffect, useState } from "react";

import { app } from "./firebase";
import { getFirestore, updateDoc } from "firebase/firestore";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

import UpButton from "./Up";
import DownButton from "./Down";
import LeftButton from "./Left";
import RightButton from "./Right";
import Loader from "react-js-loader";
import Login from "./Login";
import Winner from "./Winner";
import { maze } from "./walls";
import axios from "axios";

import "./maze.css";
import Particle from "./Particle";

async function getUserData() {
    axios
        .post(
            "http://localhost:5000/create-user",
            JSON.stringify({
                uid: sessionStorage.getItem("UID"),
            })
        )
        .then((response) => {
            window.location.reload();
        });
}

function setData(data, setSt) {
    axios.post("http://localhost:5000/update-user", JSON.stringify(data), {
        headers: {
            "Content-Type": "text/plain",
        },
    });
    var v = data.VISIBILITY;
    var state_arr = [];
    while (v.length) state_arr.push(v.splice(0, 27));

    setSt.setVis(state_arr);
    setSt.setHero(data.HERO);
    setSt.setLoading(false);
    setSt.setClick(data.CLICK);
    setSt.setFinished(data.FINISHED);
    setSt.setKey1(data.KEY1);
    setSt.setKey2(data.KEY2);
    setSt.setPenalty(data.PENALTY);
}

function Maze() {
    const db = getFirestore();
    const user = sessionStorage.getItem("UID");
    const [visiblity, setVis] = useState([]);
    const [hero, setHero] = useState([]);
    const [loading, setLoading] = useState(true);
    const [click, setClick] = useState(true);
    const [finished, setFinished] = useState(false);
    const [key1, setKey1] = useState(false);
    const [key2, setKey2] = useState(false);
    const [penalty, setPenalty] = useState(0);
    const st = {
        setVis: setVis,
        setHero: setHero,
        setLoading: setLoading,
        setClick: setClick,
        setFinished: setFinished,
        setKey1: setKey1,
        setKey2: setKey2,
        setPenalty: setPenalty,
    };

    useEffect(() => {
        var body = document.getElementsByTagName("body");
        body.id = "mazebody";
        console.log(sessionStorage.getItem("UID"));
        axios
            .post(
                "http://localhost:5000/get-user",
                JSON.stringify({ uid: sessionStorage.getItem("UID") }),
                {
                    headers: {
                        "Content-Type": "text/plain",
                    },
                }
            )
            .then((response) => {
                if (response.status === 201) {
                    getUserData();
                } else {
                    axios
                        .post(
                            "http://localhost:5000/get-user-data",
                            JSON.stringify({
                                uid: sessionStorage.getItem("UID"),
                            }),
                            {
                                headers: {
                                    "Content-Type": "text/plain",
                                },
                            }
                        )
                        .then((response) => {
                            var data = JSON.parse(response.data);
                            var v = data.VISIBILITY;
                            var state_arr = [];
                            while (v.length) state_arr.push(v.splice(0, 27));

                            setVis(state_arr);
                            setHero(data.HERO);
                            setLoading(false);
                            setClick(data.CLICK);
                            setFinished(data.FINISHED);
                            setKey1(data.KEY1);
                            setKey2(data.KEY2);
                            setPenalty(data.PENALTY);
                        });
                }
            });
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", function (e) {
            var ele;
            if (e.key === "ArrowUp") {
                ele = document.getElementsByClassName("up")[0];
                ele.click();
            }
            if (e.key === "ArrowDown") {
                ele = document.getElementsByClassName("down")[0];
                ele.click();
            }
            if (e.key === "ArrowLeft") {
                ele = document.getElementsByClassName("left")[0];
                ele.click();
            }
            if (e.key === "ArrowRight") {
                ele = document.getElementsByClassName("right")[0];
                ele.click();
            }
        });
    }, []);

    if (loading) {
        return (
            <div>
                <Particle />
                <div id="center">
                    <Loader
                        type="spinner-cub"
                        bgColor={"#FFFFFF"}
                        color={"#FFFFFF"}
                        size={100}
                    />
                </div>
                <Login />
            </div>
        );
    } else if (finished) {
        return (
            <div>
                <Winner />
            </div>
        );
    } else {
        return (
            <div id="container">
                <div id="content-container">
                    <div id="penalty">Penalty:{penalty}</div>
                    <div id="key-count">
                        Keys Collected:{(key1 ? 1 : 0) + (key2 ? 1 : 0)}/2
                    </div>
                    <div class="stars"></div>
                    <div class="twinkling"></div>
                    <div class="clouds"></div>
                    <div id="maze_container" key="maze_container">
                        <div id="maze" key="maze">
                            {maze.map(function (row, i) {
                                return (
                                    <div key={String(i)}>
                                        {row.map(function (col, j) {
                                            if (visiblity[i][j] === false) {
                                                if (maze[i][j].key === true) {
                                                    return (
                                                        <div
                                                            className="invisible key"
                                                            key={
                                                                String(i) +
                                                                "-" +
                                                                String(j)
                                                            }
                                                        ></div>
                                                    );
                                                } else if (i == 25 && j == 26) {
                                                    return (
                                                        <div
                                                            className="invisible goal"
                                                            key={
                                                                String(i) +
                                                                "-" +
                                                                String(j)
                                                            }
                                                        ></div>
                                                    );
                                                } else {
                                                    return (
                                                        <div
                                                            className="invisible"
                                                            key={
                                                                String(i) +
                                                                "-" +
                                                                String(j)
                                                            }
                                                        ></div>
                                                    );
                                                }
                                            } else if (
                                                i === hero[0] &&
                                                j === hero[1]
                                            )
                                                return (
                                                    <div
                                                        className="hero"
                                                        key={
                                                            String(i) +
                                                            "-" +
                                                            String(j)
                                                        }
                                                    ></div>
                                                );
                                            else if (maze[i][j].wall === true)
                                                return (
                                                    <div
                                                        className="wall"
                                                        key={
                                                            String(i) +
                                                            "-" +
                                                            String(j)
                                                        }
                                                    ></div>
                                                );
                                            else if (maze[i][j].key === true) {
                                                if (
                                                    i == 25 &&
                                                    j == 9 &&
                                                    key1 === false
                                                ) {
                                                    return (
                                                        <div
                                                            className="key"
                                                            key={
                                                                String(i) +
                                                                "-" +
                                                                String(j)
                                                            }
                                                        ></div>
                                                    );
                                                } else if (
                                                    i == 5 &&
                                                    j == 15 &&
                                                    key2 === false
                                                ) {
                                                    return (
                                                        <div
                                                            className="key"
                                                            key={
                                                                String(i) +
                                                                "-" +
                                                                String(j)
                                                            }
                                                        ></div>
                                                    );
                                                } else {
                                                    return <div></div>;
                                                }
                                            } else if (i == 25 && j == 26) {
                                                return (
                                                    <div
                                                        className="goal"
                                                        key={
                                                            String(i) +
                                                            "-" +
                                                            String(j)
                                                        }
                                                    ></div>
                                                );
                                            } else return <div></div>;
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="buttoncon" key="buttoncon">
                        <UpButton
                            hero={hero}
                            vis={visiblity}
                            click={click}
                            key1={key1}
                            key2={key2}
                            setClick={setClick}
                            setData={setData}
                            setSt={st}
                        ></UpButton>
                        <DownButton
                            hero={hero}
                            vis={visiblity}
                            click={click}
                            key1={key1}
                            key2={key2}
                            setClick={setClick}
                            setData={setData}
                            setSt={st}
                        ></DownButton>
                        <LeftButton
                            hero={hero}
                            vis={visiblity}
                            click={click}
                            key1={key1}
                            key2={key2}
                            setClick={setClick}
                            setData={setData}
                            setSt={st}
                        ></LeftButton>
                        <RightButton
                            hero={hero}
                            vis={visiblity}
                            click={click}
                            key1={key1}
                            key2={key2}
                            setClick={setClick}
                            setData={setData}
                            setSt={st}
                        ></RightButton>
                    </div>
                </div>
            </div>
        );
    }
}

export default Maze;
