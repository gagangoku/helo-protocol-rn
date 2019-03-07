import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {BUTTON_BACKGROUND_COLOR, TEXT_COLOR} from "../Styles";
import common from "../styles/common";
import {capitalizeFirstLetter} from "../util/Util";


export default class OptionPickerWidget extends React.Component {
    constructor(props) {
        super(props);

        let clicked = {};
        this.props.optionList.forEach(y => {clicked[PREFIX + y] = false});
        this.state = {
            ...clicked,
        };
    }

    normalizeEnumForDisplay = (str) => {
        return capitalizeFirstLetter(str.toLowerCase().trim().replace(/_/g, " "));
    };

    render() {
        const A = this.props.optionList.map(x => this.box(PREFIX, x, () => this.toggle(PREFIX, x)));

        return (
            <View style={[common.justifyAlignCenter, {width: '100%'}]}>
                <Text style={custom.subHeading}>{this.props.heading}</Text>
                <View style={custom.itemsContainer}>
                    {A}
                </View>
            </View>
        );
    }

    toggle(prefix, key) {
        const k = prefix + key;
        const newVal = !this.state[k];
        this.setState({ [k]: newVal });
        this.props.toggleFn(key, newVal);
        console.log('toggle: ', k, key);
    }

    box(prefix, key, cb) {
        const k = prefix + key;
        const boxStyle = this.state[k] ? custom.selectedBackground : custom.notSelectedBackground;
        const textStyle = this.state[k] ? custom.buttonTextSelected : custom.buttonTextNotSelected;
        const styleOverrides = this.props.styleOverrides || {};

        return (
            <View style={[custom.boxContainer, boxStyle, styleOverrides]} key={k}>
                <TouchableOpacity onPress={cb} style={common.justifyAlignCenter}>
                    <Text style={[custom.boxText, textStyle]}>{this.normalizeEnumForDisplay(key)}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const PREFIX = 'cui-';
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

    subHeading: {
        margin: 5,
        marginLeft: 10,
        fontSize: 19,
        color: TEXT_COLOR,
    },
    itemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
});
