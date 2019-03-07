import {
    AQUISITION_CAME_BY_COOK_RECOMMENDATION,
    COOK_RECOMMENDATION_API,
    CUSTOMER_PROFILE_PAGE_API,
    HOST,
    MAP_CUSTOMER_SUPPLY_PHONE_API,
    OTP_API,
    PLACE_REQUEST_API,
    PLATFORM_ANDROID,
    RATING_SUBMIT_API,
    SUBMIT_CALL_STATUS_API,
    X_AUTH_HEADER,
    X_AUTH_TOKEN,
    X_ROLE_HEADER
} from "../Constants";
import {Platform} from "react-native";
import format from "string-format";


export const getCustomerProfile = async (phoneNumber) => {
    const url = HOST + CUSTOMER_PROFILE_PAGE_API + '?countryCode=91&phone=' + phoneNumber;
    console.log(url);
    try {
        const response = await fetch(url);
        const c = await response.json();
        console.log('Customer profile response: ', c);
        return c;
    } catch (e) {
        console.log('Customer profile fetch error: ', e);
        return null;
    }
};

export const getOtp = async (phoneNumber) => {
    let url = HOST + OTP_API + '?phoneNumber=' + phoneNumber + '&countryCode=91&role=customer';
    console.log(url);
    const response = await fetch(url);
    const otp = await response.text();
    // console.log('OTP received:', otp);
    return otp;
};

export const submitRecommendation = (cookFeedback, responseCb, errorCb) => {
    const url = HOST + COOK_RECOMMENDATION_API;
    console.log(url);

    console.log('About to submit recommendation: ', cookFeedback);
    fetch(url, { method: 'POST', headers: customerRoleHeader, body: JSON.stringify(cookFeedback) })
    .then((o) => {
        // console.log('response: ', o);
        if (o.status >= 200 && o.status < 300) {
            return o.text();
        } else {
            throw null;
        }
    }).then((o) => {
        console.log('recommendation response:', o);
        responseCb();
    }).catch(ex => {
        console.log('Error in submitting recommendation:', ex);
        errorCb(ex);
    });
};

export const submitRating = async ({orderId, customerId, whatWentWell, whatDidNot, rating, comments}) => {
    const urlParams = [
        'orderId=' + orderId,
        'customerId=' + customerId,
        'rating=' + rating,
        'whatWentWell=' + encodeURIComponent(whatWentWell.join(',')),
        'whatDidNot=' + encodeURIComponent(whatDidNot.join(',')),
        'moreComments=' + encodeURIComponent(comments),
    ];
    const url = HOST + RATING_SUBMIT_API + '?' + urlParams.join('&');
    console.log(url);

    try {
        const response = await fetch(url, {method: 'PUT', headers: customerRoleHeader});
        console.log('Rating response:', response);
        const o = response.text();
        console.log('Rating response: ', o);
        return o;
    } catch (e) {
        console.log('Rating fetch error: ', e);
        return null;
    }
};

export const signupForFreePlan = async (cookFeedback) => {
    const newRequest = {
        phoneNumber: cookFeedback.customerPhone,
        gender: 'OTHER',
        customerName: cookFeedback.customerName,

        latitude: cookFeedback.address.location.lat,
        longitude: cookFeedback.address.location.lng,
        addressEntered: cookFeedback.address.fullAddress,
        area: cookFeedback.address.area,
        city: cookFeedback.address.city,

        cookSelectedName: cookFeedback.supplyName,
        cookPhoneNumber: cookFeedback.supplyPhone,
        fromHour: cookFeedback.startHour,
        toHour: cookFeedback.startHour + cookFeedback.durationHours,
        plan: 'FREE',
        cuisines: cookFeedback.cuisines,
        languages: cookFeedback.languages,
        aquisitionChannel: AQUISITION_CAME_BY_COOK_RECOMMENDATION,
        platform: Platform.OS === PLATFORM_ANDROID ? 'ANDROID_APP' : 'IOS_APP',
    };
    console.log('newRequest:', newRequest);
    console.log('stringify:', JSON.stringify(newRequest));
    const url = HOST + PLACE_REQUEST_API;
    console.log(url);

    const response = await fetch(url, { headers: {...customerRoleHeader, [X_AUTH_HEADER]: X_AUTH_TOKEN}, method: 'POST', body: JSON.stringify(newRequest) });
    console.log('response:', response);
    if (response.status >= 200 && response.status < 300) {
        const text = await response.text();
        console.log('New signup response: ', text);
        return text;
    } else {
        console.log('Exception in new signup: ', response);
        return null;
    }
};

export const mapPhoneApi = async (customerPhone, supplyId) => {
    const url = format(HOST + MAP_CUSTOMER_SUPPLY_PHONE_API + '?customerPhone={}&supplyId={}', customerPhone, supplyId);
    console.log(url);
    const response = await fetch(url, { headers: {...customerRoleHeader, [X_AUTH_HEADER]: X_AUTH_TOKEN}, method: 'PUT' });
    if (response.status >= 200 && response.status < 300) {
        const text = await response.text();
        console.log('mapPhoneApi response: ', text);
        return text;
    } else {
        console.log('Exception in mapPhoneApi: ', response);
        return null;
    }
};

export const submitCallStatus = async (obj) => {
    const url = format(HOST + SUBMIT_CALL_STATUS_API + '?');
    console.log(url);
    const response = await fetch(url, { headers: {...customerRoleHeader, [X_AUTH_HEADER]: X_AUTH_TOKEN}, method: 'PUT', body: JSON.stringify(obj) });
    if (response.status >= 200 && response.status < 300) {
        const text = await response.text();
        console.log('submitCallStatus response: ', text);
        return text;
    } else {
        console.log('Exception in submitCallStatus: ', response);
        return null;
    }
};

const customerRoleHeader = {[X_ROLE_HEADER]: 'customer'};
