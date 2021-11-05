import {createContext, useContext} from 'react';
import { SCREEN_KEY } from '../constants';

interface NavigationContextInterface {
    currentScreen: keyof typeof SCREEN_KEY;
    navigateToScreen: (route: SCREEN_KEY) => void;
};

export const NavigationContext = createContext<NavigationContextInterface>({
    currentScreen: SCREEN_KEY.HOME,
    navigateToScreen: () => {}
});

export default function useNavigationContext(): NavigationContextInterface {
  return useContext(NavigationContext);
}
