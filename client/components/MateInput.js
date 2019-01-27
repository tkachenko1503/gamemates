import React from "react";
import * as r from "ramda";
import "./MateInput.css";

const MateInput = ({ submit }) => {
  return (
    <section className="mate-input">
      <form
        onSubmit={event => {
          event.preventDefault();
          const form = event.target;
          const input = form.elements.mateInput;
          const value = r.trim(input.value);

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
        />

        <button type="submit" className="mate-input__submit">
          Add
        </button>
      </form>
    </section>
  );
};

export default MateInput;
