import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { User } from '@/types';
import MemberListItem from '@/components/MemberListItem';

const WaitlistScreen = () => {
  const { waitingList } = useLocalSearchParams();
  const parsedWaitingListUsers = typeof waitingList === 'string' ? JSON.parse(waitingList) : [];
  console.log(parsedWaitingListUsers);

  return (
    <View>
      {parsedWaitingListUsers.map((user: User) => (
        <MemberListItem user={user} key={user._id}/>
      ))}
    </View>
  );
};

export default WaitlistScreen;