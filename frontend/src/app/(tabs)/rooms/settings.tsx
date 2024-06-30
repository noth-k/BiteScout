import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import colors from '@assets/colors';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MemberListItem from '@/components/MemberListItem';
import { Room, User } from '@/types';
import { useAuthContext } from '@/providers/AuthProvider';
import MemberAddIconComponent from '@/components/MemberAddIconComponent';
import { deleteRoomApi, fetchRoomApi, fetchUserDataApi, removeUserApi, removeRoomFromUserApi } from '@/app/api/api';
import { useFocusEffect } from '@react-navigation/native';

const Settings = () => {
  const router = useRouter();
  const { user: authUser, dispatch:authDispatch } = useAuthContext();
  const { roomData, currUsers } = useLocalSearchParams();
  const [screenUpdate, setScreenUpdate] = useState(0);
  const [parsedcurrUsers, setParsedCurrUsers] = useState(JSON.parse(typeof currUsers === 'string' ? currUsers : '[]'));
  const [parsedRoomData, setParsedRoomData] = useState(JSON.parse(typeof roomData === 'string' ? roomData : '[]'));

  const fetchData = async () => {
    try {
      if (parsedRoomData?._id) {
        console.log('Fetching room data for ID:', parsedRoomData._id);
        const roomResponse:any = await fetchRoomApi(parsedRoomData._id);
        const updatedRoomData = roomResponse.room;

        const updatedUsers = await Promise.all(
          updatedRoomData.users.map(async (userId: string) => {
            const userResponse:any = await fetchUserDataApi(userId);
            return userResponse.user; // Extract the user object from the returned data
          })
        );

        setParsedRoomData(updatedRoomData);
        setParsedCurrUsers(updatedUsers);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [screenUpdate, parsedRoomData?._id]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleAddFriends = () => {
    const filteredUsers = (parsedRoomData?.users || []).filter(
      (user: string): user is string => user !== undefined && user !== null
    );

    router.push({
      pathname: '/rooms/addFriends/',
      params: {
        previousScreen: 'Room',
        currUsers: JSON.stringify(filteredUsers),
        roomId: parsedRoomData?._id,
      },
    });
  };

  const handleRemove = async (userId: string) => {
    await removeUserApi(parsedRoomData?._id, userId);
    const json:any = await removeRoomFromUserApi(parsedRoomData?._id, userId);
    console.log(json);
    if (authUser?._id == userId) {
        authDispatch({ type: "LOGIN", payload: json.updatedUser });
        router.push('/rooms/')
    }
    setScreenUpdate((prev) => prev + 1);
  };

  const handleDelete = async () => {
    await deleteRoomApi(parsedRoomData?._id);
    for (const user of parsedcurrUsers) {
        const json:any = await removeRoomFromUserApi(parsedRoomData?._id, user._id);
        if (user._id == authUser?._id) {
            authDispatch({ type: "LOGIN", payload: json.updatedUser});
        }
    }
    router.push('/rooms/');
  };

  return (
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      <View style={styles.header}>
        <FontAwesome name="angle-left" style={styles.icon} onPress={() => router.back()} />
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Text style={styles.memberText}>Members: </Text>
          <View style={{ marginLeft: 'auto' }}>
            <MemberAddIconComponent onPress={handleAddFriends} iconStyle={styles.icons} />
          </View>
        </View>
        {parsedcurrUsers.map((user: User) => (
          <MemberListItem
            user={user}
            key={user._id}
            deletable={parsedRoomData.submittedUsers.length == 0}
            selected={authUser?._id === user._id}
            deletableFunc={() => handleRemove(user._id || "")}
          />
        ))}
        <Text style={styles.label} onPress={() => handleRemove(authUser?._id || "")}>Leave Room</Text>
        <Text style={styles.label} onPress={handleDelete}>Delete Room</Text>
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '13%',
    backgroundColor: colors.primary400,
    shadowColor: 'black',
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: 'white',
    fontSize: 24,
    marginTop: 'auto',
    marginBottom: 20,
    marginLeft: 20,
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: '400',
    marginTop: 'auto',
    marginLeft: '33%',
    color: 'white',
    marginBottom: 20,
    fontSize: 20,
  },
  memberText: {
    fontFamily: 'Inter',
    fontSize: 15,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
  },
  label: {
    padding: 20,
    color: 'red',
    fontFamily: 'Inter',
    fontSize: 15,
    textAlign: 'center',
  },
  icons: {
    fontSize: 15,
    color: 'black',
    marginTop: 18,
  },
});
function authDispatch(arg0: { type: string; payload: any; }) {
    throw new Error('Function not implemented.');
}

