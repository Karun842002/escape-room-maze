import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { maze } from './walls'
class UpButton extends React.Component {
  state = {
    open: false,
    pos : this.props.hero[1]
  };

  handleClickOpen = () => {
    this.setState({ open: true });
    var hero = this.props.hero
    for(var j=hero[0];j>=0;j--){
      console.log(maze)
      if(maze[j-1][hero[1]].wall===true || 
        ((maze[j][hero[1]].options.includes('U') || maze[j][hero[1]].options.includes('D')) && 
        (maze[j][hero[1]].options.includes('L') || maze[j][hero[1]].options.includes('R')) && j!==hero[0])){
        break;
      }
    }
    console.log(j)
    this.setState({ pos: j });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAgree = () => {
    console.log("I agree!");
    this.handleClose();

    var hero =this.props.hero;
    var pos = this.state.pos;
    var vis = this.props.vis
    for(let i=-1;i<=1;i++){
      for(let j=hero[0];j>=pos-1;j--){
        vis[j][hero[1]+i] = true;
      }
    }
    this.props.setHero([this.state.pos,this.props.hero[1]]);
    this.props.setvis(vis)
  };
  handleDisagree = () => {
    console.log("I do not agree.");
    this.handleClose();
  };
  render() {
    return (
      <div>
        {/* Button to trigger the opening of the dialog */}
        <Button onClick={this.handleClickOpen}>Up</Button>
        {/* Dialog that is displayed if the state open is true */}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Successful Alert"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            Are you sure you want to move UP?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDisagree} color="primary">
              Disagree
            </Button>
            <Button onClick={this.handleAgree} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default UpButton;
