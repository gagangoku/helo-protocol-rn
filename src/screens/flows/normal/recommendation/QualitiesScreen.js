import React from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import common from "../../../../styles/common";
import OptionPickerWidget from "../../../../widgets/OptionPickerWidget";
import {fabBottomButton, getContext, getKeysWhereValueIs, navigateTo, spacer} from "../../../../util/Util";
import {BAD_HABITS, GOOD_QUALITIES} from "../../../../Constants";
import CuisinesScreen from "./CuisinesScreen";
import StarRating from "react-native-star-rating";
import {TEXT_COLOR} from "../../../../Styles";


export default class QualitiesScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Recommend cook - rating',
    });
    static URL = '/recommendation/qualities';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
        this.state = {
            rating: null,
        };
        this.goodQualities = {};
        this.badHabits = {};
    }

    setFn = (x) => (key, val) => {
        this[x][key] = val;
    };

    render() {
        const cookName = this.ctx.customerProfile['supplies'][0].person.name.toUpperCase();
        return (
            <View style={common.container}>
                <ScrollView>
                    <View style={[common.justifyAlignCenter, {width: '100%'}]}>
                        {spacer(5)}
                        <Text style={custom.heading}>Your rating</Text>
                        <View style={{ width: '40%' }}>
                            <StarRating maxStars={5} rating={this.state.rating} selectedStar={(r) => this.setState({ rating: r })}
                                        fullStarColor={TEXT_COLOR} starStyle={{ marginLeft: 7 }} starSize={26} />
                        </View>
                    </View>

                    {spacer(20)}
                    <OptionPickerWidget heading={'What is ' + cookName + ' good at ?'} optionList={GOOD_QUALITIES}
                                        toggleFn={this.setFn('goodQualities')} styleOverrides={custom.optionContainer} />

                    {spacer(20)}
                    <OptionPickerWidget heading={'What can ' + cookName + ' improve upon ?'} optionList={BAD_HABITS}
                                        toggleFn={this.setFn('badHabits')} styleOverrides={custom.optionContainer} />
                </ScrollView>

                {fabBottomButton('next', () => this.submitFn())}
            </View>
        );
    }

    submitFn() {
        if (!this.state.rating) {
            window.alert('Please rate');
            return;
        }
        const goodQualities = getKeysWhereValueIs(this.goodQualities, true);
        const badHabits = getKeysWhereValueIs(this.badHabits, true);
        if (goodQualities.length === 0 && badHabits.length === 0) {
            window.alert('Please select atleast one quality / bad habit');
            return;
        }
        this.ctx.customerRequirement.cookFeedback = {
            rating: this.state.rating,
            goodQualities: goodQualities,
            badHabits: badHabits,
            customerId: this.ctx.customerProfile.customer.person.id,
            supplyId: this.ctx.customerProfile['supplies'][0].person.id,
            customerPhone: -1,
            supplyPhone: -1,
        };
        navigateTo(this, CuisinesScreen.URL);
    }
}

const custom = StyleSheet.create({
    heading: {
        margin: 10,
        fontSize: 21,
        color: TEXT_COLOR,
    },
    optionContainer: {
        marginTop: 5,
        marginBottom: 5,
    },
});
