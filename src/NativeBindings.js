import {APP_VERSION, CODEPUSH_DEPLOYMENT_KEY, GOOGLE_MAPS_API_KEY, PLATFORM_IOS} from "./Constants";
import semver from "semver";
import codePush from "react-native-code-push";
import branch from "react-native-branch";
import {Image, Platform, Share, TouchableOpacity, View} from "react-native";
import shareIcon from "./images/share.png";
import feedbackIcon from "./images/feedback.png";
import React from "react";
import firebase, {Notification, RemoteMessage} from "react-native-firebase";
import Toast from "react-native-simple-toast";
import Geocoder from "react-native-geocoding";
import {name as appName} from "./app";
import StarRating from "react-native-star-rating";
import {Switch} from "react-native-switch";
import UserAvatar from "react-native-user-avatar";
import {createStackNavigator, NavigationActions, StackActions} from "react-navigation";
import {IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import {getContext, getTopic, navigateTo} from "./util/Util";
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView from 'react-native-maps';
import QualitiesScreen from "./screens/flows/normal/recommendation/QualitiesScreen";


// Native bindings for geocoder, codepush, firebase, branch etc.
// Put all external bindings here so that when running the code for react-native-web, it's easy to overwrite the
// native functionality in one place.
export const APP_NAME = Platform.OS === PLATFORM_IOS ? 'customer_app_rn' : appName;
export const IS_REACT_WEB = false;


// GEOCODER
export const initializeGeocoder = function () {
    Geocoder.init(GOOGLE_MAPS_API_KEY);
};


// CODEPUSH
const handleUpdate = function (update) {
    const currentVersion = APP_VERSION;
    if (update != null) {
        delete update['deploymentKey'];                         // Secret - should not be exposed
        console.log('Code push remote package: ', update);

        let desc = update['description'];
        let newVersion;
        if (desc.startsWith('version ')) {
            newVersion = desc.split(' ')[1];
            console.log('newVersion: ', newVersion);
        } else {
            console.log('Could not infer version number from description. Ignoring codepush');
            return;
        }

        if (currentVersion === newVersion) {
            console.log('Exact same version. Ignoring codepush');
            return;
        }
        let curSemVersion = semver(currentVersion);
        let newSemVersion = semver(newVersion);
        console.log('curSemVersion:', curSemVersion);
        console.log('newSemVersion:', newSemVersion);
        if (semver.major(curSemVersion) !== semver.major(newSemVersion)) {
            console.log('Major version mismatch. Ignoring codepush');
            return;
        }
        if (semver.lt(newSemVersion, curSemVersion)) {
            console.log('Older version. Ignoring codepush');
            return;
        }

        Toast.show('There\'s a hotfix available, installing', Toast.LONG);
        setTimeout(() => {
            codePush.sync({
                updateDialog: !desc.toLowerCase().includes('force-update-do-not-ask'),
                installMode: codePush.InstallMode.IMMEDIATE,
            });
        }, 200);
    } else {
        console.log('Code push remote package: null');
    }
};
export const checkForCodepushUpdateAsync = () => {
    console.log('current app version: ', APP_VERSION);
    console.log('Checking for codepush update !');

    // Check for Codepush app update.
    codePush.checkForUpdate(CODEPUSH_DEPLOYMENT_KEY, (update) => {console.log('handleBinaryVersionMismatchCallback: ', update)})
        .then((update) => {
            handleUpdate(update);
        })
        .catch((reason) => {
            console.log('Codepush update failed: ', reason);
        });
};

// Notify to codepush that current update version was successful.
export function codepushNotifyAppReady() {
    console.log('codePush.notifyAppReady:');
    codePush.notifyAppReady();
}


// BRANCH SDK
export const setIdentity = function (p) {
    branch.setIdentity('' + p);
};

// Create a referral link
async function createReferralLink(customMetadata, title, desc, desktopUrl) {
    let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
        locallyIndex: true,
        title: title,
        contentDescription: desc,
        contentMetadata: {
            customMetadata: customMetadata,
        }
    });
    let linkProperties = {
        feature: 'share',
        channel: 'whatsapp'
    };
    let controlParams = {
        $desktop_url: desktopUrl,
    };
    let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams);
    console.log('branch share link: ', url);
    return url;
}

// Helper method to refer a cook
async function referCook(customerId, cookId) {
    return await createReferralLink(
        { referrerCustomerId: customerId, referrerOffer: '10PERCENT', referrerAction: 'share-cook-' + cookId },
        'Book your cook on Homedruid',
        'Try it out and earn 10% off on the first month subscription.',
        'https://www.homedruid.com/?referral-bonus');
}

export function shareAndRecommendationIcons(navigation) {
    const shareIcon = shareSupplyIcon(navigation);
    const recoIcon = writeRecommendation(navigation);
    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {shareIcon}
            <View style={{ width: 10 }} />
            {recoIcon}
        </View>
    );
}

// Share cook widget
export function shareSupplyIcon(navigation) {
    const props = {navigation: navigation};
    const ctx = getContext(props);
    const customerProfile = ctx.customerProfile;

    const customerId = customerProfile['customer']['person']['id'];
    const cookProfile = customerProfile['supplies'][0];

    const _onPress = async () => {
        let nowMs = new Date().getTime();
        let url = await referCook(customerId, cookProfile['person']['id']);
        console.log('Time taken in getting Branch url: ', (new Date().getTime() - nowMs), url);

        Share.share({
            message: 'I booked my cook (' + cookProfile['person']['name'] + ') on Homedruid. Try it out and earn 10% off on the first month subscription: ' + url,
            title: 'Book your cook on Homedruid'
        }, {
            // Android only:
            dialogTitle: 'Share your druid',
            // iOS only:
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'
            ]
        });
    };
    return (
        <TouchableOpacity style={{}} onPress={ () => _onPress() }>
            <Image style={{ height: 20, width: 20, opacity: 0.5, marginRight: 10 }} source={shareIcon} />
        </TouchableOpacity>
    );
}

// Write a recommendation widget
export function writeRecommendation(navigation) {
    const props = {navigation: navigation};
    const ctx = getContext(props);
    const obj = {props: props, ctx: ctx};
    const customerProfile = ctx.customerProfile;

    const customerId = customerProfile['customer']['person']['id'];
    const customerName = customerProfile['customer']['person']['name'];
    const cookProfile = customerProfile['supplies'][0];

    const _onPress = () => {
        ctx.customerRequirement.cookFeedback = {
            customerId: customerId,
            customerName: customerName,
            customerPhone: ctx.customerRequirement.phoneNumber,
            supplyId: cookProfile.person.id,
            supplyName: cookProfile.person.name,
            supplyPhone: cookProfile.person.phone.phoneNumber,
            numYearsWorked: '',
            startHour: '',
            durationHours: '',
        };
        navigateTo(obj, QualitiesScreen.URL);
    };
    return (
        <TouchableOpacity style={{}} onPress={ () => _onPress() }>
            <Image style={{ height: 30, width: 30, opacity: 0.5, marginRight: 20 }} source={feedbackIcon} />
        </TouchableOpacity>
    );
}


// Open the share sheet - generates a link internally
async function shareReferralLink(customMetadata, title, desc, desktopUrl) {
    let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
        locallyIndex: true,
        title: title,
        contentDescription: desc,
        contentMetadata: {
            customMetadata: customMetadata,
        }
    });
    let shareOptions = {
        messageHeader: title,
        messageBody: desc,
    };
    let linkProperties = {
        feature: 'share',
        channel: 'whatsapp'
    };
    let controlParams = {
        $desktop_url: desktopUrl,
    };
    let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams);
    let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams);
    console.log('branch channel, completed, error:', channel, completed, error);
}

// Helper method to refer to your friends
export async function referFriends(customerId) {
    console.log('referFriends: ', customerId);
    await shareReferralLink(
        { referrerCustomerId: customerId, referrerOffer: '10PERCENT', referrerAction: 'refer-friends' },
        'Find the best chefs near you with Homedruid',
        'Install with the link below and get 10% off on the first month subscription.',
        'https://www.homedruid.com/?referral-bonus');
}



// FIREBASE
export const isFirebaseEnabled = () => true;
export const subscribeToTopic = function (p) {
    firebase.messaging().subscribeToTopic(getTopic(p));
};

// Initialize firebase
export const initializeFirebase = async () => {
    try {
        const perm = await firebase.messaging().requestPermission();
        if (perm) {
            // User has authorised
            console.log('Firebase allowed');

            firebase.messaging().onMessage(handleFirebaseMessage);

            firebase.notifications().onNotificationDisplayed(handleFirebaseNotificationDisplayed);
            firebase.notifications().onNotification(handleFirebaseNewNotification);
            firebase.notifications().onNotificationOpened(handleFirebaseNotificationOpened);
        } else {
            // User has rejected permissions
            console.log('Firebase permission rejected: ');
        }
    } catch (e) {
        // User has rejected permissions
        console.log('Firebase rejected: ', e);
    }
};

export const handleFirebaseNewNotification = (notification: Notification) => {
    // Process your notification as required
    // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    console.log('firebase new notification: ', notification);
    Toast.show('firebase new notification: ' + notification['body'], Toast.LONG);
};

export const handleFirebaseNotificationDisplayed = (notification: Notification) => {
    // Process your notification as required
    console.log('firebase notification displayed: ', notification);
    Toast.show('firebase notification displayed: ' + notification['body'], Toast.LONG);
};

export const handleFirebaseNotificationOpened = (notification: Notification) => {
    // Process your notification as required
    // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    console.log('firebase notification opened: ', notification);
    if ('notification' in notification) {
        notification = notification['notification'];
    }
    Toast.show('firebase notification opened: ' + notification['data']['titleText'], Toast.LONG);
};

export const handleFirebaseMessage = async (message: RemoteMessage) => {
    // handle your message
    console.log('firebase message: ', message);
    Toast.show('firebase message: ' + message.data['titleText'], Toast.LONG);
    return Promise.resolve();
};


// CHECKBOX
export function checkBox(valueFn, onChangeFn) {
    return (
        <Switch value={valueFn()} onValueChange={onChangeFn}
                activeText={'On'} inActiveText={'Off'} circleSize={20} barHeight={20} />
    );
}


// REACT NATIVE STAR RATING
export {
    StarRating,
    UserAvatar,

    createStackNavigator,
    NavigationActions,
    StackActions,

    IndicatorViewPager,
    PagerDotIndicator,

    GooglePlacesAutocomplete,
    Geocoder,
    MapView,

    Toast,
};
