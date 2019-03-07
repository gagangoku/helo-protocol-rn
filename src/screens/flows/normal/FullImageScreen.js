import React from "react";
import {Dimensions, Image, StyleSheet, View} from "react-native";
import common from "../../../styles/common";
import {getContext} from "../../../util/Util";


export default class FullImageScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.title,
    });
    static URL = '/normal/full-image';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
        this.imageUrl = this.ctx.imageUrl;
        this.state = {
            imgWidth: '100%',
            imgHeight: '100%',
        };
    }

    componentDidMount() {
        const obj = this;
        Image.getSize(this.imageUrl, (width, height) => {
            // Calculate image width and height
            const scale = Math.min(screenWidth / width, 0.9 * screenHeight / height);       // Leave 10% space for top navigation bar
            console.log('width: ', width, ' height: ', height);
            console.log('screenWidth: ', screenWidth, ' screenHeight: ', screenHeight);
            obj.setState({imgWidth: width * scale, imgHeight: height * scale});
        });
    }

    render() {
        console.log('this.imageUrl:', this.imageUrl);
        return (
            <View style={[common.container, common.justifyAlignCenter]}>
                <Image source={{ uri: this.imageUrl }} style={{width: this.state.imgWidth, height: this.state.imgHeight}} />
            </View>
        );
    }
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const custom = StyleSheet.create({
    regImage: {
        width: '100%',
        height: '100%',
    },
});
