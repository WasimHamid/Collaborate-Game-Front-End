import React from "react";
import css from "./HostAnswer.module.css";
import RoomNumberBox from "../../Components/RoomNumberBox";

export default function({ joinedRoom }) {
  let correctOrder = joinedRoom.currentQuestion.sort(
    (a, b) => a.order - b.order
  );
  return (
    <div className={css.cardsWrapper}>
      {correctOrder.map((item, i) => (
        <div className={css.cards} key={i}>
          {item.text}
        </div>
      ))}

      <RoomNumberBox joinedRoom={joinedRoom.id} />
    </div>
  );
}
