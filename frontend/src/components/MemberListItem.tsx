import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { User } from '@/types';
import { FontAwesome5 } from '@expo/vector-icons';

type MemberListItemProps = {
    user?: User | null,
    selected?: boolean,
    deletable?: boolean,
    deletableFunc?: () => void,
}

const MemberListItem = ({ user, selected, deletable, deletableFunc }: MemberListItemProps) => {
  return (
    <View style={!selected ? styles.memberContainer : [styles.memberContainer,{backgroundColor:'lightgrey'}]}>
      <View style={styles.picture}></View>
      <View style={{flex:7}}>
        <Text style={styles.label}>{user?.name}</Text>
        <Text style={styles.label}>{user?.email}</Text>
      </View>
    </View>
  )
}

export default MemberListItem;

const styles = StyleSheet.create({
    memberContainer: {
        backgroundColor:'white',
        marginHorizontal:15,
        flexDirection:'row',
        borderColor:'lightgrey',
        borderWidth:2,
        borderRadius: 10,
        padding:8,
        alignItems:'center',
        marginBottom:7,
    },
    picture: {
        backgroundColor:'#e0e0e0',
        height: 40,
        width:40,
        borderRadius:50,
        flex:1,
    },
    label: {
        fontFamily:'Inter',
        fontWeight:'400',
        marginLeft: 20,
        fontSize:14,
    }
})