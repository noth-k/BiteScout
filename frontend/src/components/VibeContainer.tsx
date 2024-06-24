import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import colors from '@assets/colors';

type vibeContainerProps = {
    selected?: boolean;
    vibe: String
}

const VibeContainer = ({selected, vibe}: vibeContainerProps) => {
  return (
    <TouchableOpacity style={[styles.container]}>
      <Text style={[styles.label]}>{vibe}</Text>
    </TouchableOpacity>
  )
}

export default VibeContainer;

const styles = StyleSheet.create({
    container: {
        borderColor:'lightgrey',
        borderRadius:10,
        shadowColor:'black',
        shadowOffset:{
        width:-2,
        height:2,
        },
        shadowOpacity:0.5,
        shadowRadius:3,
        justifyContent:'center',
        backgroundColor: 'white',
        width:120,
    },
    label: {
        color:colors.primary400,
        textAlign:'center',
        padding:12,
    }
})