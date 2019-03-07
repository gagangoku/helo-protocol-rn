import React from "react";
import {
    buttonWithText,
    getContext,
    getImageUrl,
    getKeysWhereValueIs,
    getThumbImage,
    navigateTo,
    spacer
} from "../../../util/Util";
import {Dimensions, Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {BUTTON_BACKGROUND_COLOR, INFO_BORDER_COLOR, TEXT_COLOR} from "../../../Styles";
import {referFriends, StarRating, UserAvatar} from '../../../NativeBindings';
import phoneIcon from "../../../images/phone.png";
import calendarIcon from '../../../images/calendar-400-bw.png';
import common from "../../../styles/common";
import {CUSTOMER_CARE_NUMBER} from '../../../Constants';
import logo from '../../../images/splash/1stscreen.png';
import TodaysCooking from "../../../widgets/TodaysCooking";
import HowDoesReferralWorkScreen from "./HowDoesReferralWorkScreen";
import {CookFullProfileScreen} from "./CookFullProfileScreen";
import RatingScreen from "./RatingScreen";
import {CalendarScreen} from "./CalendarScreen";
import {mapPhoneApi, submitCallStatus} from "../../../util/Api";
import WebviewScreen from "./WebviewScreen";
import format from "string-format";
import OptionPickerWidget from "../../../widgets/OptionPickerWidget";


// Calendar icon widget that opens the calendar screen. To be shown in header on right side
function calendarIconWidget(navigation) {
    const props = {navigation: navigation};
    const ctx = getContext(props);
    const obj = { props: {navigation: navigation}, ctx: ctx };
    const customerProfile = ctx.customerProfile;

    return !('supplies' in customerProfile) ? (<View/>) : (
        <TouchableOpacity style={{}} onPress={ () => navigateTo(obj, CalendarScreen.URL) }>
            <Image style={{ height: 42, width: 42 }} source={calendarIcon} />
        </TouchableOpacity>
    );
}
function getTitle(navigation) {
    const props = {navigation: navigation};
    const ctx = getContext(props);
    const customerProfile = ctx.customerProfile;

    return !('supplies' in customerProfile) ? 'Choose' : 'Your worker';
}

// Customer profile. Shows the person assigned to you and latest orders
export default class CustomerProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: getTitle(navigation),
        headerLeft: null,
        headerRight: calendarIconWidget(navigation),
    });
    static URL = '/normal/customer-profile';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
        this.customerProfile = this.ctx.customerProfile;
        this.state = {
            modalOpen: false,
            supplyCalled: null,
        };
        this.callWentWell = {};
        this.callWentBad = {};
        this.demoScheduled = {};
    }

    _callCustomerCare = () => {
        console.log('calling customer care');
        Linking.openURL('tel:' + CUSTOMER_CARE_NUMBER);
    };

    howDoReferralsWork() {
        navigateTo(this, HowDoesReferralWorkScreen.URL);
    }

    renderSupply(customer, supply, isDemo) {
        const starCount = 0;  // 3.5;
        const imageUrl = getImageUrl(getThumbImage(supply['person']));
        console.log('imageUrl:', imageUrl);

        const supplyName = (isDemo ? 'DEMO-' : '') + supply['person']['name'];
        const supplyPhone = supply['person']['phone']['phoneNumber'];
        const _callSupply = () => {
            console.log('calling supply');
            Linking.openURL('tel:+91' + supplyPhone);
        };

        const _showSupplyProfile = () => {
            navigateTo(this, CookFullProfileScreen.URL);
        };

        const customerId = customer['person']['id'];

        const avatarRadius = 60;
        const textStyle = { color: TEXT_COLOR, padding: 0, margin: 0 };
        const personStyle = { fontSize: 25, fontWeight: 'bold' };
        const phoneStyle = { fontSize: 20 };
        const ratingsStyle = { fontSize: 22 };

        const _onRateTodaysWork = (r) => {
            console.log('star rating  :', r);
            const order = this.customerProfile.ordersPendingRating[0];
            navigateTo(this, RatingScreen.URL, { rating: r, order: order });
        };

        return (
            <View style={[common.container, {}]}>
                {spacer(20)}
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={ () => _showSupplyProfile() }>
                    <UserAvatar size={avatarRadius * 2} name={supplyName}
                                src={imageUrl} style={{ borderColor: TEXT_COLOR, borderWidth: avatarRadius+1 }} />
                    <View style={{ height: 10 }} />
                </TouchableOpacity>

                <View style={common.justifyAlignCenter}>
                    <Text style={[textStyle, personStyle]}>{supplyName}</Text>

                    {spacer(5)}
                    <TouchableOpacity style={{ height: 30 }} onPress={ () => _callSupply() }>
                        <View style={{ flex: 1, flexDirection: 'row', height: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ height: 15, width: 15, marginRight: 10, opacity: 0.7 }} source={phoneIcon} />
                            <Text style={[textStyle, phoneStyle]}>{supplyPhone}</Text>
                        </View>
                    </TouchableOpacity>

                    {spacer(20)}
                    <Text style={[textStyle, ratingsStyle]}>Your overall ratings</Text>
                    <StarRating disabled={true} maxStars={5} rating={starCount}
                                fullStarColor={TEXT_COLOR} starStyle={{ marginLeft: 7 }} starSize={26} />
                </View>

                {spacer(20)}
                <TodaysCooking customerProfile={this.customerProfile} onStarRatingPressFn={_onRateTodaysWork} />

                {spacer(40)}
                <View style={{ height: 70, marginBottom: 10 }}>
                    {buttonWithText('SHARE to earn referral bonus', () => referFriends(customerId))}
                    {spacer(10)}
                    <TouchableOpacity style={{ height: 20 }} onPress={() => this.howDoReferralsWork()}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[textStyle, { fontSize: 14, color: 'blue' }]}>How do referrals work ?</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    callSupply = async (supplyProfile) => {
        const customerPhone = this.customerProfile['customer'].person.phone.phoneNumber;
        const supplyId = supplyProfile.person.id;

        try {
            const phoneToCall = await mapPhoneApi(customerPhone, supplyId);
            console.log('Phone mapping response: ', phoneToCall);

            if (phoneToCall) {
                const telOpen = 'tel:' + phoneToCall;
                console.log('telOpen: ', telOpen);

                this.setState({ modalOpen: true, supplyCalled: supplyProfile });
                Linking.openURL(telOpen);
            } else {
                window.alert('Something went wrong. Please contact our customer care: ' + CUSTOMER_CARE_NUMBER);
            }
        } catch (e) {
            console.log('Phone mapping failed: ', e);
            window.alert('Something went wrong. Please contact our customer care: ' + CUSTOMER_CARE_NUMBER);
        }
    };

    callButton = (cbFn, text) => {
        return (
            <TouchableOpacity onPress={cbFn} style={custom.callBtn}>
                <Text style={common.buttonText}>{text}</Text>
            </TouchableOpacity>
        );
    };

    renderSupplyEntry(supply) {
        if (!supply) {
            return (<View key={'undef'} style={custom.supplyEntry} />);
        }

        const rejectFn = () => {};
        const url = format('https://www.heloprotocol.in/person/{}?disableCallBtn=true&showHeader=false', supply.person.id);
        const showProfileFn = () => navigateTo(this, WebviewScreen.URL, {url});
        return (
            <View key={supply.person.id + ''} style={[custom.supplyEntry, { height: 60 }]}>
                <View style={{width: '70%'}}>
                    <TouchableOpacity onPress={showProfileFn}>
                        <Text style={custom.supplyEntrySupplyName}>{supply.person.name.toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '30%'}}>
                    {this.callButton(() => this.callSupply(supply), 'CALL')}
                </View>
            </View>
        );
    }

    setFn = (x) => (key, val) => {
        this[x][key] = val;
    };

    submitModal = async () => {
        const supplyCalled = this.state.supplyCalled;
        const supplyId = supplyCalled.person.id;
        const supplyName = supplyCalled.person.name;

        const callWentWell = getKeysWhereValueIs(this.callWentWell, true);
        const callWentBad = getKeysWhereValueIs(this.callWentBad, true);
        const demoScheduled = getKeysWhereValueIs(this.demoScheduled, true);
        if (callWentWell.length === 0 && callWentBad.length === 0) {
            window.alert('Please select atleast one of what went well or did not');
            return;
        }
        if (callWentBad.length === 0 && demoScheduled.length === 0) {
            window.alert('Please let us know if ' + supplyName + ' agreed to come to your place for a demo or not');
            return;
        }
        if (demoScheduled.length === 2) {
            window.alert('Please choose either YES or NO');
            return;
        }

        const rsp = await submitCallStatus({cookId: supplyId, callWentWell, callWentBad, demoScheduled});
        if (rsp !== 'ok') {
            window.alert('Something went wrong. Please try again or call ' + CUSTOMER_CARE_NUMBER);
            return;
        }

        this.setState({ modalOpen: false, supplyCalled: null });
    };

    supplyCalledModal = () => {
        const modalBackground = '#fffffffa';
        const supplyCalled = this.state.supplyCalled;
        const supplyName = supplyCalled ? supplyCalled.person.name.toUpperCase() : 'the cook';
        return (
            <Modal animationType="slide" transparent={true}
                   visible={this.state.modalOpen} onRequestClose={() => {}}>
                <View style={{ width: '100%', height: '100%', backgroundColor: modalBackground }}>
                    <View>
                        <ScrollView>
                            {spacer(20)}
                            <Text style={[custom.heading, {alignSelf: 'center'}]}>How did the call with {supplyName} go ?</Text>
                            {spacer(20)}

                            <OptionPickerWidget heading={'What went well ?'} optionList={CALL_WENT_WELL} toggleFn={this.setFn('callWentWell')} />
                            {spacer(20)}

                            <OptionPickerWidget heading={'What did not ?'} optionList={CALL_DID_NOT_GO_WELL} toggleFn={this.setFn('callWentBad')} />
                            {spacer(20)}

                            <OptionPickerWidget heading={'Is demo scheduled ?'} optionList={IS_DEMO_SCHEDULED} toggleFn={this.setFn('demoScheduled')} />
                            {spacer(20)}

                            {buttonWithText('SUBMIT', () => this.submitModal())}
                            {spacer(20)}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    renderFreeSupplies() {
        const customerName = this.customerProfile['customer'].person.name;
        const plan = this.customerProfile['customer'].plan;
        const freeTimeConfirmed = this.customerProfile.applicableSupply.freeTimeConfirmed || [];
        const freeTimeUnsure = this.customerProfile.applicableSupply.freeTimeUnsure || [];
        return (
            <ScrollView style={custom.ctr}>
                {this.supplyCalledModal()}

                <View style={custom.textSection}>
                    <Text style={custom.textLine}>
                        Dear <Text style={custom.customerName}>{customerName}</Text>, thank you for signing up.
                        Helo Protocol connects you with the blue collar workforce nearby. Please call them up and fix up a time for demo with them.
                    </Text>
                    <Text style={custom.textLine}>
                        In case you were not able to get through, please try again later. They might be working or otherwise busy.
                        The best time to call most workers is between 11.30 am - 2 pm or 8pm - 10pm.
                    </Text>
                </View>

                <View>
                    <Text style={custom.heading}>Workers who are very likely free at your time slot</Text>
                    <View style={custom.supplyEntryCtr}>
                        {freeTimeConfirmed.map(x => this.renderSupplyEntry(x))}
                        {this.renderSupplyEntry()}
                    </View>

                    {spacer(30)}
                    <Text style={custom.heading}>Workers who might be free</Text>
                    <View style={custom.supplyEntryCtr}>
                        {freeTimeUnsure.map(x => this.renderSupplyEntry(x))}
                        {this.renderSupplyEntry()}
                    </View>

                    {spacer(20)}
                </View>
            </ScrollView>
        );
    }

    render() {
        if ('supplies' in this.customerProfile && this.customerProfile['supplies'].length > 0) {
            if (this.customerProfile['customer']['status'] === 'DEMO_DONE') {
                return this.renderSupply(this.customerProfile['customer'], this.customerProfile['supplies'][0], true);
            }
            if (this.customerProfile['customer']['status'] === 'FULFILLED') {
                return this.renderSupply(this.customerProfile['customer'], this.customerProfile['supplies'][0], false);
            }
        }

        console.log('this.customerProfile.applicableSupply: ', this.customerProfile.applicableSupply);
        if (this.customerProfile.applicableSupply) {
            return this.renderFreeSupplies();
        }

        const textStyle = { color: TEXT_COLOR, padding: 0, margin: 0 };
        const customerId = this.customerProfile['customer']['person']['id'];
        return (
            <View style={common.container}>
                <View style={{ height: 40}} />

                <Image source={logo} style={custom.regImage}/>

                <View style={{ height: 40}} />
                <View style={{ borderWidth: 0 }}>
                    <Text style={[common.heading]}>We are trying to find people near you.</Text>
                </View>
                <View style={{ height: 10}} />
                <View style={{ flexDirection: 'row', borderWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <Text style={[common.heading]}>Call us at </Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={ () => this._callCustomerCare() }>
                            <Text style={[common.heading, { color: 'blue' }]}>{CUSTOMER_CARE_NUMBER}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={[common.heading]}> for an update.</Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
                {buttonWithText('SHARE to earn referral bonus', () => referFriends(customerId))}
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <TouchableOpacity style={{ }} onPress={() => this.howDoReferralsWork()}>
                        <Text style={[textStyle, { fontSize: 14, color: 'blue' }]}>How do referrals work ?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const dimHeight = Dimensions.get('window').height;
const registerImageDim = [180, 180];
const CALL_WENT_WELL = [
    'CALL_CONNECTED',
];
const CALL_DID_NOT_GO_WELL = [
    'CALL_DIDNT_CONNECT',
    'WORKER_CUT_THE_CALL',
    'WORKER_IS_NOT_FREE',
    'WORKER_TOO_FAR',
    'DIDNT_LIKE_THE_WORKER',
    'POOR_SOUND_QUALITY',
];
const IS_DEMO_SCHEDULED = [
    'YES',
    'NO',
];
const custom = StyleSheet.create({
    regImage: {
        alignSelf: 'center',
        width: registerImageDim[0],
        height: registerImageDim[1],
        marginTop: dimHeight * 0.02,
    },

    ctr: {
        backgroundColor: 'white',
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        color: 'black',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    textSection: {
        marginTop: 10,
        marginBottom: 10,
    },
    textLine: {
        fontSize: 17,
        marginBottom: 5,
    },
    customerName: {
        fontWeight: 'bold',
    },
    supplyEntryCtr: {
        paddingLeft: '4%',
        paddingRight: '4%',
    },
    supplyEntry: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',

        borderRadius: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: INFO_BORDER_COLOR,
    },
    supplyEntrySupplyName: {
        fontSize: 18,
        marginLeft: 5,
        marginRight: 5,
    },
    callBtn: {
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: BUTTON_BACKGROUND_COLOR,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: BUTTON_BACKGROUND_COLOR,
        color: 'white',
    },
});
