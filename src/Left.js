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
import { queMap } from "./questionMap"

class LeftButton extends React.Component {
  state = {
    open: false,
    pos: this.props.hero[1],
    question : '',
    option1 : '',
    option2 : '',
    option3 : '',
    option4 : '',
    correct : '',
  };

  handleClick = () => {
    if(this.props.click){
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
    var key = String(hero[0])+'-'+String(j)
    var q = queMap.get(key)
    const db = getFirestore();
    const user = sessionStorage.getItem("UID");
    getDoc(doc(db,"users",user)).then((doc)=>{
      var data = doc.data()
      var visited = data.solved;
      if(visited[parseInt(q)]===true){
        this.handleAgree();
        this.setState({ pos: j });
        console.log(key,'dest-visited')
      }
      else{
        this.handleClickOpen();
        console.log(key,'dest-not-visited')
      }
    })
    }
    else{
      alert('A Team Member has a question open!')
    }
  }

  handleClickOpen = () => {
    if (this.props.click) {
      this.setState({ open: true });
      this.props.setClick(false)
      this.props.setData({click : false})
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
    var key = String(hero[0])+'-'+String(j)
    var q = queMap.get(key)
    console.log(key)
    const db = getFirestore();
    getDoc(doc(db, "questions", q)).then((doc) => {
      var dat = doc.data();
      this.setState(dat)
    });
    }
  };

  handleClose = () => {
    this.setState({
      open: false,
      question : '',
      option1 : '',
      option2 : '',
      option3 : '',
      option4 : '',
      correct : '',
    });
    this.props.setClick(true)
    this.props.setData({click : true})
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
    var key = String(hero[0])+'-'+String(pos)
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
        hero: [this.props.hero[0], this.state.pos],
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
      for (let j = hero[1]; j >= pos - 1; j--) {
        vis[hero[0] + i][j] = true;
      }
    }
    var flattened = vis.reduce(function (a, b) {
      return a.concat(b);
    });
    var key = String(hero[0])+'-'+String(pos)
    var q = queMap.get(key)
    const db = getFirestore();
    const user = sessionStorage.getItem("UID");
    console.log(pos)
    getDoc(doc(db,"users",user)).then((doc)=>{
      var data = doc.data()
      var visited = data.solved;
      var p = data.penalty + 20;
      visited[parseInt(q)] = true
      var data = {
        visiblity: flattened,
        hero: [this.props.hero[0], this.state.pos],
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
            <img src='https://d30y9cdsu7xlg0.cloudfront.net/png/53504-200.png' style={{cursor:'pointer', float:'right', marginTop: '5px', width: '20px'}} onClick={this.handleClose}/>
          </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.question}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={(this.state.correct===1)?this.handleAgree:this.handleDisagree} color="primary">
              {this.state.option1}
            </Button>
            <Button onClick={(this.state.correct===2)?this.handleAgree:this.handleDisagree} color="primary">
            {this.state.option2}
            </Button>
            <Button onClick={(this.state.correct===3)?this.handleAgree:this.handleDisagree} color="primary">
            {this.state.option3}
            </Button>
            <Button onClick={(this.state.correct===4)?this.handleAgree:this.handleDisagree} color="primary">
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
