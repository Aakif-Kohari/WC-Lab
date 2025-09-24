/*
Weather App

Advanced React
- Functional Component- Refs
- Use effects
- Hooks
- Flow architecture
- Model-View Controller framework
- Flux
- Bundling the application. Webpack
*/
import React, { useReducer } from "react";
import WeatherForm from "./components/WeatherForm";
import WeatherDisplay from "./components/WeatherDisplay";
import WeatherController from "./components/WeatherController";
import { weatherReducer, initialState } from "./store/weatherReducer";
import "./styles.css";


/* Functional Component:
  In React, a functional component is a JS function used as a react Component that returns JSX.
  It is conterpart of React Class but unlike how React Class uses render Method it returns the JSX. 
  
*/
function App() {

  /* MVC - Model-View-Controller
  MVC is a software design pattern that separates an application into three interconnected components 
  to separate data, UI and Logic .

Components:
1. Model
  Represents the data and business logic of the application.
  Responsible for fetching, updating, and validating data.
  In React, this could be your state or data stored in Redux/Context.

2. View
  Represents the UI (user interface).
  Displays data from the model to the user.
  In React, this is usually the JSX in components.

3. Controller
  Handles user interactions.
  Receives input from the View, processes it, and updates the Model.


In our Program, state of the reducer defined below acts as model
it stores current action and its payload

WeatherDisplay.js acts as View
it displays the fetched data on the App

WeatherController.js acts as Controller
it handles fetching and updating the data

*/
  const [state, dispatch] = useReducer(weatherReducer, initialState);
  
  /* Flux

  Flux is an architectural pattern used for managing state in ReactJS applications
  It was introduced by Facebook to address the complexity of state management in large-scale applications

  Components of Flux:
  - Dispatcher: manages all actions and dispatches them to the appropriate stores, Mediator between action and stores
  - Stores: Containers for application state and logic.
  - Actions: Objects that contain information about what happened in the application
  - Views: React components that listen to changes in the stores and re-render

  In this program,
  the above defined dispatch function of reducer is Dispatcher
  Store is the weatherReducer storing data in its state
  weatherReducer is also used an Action to Fetch Weather
  WeatherDisplay is the View used to display the weather 

  Flow: User Interaction → Dispatcher → Store → Action → View → User
  */

  /* Flow Architecture
  - React Flow Architecture describes how data and components interact in a React application
  - In react, data and components have a Unidirectional Data Flow
  - For example Data flows from granparent class to parent class then to child class

  - In our Program, 
  - Input Data (WeatherForm) →  weatherReducer → WeatherController (fetch) → Store update → WeatherDisplay (view)
  */
  return (
    <div className="app-container">
      <h1>🌤️ Weather App </h1>
      <WeatherForm dispatch={dispatch} />

      {/* Pass full state to Controller */}
      <WeatherController state={state} dispatch={dispatch} />
      <WeatherDisplay weather={state.weather} error={state.error} />
    </div>
  );
}

export default App;
