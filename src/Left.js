import React from "react";

import { app } from "./firebase";
import { getDoc, getFirestore } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { maze } from "./walls";
import { queMap } from "./questionMap";
import axios from "axios";
class LeftButton extends React.Component {
    state = {
        open: false,
        pos: this.props.hero[1],
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correct: "",
    };

    handleClick = () => {
        if (true) {
            var hero = this.props.hero;
            for (var j = hero[1]; j >= 0; j--) {
                if (j === 0) {
                    break;
                }
                if (
                    maze[hero[0]][j - 1].wall === true ||
                    ((maze[hero[0]][j].options.includes("U") ||
                        maze[hero[0]][j].options.includes("D")) &&
                        (maze[hero[0]][j].options.includes("L") ||
                            maze[hero[0]][j].options.includes("R")) &&
                        j !== hero[1])
                ) {
                    break;
                }
            }
            var key = String(hero[0]) + "-" + String(j);
            var q = queMap.get(key);
            const db = getFirestore();
            const user = sessionStorage.getItem("UID");
            axios
                .post(
                    "http://35.200.157.115/get-user-data",
                    JSON.stringify({
                        uid: user,
                    }),
                    {
                        headers: {
                            "Content-Type": "text/plain",
                        },
                    }
                )
                .then((response) => {
                    console.log(response);
                    var data = JSON.parse(response.data);
                    var visited = data.SOLVED;
                    if (visited[parseInt(q)] === true) {
                        this.setState({ pos: j });
                        this.handleAgree();
                    } else {
                        this.handleClickOpen();
                    }
                });
        } else {
            alert("A Team Member has a question open!");
        }
    };

    handleClickOpen = () => {
        if (true) {
            this.setState({ open: true });
            this.props.setClick(false);
            var data = {};
            var user = sessionStorage.getItem("UID");
            axios
                .post(
                    "http://35.200.157.115/get-user-data",
                    JSON.stringify({
                        uid: user,
                    }),
                    {
                        headers: {
                            "Content-Type": "text/plain",
                        },
                    }
                )
                .then((response) => {
                    data = JSON.parse(response.data);
                    var data1 = {
                        USER_ID: sessionStorage.getItem("UID"),
                        CLICK: true,
                        FINISHED: data.FINISHED,
                        FINISHED_TIME: data.FINISHED_TIME,
                        HERO: data.HERO,
                        KEY1: data.KEY1,
                        KEY2: data.KEY2,
                        PENALTY: data.PENALTY,
                        SOLVED: data.SOLVED,
                        VISIBILITY: data.VISIBILITY,
                        SOURCE: "handle_click_open",
                    };
                    this.props.setData(data1, this.props.setSt);
                });
            var hero = this.props.hero;
            for (var j = hero[1]; j >= 0; j--) {
                if (j === 0) {
                    break;
                }
                if (
                    maze[hero[0]][j - 1].wall === true ||
                    ((maze[hero[0]][j].options.includes("U") ||
                        maze[hero[0]][j].options.includes("D")) &&
                        (maze[hero[0]][j].options.includes("L") ||
                            maze[hero[0]][j].options.includes("R")) &&
                        j !== hero[1])
                ) {
                    break;
                }
            }
            this.setState({ pos: j });
            var key = String(hero[0]) + "-" + String(j);
            var q = queMap.get(key);
            console.log(key);
            const db = getFirestore();
            getDoc(doc(db, "questions", q)).then((doc) => {
                var dat = doc.data();
                this.setState(dat);
            });
        }
    };

    handleClose = () => {
        this.setState({
            open: false,
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            correct: "",
        });
        this.props.setClick(true);
        var data = {};
        var user = sessionStorage.getItem("UID");
        axios
            .post(
                "http://35.200.157.115/get-user-data",
                JSON.stringify({
                    uid: user,
                }),
                {
                    headers: {
                        "Content-Type": "text/plain",
                    },
                }
            )
            .then((response) => {
                var data = JSON.parse(response.data);
                var data1 = {
                    USER_ID: sessionStorage.getItem("UID"),
                    CLICK: true,
                    FINISHED: data.FINISHED,
                    FINISHED_TIME: data.FINISHED_TIME,
                    HERO: data.HERO,
                    KEY1: data.KEY1,
                    KEY2: data.KEY2,
                    PENALTY: data.PENALTY,
                    SOLVED: data.SOLVED,
                    VISIBILITY: data.VISIBILITY,
                    SOURCE: "handle_close",
                };
                this.props.setData(data1, this.props.setSt);
            });
    };

    handleAgree = () => {
        this.handleClose();

        var hero = this.props.hero;
        var pos = this.state.pos;
        var vis = this.props.vis;
        for (let i = -1; i <= 1; i++) {
            for (let j = hero[1]; j >= pos - 1; j--) {
                vis[hero[0] + i][j] = true;
            }
        }
        var flattened = vis.reduce(function (a, b) {
            return a.concat(b);
        });
        var key = String(hero[0]) + "-" + String(pos);
        var q = queMap.get(key);
        const db = getFirestore();
        const user = sessionStorage.getItem("UID");
        console.log(pos);
        var data1 = {};
        axios
            .post(
                "http://35.200.157.115/get-user-data",
                JSON.stringify({
                    uid: user,
                }),
                {
                    headers: {
                        "Content-Type": "text/plain",
                    },
                }
            )
            .then((response) => {
                console.log(response);
                var data = JSON.parse(response.data);
                var visited = data.SOLVED;
                visited[parseInt(q)] = true;
                data1 = {
                    USER_ID: sessionStorage.getItem("UID"),
                    CLICK: data.CLICK,
                    FINISHED: data.FINISHED,
                    FINISHED_TIME: data.FINISHED_TIME,
                    HERO: [this.props.hero[0], this.state.pos],
                    KEY1: data.KEY1,
                    KEY2: data.KEY2,
                    PENALTY: data.PENALTY,
                    SOLVED: visited,
                    VISIBILITY: flattened,
                    SOURCE: "handle_agree",
                };
                this.props.setData(data1, this.props.setSt);
            });
    };

    handleSkip = () => {
        this.handleClose();

        var hero = this.props.hero;
        var pos = this.state.pos;
        var vis = this.props.vis;
        for (let i = -1; i <= 1; i++) {
            for (let j = hero[1]; j >= pos - 1; j--) {
                vis[hero[0] + i][j] = true;
            }
        }
        var flattened = vis.reduce(function (a, b) {
            return a.concat(b);
        });
        var key = String(hero[0]) + "-" + String(pos);
        var q = queMap.get(key);
        const db = getFirestore();
        const user = sessionStorage.getItem("UID");
        var data1 = {};
        axios
            .post(
                "http://35.200.157.115/get-user-data",
                JSON.stringify({
                    uid: user,
                }),
                {
                    headers: {
                        "Content-Type": "text/plain",
                    },
                }
            )
            .then((response) => {
                var data = JSON.parse(response.data);
                var visited = data.SOLVED;
                var p = data.PENALTY + 20;
                visited[parseInt(q)] = true;
                data1 = {
                    USER_ID: sessionStorage.getItem("UID"),
                    CLICK: data.CLICK,
                    KEY1: data.KEY1,
                    KEY2: data.KEY2,
                    VISIBILITY: flattened,
                    HERO: [this.props.hero[0], this.state.pos],
                    SOLVED: visited,
                    PENALTY: p,
                    FINISHED: data.FINISHED,
                    FINISHED_TIME: data.FINISHED_TIME,
                    SOURCE: "handle_skip",
                };
                this.props.setData(data1, this.props.setSt);
            });
    };

    handleDisagree = () => {
        this.handleClose();
        const db = getFirestore();
        const user = sessionStorage.getItem("UID");
        axios
            .post(
                "http://35.200.157.115/get-user-data",
                JSON.stringify({
                    uid: user,
                }),
                {
                    headers: {
                        "Content-Type": "text/plain",
                    },
                }
            )
            .then((response) => {
                var data = JSON.parse(response.data);
                var p = data.PENALTY + 1;
                var data1 = {
                    USER_ID: sessionStorage.getItem("UID"),
                    CLICK: data.CLICK,
                    KEY1: data.KEY1,
                    KEY2: data.KEY2,
                    VISIBILITY: data.VISIBILITY,
                    HERO: data.HERO,
                    SOLVED: data.SOLVED,
                    PENALTY: p,
                    FINISHED: data.FINISHED,
                    FINISHED_TIME: data.FINISHED_TIME,
                    SOURCE: "handle_disagree",
                };
                this.props.setData(data1, this.props.setSt);
            });
    };
    render() {
        return (
            <div>
                {/* Button to trigger the opening of the dialog */}
                <a href="#" className="left" onClick={this.handleClick}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    LEFT
                </a>
                {/* Dialog that is displayed if the state open is true */}
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <div>
                            {"Question"}
                            <img
                                src="https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png"
                                style={{
                                    cursor: "pointer",
                                    float: "right",
                                    marginTop: "5px",
                                    width: "20px",
                                }}
                                onClick={this.handleClose}
                            />
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.state.question}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={
                                this.state.correct === 1
                                    ? this.handleAgree
                                    : this.handleDisagree
                            }
                            color="primary"
                        >
                            {this.state.option1}
                        </Button>
                        <Button
                            onClick={
                                this.state.correct === 2
                                    ? this.handleAgree
                                    : this.handleDisagree
                            }
                            color="primary"
                        >
                            {this.state.option2}
                        </Button>
                        <Button
                            onClick={
                                this.state.correct === 3
                                    ? this.handleAgree
                                    : this.handleDisagree
                            }
                            color="primary"
                        >
                            {this.state.option3}
                        </Button>
                        <Button
                            onClick={
                                this.state.correct === 4
                                    ? this.handleAgree
                                    : this.handleDisagree
                            }
                            color="primary"
                        >
                            {this.state.option4}
                        </Button>
                        <Button onClick={this.handleSkip} color="primary">
                            Skip
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default LeftButton;
