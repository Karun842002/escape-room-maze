import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { maze } from "./walls";
import { queMap } from "./questionMap";
import { app } from "./firebase";
import { getDoc, getFirestore } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import axios from "axios";
import { touchRippleClasses } from "@mui/material";
class DownButton extends React.Component {
    state = {
        open: false,
        pos: this.props.hero[1],
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        option5: "",
        correct: "",
        solved: false,
    };

    handleClickOpen = () => {
        if (this.props.click) {
            this.setState({ open: true });
            var data = {};
            var user = sessionStorage.getItem("UID");
            var hero = this.props.hero;
            for (var j = hero[0]; j < 27; j++) {
                if (
                    maze[j + 1][hero[1]].wall === true ||
                    ((maze[j][hero[1]].options.includes("U") ||
                        maze[j][hero[1]].options.includes("D")) &&
                        (maze[j][hero[1]].options.includes("L") ||
                            maze[j][hero[1]].options.includes("R")) &&
                        j !== hero[0])
                ) {
                    break;
                }
            }
            this.setState({ pos: j });
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
                    var data = JSON.parse(response.data);
                    var key = String(j) + "-" + String(hero[1]);
                    var q = queMap.get(key);
                    if (data.SOLVED[parseInt(q)]) {
                        this.setState({
                            solved: true,
                        });
                    } else {
                        const db = getFirestore();
                        //console.log(q);
                        getDoc(doc(db, "questions", q)).then((doc) => {
                            //console.log(doc.data());
                            var dat = doc.data();
                            this.setState(dat);
                            this.setState({ option5: "SKIP", solved: false });
                        });
                    }
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
            option5: "",
            correct: "",
            solved: false,
        });
    };

    handleAgree = () => {
        this.handleClose();

        var hero = this.props.hero;
        var pos = this.state.pos;
        var vis = this.props.vis;
        for (let i = -1; i <= 1; i++) {
            for (let j = hero[0]; j <= pos + 1; j++) {
                vis[j][hero[1] + i] = true;
            }
        }
        var flattened = vis.reduce(function (a, b) {
            return a.concat(b);
        });
        var key = String(pos) + "-" + String(hero[1]);
        var q = queMap.get(key);
        const db = getFirestore();
        const user = sessionStorage.getItem("UID");
        var data1 = {};
        axios
            .post(
                "/api/get-user-data",
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
                //console.log(response);
                var data = JSON.parse(response.data);
                var visited = data.SOLVED;
                visited[parseInt(q)] = true;
                if (this.state.pos === 5 && this.props.hero[1] == 15)
                    this.props.setData(
                        {
                            USER_ID: sessionStorage.getItem("UID"),
                            CLICK: true,
                            HERO: [this.state.pos, this.props.hero[1]],
                            KEY1: data.KEY1,
                            KEY2: true,
                            PENALTY: data.PENALTY,
                            SOLVED: visited,
                            VISIBILITY: flattened,
                            FINISHED: data.FINISHED,
                            FINISHED_TIME: data.FINISHED_TIME,
                            SKIPPED: data.SKIPPED,
                            SOURCE: "handle_agree",
                        },
                        this.props.setSt
                    );
                else
                    this.props.setData(
                        {
                            USER_ID: sessionStorage.getItem("UID"),
                            CLICK: true,
                            HERO: [this.state.pos, this.props.hero[1]],
                            KEY1: data.KEY1,
                            KEY2: data.KEY2,
                            PENALTY: data.PENALTY,
                            SOLVED: visited,
                            VISIBILITY: flattened,
                            FINISHED: data.FINISHED,
                            FINISHED_TIME: data.FINISHED_TIME,
                            SKIPPED: data.SKIPPED,
                            SOURCE: "handle_agree",
                        },
                        this.props.setSt
                    );
            });
    };

    handleSkip = () => {
        this.handleClose();

        var hero = this.props.hero;
        var pos = this.state.pos;
        var vis = this.props.vis;
        for (let i = -1; i <= 1; i++) {
            for (let j = hero[0]; j <= pos + 1; j++) {
                vis[j][hero[1] + i] = true;
            }
        }
        var flattened = vis.reduce(function (a, b) {
            return a.concat(b);
        });
        var key = String(pos) + "-" + String(hero[1]);
        var q = queMap.get(key);
        const db = getFirestore();
        const user = sessionStorage.getItem("UID");
        var data1 = {};
        axios
            .post(
                "/api/get-user-data",
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
                var s = data.SKIPPED
                s[parseInt(q)]=true;
                visited[parseInt(q)] = true;
                if (this.state.pos === 5 && this.props.hero[1] == 15)
                    this.props.setData(
                        {
                            USER_ID: sessionStorage.getItem("UID"),
                            CLICK: true,
                            HERO: [this.state.pos, this.props.hero[1]],
                            KEY1: data.KEY1,
                            KEY2: true,
                            PENALTY: p,
                            SOLVED: visited,
                            VISIBILITY: flattened,
                            FINISHED: data.FINISHED,
                            FINISHED_TIME: data.FINISHED_TIME,
                            SKIPPED : s,
                            SOURCE: "handle_skip",
                        },
                        this.props.setSt
                    );
                else
                    this.props.setData(
                        {
                            USER_ID: sessionStorage.getItem("UID"),
                            CLICK: true,
                            HERO: [this.state.pos, this.props.hero[1]],
                            KEY1: data.KEY1,
                            KEY2: data.KEY2,
                            PENALTY: p,
                            SOLVED: visited,
                            VISIBILITY: flattened,
                            FINISHED: data.FINISHED,
                            FINISHED_TIME: data.FINISHED_TIME,
                            SKIPPED : s,
                            SOURCE: "handle_skip",
                        },
                        this.props.setSt
                    );
            });
    };

    handleDisagree = () => {
        this.handleClose();
        const db = getFirestore();
        const user = sessionStorage.getItem("UID");
        axios
            .post(
                "/api/get-user-data",
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
                    CLICK: true,
                    KEY1: data.KEY1,
                    KEY2: data.KEY2,
                    VISIBILITY: data.VISIBILITY,
                    HERO: data.HERO,
                    SOLVED: data.SOLVED,
                    PENALTY: p,
                    FINISHED: data.FINISHED,
                    FINISHED_TIME: data.FINISHED_TIME,
                    SKIPPED: data.SKIPPED,
                    SOURCE: "handle_disagree",
                };
                this.props.setData(data1, this.props.setSt);
            });
    };
    render() {
        if (this.state.solved) {
            return (
                <div>
                    {/* Button to trigger the opening of the dialog */}
                    <a href="#" className="down" onClick={this.handleClickOpen}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        DOWN
                    </a>
                    {/* Dialog that is displayed if the state open is true */}
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Successful Alert"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to move DOWN?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Disagree
                            </Button>
                            <Button onClick={this.handleAgree} color="primary">
                                Agree
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        } else {
            return (
                <div>
                    {/* Button to trigger the opening of the dialog */}
                    <a href="#" className="down" onClick={this.handleClickOpen}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        DOWN
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
                                {this.state.option5}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }
    }
}

export default DownButton;
