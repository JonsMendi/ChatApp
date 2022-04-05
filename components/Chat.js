import React from 'react';
import { View, Text } from 'react-native';

export default class Chat extends React.Component {
    render() {
        //Under, will setOptions makes the typed 'name' being saved in the state and by consequence showing it in the navigation menu.
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });
        
        const { backGroundColor } = this.props.route.params;

        return (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: backGroundColor}}>
                <Text>Welcome to the Chat</Text>
            </View>
        )
    }
}