import React from "react";
import {StyleSheet} from "react-native";
import {getContext, resetNavigation} from "../../../../util/Util";
import CustomerProfileScreen from "../CustomerProfileScreen";
import RecommendationPage from "../../../../widgets/RecommendationPage";


export default class RecoScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Recommend cook - recommendation',
    });
    static URL = '/recommendation/reco';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
    }

    render() {
        const cookName = this.ctx.customerProfile['supplies'][0].person.name.toUpperCase();
        return (
            <RecommendationPage submitFn={this.submitFn} cookName={cookName} cookFeedback={this.ctx.customerRequirement.cookFeedback} />
        );
    }

    submitFn = () => {
        resetNavigation(this, CustomerProfileScreen.URL);
    };
}

const custom = StyleSheet.create({
});
