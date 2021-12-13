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

async function getUserData(db, user) {
    const docRef = doc(db, "users", user);

    getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
        } else {
            var v = Array(27)
                .fill(0)
                .map((row) => new Array(27).fill(false));
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    v[i][j] = true;
                }
            }

            var flattened = v.reduce(function (a, b) {
                return a.concat(b);
            });
            var sol = Array(115).fill(false);
            for (let i = 50; i < 115; i++) sol[i] = true;
            var d = new Date(0);
            setUserData(docRef, {
                visiblity: flattened,
                hero: [1, 0],
                solved: sol,
                penalty: 0,
                click: true,
                finished: false,
                finishedTime: 0,
                key1: false,
                key2: false,
            });
        }
    });
}

async function setUserData() {
    // DB new User create
    const response = await axios.post("localhost:5000/create-user", {
        uid: sessionStorage.getItem("UID"),
    });
    console.log(response);
}

async function updateUserData(docRef, data) {
    // DB user update
    await updateDoc(docRef, data);
}

function setData(data) {
    const db = getFirestore();
    const user = sessionStorage.getItem("UID");
    const docRef = doc(db, "users", user);
    updateUserData(docRef, data);
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

    useEffect(() => {
        var body = document.getElementsByTagName("body");
        body.id = "mazebody";
        const data = onSnapshot(doc(db, "users", user), (doc) => {
            var dat = doc.data();
            if (dat === undefined) {
                getUserData(db, user);
            } else {
                var v = dat.visiblity;
                var state_arr = [];
                while (v.length) state_arr.push(v.splice(0, 27));

                setVis(state_arr);
                setHero(dat.hero);
                setLoading(false);
                setClick(dat.click);
                setFinished(dat.finished);
                setKey1(dat.key1);
                setKey2(dat.key2);
                setPenalty(dat.penalty);
            }
        });
        return () => data();
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
                        ></UpButton>
                        <DownButton
                            hero={hero}
                            vis={visiblity}
                            click={click}
                            key1={key1}
                            key2={key2}
                            setClick={setClick}
                            setData={setData}
                        ></DownButton>
                        <LeftButton
                            hero={hero}
                            vis={visiblity}
                            click={click}
                            key1={key1}
                            key2={key2}
                            setClick={setClick}
                            setData={setData}
                        ></LeftButton>
                        <RightButton
                            hero={hero}
                            vis={visiblity}
                            click={click}
                            key1={key1}
                            key2={key2}
                            setClick={setClick}
                            setData={setData}
                        ></RightButton>
                    </div>
                </div>
            </div>
        );
    }
}

export default Maze;
