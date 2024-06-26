import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchAllUsersApi, fetchRoomApi, resetSubmittedUsersApi } from '@/app/api/api';
import { Room, User } from '@/types';
import colors from '@assets/colors';
import { FontAwesome } from '@expo/vector-icons';
import MemberAddIconComponent from '@/components/MemberAddIconComponent';
import CircularProgress from '@/components/CircularProgress';
import { useAuthContext } from '@/providers/AuthProvider';
import { useFocusEffect } from '@react-navigation/native';
import recommend from '../home/recommend';

const RoomScreen = () => {
  const { id } = useLocalSearchParams();
  const { user } = useAuthContext();
  const router = useRouter();
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const currUsers = users?.filter((user: User) => roomData?.users.includes(user._id));
  const waitingUsers = currUsers?.filter((user: User) => !roomData?.submittedUsers.includes(user._id || ''));



  const handleSubmit = () => {
    router.push({
        pathname: './selection',
        params: {
            roomData: JSON.stringify(roomData)
        }
    });
  };

  const handleWaitlist = () => {
    router.push({
      pathname: '/rooms/waitlist',
      params: { waitingList: JSON.stringify(waitingUsers) },
    });
  };

  const handleSettings = () => {
    router.push({
      pathname: './settings',
      params: {
        roomData: JSON.stringify(roomData),
        currUsers: JSON.stringify(currUsers),
      },
    });
  };

  const handleReset = async () => {
    await resetSubmittedUsersApi(roomData?._id || "");
  }

  const fetchData = async () => {
    try {
      const roomResponse: any = await fetchRoomApi(id);
      setRoomData(roomResponse.room);

      const usersResponse: any = await fetchAllUsersApi();
      setUsers(usersResponse);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const settingSubmitted = () => {
    if (roomData?.submittedUsers.includes(user?._id || "")) {
        setSubmitted(true);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
      settingSubmitted();
    }, [id, roomData])
  );

  return (
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      <View style={styles.header}>
        <View style={styles.title}>
          <FontAwesome name="angle-left" style={styles.back} onPress={() => router.back()} />
          <Text style={styles.roomName}>{roomData?.name}</Text>
          <FontAwesome name="cog" style={styles.settings} onPress={handleSettings} />
        </View>
        <View style={styles.roomDetails}>
          <CircularProgress
            userCount={roomData?.users.length || 0}
            submitCount={roomData?.submittedUsers.length || 0}
            style={{ marginLeft: 30 }}
          />
          <View>
            {roomData?.submittedUsers.length != roomData?.users.length && <Text style={styles.waitLabel} onPress={handleWaitlist}>
              Waiting on...
            </Text>}

            {roomData?.submittedUsers.length == roomData?.users.length && <Text style={styles.waitLabel} onPress={handleReset}>
              Reset Room
            </Text>}


            <TouchableOpacity style={styles.submit} disabled={roomData?.submittedUsers.includes(user?._id || "")} onPress={handleSubmit}>
              <Text style={styles.submitText}>Select Vibe</Text>
            </TouchableOpacity>
          </View>
        </View>
        {roomData?.submittedUsers.length == roomData?.users.length && <TouchableOpacity style={styles.recommend} onPress={() => {}}>
              <Text style={styles.submitText}>Recommendation</Text>
            </TouchableOpacity>}
      </View>
      <Text style={{ fontFamily: 'Inter', margin: 20, fontWeight: 'bold', color: 'lightgrey' }}>
        Past Recommendations feature not included yet
      </Text>
    </View>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary400,
    height: '50%',
    borderRadius: 15,
    shadowColor: 'black',
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  title: {
    height: '25%',
    flexDirection: 'row',
  },
  back: {
    fontSize: 24,
    color: 'white',
    marginTop: 'auto',
    padding: 20,
  },
  settings: {
    fontSize: 25,
    color: 'white',
    marginTop: 'auto',
    padding: 20,
    marginLeft: 'auto',
  },
  roomName: {
    marginTop: 'auto',
    fontFamily: 'Inter',
    color: 'white',
    fontSize: 20,
    padding: 20,
    marginLeft: '18%',
  },
  roomDetails: {
    flexDirection: 'row',
    marginTop: 30,
  },
  waitLabel: {
    color: 'white',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: '25%',
    marginTop: '10%',
  },
  submit: {
    backgroundColor: 'white',
    padding: 10,
    width: '60%',
    alignSelf: 'center',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    marginTop: 40,
  },
  submitText: {
    color: colors.primary400,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recommend: {
    backgroundColor: 'white',
    padding: 10,
    width: '75%',
    alignSelf: 'center',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    marginTop: 40,
  }
});
