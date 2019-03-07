import React from "react";
import {PHONE_NUMBER_KEY} from "../../../Constants";
import {
    AsyncStorage,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View
} from "react-native";
import {getContext, resetNavigation} from "../../../util/Util";
import xrange from 'xrange';
import common from '../../../styles/common.js';
import logo from '../../../images/logo.png';
import {isFirebaseEnabled, subscribeToTopic} from "../../../NativeBindings";
import PurposeScreen from "../../PurposeScreen";
import {getCustomerProfile, getOtp} from "../../../util/Api";
import CustomerProfileScreen from "../normal/CustomerProfileScreen";


export default class OtpInputScreen extends React.Component {
    static navigationOptions = {
        title: '',
    };
    static URL = '/signup/otp-input';

    constructor(props) {
        super(props);
        this.refss = [1, 2, 3, 4, 5, 6];
        this.ctx = getContext(props);
        this.state = {
            values: ['', '', '', '', '', ''],
            otpReceived: '',
            mismatch: false,
        };
    }

    async componentDidMount() {
        const otp = await getOtp(this.ctx.phoneNumberEntered);
        this.setState({otpReceived: otp});
    }

    submitFn = async () => {
        const phoneNumber = this.ctx.phoneNumberEntered;
        if (this.state.otpReceived === this.state.values.join('')) {
            this.ctx.phoneNumber = parseInt(phoneNumber);

            // Subscribe to topic
            if (isFirebaseEnabled()) {
                subscribeToTopic(phoneNumber);
            }

            await AsyncStorage.setItem(PHONE_NUMBER_KEY, '' + phoneNumber);
            console.log('saved phone number: ', phoneNumber);

            this.ctx.customerProfile = await getCustomerProfile(phoneNumber);
            resetNavigation(this, this.ctx.customerProfile.customer ? CustomerProfileScreen.URL : PurposeScreen.URL);
        } else {
            this.setState({mismatch: true});
        }
    };

    _key = (i) => {
        return (e) => {
            console.log('i:', i, 'key:', e.nativeEvent.key);
            if (e.nativeEvent.key === 'Backspace') {
                let v = this.state.values.slice();
                v[i] = '';
                this.setState({ values: v});
                if (i > 0) {
                    this.refss[i - 1].focus();
                }
            }
        };
    };
    _onChange = (i) => (val) => {
        console.log('i:', i, 'val:', val);
        let oldVal = this.state.values[i];
        let v = this.state.values.slice();
        v[i] = val;
        this.setState({ values: v});

        if (val === '' && oldVal !== '') {
            if (i > 0) {
                this.refss[i - 1].focus();
            }
        }
        if (val !== '') {
            if (i < 5) {
                this.refss[i + 1].focus();
            }
        }
    };

    render() {
        if (this.state.otpReceived === '') {
            return (
                <View style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
                    <Text>Loading ...</Text>
                </View>
            );
        }
        console.log('values:', this.state.values);

        let inputs = xrange(0, 6).toArray().map((i) => {
            return (
                <View style={custom.inputWrap} key={i}>
                    <TextInput style={custom.otp} underlineColorAndroid='transparent' key={i} maxLength={1} keyboardType={'numeric'} autoFocus={i === 0}
                               ref={(input) => { this.refss[i] = input; }} onChangeText={this._onChange(i)} onKeyPress={this._key(i)}/>
                </View>
            );
        });
        let verifyButton = this.state.otpReceived === this.state.values.join('') ?
            (
                <TouchableHighlight underlayColor="white" style={{alignItems: 'center'}} onPress={() => this.submitFn()}>
                    <View style={[common.button, custom.regButton]}>
                        <Text style={common.buttonText}>VERIFY</Text>
                    </View>
                </TouchableHighlight>
            ) : (
                <View style={[common.buttonLight, custom.regButton]}>
                    <Text style={common.buttonTextDisabled}>VERIFY</Text>
                </View>
            );

        return (
            <View style={common.container}>
                <ScrollView>
                    <View style={custom.regSection}>
                        <Image source={logo} style={custom.regImage}/>
                        <Text style={[common.heading, custom.regHeading]}>VERIFY YOUR ACCOUNT</Text>
                        <Text style={[common.text, custom.regText]}>Enter the 6 digit OTP</Text>

                        <View style={custom.row}>
                            {inputs}
                        </View>

                        {verifyButton}
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
    otp: {
        fontSize: 18,
        marginRight: 3,
        color: "black",
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
