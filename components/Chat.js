import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, SystemMessage, Day } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import 'firebase/firestore';


//Under, firebaseConfig are the credentials from the Database created in Firebase. (Firebase/ProjectSettings/YourApps/WebApp).
// Then, firebaseConfig is used under in firebase.initializeApp.
const firebaseConfig = {
    apiKey: "AIzaSyAnq2ovFN98gCqkXk21P80rlgMAB4QbLjA",
    authDomain: "chatapp-bf3cb.firebaseapp.com",
    projectId: "chatapp-bf3cb",
    storageBucket: "chatapp-bf3cb.appspot.com",
    messagingSenderId: "537827933031",
    appId: "1:537827933031:web:03ae4f94b4201d6ad00dc2",
    measurementId: "G-K827FDD549"
  };

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
            },
        }

        //Under, the condition verifies if the firebaseConfig credentials are correct to initialize the app.
        if (!firebase.apps.length){
            firebase.initializeApp(firebaseConfig);
        }

        // Under, referenceChatMessages connects to the 'messages' collection in the Firestore.
        this.referenceChatMessages = firebase.firestore().collection('messages');
        this.refMsgsUser = null;
    }

    componentDidMount() {
        //Under, will setOptions makes the typed 'name' being saved in the state and by consequence showing it in the navigation menu.
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });
        //Under, user authentication
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
            await firebase.auth().signInAnonymously();
            }
            //Under, update user state with currently active user data
            this.setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: "https://placeimg.com/140/140/any",
                },
            });
            // Under, check for updates in the collection
            this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate)
        });
    }

    componentWillUnmount() {
        // Under, unsubscribe from collection updates and authUnsubscribe. Otherwise it will be in one endless loop.
        this.authUnsubscribe();
        this.unsubscribe();
    }

    // Under, when updated set the messages state with the current data
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar
                }
            });
        });
        this.setState({
            messages: messages
        });
    };

    // Under, add messages to database
    addMessages() { 
    const message = this.state.messages[0];
    // add a new messages to the collection. Same structure used to build the collection documents in database is used here. Otherwise will not work.
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: this.state.user
    });
  }

    //Under, onSend() is a function from GiftedChat that assure that your new messages are saved and attached to old ones.
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => { 
            //Under, addMessages() function is added here since now the messages are being defined on that function.
            this.addMessages();
        })
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
                user={{ 
                    _id: this.state.user._id,
                    name: this.state.user.name,
                    avatar: this.state.user.avatar
                 }}
            />
            {/*Under, Platform and KeyboardAvoidingView are components from react-native 
            to 'Fix the Android Keyboard' (without, some phone Android version 
            will overlap de keyboard on the top of the messages) */}
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View> 
        )
    }
}