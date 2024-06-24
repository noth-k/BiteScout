import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

type InputFieldProps = {
    label: string,
    value: string,
    placeholder?: string,
    onChangeText: (text:string) => void,
    disabled?: boolean,
}

const InputField = ({ label, placeholder, value, onChangeText, disabled }:InputFieldProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        value={value}
        onChangeText={onChangeText}
        editable={disabled ? false : true}
        selectTextOnFocus={disabled ? false : true}
        placeholder={placeholder}
        style={[styles.inputContainer, disabled && {backgroundColor:'lightgrey'}]}
        />
    </View>
  )
}

export default InputField;

const styles = StyleSheet.create({
    container: {
        marginVertical:20,
        marginHorizontal:15,
    },
    label: {
        fontFamily: 'Inter',
        fontWeight: '300',
        fontSize:14,
        marginTop: 5,
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "gray",
        padding: 12,
        width: "100%",
        backgroundColor: "white",
    }
})