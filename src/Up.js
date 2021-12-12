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
class UpButton extends React.Component {
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
    if(this.props.click){
      var hero = this.props.hero;
      for (var j = hero[0]; j >= 0; j--) {
        if (
          maze[j - 1][hero[1]].wall === true ||
          ((maze[j][hero[1]].options.includes("U") ||
            maze[j][hero[1]].options.includes("D")) &&
            (maze[j][hero[1]].options.includes("L") ||
              maze[j][hero[1]].options.includes("R")) &&
            j !== hero[0])
        ) {
          break;
        }
      }
    var key = String(j)+'-'+String(hero[1])
    var q = queMap.get(key)
    const db = getFirestore();
    const user = sessionStorage.getItem("UID");
    getDoc(doc(db,"users",user)).then((doc)=>{
      var data = doc.data()
      var visited = data.solved;
      if(visited[parseInt(q)]===true){
        this.setState({ pos: j });
        this.handleAgree();
      }
      else{
        this.handleClickOpen();
      }
    })
    }
  }

  handleClickOpen = () => {
    if (this.props.click) {
      this.setState({ open: true });
      this.props.setData({click : false})
      this.props.setClick(false);
      var hero = this.props.hero;
      for (var j = hero[0]; j >= 0; j--) {
        if (
          maze[j - 1][hero[1]].wall === true ||
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
      var key = String(j) + "-" + String(hero[1]);
      var q = queMap.get(key);
      const db = getFirestore();
      const data = onSnapshot(doc(db, "questions", q), (doc) => {
        var dat = doc.data();
        this.setState(dat);
      });
    }
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.setClick(true);
    this.props.setData({click : true})
  };

  handleAgree = () => {
    this.handleClose();

    var hero = this.props.hero;
    var pos = this.state.pos;
    var vis = this.props.vis;
    for (let i = -1; i <= 1; i++) {
      for (let j = hero[0]; j >= pos - 1; j--) {
        vis[j][hero[1] + i] = true;
      }
    }
    var flattened = vis.reduce(function (a, b) {
      return a.concat(b);
    });
    var key = String(pos)+'-'+String(hero[1])
    var q = queMap.get(key)
    const db = getFirestore();
    const user = sessionStorage.getItem("UID");
    console.log(pos)
    getDoc(doc(db,"users",user)).then((doc)=>{
      var data = doc.data()
      var visited = data.solved;
      visited[parseInt(q)] = true
      var data = {
        visiblity: flattened,
        hero: [this.state.pos, this.props.hero[1]],
        solved : visited
      };
      this.props.setData(data);
    })
  };

  handleSkip = () => {
    this.handleClose();

    var hero = this.props.hero;
    var pos = this.state.pos;
    var vis = this.props.vis;
    for (let i = -1; i <= 1; i++) {
      for (let j = hero[0]; j >= pos - 1; j--) {
        vis[j][hero[1] + i] = true;
      }
    }
    var flattened = vis.reduce(function (a, b) {
      return a.concat(b);
    });
    var key = String(pos)+'-'+String(hero[1])
    var q = queMap.get(key)
    const db = getFirestore();
    const user = sessionStorage.getItem("UID");
    console.log(pos)
    getDoc(doc(db,"users",user)).then((doc)=>{
      var data = doc.data()
      var visited = data.solved;
      var p = data.penalty + 10;
      visited[parseInt(q)] = true
      var data = {
        visiblity: flattened,
        hero: [this.state.pos, this.props.hero[1]],
        solved : visited,
        penalty : p
      };
      this.props.setData(data);
    })
  };

  handleDisagree = () => {
    this.handleClose();
    const db = getFirestore();
    const user = sessionStorage.getItem("UID");
    getDoc(doc(db,"users",user)).then((doc)=>{
      var data = doc.data()
      var pen = data.penalty;
      pen+=1
      var data = {
        penalty : pen
      };
      this.props.setData(data);
    })
  };
  render() {
    return (
      <div>
        {/* Button to trigger the opening of the dialog */}
        <a href="#" className="up" onClick={this.handleClick}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          UP
        </a>
        {/* Dialog that is displayed if the state open is true */}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Question"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.question}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={
                this.state.correct === 1 ? this.handleAgree : this.handleDisagree
              }
              color="primary"
            >
              {this.state.option1}
            </Button>
            <Button
              onClick={
                this.state.correct === 2 ? this.handleAgree : this.handleDisagree
              }
              color="primary"
            >
              {this.state.option2}
            </Button>
            <Button
              onClick={
                this.state.correct === 3 ? this.handleAgree : this.handleDisagree
              }
              color="primary"
            >
              {this.state.option3}
            </Button>
            <Button
              onClick={
                this.state.correct === 4 ? this.handleAgree : this.handleDisagree
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

export default UpButton;
