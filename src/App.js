import './App.css';
import React, { useState } from 'react';
import { maze } from './walls'
import UpButton from './Up'
import DownButton from './Down'
import LeftButton from './Left'
import RightButton from './Right'

function App() {
  const [hero,setHero] = useState([1,0])
  
  return (
    <div id="maze_container">
      <div id="maze">
        {maze.map(function(row,i){
          return(
          <div>
            {row.map(function(col,j) {
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
      <UpButton hero={hero} setHero={setHero}></UpButton>
      <DownButton hero={hero} setHero={setHero}></DownButton>
      <LeftButton hero={hero} setHero={setHero}></LeftButton>
      <RightButton hero={hero} setHero={setHero}></RightButton>
      </div>
    </div>
  );
}

export default App;