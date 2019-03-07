import React from "react";
import {Alert, Platform, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {TEXT_COLOR} from "../Styles";
import common from "../styles/common";
import {buttonWithText, spacer} from "../util/Util";
import {submitRecommendation} from "../util/Api";
import {MIN_CHARACTERS_RECOMMENDATION, PLATFORM_IOS} from "../Constants";


export default class RecommendationPage extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Recommend cook - recommendation',
    });

    constructor(props) {
        super(props);
        this.state = {
            moreComments: '',
        };
    }

    render() {
        const cookName = this.props.cookName.toUpperCase();
        const numLines = 6;
        return (
            <View style={common.container}>
                <ScrollView style={custom.scrollContainer}>
                    <View style={[common.justifyAlignCenter, {width: '100%'}]}>
                        {spacer()}
                        <Text style={custom.heading}>Please write a recommendation for {cookName}.
                            This will be visible on their profile and will help them get better jobs.</Text>
                        {spacer(5)}
                        <Text style={custom.heading}>It will also help other customers know about {cookName} before hiring them.</Text>

                        <TextInput style={custom.textInput} underlineColorAndroid='transparent' autoFocus={false}
                                   placeholder=" Recommendation" multiline={true}
                                   maxLength={MAX_LEN}
                                   numberOfLines={Platform.OS === PLATFORM_IOS ? null : numLines}
                                   minHeight={Platform.OS === PLATFORM_IOS ? (20 * numLines) : null}
                                   onChangeText={(text) => this.setState({ moreComments: text })} />
                        <Text>{this.state.moreComments.length} / {MAX_LEN}</Text>
                    </View>

                    {spacer(20)}
                    {buttonWithText('SUBMIT', () => this.submitFn())}
                    {spacer(20)}
                </ScrollView>
            </View>
        );
    }

    submitFn() {
        const obj = this;
        console.log('Submit clicked: ', this.state);
        if (!this.state.moreComments || this.state.moreComments.length < MIN_CHARACTERS_RECOMMENDATION) {
            window.alert('Please enter atleast ' + MIN_CHARACTERS_RECOMMENDATION + ' characters for a useful recommendation');
            return;
        }

        const cookFeedback = this.props.cookFeedback;
        console.log('cookFeedback: ', cookFeedback);
        cookFeedback.recommendation = this.state.moreComments;
        submitRecommendation(cookFeedback, () => {
            Alert.alert(
                'Thank you for providing feedback',
                'This will help them improve, get better jobs and earn more.',
                [{text: 'OK', onPress: () => obj.props.submitFn() }],
                { cancelable: false }
            );
        }, () => {
            window.alert('Something went wrong. Please try again');
        });
    }
}

const MAX_LEN = 1500;
const custom = StyleSheet.create({
    heading: {
        margin: 10,
        fontSize: 18,
        color: TEXT_COLOR,
        width: '80%',
    },
    scrollContainer: {},
    textInput: {
        marginTop: 10,
        fontSize: 18,
        color: "black",
        borderWidth: 2,
        borderBottomColor: "#979797",
        textAlignVertical: 'top',
        width: '80%',
    },
});
