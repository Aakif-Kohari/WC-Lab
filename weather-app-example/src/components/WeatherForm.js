import React, { useRef } from "react";

function WeatherForm({ dispatch }) {
  /* Refs
    -It stands for Reference
    -Refs are used to reference DOM nodes or React components directly
    -allow us to interact with elements outside typical rendering workflow
    -useRef lets us directly access DOM elements
    -without triggering re-renders.
    -In this example, We'll use it to grab the city input field.
  */
  const cityRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const city = cityRef.current.value.trim();
    if (city) {
      dispatch({ type: "FETCH_WEATHER", payload: city });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={cityRef} type="text" placeholder="Enter city" />
      <button type="submit">Get Weather</button>
    </form>
  );
}

export default WeatherForm;

