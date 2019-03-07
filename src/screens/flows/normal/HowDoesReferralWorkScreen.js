import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import common from "../../../styles/common";
import {TEXT_COLOR} from "../../../Styles";
import {getContext} from "../../../util/Util";


export default class HowDoesReferralWorkScreen extends React.Component {
    static navigationOptions = {
        title: 'Referrals',
    };
    static URL = '/normal/how-referral-works';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
    }

    render() {
        return (
            <View style={common.container}>
                <View style={{ height: 20 }} />
                <Text style={custom.text}>Share your referral link with your friends and they get <Text style={custom.offer}>10% off</Text> on their first month subscription.</Text>
                <Text style={custom.text}>For every customer who subscribes and stays atleast 2 months, you get <Text style={custom.offer}>10% off</Text> in your next month bill !</Text>
            </View>
        );
    }
}

const custom = StyleSheet.create({
    text: {
        fontSize: 18,
        color: TEXT_COLOR,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    offer: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
