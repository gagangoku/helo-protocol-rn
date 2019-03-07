import React from "react";
import {Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {BUTTON_BACKGROUND_COLOR, TEXT_COLOR} from "../../../Styles";
import {StarRating} from '../../../NativeBindings';
import common from "../../../styles/common";
import {fabBottomButton, getContext, getKeysWhereValueIs, resetNavigation, spacer} from "../../../util/Util";
import {PLATFORM_IOS, WHAT_DID_NOT, WHAT_WENT_WELL} from "../../../Constants";
import prompt from "react-native-prompt-android";
import CustomerProfileScreen from "./CustomerProfileScreen";
import OptionPickerWidget from "../../../widgets/OptionPickerWidget";
import {submitRating} from "../../../util/Api";


export default class RatingScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Today\'s food rating',
    });
    static URL = '/normal/rating';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
        this.state = {
            moreComments: '',
            rating: this.ctx.rating,
        };
        this.whatWentWell = {};
        this.whatDidNot = {};
    }

    setFn = (x) => (key, val) => {
        this[x][key] = val;
    };

    additionalCommentsPrompt = () => {
        const cancel = () => console.log('Cancel Pressed');
        const commentEntered = comment => {
            console.log('Comment entered: ' + comment);
            this.setState({ moreComments: comment });
        };
        prompt(
            'Comments', 'Enter detailed feedback so we can understand your concerns better',
            [
                {text: 'Cancel', onPress: cancel, style: 'cancel'},
                {text: 'OK', onPress: commentEntered},
            ],
            {
                type: 'plain-text',
                cancelable: false,
                defaultValue: this.state.moreComments,
                placeholder: 'Feedback',
            }
        );
    };

    render() {
        const styleOverrides = Platform.OS === PLATFORM_IOS ? custom.optionContainer : {};
        return (
            <View style={common.container}>
                <ScrollView>
                    <View style={[common.justifyAlignCenter, {width: '100%'}]}>
                        {spacer()}
                        <Text style={custom.heading}>Your rating</Text>
                        <View style={{ width: '40%' }}>
                            <StarRating maxStars={5} rating={this.state.rating} selectedStar={(r) => this.setState({ rating: r })}
                                        fullStarColor={TEXT_COLOR} starStyle={{ marginLeft: 7 }} starSize={26} />
                        </View>
                    </View>

                    {spacer(20)}
                    <OptionPickerWidget heading={'What went well ?'} optionList={WHAT_WENT_WELL}
                                        toggleFn={this.setFn('whatWentWell')} styleOverrides={styleOverrides} />

                    {spacer(20)}
                    <OptionPickerWidget heading={'What did not ?'} optionList={WHAT_DID_NOT}
                                        toggleFn={this.setFn('whatDidNot')} styleOverrides={styleOverrides} />

                    {spacer()}
                    <TouchableOpacity style={[common.justifyAlignCenter, {width: '100%'}]} onPress={this.additionalCommentsPrompt}>
                        <Text>Enter detailed feedback</Text>
                    </TouchableOpacity>

                    {spacer(40)}
                </ScrollView>

                {fabBottomButton('submit rating', () => this.submitFn())}
            </View>
        );
    }

    async submitFn() {
        console.log('Submit clicked: ', this.state);

        const customerProfile = this.ctx.customerProfile;
        const customerId = this.ctx.customerProfile.customer.person.id;
        const rating = this.state.rating;
        const orderId = this.ctx.order.id;
        const comments = this.state.moreComments;
        const whatWentWell = getKeysWhereValueIs(this.whatWentWell, true);
        const whatDidNot = getKeysWhereValueIs(this.whatDidNot, true);

        await submitRating({orderId, customerId, whatWentWell, whatDidNot, rating, comments});

        Alert.alert(
            'Thank you for rating',
            'This helps us improve.',
            [{text: 'OK', onPress: () => {
                customerProfile.ordersPendingRating.shift();
                resetNavigation(this, CustomerProfileScreen.URL);
            }}],
            { cancelable: false }
        );
    }

    toggle(prefix, key) {
        const k = prefix + '-' + key;
        this.setState({ [k]: !this.state[k] });
        console.log('toggle: ', k);
    }

    box(prefix, key, cb) {
        const k = prefix + '-' + key;
        const boxStyle = this.state[k] ? custom.selectedBackground : custom.notSelectedBackground;
        const textStyle = this.state[k] ? custom.buttonTextSelected : custom.buttonTextNotSelected;

        return (
            <View style={[custom.boxContainer, boxStyle]} key={k}>
                <TouchableOpacity onPress={cb} style={common.justifyAlignCenter}>
                    <Text style={[custom.boxText, textStyle]}>{key}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const custom = StyleSheet.create({
    selectedBackground: {
        backgroundColor: BUTTON_BACKGROUND_COLOR,
    },
    notSelectedBackground: {
    },
    boxContainer: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: BUTTON_BACKGROUND_COLOR,
    },
    boxText: {
        padding: 10,
        textAlign: 'center',
        fontSize: 17,
    },
    buttonTextSelected: {
        color: 'white',
    },
    buttonTextNotSelected: {
        color: TEXT_COLOR,
    },

    heading: {
        margin: 10,
        fontSize: 21,
        color: TEXT_COLOR,
    },
    subHeading: {
        margin: 5,
        fontSize: 19,
        color: TEXT_COLOR,
    },
    itemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    optionContainer: {
        marginTop: 5,
        marginBottom: 5,
    },
});
