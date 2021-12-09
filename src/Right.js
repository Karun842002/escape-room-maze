import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {maze} from './walls'

class RightButton extends React.Component {
  state = {
    open: false,
    pos : this.props.hero[1]
  };
  
  handleClickOpen = () => {
    this.setState({ open: true });
    var hero = this.props.hero
    for(var j=hero[1];j<27;j++){
      if(j===26){
        break;
      }
      if(maze[hero[0]][j+1].wall===true || 
        ((maze[hero[0]][j].options.includes('U') || maze[hero[0]][j].options.includes('D')) && 
        (maze[hero[0]][j].options.includes('L') || maze[hero[0]][j].options.includes('R')) && j!==hero[1])){
        break;
      }
    }
    this.setState({ pos: j });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleAgree = () => {
    this.handleClose();
    
    var hero =this.props.hero;
    var pos = this.state.pos;
    var vis = this.props.vis
    if(this.state.pos !== 26)
    for(let i=-1;i<=1;i++){
      for(let j=hero[1];j<=pos+1;j++){
        vis[hero[0]+i][j] = true;
      }
    }
    
    var flattened = vis.reduce(function (a, b) {
      return a.concat(b);
    });
    var data = {
      visiblity : flattened,
      hero : [this.props.hero[0],this.state.pos]
    }
    this.props.setData(data)
    if(this.state.pos === 26) alert('You Win')
  };
  handleDisagree = () => {
    this.handleClose();
  };
  render() {
    return (
      <div>
        {/* Button to trigger the opening of the dialog */}
        <Button onClick={this.handleClickOpen}>Right</Button>
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
              Are you sure you want to move RIGHT?
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

export default RightButton;
