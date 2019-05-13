import React, { useEffect, useState } from "react";
import openSocket from "socket.io-client";
import { BrowserRouter as Router, Route } from "react-router-dom";

import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../../firebaseConfig";

import Host from "../Host";
import Player from "../Player";
import Login from "../Login";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
  facebookProvider: new firebase.auth.FacebookAuthProvider(),
  twitterProvider: new firebase.auth.TwitterAuthProvider()
};

const socket = openSocket("192.168.0.74:6001"); // change to your ip address

function App(props) {
  const [roomInput, setRoomInput] = useState("");
  const [joinedRoom, setJoinedRoom] = useState({});
  const [gameMessage, setGameMessage] = useState("");
  const [teamOptions, setTeamOptions] = useState([]);
  const [gotNameAndInRoom, setGotNameAndInRoom] = useState(false);
  const [teamColor, setTeamColor] = useState("orange");
  const [card, setCard] = useState({ gotCard: false });
  const [hasAnswered, setHasAnswered] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [liveCardUpdates, setliveCardUpdates] = useState({
    1: [],
    2: [],
    3: [],
    4: []
  });
  const [tidbit, setTidbit] = useState("");
  const [UID, setUID] = useState("");

  useEffect(() => {
    socket.on("makeGameRoom", data => {
      console.log("new Game Room: ", data);
      setJoinedRoom(data);
      let options = Object.keys(data.teams);
      setTeamOptions(options);
    });
    socket.on("enterGameRoom", data => {
      console.log("Entered Room", data);
      let options = Object.keys(data.teams);
      setTeamOptions(options);
      setJoinedRoom(data);
      setGotNameAndInRoom(true);
    });
    socket.on("updateHostRoom", room => {
      setJoinedRoom(room);
    });
    // socket.on("showScore", data => {
    //   console.log("showScore", data);
    //   setScore(data);
    // });
    socket.on("gameMessage", message => {
      setGameMessage(message);
    });
    socket.on("teamColor", color => setTeamColor(color));
    socket.on("cardMessage", serverCard => {
      setCard({ gotCard: true, ...serverCard });
      setHasAnswered(false);
      setHasSubmitted(false);
      setliveCardUpdates({
        1: [],
        2: [],
        3: [],
        4: []
      });
      console.log(serverCard);
    });
    socket.on("updateCardOptions", cards => {
      if (cards) {
        setliveCardUpdates(cards);
      }
      console.log("app live card updates", cards);
    });
    socket.on("tidbit", bit => setTidbit(bit));
    socket.on("scoreMessage", score => console.log("scoreMessage", score));
    socket.emit("login", "username");
    console.log(props);
  }, []);

  useEffect(() => {
    props.user && console.log("user", props.user.uid);
  }, [props.user]);

  function getRoundScore() {
    socket.emit("getRoundScore");
  }

  function makeGameRoom(numberOfTeams) {
    socket.emit("makeGameRoom", numberOfTeams);
  }
  function enterGameRoom() {
    socket.emit("enterGameRoom", { room: roomInput, uid: props.user.uid });
  }

  function joinTeam(team, name) {
    socket.emit("joinTeam", {
      joinedRoom: joinedRoom.id,
      team,
      name
    });
  }

  function startGame() {
    socket.emit("startGame", joinedRoom.id);
  }

  function sendNextQuestion() {
    socket.emit("sendNextQuestion", joinedRoom.id);
  }

  function deleteGameRoom() {
    socket.emit("deleteGameRoom", joinedRoom.id);
    setJoinedRoom({});
    setTeamOptions([]);
  }

  function sendAnswerToServer(answerNumber) {
    socket.emit("sendAnswer", {
      roomNumber: joinedRoom.id,
      team: teamColor,
      playersAnswer: answerNumber,
      correctAnswer: card.order
    });
  }

  function sendliveCardUpdates(answer, cardText) {
    socket.emit("updateCardOptions", {
      answer,
      cardText,
      roomNumber: joinedRoom.id,
      team: teamColor
    });
  }

  return (
    <div>
      <Router>
        <div>
          <Route
            exact
            path="/"
            render={routerProps => <Login {...routerProps} appProps={props} />}
          />
          <Route
            exact
            path="/host"
            render={routerProps => (
              <Host
                {...routerProps}
                tidbit={tidbit}
                startGame={startGame}
                gameMessage={gameMessage}
                joinedRoom={joinedRoom}
                makeGameRoom={makeGameRoom}
                sendNextQuestion={sendNextQuestion}
                deleteGameRoom={deleteGameRoom}
                teamOptions={teamOptions}
                getRoundScore={getRoundScore}
                appProps={props}
              />
            )}
          />
          <Route
            path="/join"
            render={routerProps => (
              <Player
                {...routerProps}
                appProps={props}
                card={card}
                getRoundScore={getRoundScore}
                sendliveCardUpdates={sendliveCardUpdates}
                teamColor={teamColor}
                liveCardUpdates={liveCardUpdates}
                hasAnswered={hasAnswered}
                hasSubmitted={hasSubmitted}
                setHasAnswered={setHasAnswered}
                setHasSubmitted={setHasSubmitted}
                gotNameAndInRoom={gotNameAndInRoom}
                setRoomInput={setRoomInput}
                teamOptions={teamOptions}
                gameMessage={gameMessage}
                roomInput={roomInput}
                enterGameRoom={enterGameRoom}
                joinTeam={joinTeam}
                sendAnswerToServer={sendAnswerToServer}
              />
            )}
          />
        </div>
      </Router>
      {props.user && <button onClick={props.signOut}>sign out</button>}
    </div>
  );
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(App);
