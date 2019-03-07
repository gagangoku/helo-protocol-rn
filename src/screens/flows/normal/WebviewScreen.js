import React from "react";
import {View, WebView} from 'react-native';
import {getContext} from "../../../util/Util";


export default class WebviewScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
        };
    };
    static URL = '/normal/webview';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);

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
        const processNavFn = this.props.processNavFn || this.ctx.processNavFn;
        const onNavigationStateChange = (x) => {
            console.log('onNavigationStateChange: ', x);
            const url = x['url'];
            const title = x['title'];
            console.log('url: ', url);
            console.log('title: ', title);
            this.setState({ url: url, title: title });

            processNavFn(url, title);
        };

        return (
            <View style={{ height: '100%', width: '100%' }}>
                <View style={{ height: '100%' }}>
                    <WebView useWebKit={true} source={{uri: this.ctx.url}} ref={r => this.updateRef(r)}
                             onNavigationStateChange={onNavigationStateChange} />
                </View>
            </View>
        );
    }
}
