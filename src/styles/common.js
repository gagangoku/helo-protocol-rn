import {Dimensions, Platform, StyleSheet} from 'react-native';
import {BUTTON_BACKGROUND_COLOR, TEXT_COLOR} from '../Styles';
import React from "react";
import {PLATFORM_IOS} from "../Constants";


const dimWidth = Dimensions.get('window').width;
const dimHeight = Dimensions.get('window').height;
const headingSize = 18;
const textSize = 16;
const buttonPad = 14;
const pagerImageDim = 180;
const marginArr = [10, 20, 40, 60];

export default StyleSheet.create({
    bold: {
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
    },
    containerCenter: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    heading: {
        fontSize: headingSize,
        color: TEXT_COLOR,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    text: {
        fontSize: textSize,
        color: TEXT_COLOR,
        textAlign: 'center',
    },
    button: {
        // width: '100%',
        alignItems: 'center',
        backgroundColor: BUTTON_BACKGROUND_COLOR,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: BUTTON_BACKGROUND_COLOR,
    },
    buttonLight: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: BUTTON_BACKGROUND_COLOR,
    },
    buttonText: {
        padding: buttonPad,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonTextBlack: {
        padding: buttonPad,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonTextDisabled: {
        padding: buttonPad,
        color: 'gray',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    marginTop1: {
        marginTop: marginArr[0],
    },
    marginTop2: {
        marginTop: marginArr[1],
    },
    marginTop3: {
        marginTop: marginArr[2],
    },
    marginTop4: {
        marginTop: marginArr[3],
    },
    marginLR1: {
        marginLeft: marginArr[0] / 2, marginRight: marginArr[0] / 2,
    },
    marginLR2: {
        marginLeft: marginArr[1] / 2, marginRight: marginArr[1] / 2,
    },
    marginLR3: {
        marginLeft: marginArr[2] / 2, marginRight: marginArr[2] / 2,
    },
    marginLR4: {
        marginLeft: marginArr[3] / 2, marginRight: marginArr[3] / 2,
    },


    fabBottomContainer: {
        position: 'absolute',
        bottom: '3%',
        height: Platform.OS === PLATFORM_IOS ? 50 : 40,
        width: '100%',

        zIndex: 10,
        elevation: 4,

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        height: Platform.OS === PLATFORM_IOS ? 50 : 40,
        // width: '100%',

        zIndex: 10,
        elevation: 4,

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
    },
    justifyAlignCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
});
