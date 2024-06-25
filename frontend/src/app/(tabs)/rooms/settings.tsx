import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import colors from '@assets/colors';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MemberListItem from '@/components/MemberListItem';
import { User } from '@/types';



const settings = () => {
    //Members
    //Add Friends
    //Leave Group
    //Delete Group

    const router = useRouter();
    const { roomId, currUsers } = useLocalSearchParams();
    const parsedcurrUsers = JSON.parse(typeof currUsers === 'string' ? currUsers : '[]');

  return (
    <View style={{backgroundColor:'white', height:'100%'}}>
      <View style={styles.header}>
        <FontAwesome 
        name="angle-left"
        style={styles.icon}
        onPress={() => router.back()}/>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView>
        <Text style={styles.memberText}>Members: </Text>
        {parsedcurrUsers.map((user: User) => (
            <MemberListItem user={user} key={user._id}/>
        ))}

        <Text style={styles.label}>Leave Group</Text>
        <Text style={styles.label}>Delete Group</Text>
      </ScrollView>
    </View>
  )
}

export default settings;

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: '15%',
        backgroundColor: colors.primary400,
        shadowColor: 'black',
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        flexDirection:'row',
    },
    icon: {
        color:'white',
        fontSize:24,
        marginTop:'auto',
        marginBottom:20,
        marginLeft:20,
    },
    title: {
        fontFamily:'Inter',
        fontWeight:'400',
        marginTop:'auto',
        marginLeft:'33%',
        color:'white',
        marginBottom:20,
        fontSize:20,
    },
    memberText: {
        fontFamily:'Inter',
        fontSize:15, 
        marginTop:20,
        marginBottom:10,
        marginLeft:20,
    },
    label: {
        padding:20, 
        color:'red',
        fontFamily:'Inter',
        fontSize:15,
        textAlign:'center',
    }
})