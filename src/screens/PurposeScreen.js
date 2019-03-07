import React from "react";
import {Dimensions, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import common from '../styles/common';
import {getContext, navigateTo, resetNavigation} from '../util/Util';
import {TEXT_COLOR} from "../Styles";
import WebviewScreen from "./flows/normal/WebviewScreen";
import SplashScreen from "./SplashScreen";


export default class PurposeScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    static URL = '/signup/purpose';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
    }

    onMessageFn = (m) => {
        const data = m.nativeEvent.data;
        console.log('window.postMessage: ', data);
        if (data === 'success') {
            // Goto splash screen after 2 seconds
            setTimeout(() => resetNavigation(this, SplashScreen.URL), 2000);
        }
    };
    signup = () => {
        navigateTo(this, WebviewScreen.URL, { url: SIGNUP_URL + '?phoneNumber=' + this.ctx.phoneNumber, onMessageFn: this.onMessageFn });
    };
    render() {
        const reviewDiv = (
            <View style={custom.buttonSection}>
                <TouchableHighlight underlayColor="white" onPress={this.signup}>
                    <View style={[custom.purposeButton]}>
                        <Text style={custom.purposeButtonText}>Review my current maid / cook / nanny</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );

        return (
            <View style={common.container}>
                <View style={custom.headingSection}>
                    <Text style={[custom.heading]}>What is your primary purpose ?</Text>
                </View>

                <View style={custom.feedbackSection}>
                    <View style={custom.buttonSection}>
                        <TouchableHighlight underlayColor="white" onPress={this.signup}>
                            <View style={[custom.purposeButton]}>
                                <Text style={custom.purposeButtonText}>Looking for a maid / cook / nanny etc.</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={custom.buttonSection}>
                        <TouchableHighlight underlayColor="white" onPress={this.signup}>
                            <View style={[custom.purposeButton]}>
                                <Text style={custom.purposeButtonText}>Other</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>

                <View style={custom.bottomSection}>
                    <Text> </Text>
                </View>
            </View>
        );
    }
}

const SIGNUP_URL = 'https://www.heloprotocol.in/customer/entry';
// const SIGNUP_URL = 'http://192.168.0.104:8092/customer/entry';
const dimWidth = Dimensions.get('window').width;
const dimHeight = Dimensions.get('window').height;
const btnPadding = 14;
const custom = StyleSheet.create({
    purposeSection: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        margin: dimWidth / 25,
        marginTop: dimHeight * 0.07,
        marginBottom: dimHeight * 0.06,
        backgroundColor: '#FFFFFF',
    },

    bottomSection: {
        flex: 4,
    },
    headingSection: {
        flex: 4,
        paddingTop: 40,
    },
    heading: {
        fontSize: 20,
        color: TEXT_COLOR,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    feedbackSection: {
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 6,
    },
    buttonSection: {
        flex: 1,
        margin: 0,
        padding: 0,
    },
    purposeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#999',
        borderWidth: 1,
        width: dimWidth * 0.8,
        height: 60,
    },
    purposeButtonText: {
        padding: btnPadding,
        color: '#4d4d4d',
        fontSize: 20,
    },
});
