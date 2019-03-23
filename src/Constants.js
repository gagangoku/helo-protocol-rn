// Constants
import {Dimensions, Platform} from "react-native";


// NOTE: Unable to get the correct appVersion from codepush update. Also, codepush only updates the JS bundle,
// so the installed appVersion won't change. Hence, the version number is set in JS here.
// NOTE: Do not forget to update this version everytime you release a codepush / playstore update.
export const APP_VERSION = '1.0.5';

export const HOST = '<your host name>';
// export const HOST = 'http://192.168.0.105:7071';
// export const HOST = 'http://192.168.1.31:7071';

export const MWEB_URL = 'https://www.heloprotocol.in';
// export const MWEB_URL = 'http://192.168.0.104:8092';


// Keys for referrals
export const REFERRING_CUSTOMER_ID_KEY = 'referrring-customer-id';
export const REFERRAL_OFFER_KEY = 'referral-offer';

// TODO: Your API's here

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const SPLASH_SCREEN_TIME_MS = 2000;


export const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
export const NUM_DAYS_TO_SHOW_PREVIOUS_MONTHS_CALENDAR = 7;
export const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const LATITUDE_DELTA = 0.005;
export const LONGITUDE_DELTA = 0.005;

export const COOK_SRP_MAX_CUISINES_LENGTH = 25;
export const COOK_SRP_MAX_LANGUAGES_LENGTH = 25;

export const CUSTOMER_CARE_NUMBER = '080-45683501';

export const NUM_COOKS_TO_SHOW_IN_SEARCH_RESULTS = 25;

export const RUPEE_SYMBOL = String.fromCharCode(8377);

export const STARTING_PRICE = 1500;
export const MIN_CHARACTERS_RECOMMENDATION = 25;
export const MIN_CHARACTERS_ADDRESS = 10;


// For daily rating
export const WHAT_WENT_WELL = [
    'Delicious', 'Presentable', 'Timely food',
    'Healthy', 'Just perfect',
];
export const WHAT_DID_NOT = [
    "Druid did not show up today", 'Druid came late',
    'Bland', 'Too spicy', 'Made in a hurry',
    'Too much / too little salt', 'Not tasty',
];

// Cuisines and languages
export const CUISINES = [
    'NORTH_INDIAN', 'SOUTH_INDIAN', 'CONTINENTAL', 'THAI',
    'CHINESE', 'PUNJABI', 'BENGALI', 'MUGHLAI', 'GUJARATI',
    'ORIYA',
];
export const LANGUAGES = [
    'HINDI', 'ENGLISH', 'KANNADA',
    'PUNJABI', 'BENGALI', 'ORIYA', 'TAMIL',
    'MALAYALAM', 'GUJARATI', 'TELUGU', 'ARABIC',
    'BHOJPURI'
];


// For recommendation
export const GOOD_QUALITIES = [
    'PRESENTABLE', 'MAKES_TIMELY_FOOD',
    'USES_LESS_OIL', 'PUNCTUAL', 'RESPONSIBLE',
    'DOES_NOT_TAKE_SUDDEN_LEAVES',
    'JUST_PERFECT'
];
export const BAD_HABITS = [
    'NOT_PRESENTABLE', 'COMES_LATE', 'SPICY_FOOD',
    'OILY_FOOD', 'BLAND', 'USES_TOO_MUCH_TOO_LITTLE_SALT',
    'NOT_TASTY',
];

export const PLATFORM_ANDROID = 'android';
export const PLATFORM_IOS = 'ios';
