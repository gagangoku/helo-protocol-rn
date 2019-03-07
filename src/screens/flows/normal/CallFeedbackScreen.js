import {Dimensions, Modal, ScrollView, StyleSheet, Text, View} from "react-native";
import {buttonWithText, getContext, getKeysWhereValueIs, resetNavigation, spacer} from "../../../util/Util";
import OptionPickerWidget from "../../../widgets/OptionPickerWidget";
import React from "react";
import {BUTTON_BACKGROUND_COLOR, INFO_BORDER_COLOR} from "../../../Styles";
import {CUSTOMER_CARE_NUMBER} from '../../../Constants';
import {submitCallStatus} from "../../../util/Api";
import CustomerProfileScreen from "./CustomerProfileScreen";


// Customer profile. Shows the cook assigned to you and latest orders
export default class CallFeedbackScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Calling Druid',
        headerLeft: null,
    });
    static URL = '/normal/calling-druid';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
        this.customerProfile = this.ctx.customerProfile;
        this.state = {
            modalOpen: false,
            cookCalled: null,
        };
        this.callWentWell = {};
        this.callWentBad = {};
        this.demoScheduled = {};
    }

    setFn = (x) => (key, val) => {
        this[x][key] = val;
    };

    submitModal = async () => {
        const cookCalled = this.state.cookCalled;
        const cookId = cookCalled.person.id;

        const callWentWell = getKeysWhereValueIs(this.callWentWell, true);
        const callWentBad = getKeysWhereValueIs(this.callWentBad, true);
        const demoScheduled = getKeysWhereValueIs(this.demoScheduled, true);
        if (callWentWell.length === 0 && callWentBad.length === 0) {
            window.alert('Please select atleast one of what went well or did not');
            return;
        }
        if (callWentBad.length === 0 && demoScheduled.length === 0) {
            window.alert('Please let us know if the person has agreed to come to your place for a demo or not');
            return;
        }
        if (demoScheduled.length === 2) {
            window.alert('Please choose either YES or NO');
            return;
        }

        const rsp = await submitCallStatus({cookId, callWentWell, callWentBad, demoScheduled});
        if (rsp !== 'ok') {
            window.alert('Something went wrong. Please try again or call ' + CUSTOMER_CARE_NUMBER);
            return;
        }

        resetNavigation(this, CustomerProfileScreen.URL);
    };

    cookCalledModal = () => {
        const modalBackground = '#fffffffa';
        const cookCalled = this.state.cookCalled;
        const cookName = cookCalled ? cookCalled.person.name.toUpperCase() : 'the cook';
        return (
            <Modal animationType="slide" transparent={true}
                   visible={this.state.modalOpen} onRequestClose={() => {}}>
            </Modal>
        );
    };

    render() {
        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: modalBackground }}>
                <View>
                    <ScrollView>
                        {spacer(20)}
                        <Text style={[custom.heading, {alignSelf: 'center'}]}>How did the call with {cookName} go ?</Text>
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
    'COOK_CUT_THE_CALL',
    'COOK_IS_NOT_FREE',
    'COOK_TOO_FAR',
    'DIDNT_LIKE_THE_COOK',
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
