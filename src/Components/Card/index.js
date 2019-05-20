import React from "react";
import css from "./card.module.css";
import LeftArrow from "../LeftArrow";
import RightArrow from "../RightArrow";

const selectionOptions = [1, 2, 3, 4];

export default function({
  card,
  liveCardUpdates,
  sendliveCardUpdates,
  isSubmitAllowed,
  submitTeamAnswer,
  answerFeedback,
  showPoints
}) {
  return (
    <div className={css.cardWrapper}>
      <h1 className={css.cardText}>{card.text}</h1>
      <div className={css.selectionWrapper}>
        {selectionOptions.map((item, i) => (
          <>
            {showPoints && <div>{item.points}</div>}
            <button
              style={{ backgroundColor: answerFeedback[i].color }}
              key={i}
              className={css.selection}
              onClick={() => {
                sendliveCardUpdates(item, card);
              }}
            >
              {liveCardUpdates[item].map(item => item.cardText)}
            </button>
          </>
        ))}
      </div>
      <br />
      <div className={css.instructionsWrapper}>
        <div>
          {LeftArrow}
          {card.gotCard && card.instruction[0]}
        </div>
        <div>
          {card.gotCard && card.instruction[1]} {RightArrow}
        </div>
      </div>
      {isSubmitAllowed && (
        <button
          className={css.submit}
          onClick={() => {
            submitTeamAnswer();
          }}
        >
          Submit
        </button>
      )}
    </div>
  );
}
