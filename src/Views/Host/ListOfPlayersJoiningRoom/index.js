import React from "react";

// import TeamBoxes from "../../../Components/HostTeamJoiningBoxes";
import CorrelateLogo from "../../../Components/Branding";
import css from "./ListOfPlayersJoiningRoom.module.css";

export default function({
    teamOptions,
    joinedRoom,
    deleteTeamMember,
    deleteGameRoom,
    startGame
}) {
    return (
        <main>
            <CorrelateLogo />
            <div className={css.roomCodeContainer}>
                <p className={css.p1}>Room Code:</p>
                <p className={css.p2}>{joinedRoom.id}</p>
            </div>
            <div className={css.buttonContainer}>
                <button className={css.startGame} onClick={startGame}>
                    Start Game
                </button>
                <ul>
                    {joinedRoom.players.map(({ name }) => (
                        <li>{name}</li>
                    ))}
                </ul>
                <button className={css.deleteRoom} onClick={deleteGameRoom}>
                    Delete Room
                </button>
            </div>
        </main>
    );
}