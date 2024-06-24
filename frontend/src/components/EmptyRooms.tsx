import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

const emptyIcon = require("@assets/images/emptyBox.png")

const EmptyRooms = () => {
  return (
    <View style={styles.container}>
        <Image source={emptyIcon} style={styles.icon}/>
        <Text style={styles.caption}>No rooms available</Text>
    </View>
  )
}

export default EmptyRooms;

const styles = StyleSheet.create({
    container: {
        height:'auto',
        backgroundColor:'white',
        justifyContent:'center'
    },
    icon: {
        height:200, 
        width:200,
        alignSelf:'center',
        marginTop:'50%',
    },
    caption: {
        textAlign:'center',
        marginTop:15,
        fontSize:18,
        fontFamily:'Inter'
    }
})
