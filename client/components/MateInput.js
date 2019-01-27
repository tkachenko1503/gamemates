import React from "react";
import * as r from "ramda";
import Button from "./Button";
import "./MateInput.css";

const extractValue = r.pipe(
  r.trim,
  r.split("/"),
  r.last
);

const MateInput = ({ submit }) => {
  return (
    <section className="mate-input">
      <form
        className="mate-input__content"
        onSubmit={event => {
          event.preventDefault();
          const form = event.target;
          const input = form.elements.mateInput;
          const value = extractValue(input.value);

          if (value.length) {
            submit(value);
            input.value = "";
          }
        }}
      >
        <input
          type="text"
          name="mateInput"
          className="mate-input__editor"
          placeholder="Enter existing steam username"
          autoComplete="off"
        />

        <Button type="submit" className="mate-input__submit">
          +
        </Button>
      </form>
    </section>
  );
};

export default MateInput;
