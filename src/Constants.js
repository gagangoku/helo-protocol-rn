// Constants
import {Dimensions, Platform} from "react-native";


// NOTE: Unable to get the correct appVersion from codepush update. Also, codepush only updates the JS bundle,
// so the installed appVersion won't change. Hence, the version number is set in JS here.
// NOTE: Do not forget to update this version everytime you release a codepush / playstore update.
export const APP_VERSION = '1.0.3';

export const HOST = 'https://api.heloprotocol.in';
// export const HOST = 'http://192.168.0.105:7071';
// export const HOST = 'http://192.168.1.31:7071';
export const IMAGES_HOST = 'https://imageserver.heloprotocol.in';
// export const IMAGES_HOST = 'http://192.168.0.104:7071';


// Keys for referrals
export const REFERRING_CUSTOMER_ID_KEY = 'referrring-customer-id';
export const REFERRAL_OFFER_KEY = 'referral-offer';

export const PHONE_NUMBER_KEY = 'phoneNumber-1';
export const OTP_API = '/v1/otp/generate';
export const CUSTOMER_SEARCH_API = '/v2/crm/customer/search';
export const CUSTOMER_PROFILE_PAGE_API = '/v2/crm/customer/app/profile_page';
export const COOK_SEARCH_API = '/v2/srm/supply/find';
export const PLACE_REQUEST_API = '/v2/crm/newRequest';
export const OTHER_INTERESTS_API = '/v2/crm/customer/other_interests';
export const RATING_SUBMIT_API = '/v2/ratings/rate';
export const COOK_RECOMMENDATION_API = '/v2/ratings/cook_recommendation';
export const MAP_CUSTOMER_SUPPLY_PHONE_API = '/v1/exotel/get_connect_number';
export const SUBMIT_CALL_STATUS_API = '/v1/new-jobs/customer_to_supply_call_status';

export const X_ROLE_HEADER = "X-Role";

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
export const GOOGLE_MAPS_API_KEY = 'AIzaSyB_6Ly7ovRtYqb_p7QxxRSV3WnQh3b1e6Y';

export const COOK_SRP_MAX_CUISINES_LENGTH = 25;
export const COOK_SRP_MAX_LANGUAGES_LENGTH = 25;

export const X_AUTH_HEADER = 'X-Authorization-Token';
export const X_AUTH_TOKEN = 'C5F925633FEF36ED2B3E197F88AF5';
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
export const CODEPUSH_DEPLOYMENT_KEY_ANDROID = 'YcoPjhkVGsWnfvhZLiT0YMCN3cYiHyrVcKyv4';
export const CODEPUSH_DEPLOYMENT_KEY_IOS = 'fknS0vtDJBsn6k937Cd3JD9RBwqwSk_89K1DN';  // 'Pv7bKa_COn6GLddSt309URkmB76dHJk3SuNWE';
export const CODEPUSH_DEPLOYMENT_KEY = Platform.OS === PLATFORM_ANDROID ? CODEPUSH_DEPLOYMENT_KEY_ANDROID : CODEPUSH_DEPLOYMENT_KEY_IOS;

export const AQUISITION_REFERRED = 'REFERRED';
export const AQUISITION_CAME_BY_COOK_RECOMMENDATION = 'CAME_BY_COOK_RECOMMENDATION';
export const AQUISITION_SELF_APPLIED = 'SELF_APPLIED';
