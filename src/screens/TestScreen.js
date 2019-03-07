import React from "react";
import {Alert, Dimensions, Modal, Picker, StyleSheet, Text, TextInput, TouchableHighlight, View} from "react-native";
import prompt from 'react-native-prompt-android';

import {fabBottomButton, normalizeStrForEnum, spacer} from "../util/Util";


export default class TestScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Today\'s food rating',
    });
    static URL = '/test-screen';

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
        };
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    render() {
        console.log(normalizeStrForEnum('uses less oil'));
        return this.render1();
    }

    render1() {
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 10,
                backgroundColor: '#ecf0f1',
            },
            paragraph: {
                margin: 24,
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#34495e',
            },
            textInput: {},
        });

        return (
            <View style={styles.container}>
                <Text style={styles.paragraph}>
                    Change code in the editor and watch it change on your phone!
                    Save to get a shareable url. You get a new url each time you save.
                </Text>
                <TextInput placeholder=" Your name" underlineColorAndroid='transparent'
                           value={'Hi'}
                           onChangeText={(text) => this.setState({ customerName: text })} />

                <Picker
                    style={{width: 100}}
                    selectedValue={this.state.language}
                    onValueChange={(lang) => this.setState({language: lang})}>
                    <Picker.Item label="Java" value="java" />
                    <Picker.Item label="JavaScript" value="js" />
                </Picker>
            </View>
        );
    }

    render2() {
        // Try removing the `flex: 1` on the parent View.
        // The parent will not have dimensions, so the children can't expand.
        // What if you add `height: 300` instead of `flex: 1`?
        const a = (
            <View style={{ height: '100%', width: '100%'}}>
                <View style={{height: 400, borderWidth: 1}}>
                    <View style={{flex: 1, backgroundColor: 'powderblue'}} />
                    {spacer()}
                    <View style={{flex: 2, backgroundColor: 'skyblue'}} />
                    {spacer()}
                    <View style={{flex: 3, backgroundColor: 'steelblue'}} />

                </View>
                {fabBottomButton('submit rating', () => console.log('hi'))}
            </View>
        );
        // return (
        // );

        const f = () => {
            prompt(
                'Comments', 'Enter your comments',
                [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: comment => console.log('OK Pressed, password: ' + comment)},
                ],
                {
                    type: 'plain-text',
                    cancelable: false,
                    defaultValue: 'All good',
                    placeholder: 'placeholder'
                }
            );
        };
        setTimeout(f, 1000);

        const b = (
            <View style={{marginTop: 22}}>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{marginTop: 22}}>
                        <View>
                            <Text>Hello World!</Text>

                            <TouchableHighlight
                                onPress={() => {
                                    this.setModalVisible(false);
                                }}>
                                <Text>Hide Modal</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>

                <TouchableHighlight
                    onPress={() => {
                        this.setModalVisible(true);
                    }}>
                    <Text>Show Modal</Text>
                </TouchableHighlight>
            </View>
        );
        return b;
    }
}

const DIM_HEIGHT = Dimensions.get('window').height;
const DIM_WIDTH = Dimensions.get('window').width;
const custom = StyleSheet.create({
});
