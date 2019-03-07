import React from "react";
import {StyleSheet, View} from "react-native";
import common from "../../../../styles/common";
import OptionPickerWidget from "../../../../widgets/OptionPickerWidget";
import {fabBottomButton, getContext, getKeysWhereValueIs, navigateTo, spacer} from "../../../../util/Util";
import {CUISINES} from "../../../../Constants";
import RecoScreen from "./RecoScreen";


export default class CuisinesScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Select cuisines & languages',
    });
    static URL = '/recommendation/cuisines';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
        this.cuisines = {};
    }

    setFn = (x) => (key, val) => {
        this[x][key] = val;
    };
    render() {
        const cookName = this.ctx.customerProfile['supplies'][0].person.name.toUpperCase();
        return (
            <View style={common.container}>
                {spacer(20)}
                <OptionPickerWidget heading={'What cuisines does ' + cookName + ' make well ?'} optionList={CUISINES} toggleFn={this.setFn('cuisines')} />

                {fabBottomButton('next', () => this.submitFn())}
            </View>
        );
    }

    submitFn() {
        const cuisines = getKeysWhereValueIs(this.cuisines, true);
        if (cuisines.length === 0) {
            window.alert('Please select atleast one cuisine');
            return;
        }
        this.ctx.customerRequirement.cookFeedback = {
            ...this.ctx.customerRequirement.cookFeedback,
            cuisines: cuisines,
        };
        navigateTo(this, RecoScreen.URL);
    }
}

const custom = StyleSheet.create({
});
