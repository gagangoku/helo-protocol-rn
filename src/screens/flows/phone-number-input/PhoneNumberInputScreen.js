import React from "react";
import {Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View} from "react-native";
import common from '../../../styles/common.js';
import logo from '../../../images/logo.png';
import {getContext, navigateTo} from "../../../util/Util";
import {shallowCopyInto} from "../../../Constants";
import OtpInputScreen from "./OtpInputScreen";


export default class PhoneNumberInputScreen extends React.Component {
    static navigationOptions = {
        title: '',
    };
    static URL = '/signup/phone-number-input';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
        this.state = {
            phoneNumber: '',
        };
    }

    _onSubmit() {
        this.ctx.phoneNumberEntered = parseInt(this.state.phoneNumber);
        navigateTo(this, OtpInputScreen.URL);
    }

    render() {
        console.log('phonenumber:', this.state.phoneNumber, this.state.phoneNumber.length);
        let submitButton = this.state.phoneNumber.length === 10 ?
            (
                <TouchableHighlight underlayColor="white" style={{alignItems: 'center'}} onPress={() => this._onSubmit()}>
                    <View style={[common.button, custom.regButton]}>
                        <Text style={common.buttonText}>SUBMIT</Text>
                    </View>
                </TouchableHighlight>
            ) : (
                <View style={[common.buttonLight, custom.regButton]}>
                    <Text style={common.buttonTextDisabled}>SUBMIT</Text>
                </View>
            );
        return (
            <View style={common.container}>
                <ScrollView>
                    <View style={custom.regSection}>
                        <Image source={logo} style={custom.regImage}/>
                        <Text style={[common.heading, custom.regHeading]}>CREATE AN ACCOUNT</Text>
                        <Text style={[common.text, custom.regText]}>Enter your mobile number</Text>
                        <View style={custom.row}>
                            <View style={custom.inputWrap}>
                                <TextInput style={custom.countryCodeInput} value="+91" underlineColorAndroid='transparent' editable={false}/>
                            </View>
                            <View style={custom.inputWrap}>
                                <TextInput style={custom.phoneNumberInput} maxLength={10}
                                           onChangeText = {(text) => this.setState({phoneNumber: text})}
                                           underlineColorAndroid='transparent' placeholder="" keyboardType="numeric" autoFocus={true} />
                            </View>
                        </View>

                        {submitButton}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const dimHeight = Dimensions.get('window').height;
const registerImageDim = [180, 140];
const successImageDim = [100, 100];
const custom = StyleSheet.create({
    regSection: {
        alignItems: 'center'
    },
    successSection: {
        alignItems: 'center'
    },
    regImage: {
        alignSelf: 'center',
        width: registerImageDim[0],
        height: registerImageDim[1],
        marginTop: dimHeight * 0.02,
    },
    successImage: {
        alignSelf: 'center',
        width: successImageDim[0],
        height: successImageDim[1],
        marginTop: dimHeight * 0.125,
    },

    regHeading: {
        marginTop: dimHeight * 0.04
    },
    sucHeading: {
        marginTop: dimHeight * 0.04
    },
    regText: {
        marginTop: dimHeight * 0.02
    },
    sucText: {
        marginTop: dimHeight * 0.06
    },
    row: {
        flexDirection: "row",
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    inputWrap: {
        marginBottom: 10,
        height: 40,
    },
    countryCodeInput: {
        fontSize: 18,
        marginRight: 3,
        color: "black",
        borderBottomWidth: 2,
        borderBottomColor: "#979797",
        width: 50,
        padding: 7,
        paddingBottom: 1
    },
    phoneNumberInput: {
        fontSize: 18,
        color: "black",
        borderBottomWidth: 2,
        borderBottomColor: "#979797",
        width: 120,
        padding: 7,
        paddingBottom: 1
    },
    otp: {
        fontSize: 18,
        marginRight: 3,
        color: "#979797",
        borderBottomWidth: 2,
        borderBottomColor: "#979797",
        width: 25,
        padding: 7,
        paddingBottom: 1
    },
    sucProfile: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontSize: 15,
        marginTop: dimHeight * 0.03,
    },
    regButton: {
        width: 150
    },
    sucButton: {
        width: 170,
        marginTop: dimHeight * 0.07
    }
});
