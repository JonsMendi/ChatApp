import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, SystemMessage, Day } from 'react-native-gifted-chat'

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    componentDidMount() {
        //Under, will setOptions makes the typed 'name' being saved in the state and by consequence showing it in the navigation menu.
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });
        //Under, simulating on user
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Administrator',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: 'Welcome to the Chat.',
                    createdAt: new Date(),
                    system: true,
                },
            ]
        })
    }

    //Under, onSend() is a function from GiftedChat that assure that your new messages are saved and attached to old ones.
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    //Under, renderBubble is function from GiftedChat that allows to change the bubble messages displayed in the chat.
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{ right: { backgroundColor: '#000' } }} />
        )
    }

    //Under, renderSystemMessage is a function from GiftedChat that allows to change the SystemMessage displayed in the chat.
    renderSystemMessage(props) {
        return (
            <SystemMessage
                {...props}
                textStyle={{
                    color: '#000'
                }}
            />
        ) 
    }

    //Under, renderDay is a function from GiftedChat that allows to change the Date displayed in the chat.
    renderDay(props) {
        return (
            <Day
                {...props}
                textStyle={{
                    color: '#000'
                }} 
            />
        )
    }

    render() {
        
        
        const { backGroundColor } = this.props.route.params;

        return (
            <View style={{ flex: 1, backgroundColor: backGroundColor }}>
            {/*Under, GiftedChat is a library from react-native that provides a complete Chat Interface. */}
            {/*Under, 'render...' allows to read and accept the changes made in the own functions above. */}
            <GiftedChat
                renderDay={this.renderDay.bind(this)}
                renderSystemMessage={this.renderSystemMessage.bind(this)}
                renderBubble={this.renderBubble.bind(this)}
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{ _id: 1 }}
            />
            {/*Under, Platform and KeyboardAvoidingView are components from react-native 
            to 'Fix the Android Keyboard' (without, some phone Android version 
            will overlap de keyboard on the top of the messages) */}
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View> 
        )
    }
}