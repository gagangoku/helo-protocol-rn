/** @format */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {APP_NAME, handleFirebaseMessage, IS_REACT_WEB, isFirebaseEnabled} from "./src/NativeBindings";

// Current main application
AppRegistry.registerComponent(APP_NAME, () => App);

// New task registration
if (isFirebaseEnabled()) {
    AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => handleFirebaseMessage);
    AppRegistry.registerHeadlessTask('RNFirebaseMessaging', () => handleFirebaseMessage);
}

if (IS_REACT_WEB) {
    AppRegistry.runApplication(APP_NAME, {
        rootTag: document.getElementById("root")
    });
}
