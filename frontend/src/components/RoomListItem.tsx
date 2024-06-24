import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

type RoomListItemProps = {
    label: string;
    id?: string;
}

const RoomListItem = ({ label, id }: RoomListItemProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.container} onPress={() => router.push(`/(tabs)/rooms/${id}`)}>
            <View style={styles.picture}></View>
        <Text style={styles.title}>{label}</Text>
        </TouchableOpacity>
    )
}

export default RoomListItem;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderBottomColor:'#e0e0e0',
        borderBottomWidth:2,
        height: 70,
        alignItems:'center',
        flexDirection:'row',
    },
    picture: {
        backgroundColor:'#e0e0e0',
        height: 40,
        width:40,
        borderRadius:50,
        flex:1,
        marginLeft:30,

    },
    title: {
        fontFamily:'Inter',
        fontWeight:'400',
        flex:7,
        marginLeft: 20,
        fontSize:17,
    }
})