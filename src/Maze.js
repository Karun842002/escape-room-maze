import React, { useEffect, useState } from 'react';
import { maze } from './walls'
import UpButton from './Up'
import DownButton from './Down'
import LeftButton from './Left'
import RightButton from './Right'

function Maze() {
  const [hero,setHero] = useState([1,0])
  const [visiblity,setVisibility] = useState(new Array(27).fill(0).map(e => new Array(27).fill(false)))
  useEffect(() => {
    for(let i=0;i<3;i++){
      for(let j=0;j<3;j++){
        var v = visiblity
        console.log(v)
        v[i][j] = true;
        setVisibility(v)
      }
    }
  },[visiblity])
  
  return (
    <div id="maze_container">
      <div id="maze">
        {maze.map(function(row,i){
          return(
          <div>
            {row.map(function(col,j) {
              if(visiblity[i][j]===false)
              return ((<div class="invisible"></div>))
              if(i===hero[0] && j===hero[1]) 
              return (<div class="hero"></div>)
              if(maze[i][j].wall === true)
              return (<div class="wall"></div>)
              else
              return(<div></div>)
            })}
          </div>)
        })}
      </div>
      <div class="buttoncon">
      <UpButton hero={hero} setHero={setHero} vis={visiblity} setvis={setVisibility}></UpButton>
      <DownButton hero={hero} setHero={setHero} vis={visiblity} setvis={setVisibility}></DownButton>
      <LeftButton hero={hero} setHero={setHero} vis={visiblity} setvis={setVisibility}></LeftButton>
      <RightButton hero={hero} setHero={setHero} vis={visiblity} setvis={setVisibility}></RightButton>
      </div>
    </div>
  );
}

export default Maze;