import React from 'react';
import {Platform, StyleSheet, Text} from 'react-native';
import {AppRouter} from "./screens/AllScreens";
import {initializeGeocoder} from "./NativeBindings";
import {PLATFORM_ANDROID} from "./Constants";


// Initialize the geocoder
initializeGeocoder();

// BUG: https://github.com/facebook/react-native/issues/15114
// OnePlus 5 has an issue if Slate font is used (which is default i think). Oppo probably has similar issue
if (Platform.OS === PLATFORM_ANDROID) {
    const styles = StyleSheet.create({
        defaultFontFamily: {
            fontFamily: 'lucida grande',
        }
    });

    const oldRender = Text.render;
    if (!oldRender) {
        console.log('Did not find Text.render');
    } else {
        console.log('Found Text.render, overriding');
        Text.render = function (...args) {
            const origin = oldRender.call(this, ...args);
            return React.cloneElement(origin, {
                style: [styles.defaultFontFamily, origin.props.style]
            });
        };
    }
}

export default AppRouter;
