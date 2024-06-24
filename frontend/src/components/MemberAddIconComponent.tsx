import { View, Text, StyleProp, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

type MemberAddIconProps = {
    onPress: () => void,
    iconStyle: StyleProp<TextStyle>,
}


const MemberAddIconComponent = ({onPress, iconStyle}:MemberAddIconProps) => {
  return (
    <View>
        <TouchableOpacity style={styles.membersAdd} onPress={onPress}>
                <FontAwesome
                name="plus"
                style={iconStyle}
                />
                <FontAwesome
                name='user'
                style={iconStyle}
                />
        </TouchableOpacity>
    </View>
  )
}

export default MemberAddIconComponent;

const styles = StyleSheet.create({
    membersAdd: {
        flexDirection:'row',
        marginLeft:'auto',
        marginRight:20,
        marginVertical:5,
    },
})