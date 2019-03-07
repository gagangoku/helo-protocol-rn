import React from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import common from "../styles/common";
import {fabBottomButton, getKeysWhereValueIs, spacer} from "../util/Util";
import OptionPickerWidget from "./OptionPickerWidget";
import {CUISINES, LANGUAGES} from "../Constants";


export default class CuisinesLanguagesWidget extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Select cuisines & languages',
    });

    constructor(props) {
        super(props);
        this.cuisines = {};
        this.languages = {};
    }

    setFn = (x) => (key, val) => {
        this[x][key] = val;
    };
    render() {
        return (
            <View style={common.container}>
                <ScrollView>
                    {spacer(20)}
                    <OptionPickerWidget heading={'What cuisines do you like ?'} optionList={CUISINES} toggleFn={this.setFn('cuisines')} />

                    {spacer(20)}
                    <OptionPickerWidget heading={'What languages should the druid speak ?'} optionList={LANGUAGES} toggleFn={this.setFn('languages')} />
                </ScrollView>

                {fabBottomButton('next', () => this.submitFn())}
            </View>
        );
    }

    submitFn() {
        const cuisines = getKeysWhereValueIs(this.cuisines, true);
        const languages = getKeysWhereValueIs(this.languages, true);
        if (cuisines.length === 0 || languages.length === 0) {
            window.alert('Please select atleast one cuisine & language');
            return;
        }

        this.props.submitFn(cuisines, languages);
    }
}

const custom = StyleSheet.create({
});
