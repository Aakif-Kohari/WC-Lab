/* MVC - Controller
Handles fetching logic, now with FAKE API
*/
import { useEffect } from "react";
import { fetchFakeWeather } from "../fakeWeatherAPI";

function WeatherController({ state, dispatch }) {
  /* Hooks
  -Hooks are functions that let you "hook into" React state and lifecycle features
  -Unlike how we use lifecycle methods in React Class Component
  -We use different Hooks to access state and lifecycle features
  
  -useEffect is a hook that triggers a function when any of its dependencies changes
  - Syntax: useEffect( function, [array of dependencies])
  */
 useEffect(() => {
   if (!state.city) return;

    async function fetchWeather() {
      try {
        const data = await fetchFakeWeather(state.city);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    }

    fetchWeather();
  }, [state.city, dispatch]);
  // Executes when state.city changes
  
  return null; // Controller has no UI
}

export default WeatherController;

