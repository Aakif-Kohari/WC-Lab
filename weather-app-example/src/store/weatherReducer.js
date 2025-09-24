/* Flux Store
In Flux architecture, a Store holds state
and listens for actions dispatched.
Here, we implement it with useReducer.
*/
export const initialState = {
  city: null,
  weather: null,
  error: null,
};

export function weatherReducer(state, action) {
  switch (action.type) {
    case "FETCH_WEATHER":
      return { ...state, city: action.payload, error: null, weather: null };
    case "FETCH_SUCCESS":
      return { ...state, weather: action.payload, error: null };
    case "FETCH_ERROR":
      return { ...state, error: action.payload, weather: null };
    default:
      return state;
  }
}

