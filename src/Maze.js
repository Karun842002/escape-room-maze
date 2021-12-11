import React, { useEffect, useState } from "react";

import { app } from "./firebase";
import { getFirestore, updateDoc } from "firebase/firestore";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

import UpButton from "./Up";
import DownButton from "./Down";
import LeftButton from "./Left";
import RightButton from "./Right";
import Loader from "react-js-loader";
import Login from "./Login";

import { maze } from "./walls";
import "./maze.css";

async function getUserData(db, user) {
  const docRef = doc(db, "users", user);
  getDoc(docRef).then((docSnap) => {
    
    if (docSnap.exists()) {
      
    } else {
      var v = Array(27)
        .fill(0)
        .map((row) => new Array(27).fill(false));
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          v[i][j] = true;
        }
      }
      var flattened = v.reduce(function (a, b) {
        return a.concat(b);
      });
      var sol = Array(113).fill(false)
      sol[0] = true;
      setUserData(docRef, {
        visiblity: flattened,
        hero: [1, 0],
        solved : sol,
        penalty : 0
      });
    }
  });
}

async function setUserData(docRef, data) {
  await setDoc(docRef, data);
}

async function updateUserData(docRef, data){
  await updateDoc(docRef, data)
}

function setData(data) {
  const db = getFirestore();
  const user = sessionStorage.getItem("UID");
  const docRef = doc(db, "users", user);
  updateUserData(docRef, data);
}


function Maze() {
  const db = getFirestore();
  const user = sessionStorage.getItem("UID");
  const [visiblity, setVis] = useState([]);
  const [hero, setHero] = useState([]);
  const [loading, setLoading] = useState(true);
  const [click, setClick] = useState(true);
  useEffect(() => {
    var body = document.getElementsByTagName('body')
    body.id = 'mazebody'
    const data = onSnapshot(doc(db, "users", user), (doc) => {
      var dat = doc.data();
      if (dat === undefined) {
        
        getUserData(db, user);
      } else {
        
        var v = dat.visiblity;
        
        var state_arr = [];
        while (v.length) state_arr.push(v.splice(0, 27));
        
        setVis(state_arr);
        setHero(dat.hero);
        setLoading(false);
      }
    });
    return () => data();
  }, []);

  useEffect(()=>{
    document.addEventListener('keydown', function(e) {
      var ele;
      if (e.key === 'ArrowUp') {
        ele = document.getElementsByClassName('up')[0]
        ele.click()
      }
      if (e.key === 'ArrowDown') {
        ele = document.getElementsByClassName('down')[0]
        ele.click()
      }
      if (e.key === 'ArrowLeft') {
        ele = document.getElementsByClassName('left')[0]
        ele.click()
      }
      if (e.key === 'ArrowRight') {
        ele = document.getElementsByClassName('right')[0]
        ele.click()
      }
  });
  },[])


  if (loading) {
    return (
      <div>
        <div id="center">
          <Loader
            type="spinner-cub"
            bgColor={"#FFFFFF"}
            color={"#FFFFFF"}
            size={100}
          />
        </div>
        <Login />
      </div>
    );
  } else {
    return (
      <div id="container">
        <div id="content-container">
        <div class="stars"></div>
        <div class="twinkling"></div>
        <div class="clouds"></div>
          <div id="maze_container" key="maze_container">
            <div id="maze" key="maze">
              {maze.map(function (row, i) {
                return (
                  <div key={String(i)}>
                    {row.map(function (col, j) {
                      if (visiblity[i][j] === false)
                        return (
                          <div
                            className="invisible"
                            key={String(i) + "-" + String(j)}
                          ></div>
                        );
                      else if (i === hero[0] && j === hero[1])
                        return (
                          <div
                            className="hero"
                            key={String(i) + "-" + String(j)}
                          ></div>
                        );
                      else if (maze[i][j].wall === true)
                        return (
                          <div
                            className="wall"
                            key={String(i) + "-" + String(j)}
                          ></div>
                        );
                      else return <div></div>;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="buttoncon" key="buttoncon">
            <UpButton 
            hero={hero} 
            vis={visiblity}
            click={click}
            setClick={setClick} 
            setData={setData}
            ></UpButton>
            <DownButton
              hero={hero}
              vis={visiblity}
              click={click}
            setClick={setClick}
              setData={setData}
            ></DownButton>
            <LeftButton
              hero={hero}
              vis={visiblity}
              click={click}
            setClick={setClick}
              setData={setData}
            ></LeftButton>
            <RightButton
              hero={hero}
              vis={visiblity}
              click={click}
            setClick={setClick}
              setData={setData}
            ></RightButton>
          </div>
        </div>
      </div>
    );
  }
}

export default Maze;
