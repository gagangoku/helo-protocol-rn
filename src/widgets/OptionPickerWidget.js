import React from "react";
import {capitalizeFirstLetter, getKeysWhereValueIs} from '../util/Util';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";


export default class OptionPickerWidget extends React.Component {
    constructor(props) {
        super(props);

        let clicked = {};
        this.props.optionList.forEach(y => {clicked[PREFIX + y] = false});
        (this.props.initialSelected || []).forEach(y => {
            clicked[PREFIX + y] = true;
            this.props.toggleFn(y, true);
        });

        this.state = {
            ...clicked,
        };
        this.displayFn = this.props.displayFn || this.normalizeEnumForDisplay;
        this.singleSelection = this.props.singleSelection || false;
    }

    normalizeEnumForDisplay = (str) => {
        return capitalizeFirstLetter(str.toLowerCase().trim().replace(/_/g, " "));
    };

    render() {
        const A = this.props.optionList.map(x => this.box(PREFIX, x, () => this.toggle(PREFIX, x)));

        return (
            <View style={[custom.justifyAlignCenter, {width: '100%'}]}>
                <Text style={custom.heading}>{this.props.heading}</Text>
                <Text style={custom.subHeading}>{this.props.subHeading || ''}</Text>
                <View style={custom.itemsContainer}>
                    {A}
                </View>
            </View>
        );
    }

    toggle(prefix, key) {
        const k = prefix + key;
        const newVal = !this.state[k];
        if (this.singleSelection) {
            const selected = getKeysWhereValueIs(this.state, true);
            if (selected.length > 0) {
                this.setState({ [selected[0]]: false });
                this.props.toggleFn(selected[0].split(PREFIX)[1], false);
            }
        }

        this.setState({ [k]: newVal });
        this.props.toggleFn(key, newVal);
        console.log('toggle: ', k, key);
    }

    box(prefix, key, cb) {
        const k = prefix + key;
        const boxStyle = this.state[k] ? custom.selectedBackground : custom.notSelectedBackground;
        const textStyle = this.state[k] ? custom.buttonTextSelected : custom.buttonTextNotSelected;
        const styleOverrides = this.props.styleOverrides || {};
        const val = this.displayFn(key);

        return (
            <View style={[custom.boxContainer, boxStyle, styleOverrides]} key={k}>
                <TouchableOpacity onPress={cb} style={custom.justifyAlignCenter}>
                    <Text style={[custom.boxText, textStyle]}>{val}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const PREFIX = 'cui-';

export const BUTTON_BACKGROUND_COLOR = '#4d4d4d';
export const TEXT_COLOR = '#404040';

const custom = StyleSheet.create({
    selectedBackground: {
        backgroundColor: BUTTON_BACKGROUND_COLOR,
        borderWidth: 1,
        borderColor: BUTTON_BACKGROUND_COLOR,
    },
    notSelectedBackground: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: BUTTON_BACKGROUND_COLOR,
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

        // NOTE: These properties apply to web
        // userSelect: 'none',
        // MozUserSelect: 'none',
        // WebkitUserSelect: 'none',
        // msUserSelect: 'none',
    },
    boxText: {
        padding: 10,
        textAlign: 'center',
        fontSize: 16,
    },
    buttonTextSelected: {
        color: 'white',
    },
    buttonTextNotSelected: {
        color: TEXT_COLOR,
    },

    heading: {
        fontSize: 18,
        fontWeight: '600',
        color: TEXT_COLOR,
        width: '100%',
        textAlign: 'center',
    },
    subHeading: {
        fontSize: 15,
        fontWeight: '400',
        color: TEXT_COLOR,
        width: '100%',
        textAlign: 'center',
    },
    itemsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    justifyAlignCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
});
