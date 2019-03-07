import React from 'react';
import {createStackNavigator} from "../NativeBindings";
import SplashScreen from './SplashScreen';
import TestScreen from "./TestScreen";
import {screens as recommendationScreens} from "./flows/normal/recommendation/AllScreens";
import {screens as normalFlowScreens} from "./flows/normal/AllScreens";
import {screens as phoneNumberInputScreens} from "./flows/phone-number-input/AllScreens";
import PurposeScreen from "./PurposeScreen";


const allScreens = {
    [SplashScreen.URL]: {screen: SplashScreen},
    [PurposeScreen.URL]: {screen: PurposeScreen},
    [TestScreen.URL]: {screen: TestScreen},
};
[normalFlowScreens, phoneNumberInputScreens, recommendationScreens].forEach(y => {
    y.forEach(x => {
        allScreens[x.URL] = {screen: x};
    });

});
export const AppRouter = createStackNavigator(allScreens, {
    initialRouteName: SplashScreen.URL,
});
