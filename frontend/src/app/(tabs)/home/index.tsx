import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect } from 'react';
import colors from '@assets/colors';
import VibeContainer from '@/components/VibeContainer';

const displayVector = require("@assets/images/displayImage.png");

const index = () => {
  return (
    <View>
      <View style={styles.display}>
        <Image source={displayVector} style={styles.title}/>
      </View>
      <View style={{margin:15}}>
        <Text style={styles.label}>SELECT VIBE</Text>
        <VibeContainer vibe={"Test"}/>
        <Text style={styles.label}>SELECT PRICE RANGE</Text>
      </View>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  display: {
    width:'100%',
    height:'68%',
    backgroundColor:colors.primary400,
    borderRadius:10,
    shadowColor:'black',
    shadowOffset:{
      width:-2,
      height:2,
    },
    shadowOpacity:0.5,
    shadowRadius:3,
  },
  title: {
    height:210,
    width:350,
    alignSelf:'center',
    marginTop:'auto',
    marginBottom:'8%',
  },
  label: {
    fontFamily:'Inter',
    fontWeight:'bold',
    color:'grey',
    marginTop:30,
  }
})