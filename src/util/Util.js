import React from "react";
import {Image, PermissionsAndroid, Text, TouchableOpacity, View} from "react-native";
import {NavigationActions, StackActions} from '../NativeBindings';
import {IMAGES_HOST, MONTHS} from "../Constants";
import common from "../styles/common";
import Toast from "react-native-simple-toast";
import infoIcon from "../images/info.png";


export const requestLocationPermission = async (title, message) => {
    return await androidRequestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, 'FINE_LOCATION', title, message);
};

export const requestCallPhonePermission = async (title, message) => {
    return await androidRequestPermission(PermissionsAndroid.PERMISSIONS.CALL_PHONE, 'CALL_PHONE', title, message);
};

export const androidRequestPermission = async (permission, permName, title, message) => {
    try {
        console.log('Asking for permission: ', permName);
        const granted = await PermissionsAndroid.request(permission, {title: title, message: message});
        console.log(permission, granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permission granted: ", permName);
            return true;
        } else {
            console.log("Permission denied: ", permName, permission);
            return false;
        }
    } catch (err) {
        console.warn('Permission exception: ', permName, err);
        return false;
    }
};

// Reset the navigation stack so that back button does not take it to previous screen.
// For example, HomeScreen -> PurposeScreen should not be allowed.
export function resetNavigation(obj, targetRoute, overrides={}) {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: targetRoute, params: { ctx: {...obj.ctx, ...overrides} } })],
    });
    obj.props.navigation.dispatch(resetAction);
}

export function navigateTo(obj, targetRoute, overrides={}) {
    obj.props.navigation.navigate({ routeName: targetRoute, params: { ctx: {...obj.ctx, ...overrides} } });
}

const BROKEN_IMAGE = 'http://image.shutterstock.com/z/stock-vector-broken-robot-a-hand-drawn-vector-doodle-cartoon-illustration-of-a-broken-robot-trying-to-fix-478917859.jpg';
export function getImageUrl(imageUrl) {
    if (!imageUrl) {
        return BROKEN_IMAGE;
    }

    if (imageUrl.startsWith('http')) {
    } else if (imageUrl.startsWith("/v")) {
        imageUrl = IMAGES_HOST + imageUrl;
    } else if (imageUrl.startsWith("id=")) {
        imageUrl = IMAGES_HOST + '/v1/image/get?id=' + imageUrl.split('id=')[1];
    } else if (!isNaN(imageUrl)) {
        imageUrl = IMAGES_HOST + '/v1/image/get?id=' + imageUrl;
    } else {
        imageUrl = BROKEN_IMAGE;
    }
    return imageUrl;
}
export function getThumbImage(person) {
    return person['thumbImage'] ? person['thumbImage'] :
        (person['image'] ? person['image'] : 'https://image.shutterstock.com/image-vector/chef-drawing-vector-logo-icon-260nw-502621414.jpg');
}

// dateStr - yyyy-MM-dd format
export function age(dateStr, now=new Date().getTime()) {
    let years = (now - new Date(parseDate(dateStr))) / (1000 * 60 * 60 * 24 * 365);
    return Math.round(years * 10) / 10;
}

export function parseDate(str) {
    let splits = str.split('-');
    return dateObj(splits[0], splits[1], splits[2]);
}
function dateObj(year, month, day) {
    year = parseInt(year);
    day = parseInt(day);
    month = isNaN(month) ? _lookupMonth(month) : parseInt(month);

    if (!month || year <= 0 || month <= 0 || day <= 0) {
        return null;
    }
    const d = new Date(year, month-1, day);
    if (d.getFullYear() !== year || d.getMonth() !== (month - 1) || d.getDate() !== day) {
        return null;
    }
    return d;
}
function _lookupMonth(month) {
    let idx = MONTHS.indexOf(month);
    return idx < 0 ? null : idx + 1;
}


export function hashCode(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function fabBottomButton(text, onSubmitFn, overrides={}) {
    overrides.minWidth = overrides.minWidth || 150;
    return (
        <View style={common.fabBottomContainer} pointerEvents="box-none">
            <TouchableOpacity onPress={ onSubmitFn }>
                <View style={[common.button]}>
                    <Text style={[common.buttonText, overrides]}>{text.toUpperCase()}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export function buttonWithText(text, onSubmitFn, overrides={}) {
    overrides.minWidth = overrides.minWidth || 150;
    return (
        <View style={common.buttonContainer} pointerEvents="box-none">
            <TouchableOpacity onPress={ onSubmitFn }>
                <View style={[common.button]}>
                    <Text style={[common.buttonText, overrides]}>{text}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
export function buttonLightWithText(text, onSubmitFn, overrides={}) {
    overrides.minWidth = overrides.minWidth || 150;
    return (
        <View style={common.buttonContainer} pointerEvents="box-none">
            <TouchableOpacity onPress={ onSubmitFn }>
                <View style={[common.buttonLight]}>
                    <Text style={[common.buttonTextBlack, overrides]}>{text}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
export function buttonDisabledWithText(text, overrides={}) {
    overrides.minWidth = overrides.minWidth || 150;
    return (
        <View style={common.buttonContainer} pointerEvents="box-none">
            <View style={[common.buttonLight]}>
                <Text style={[common.buttonTextDisabled, overrides]}>{text}</Text>
            </View>
        </View>
    );
}

export function infoButton(text, styles={}) {
    return (
        <TouchableOpacity style={styles} onPress={() => Toast.show(text, Toast.LONG)} key={text}>
            <Image style={{ resizeMode: 'stretch', height: 20, width: 20, }} source={infoIcon} />
        </TouchableOpacity>
    );
}

export function emptyIfNull(str) {
    return str ? str : '';
}

export function getTopic(phoneNumber) {
    return 'customer-app-' + phoneNumber;
}

export function spacer(h=10, w=0) {
    return (
        <View style={{ height: h, width: w, borderWidth: 0 }} />
    );
}

export function getContext(props) {
    const ctx = props.navigation && props.navigation.state && props.navigation.state.params && props.navigation.state.params.ctx ?
        props.navigation.state.params.ctx : {};
    return ctx;
}
export function normalizeStrForEnum(str) {
    return str.replace("/", "").trim().replace(/  */g, "_").toUpperCase();
}

export function getKeysWhereValueIs(dict, val) {
    const array = [];
    Object.keys(dict).forEach(x => {
        if (dict[x] === val) {
            array.push(x);
        }
    });
    return array;
}

export const promiseWithTimeout = (promise, timeoutMs) => {
    const startTimeMs = new Date().getTime();

    // Create a promise that rejects in <ms> milliseconds
    const timeout = new Promise((resolve, reject) => {
        setTimeout(() => reject('Timed out in '+ (new Date().getTime() - startTimeMs) + 'ms.'), timeoutMs);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([promise, timeout]);
};

export const haversineDistance = (point1, point2, latField='latitude', lonField='longitude') => {
    const R = 6371;                                 // Earth radius in km
    const dLat = toRad(point2[latField] - point1[latField]);
    const dLon = toRad(point2[lonField] - point1[lonField]);
    const lat1 = toRad(point1[latField]);
    const lat2 = toRad(point2[latField]);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

const toRad = (value) => {
    return value * Math.PI / 180;
};
