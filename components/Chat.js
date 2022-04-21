import React from 'react';
import { View, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
import { GiftedChat, Bubble, SystemMessage, Day, InputToolbar } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';


//Under, LogBox is a at the moment a temporarily workaround for the 'Warning' issue specified in the array.
LogBox.ignoreAllLogs();

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
            user: '',
            isConnected: false,
            image: null,
            location: null
        }

        //Under, the condition verifies if the firebaseConfig credentials are correct to initialize the app.
        if (!firebase.apps.length){
            firebase.initializeApp(firebaseConfig);
        }
    }

    componentDidMount() {
        // to find out the user's connection status
        NetInfo.fetch().then(connection => {
          // if user is online, fetch data from server
          if (connection.isConnected) {
            // Under, referenceChatMessages connects to the 'messages' collection in the Firestore.
            this.referenceChatMessages = firebase.firestore().collection('messages');
            this.setState({
              isConnected: true
            });
    
            // listen to authentication events
            this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
              // when no user is signed in, create new user by signing in anonymously (a temporary account)
              if (!user) {
                await firebase.auth().signInAnonymously();
              }
    
              // update user state with currently active user data
              this.setState({
                uid: user.uid,
                messages: [],         
                user: {
                  _id: user.uid,
                  name: name,
                  avatar: 'https://placeimg.com/140/140/any'
                }
              });
    
              // access stored messages of current user
              this.refMsgsUser = firebase
                .firestore()
                .collection('messages')
                .where('uid', '==', this.state.uid);
    
              // listens for updates in the collection
              this.unsubscribe = this.referenceChatMessages
                .orderBy('createdAt', 'desc')
                .onSnapshot(this.onCollectionUpdate);
            });
    
            //Under, save messages and user when online
            this.saveMessages();
            this.saveUser();
          } else {
            this.setState({
              isConnected: false
            });     
            //Under, when Offline loads messages from AsyncStorage.
            this.getMessages();
            this.getUser();
          }
        });

        //Under, will setOptions makes the typed 'name' being saved in the state and by consequence showing it in the navigation menu.
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });
    }
    
    componentWillUnmount() {
        if (this.state.isConnected) {
          // stop listening to authentication
          this.authUnsubscribe();
          // stop listening for changes
          this.unsubscribe();
        }
    }

    // takes snapshot on collection update
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
        // get the queryDocumentSnapshot's data
        var data = doc.data();
        // each field within each doc is saved into the messages object
        messages.push({
            //Under, 'doc' was used instead of 'data' to synchronized with correct 'id' with GiftedChat.
            _id: doc.id,
            text: data.text || '',
            createdAt: data.createdAt.toDate(),
            user: {
            _id: data.user._id,
            name: data.user.name,
            avatar: data.user.avatar
            },
            image: data.image || null,
            location: data.location || null
        });
        });
        // renders messages object in the app
        this.setState({
        messages: messages
        });
        this.saveMessages();
        this.saveUser();
    }

    //Under, onSend() is a function from GiftedChat that assure that your new messages are saved and attached to old ones.
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => { 
            //Under, addMessages() function is added here since now the messages are being defined on that function.
            this.addMessages();
            //Under, saveMessages() function is added here to save the messages on the AsyncStorage when user send it.
            this.saveMessages();
            //Under, saveUser() function is added here to save the user on the AsyncStorage to be synchronized offline with their own messages.
            this.saveUser();
        })
    }

    // Under, add messages to database
    addMessages() { 
        const message = this.state.messages[0];
        // add a new messages to the collection. Same structure used to build the collection documents in database is used here. Otherwise will not work.
        this.referenceChatMessages.add({
        _id: message._id,
        text: message.text || "",
        createdAt: message.createdAt,
        user: this.state.user,
        image: message.image || "",
        location: message.location || null
        });
    }

    //START Methods for AsyncStorage.
    // Under, get the messages from the AsyncStorage.
    getMessages = async () => {
        let messages = '';
        try {
          messages = await AsyncStorage.getItem('messages') || [];
          this.setState({
            messages: JSON.parse(messages)
          });
        } catch (error) {
          console.log(error.message);
        }
    };

    //Under, saves the messages in the AsyncStorage.
    saveMessages = async () => {
        try {
          await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
          console.log(error.message);
        }
    }

    //Under, deletes the messages from AsyncStorage.
    deleteMessages = async () => {
        try {
          await AsyncStorage.removeItem('messages');
          this.setState({
            messages: []
          })
        } catch (error) {
          console.log(error.message);
        }
    }

    //Under, saves user to asyncStorage and furthermore display the bubble messages in the correct side when Offline.
    saveUser = async () => {
        try {
        await AsyncStorage.setItem('user', JSON.stringify(this.state.user));
        } catch (err) {
        console.log(err.message);
        }
    }

    //Under, get the user from AsyncStorage and furthermore use to identify to their own conversation(bubble) when Offline.
    getUser = async () => {
        let user = '';
        try {
        user = await AsyncStorage.getItem('user') || [];
        this.setState({
            user: JSON.parse(user)
        });
        } catch (err) {
        console.log(err.message);
        }
    }
    //ENDS, Methods for AsyncStorage.

    

    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
          return (
            <MapView
              style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
              region={{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          );
        }
        return null;
    }

    renderCustomActions(props) {
        return <CustomActions {...props} />;
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

    //Under, hides the toolbar if the User is offline.
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
          return(
            <InputToolbar
            {...props}
            />
          );
        }
    }

    render() {
        const { backGroundColor } = this.props.route.params;

        return (
            <View style={{ flex: 1, backgroundColor: backGroundColor }}>
            {/*Under, GiftedChat is a library from react-native that provides a complete Chat Interface. */}
            {/*Under, 'render...' allows to read and accept the changes made in the own functions above. */}
            <GiftedChat
                renderActions={this.renderCustomActions}
                renderCustomView={this.renderCustomView}
                renderInputToolbar={this.renderInputToolbar.bind(this)}
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