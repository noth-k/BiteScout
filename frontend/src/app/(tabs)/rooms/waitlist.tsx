import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import MemberListItem from '@/components/MemberListItem';
import { fetchAllUsersApi } from '@/app/api/api';
import { User } from '@/types';
import { useLocalSearchParams } from 'expo-router';


const waitlist = () => {
  const { waitingListUsers } = useLocalSearchParams();
  const parsedWaitingListUsers = typeof waitingListUsers === 'string' ? JSON.parse(waitingListUsers) : [];
  console.log(parsedWaitingListUsers);

  

  return (
    <View style={{marginBottom: 20}}>
      {parsedWaitingListUsers.map((user: User)=> (
        <MemberListItem user={user} key={user._id}/>
      ))}
    </View>
  )
}

export default waitlist