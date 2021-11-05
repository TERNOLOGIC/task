import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SCREEN_KEY } from './constants';
import { NavigationContext } from './hooks/navigationContext';
import reportWebVitals from './reportWebVitals';

const NavigationContextProviderApp = () => {
  const [screen, setScreen] = useState(SCREEN_KEY.HOME)
  return <NavigationContext.Provider value={{
    currentScreen: screen,
    navigateToScreen: setScreen
  }}>
    <App />
  </NavigationContext.Provider>
}

ReactDOM.render(
  <React.StrictMode>
    <NavigationContextProviderApp />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
