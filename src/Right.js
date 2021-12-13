import React from "react";

import { app } from "./firebase";
import { getDoc, getFirestore, serverTimestamp } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";

import { maze } from "./walls";
import { queMap } from "./questionMap";
class RightButton extends React.Component {
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

    componentDidMount = () => {
        console.log("hello");
    };

    handleClick = () => {
        if (true) {
            var hero = this.props.hero;
            for (var j = hero[1]; j < 27; j++) {
                if (j === 26) {
                    break;
                }
                if (
                    maze[hero[0]][j + 1].wall === true ||
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
            const user = sessionStorage.getItem("UID");
            axios
                .post(
                    "http://localhost:5000/get-user-data",
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
                    var data = response.data;
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
            this.props.setData({ click: false });
            var hero = this.props.hero;
            for (var j = hero[1]; j < 27; j++) {
                if (j === 26) {
                    break;
                }
                if (
                    maze[hero[0]][j + 1].wall === true ||
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
            const db = getFirestore();
            const data = onSnapshot(doc(db, "questions", q), (doc) => {
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
        this.props.setData({ click: true });
    };

    handleAgree = () => {
        this.handleClose();

        var hero = this.props.hero;
        var pos = this.state.pos;
        var vis = this.props.vis;
        if (this.state.pos !== 26)
            for (let i = -1; i <= 1; i++) {
                for (let j = hero[1]; j <= pos + 1; j++) {
                    vis[hero[0] + i][j] = true;
                }
            }

        var flattened = vis.reduce(function (a, b) {
            return a.concat(b);
        });
        var key = String(hero[0]) + "-" + String(pos);
        var q = queMap.get(key);
        const user = sessionStorage.getItem("UID");
        var data1 = {};
        axios
            .post(
                "http://localhost:5000/get-user-data",
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
                var data = response.data;
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
                };
                this.props.setData(data1);
            });
        if (this.state.pos === 26 && this.props.key1 && this.props.key2)
            this.props.setData({
                USER_ID: sessionStorage.getItem("UID"),
                CLICK: data1.CLICK,
                HERO: data1.HERO,
                KEY1: data1.KEY1,
                KEY2: data1.KEY2,
                PENALTY: data1.PENALTY,
                SOLVED: data1.SOLVED,
                VISIBILITY: data1.VISIBILITY,
                FINISHED: true,
                FINISHED_TIME: Date.now(),
            });
        if (this.props.hero[0] === 25 && this.state.pos === 9)
            this.props.setData({
                USER_ID: sessionStorage.getItem("UID"),
                CLICK: data1.CLICK,
                HERO: data1.HERO,
                KEY1: true,
                KEY2: data1.KEY2,
                PENALTY: data1.PENALTY,
                SOLVED: data1.SOLVED,
                VISIBILITY: data1.VISIBILITY,
                FINISHED: data1.FINISHED,
                FINISHED_TIME: data1.FINISHED_TIME,
            });
    };

    handleSkip = () => {
        this.handleClose();

        var hero = this.props.hero;
        var pos = this.state.pos;
        var vis = this.props.vis;
        if (this.state.pos !== 26)
            for (let i = -1; i <= 1; i++) {
                for (let j = hero[1]; j <= pos + 1; j++) {
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
        getDoc(doc(db, "users", user)).then((doc) => {
            var data = doc.data();
            var visited = data.solved;
            var p = data.penalty + 20;
            visited[parseInt(q)] = true;
            var data = {
                visibIlity: flattened,
                hero: [this.props.hero[0], this.state.pos],
                solved: visited,
                penalty: p,
            };
            this.props.setData(data);
        });
        if (this.state.pos === 26 && this.props.key1 && this.props.key2)
            this.props.setData({
                finished: true,
                finishedTime: serverTimestamp(),
            });
        if (this.props.hero[0] === 25 && this.state.pos == 9)
            this.props.setData({ key1: true });
    };

    handleDisagree = () => {
        this.handleClose();
        const db = getFirestore();
        const user = sessionStorage.getItem("UID");
        getDoc(doc(db, "users", user)).then((doc) => {
            var data = doc.data();
            var pen = data.penalty;
            pen += 1;
            var data = {
                penalty: pen,
            };
            this.props.setData(data);
        });
    };
    render() {
        return (
            <div>
                {/* Button to trigger the opening of the dialog */}
                <a href="#" className="right" onClick={this.handleClick}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    RIGHT
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

export default RightButton;
