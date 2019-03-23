import React from 'react';
import {
    AsyncStorage,
    Dimensions,
    Image,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import {
    checkForCodepushUpdateAsync,
    codepushNotifyAppReady,
    IndicatorViewPager,
    initBranch,
    initializeFirebase,
    isFirebaseEnabled,
    PagerDotIndicator,
    subscribeToTopic
} from '../NativeBindings';
import common from '../styles/common.js';
import splashIcon1 from '../images/splash/1stscreen.png';
import splashIcon2 from '../images/splash/2ndscreen.png';
import splashIcon3 from '../images/splash/3rdscreen.png';
import {APP_VERSION, PHONE_NUMBER_KEY, PLATFORM_ANDROID, SPLASH_SCREEN_TIME_MS} from "../Constants";
import {
    getContext,
    promiseWithTimeout,
    requestCallPhonePermission,
    requestLocationPermission,
    resetNavigation
} from "../util/Util";
import {TEXT_COLOR} from "../Styles";
import PurposeScreen from "./PurposeScreen";
import PhoneNumberInputScreen from "./flows/phone-number-input/PhoneNumberInputScreen";
import {getCustomerProfile} from "../util/Api";
import branch from "react-native-branch";
import CustomerProfileScreen from "./flows/normal/CustomerProfileScreen";


// Shows about Helo Protocol for a couple of seconds before deciding what to show next - profile or phone input
export default class SplashScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    static URL = '/splash';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
        this.ctx.customerRequirement = {};
        this.state = {
            initialized: false,
        };
    }

    async componentDidMount() {
        console.log('in SplashScreen componentDidMount: ', Platform.OS);
        const startTimeMs = new Date().getTime();

        if (this.state.initialized) {
            return;
        }

        // Initialize branch sdk - kick it off async
        console.log('Initializing branch sdk');
        const branchPromise = new Promise(resolve => branch.subscribe(({error, params}) => this.branchSubscribeCb({error, params}, resolve)));

        // Notify to codepush that app is ready.
        codepushNotifyAppReady();

        try {
            const initialUrl = await Linking.getInitialURL();
            console.log('Initial url is: ', initialUrl);
        } catch (err) {
            console.log('An error occurred in Linking.getInitialURL:', err);
        }

        // Get firebase permisison
        if (isFirebaseEnabled()) {
            await initializeFirebase();
        }


        // Get the saved phone number
        let p = await AsyncStorage.getItem(PHONE_NUMBER_KEY);
        console.log('phoneNumber from AsyncStorage: ', p);
        if (p) {
            // Subscribe to topic
            subscribeToTopic(p);

            // Identify the user in branch. TODO: Uncomment
            // setIdentity(p);

            this.ctx.phoneNumber = parseInt(p);
        }


        // Request location permission
        if (Platform.OS === PLATFORM_ANDROID) {
            await requestLocationPermission('Requesting location permission', 'App needs access to your location for service');
            await requestCallPhonePermission('Requesting call phone permission', 'Makes it easy to call the cook directly');
        }

        // Check for a codepush update. It's non-blocking, updates in the background.
        checkForCodepushUpdateAsync();

        // Get the customer profile
        if (p !== null && p > 0) {
            this.ctx.customerProfile = await getCustomerProfile(p);
        }

        const elapsedMs = new Date().getTime() - startTimeMs;
        console.log('Time taken in initialization: ', elapsedMs);

        // Spend initial 2-3 seconds in splash, to show the customer what we stand for
        const waitTimeMs = elapsedMs >= SPLASH_SCREEN_TIME_MS ? 1 : SPLASH_SCREEN_TIME_MS - elapsedMs;
        await new Promise(resolve => setTimeout(resolve, waitTimeMs));
        console.log('Slept for ', waitTimeMs, ' ms');

        try {
            // See if app was triggered by a deep-link click. If so, handle it here.
            const {installParams, params} = await promiseWithTimeout(branchPromise, 10);
            console.log('Got branch params');
            const customObject = params['custom_object'];
            if (customObject && customObject.action) {
                this.ctx.branchParams = customObject;
                console.log('Handle deeplink: ', customObject);
            }
            // TODO: Deep linking is too painful, its causing more bugs. Defer for now
            // if (customObject.action === 'write-recommendation') {
            //     if (this.ctx.customerProfile && this.ctx.customerProfile.supplies && this.ctx.customerProfile.supplies.length > 0) {
            //         navigateTo(this, QualitiesScreen.URL);
            //         return;
            //     } else {
            //         navigateTo(this, WelcomeScreen.URL);
            //         return;
            //     }
            // }
        } catch (e) {
            console.log('Error in getting branch params: ', e);
        }

        this.setState({initialized: true});
        if (p !== null && p > 0) {
            resetNavigation(this, this.ctx.customerProfile.customer ? CustomerProfileScreen.URL : PurposeScreen.URL);
        }

        console.log('Total time taken in Splash: ', new Date().getTime() - startTimeMs);
    }

    // NOTE: There is a bug i'm having to work around. branch.getFirstReferringParams() & branch.getLatestReferringParams() are not returning the correct params
    branchSubscribeCb = async ({ error, params }, cbFn) => {
        console.log('branch params: ', params, error);
        let numTimesAppOpen = await AsyncStorage.getItem(NUM_TIMES_APP_OPEN);
        numTimesAppOpen = numTimesAppOpen === null ? 0 : parseInt(numTimesAppOpen);
        const firstSubscribeCall = await AsyncStorage.getItem(FIRST_SUBSCRIBE_CALL);

        await AsyncStorage.setItem(NUM_TIMES_APP_OPEN, '' + (numTimesAppOpen+1));
        await AsyncStorage.setItem(FIRST_SUBSCRIBE_CALL, 'nope');

        if (numTimesAppOpen === 0 && firstSubscribeCall === null) {
            // Save the app install params to local storage
            await AsyncStorage.setItem(APP_INSTALL_PARAMS, JSON.stringify(params));
        }
        const installParams = JSON.parse(await AsyncStorage.getItem(APP_INSTALL_PARAMS));
        cbFn({installParams, params});
    };

    async _register() {
        resetNavigation(this, PhoneNumberInputScreen.URL);
    }
    _searchACook() {
        this._register();
    }

    render() {
        console.log('In render');
        const screen1 = (
            <View>
                <View style={custom.imageSection}>
                    <Image source={splashIcon1} style={custom.pagerImage}/>
                </View>
                <View style={custom.textSection}>
                    <View style={custom.headingSection}>
                        <Text style={[common.heading, common.marginLR4]}>Helo Protocol</Text>
                        <Text style={custom.appVersionSection}>Version {APP_VERSION}</Text>
                    </View>

                    <View style={custom.descSection}>
                        <Text style={[common.text, common.marginLR4]}>Your one stop solution to finding the blue collar workforce (maids, cooks, nannies, car washers etc.) of your choice, in 3 simple steps! </Text>
                        <View style={custom.splashStepsContainer}>
                            <View style={custom.splashSteps}>
                                <Text style={custom.stepsRoundBorderText}>1</Text>
                                <Text style={[common.text, common.bold]}>Choose</Text>
                            </View>

                            <View style={custom.splashSteps}>
                                <Text style={custom.stepsRoundBorderText}>2</Text>
                                <Text style={[common.text, common.bold]}>Schedule</Text>
                            </View>

                            <View style={custom.splashSteps}>
                                <Text style={custom.stepsRoundBorderText}>3</Text>
                                <Text style={[common.text, common.bold]}>Enjoy</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );

        if (!this.state.initialized) {
            return (
                <View style={common.container}>
                    <View style={{flex: 10}}>
                        <IndicatorViewPager style={{flex: 1}}>
                            {screen1}
                        </IndicatorViewPager>
                    </View>
                </View>
            );
        }

        return (
            <View style={common.container}>
                <View style={{flex: 10}}>
                    <IndicatorViewPager style={{flex: 1}} indicator={this._renderDotIndicator()}>
                        {screen1}
                        <View>
                            <View style={custom.imageSection}>
                                <Image source={splashIcon2} style={custom.pagerImage}/>
                            </View>
                            <View style={custom.textSection}>
                                <View style={custom.headingSection}>
                                    <Text style={[common.heading, common.marginLR4]}>Verified workforce at {'\n'} your
                                        Doorstep</Text>
                                </View>
                                <View style={custom.descSection}>
                                    <Text style={[common.text, common.marginLR4]}>
                                        Helo Protocol helps you view and hire professional, pre-screened & background checked
                                        blue collar workforce (maids, nannies, cooks, car washers, etc.). See them online before hiring them.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <View style={custom.imageSection}>
                                <Image source={splashIcon3} style={custom.pagerImage}/>
                            </View>
                            <View style={custom.textSection}>
                                <View style={custom.headingSection}>
                                    <Text style={[common.heading, common.marginLR4]}>Maid performance, Reviews and More</Text>
                                </View>
                                <View style={custom.descSection}>
                                    <Text style={[common.text, common.marginLR4]}>Rate and refer your maid, book online all from the comfort of your phone !</Text>
                                </View>
                            </View>
                        </View>
                    </IndicatorViewPager>
                </View>

                <View style={custom.pagerFooter}>
                    <TouchableHighlight style={custom.pagerFooterButtonContainer} underlayColor="white"
                                        onPress={() => this._register()}>
                        <View style={[common.buttonLight, common.marginLR2]}>
                            <Text style={common.buttonTextBlack}>REGISTER</Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight style={custom.pagerFooterButtonContainer} underlayColor="white"
                                        onPress={() => this._searchACook()}>
                        <View style={[common.button, common.marginLR2]}>
                            <Text style={common.buttonText}>SEARCH</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    _renderDotIndicator() {
        return <PagerDotIndicator pageCount={3} dotStyle={custom.dotStyle} selectedDotStyle={custom.selectedDotStyle} />;
    }
}

export const NUM_TIMES_APP_OPEN = 'NUM_TIMES_APP_OPEN';
export const FIRST_SUBSCRIBE_CALL = 'FIRST_SUBSCRIBE_CALL';
export const APP_INSTALL_PARAMS = 'APP_INSTALL_PARAMS';

const dimHeight = Dimensions.get('window').height;
const pagerImageDim = 180;
const custom = StyleSheet.create({
    offerText: {
        fontSize: 14,
        margin: 5,
        textAlign: 'center',
    },
    pagerImage: {
        width: pagerImageDim,
        height: pagerImageDim,
    },
    imageSection: {
        alignItems: 'center',
        marginTop: dimHeight / 14,
        flex: 1,
        justifyContent: 'center',
    },
    textSection: {
        alignItems: 'center',
        margin: 10,
        flex: 1,
        flexDirection: 'column',
    },
    appVersionSection: {
        fontSize: 11,
    },
    headingSection: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    descSection: {
        alignItems: 'center',
        flex: 2,
        paddingTop: 10,
    },

    pagerFooter: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    pagerFooterButtonContainer: {
        flex: 1,
    },

    splashStepsContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 10,
        margin: 15,
    },
    splashSteps: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    stepsRoundBorderText: {
        height: 26,
        width: 26,
        borderRadius: 13,
        borderWidth: 1,
        marginRight: 5,
        borderColor: '#4d4d4d',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: TEXT_COLOR,
    },

    dotStyle: {
        backgroundColor: 'white',
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
    },
    selectedDotStyle: {
        backgroundColor: 'black',
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
    },
});
