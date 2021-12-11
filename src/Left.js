import React from "react";

import { app } from "./firebase";
import { getFirestore } from "firebase/firestore";
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

  handleClickOpen = () => {
    if (this.props.click) {
      this.setState({ open: true });
      this.props.setClick(false)
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
    const data = onSnapshot(doc(db, "questions", q), (doc) => {
      var dat = doc.data();
      console.log(dat)
      this.setState(dat)
    });
    }
    
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.setClick(true)
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
    var data = {
      visiblity: flattened,
      hero: [this.props.hero[0], this.state.pos],
    };
    this.props.setData(data);
  };
  handleDisagree = () => {
    this.handleClose();
  };
  render() {
    return (
      <div>
        {/* Button to trigger the opening of the dialog */}
        <a href="#" className="left" onClick={this.handleClickOpen}>
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
          {"Question"}
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
            <Button onClick={(this.state.correct===2)?this.handleAgree:this.handleDisagree} color="primary" autoFocus>
            {this.state.option2}
            </Button>
            <Button onClick={(this.state.correct===3)?this.handleAgree:this.handleDisagree} color="primary">
            {this.state.option3}
            </Button>
            <Button onClick={(this.state.correct===4)?this.handleAgree:this.handleDisagree} color="primary" autoFocus>
            {this.state.option4}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default LeftButton;
