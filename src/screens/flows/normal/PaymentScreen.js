import React from "react";
import {Text, View, WebView} from 'react-native';
import {getContext, resetNavigation} from "../../../util/Util";
import {Toast} from "../../../NativeBindings";
import CustomerProfileScreen from "./CustomerProfileScreen";


export default class PaymentScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Payment',
        };
    };
    static URL = '/normal/payment';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
        this.customerProfile = this.ctx.customerProfile;
        this.paymentLink = this.ctx.paymentLink;

        this.webview = null;
        this.state = {
            url: null,
            title: null,
        };
    }
    componentDidMount() {
    }

    updateRef(r) {
        this.webview = r;
    }
    render() {
        const PAYMENT_SUCCESS_URL_SUBSTR = '/instamojo_payment_redirect';
        // const PAYMENT_SUCCESS_URL_SUBSTR = 'google';
        const PAYMENT_SUCCESS_TITLE_SUBSTR = 'success';

        let obj = this;
        const onNavigationStateChange = function(x) {
            console.log('onNavigationStateChange: ', x);
            const url = x['url'];
            const title = x['title'];
            console.log('url: ', url);
            console.log('title: ', title);
            obj.setState({ url: url, title: title });
            if (url.includes(PAYMENT_SUCCESS_URL_SUBSTR) && title.toLowerCase().includes(PAYMENT_SUCCESS_TITLE_SUBSTR)) {
                // Payment succeeded
                Toast.show('Payment successful !', Toast.LONG);
                resetNavigation(obj, CustomerProfileScreen.URL);
            }
        };
        const _back = function() {
            obj.webview.goBack();
        };

        return (
            <View style={{ height: '100%', width: '100%' }}>
                <View style={{ height: '100%' }}>
                    <WebView useWebKit={true} source={{uri: this.paymentLink}} ref={r => this.updateRef(r)}
                             style={{marginTop: 20}} processNavFn={() => {}}
                             onNavigationStateChange={onNavigationStateChange}
                    />
                </View>

                <View>
                    <Text>Content below</Text>
                </View>
            </View>
        );
    }
}
