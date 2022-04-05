import React from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import BgImage from '../assets/background-image.png';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: '',
            backGroundColor: this.colors.green,
        };
    }

    changeBgColor = (selectedColor) => {
        this.setState({ backGroundColor: selectedColor })
    };

    colors = {
        green: '#139487',
        blue: '#86C6F4',
        brown: '#FFF1CE',
        yellow: '#D29D2B'
    }

    render() {
        return (
            
            <View style={styles.container}>
            <ImageBackground 
                source={BgImage} 
                resizeMode='cover' 
                style={styles.backgroundImage}>    
                {/* Title */}
                <View style={styles.titleBox}>
                    <Text style={styles.title}>Chatty Chatting</Text>
                </View>
                {/* TextInput */}
                <View style={styles.inputBox}>
                    <View style={styles.textInputBox}>
                        <TextInput
                            //Under, through the onChangeText the state will be updated with the typed text (in this case will show the user 'name').
                            style={styles.input}
                            onChangeText={(text) => this.setState({ name: text })}
                            value={this.state.name}
                            placeholder= 'Your Name' 
                        />
                    </View>
                    {/* Choose Background Color */}
                    <View>
                        <Text style={styles.chooseColorTitle}>Choose you're Background Color</Text>
                    </View>
                    {/* Background Color */}
                    <View style={styles.colorBox}>
                        <TouchableOpacity
                            style={styles.touchGreen}
                            onPress={() => this.changeBgColor(this.colors.green)}>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.touchBlue}
                            onPress={() => this.changeBgColor(this.colors.blue)}>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.touchBrown}
                            onPress={() => this.changeBgColor(this.colors.brown)}>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.touchYellow}
                            onPress={() => this.changeBgColor(this.colors.yellow)}>
                        </TouchableOpacity>
                    </View>
                    {/* Button */}
                    <Pressable
                        // Using the react-navigation in the onPress function we can enjoy the fast navigation defined in App.js.
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, backGroundColor: this.state.backGroundColor })} >
                    <Text style={styles.buttonText}>Start Chatting</Text>    
                    </Pressable>  
                </View>
            </ImageBackground>     
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    backgroundImage: {
        flex:1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    titleBox: {
        height: '50%',
        width: '90%',
        alignItems: 'center',
        paddingTop: 100,
    },

    title: {
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF'
    },

    inputBox: {
        backgroundColor: "white",
        height: "46%",
        width: "88%",
        justifyContent: "space-around",
        alignItems: "center",
      },

    textInputBox: {
        borderWidth: 2,
        borderRadius: 1,
        borderColor: "grey",
        width: "88%",
        height: 60,
        paddingLeft: 20,
        flexDirection: "row",
        alignItems: "center",
    },

    input: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 0.5,
    },

    chooseColorTitle: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 1,
      },

    colorBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    },

    touchGreen: {
        backgroundColor: "#139487",
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    touchBlue: {
        backgroundColor: "#86C6F4",
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    touchBrown: {
        backgroundColor: "#FFF1CE",
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    touchYellow: {
        backgroundColor: "#D29D2B",
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    button: {
        width: "60%",
        height: 60,
        borderRadius: 9,
        backgroundColor: "#8A95A5",
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
      },
})