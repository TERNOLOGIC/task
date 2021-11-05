import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { useCallback, useState } from "react";
import { SCREEN_KEY } from "./constants";
import useNavigationContext from "./hooks/navigationContext";
import { SignUp, Home, SignIn } from "./pages";
import { getLocalStorageItem, deleteLocalStorageItem } from "./utils";

function App() {
  const {currentScreen, navigateToScreen} = useNavigationContext();

  const navCB = useCallback((screen: SCREEN_KEY) => {
      navigateToScreen(screen)
  }, [])

  const navToSignIn = useCallback(() => { navCB(SCREEN_KEY.SIGN_IN) },[]);

  // check none auth user.
  useEffect(() => {
    const userData = getLocalStorageItem("token");
    if(!userData || !Object.keys(userData).length) {
      navToSignIn()
    }
  }, [])
  
  switch (currentScreen) {
    case SCREEN_KEY.HOME:
      return <Home />
    case SCREEN_KEY.SIGN_UP:
      return <SignUp />
    default:
      return <SignIn />
  }
}

export default App;
