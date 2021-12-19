import React, { useEffect, useState } from "react";

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

async function getUserData() {
    axios
        .post(
            "/api/create-user",
            JSON.stringify({
                uid: sessionStorage.getItem("UID"),
            })
        )
        .then((response) => {
            window.location.reload();
        });
}

function setData(data, setSt) {
    setSt.setLoading(true);
    setSt.setClick(false);
    axios
        .post("/api/update-user", JSON.stringify(data), {
            headers: {
                "Content-Type": "text/plain",
            },
        })
        .then(() => {
            var v = data.VISIBILITY;
            var state_arr = [];
            while (v.length) state_arr.push(v.splice(0, 27));

            setSt.setVis(state_arr);
            setSt.setHero(data.HERO);
            setSt.setFinished(data.FINISHED);
            setSt.setKey1(data.KEY1);
            setSt.setKey2(data.KEY2);
            setSt.setPenalty(data.PENALTY);
            setSt.setFinishedTime(data.FINISHED_TIME);
            setSt.setSolved(data.SOLVED);
            setTimeout(() => {
                setSt.setLoading(false);
                setSt.setClick(true);
            }, 2000);
        });
}

function Maze() {
    const user = sessionStorage.getItem("UID");
    const [visiblity, setVis] = useState([]);
    const [solved, setSolved] = useState([]);
    const [hero, setHero] = useState([]);
    const [loading, setLoading] = useState(true);
    const [click, setClick] = useState(true);
    const [finished, setFinished] = useState(false);
    const [finished_time, setFinishedTime] = useState(0);
    const [key1, setKey1] = useState(false);
    const [key2, setKey2] = useState(false);
    const [penalty, setPenalty] = useState(0);
    const [firstBoot, setFirstBoot] = useState(true);

    const st = {
        setVis: setVis,
        setHero: setHero,
        setLoading: setLoading,
        setClick: setClick,
        setFinished: setFinished,
        setKey1: setKey1,
        setKey2: setKey2,
        setPenalty: setPenalty,
        setFinishedTime: setFinishedTime,
        setSolved: setSolved,
    };

    useEffect(() => {
        var body = document.getElementsByTagName("body");
        body.id = "mazebody";
        //console.log(sessionStorage.getItem("UID"));
        axios
            .post("/api/get-user", JSON.stringify({ uid: sessionStorage.getItem("UID") }), {
                headers: {
                    "Content-Type": "text/plain",
                },
            })
            .then((response) => {
                if (response.status === 201) {
                    getUserData();
                } else {
                    axios
                        .post(
                            "/api/get-user-data",
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
                            //console.log(JSON.parse(response.data))
                            var data = JSON.parse(response.data);
                            var v = data.VISIBILITY;
                            var state_arr = [];
                            while (v.length) state_arr.push(v.splice(0, 27));
                            //console.log(data)
                            setVis(state_arr);
                            setHero(data.HERO);
                            setLoading(false);
                            setClick(data.CLICK);
                            setFinished(data.FINISHED);
                            setKey1(data.KEY1);
                            setKey2(data.KEY2);
                            setPenalty(data.PENALTY);
                            setFirstBoot(false);
                        });
                }
            });
    }, []);

    if (loading && firstBoot) {
        return (
            <div>
                <div id="center">
                    <Loader type="spinner-cub" bgColor={"#FFFFFF"} color={"#FFFFFF"} size={100} />
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
                {loading && (
                    <>
                        <div id="center">
                            <Loader
                                type="spinner-cub"
                                bgColor={"#FFFFFF"}
                                color={"#FFFFFF"}
                                size={100}
                            />
                        </div>
                        <div className="overlay"></div>
                    </>
                )}
                <div id="content-container">
                    <div id="penalty">Penalty:{penalty}</div>
                    <div id="key-count">Keys Collected:{(key1 ? 1 : 0) + (key2 ? 1 : 0)}/2</div>
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
                                                            key={String(i) + "-" + String(j)}
                                                        ></div>
                                                    );
                                                } else if (i == 25 && j == 26) {
                                                    return (
                                                        <div
                                                            className="invisible goal"
                                                            key={String(i) + "-" + String(j)}
                                                        ></div>
                                                    );
                                                } else {
                                                    return (
                                                        <div
                                                            className="invisible"
                                                            key={String(i) + "-" + String(j)}
                                                        ></div>
                                                    );
                                                }
                                            } else if (i === hero[0] && j === hero[1])
                                                return (
                                                    <div
                                                        className="hero"
                                                        key={String(i) + "-" + String(j)}
                                                    ></div>
                                                );
                                            else if (maze[i][j].wall === true)
                                                return (
                                                    <div
                                                        className="wall"
                                                        key={String(i) + "-" + String(j)}
                                                    ></div>
                                                );
                                            else if (maze[i][j].key === true) {
                                                if (i == 25 && j == 9 && key1 === false) {
                                                    return (
                                                        <div
                                                            className="key"
                                                            key={String(i) + "-" + String(j)}
                                                        ></div>
                                                    );
                                                } else if (i == 5 && j == 15 && key2 === false) {
                                                    return (
                                                        <div
                                                            className="key"
                                                            key={String(i) + "-" + String(j)}
                                                        ></div>
                                                    );
                                                } else {
                                                    return <div></div>;
                                                }
                                            } else if (i == 25 && j == 26) {
                                                return (
                                                    <div
                                                        className="goal"
                                                        key={String(i) + "-" + String(j)}
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
