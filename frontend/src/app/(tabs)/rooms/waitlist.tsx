import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import MemberListItem from '@/components/MemberListItem';
import { fetchAllUsersApi } from '@/app/api/api';
import { User } from '@/types';


const waitlist = () => {
  const route = useRoute();
  const [users, setUsers] = useState<User[] | []>([]);
  const { waitingList } = route.params as { waitingList:string[] };
  const waitingListUsers = users.filter(user => waitingList.includes(user._id || ""))

  useEffect(() => {
    const getUsers = async () => {
      const users:any = await fetchAllUsersApi();
      setUsers(users);
    }
    getUsers();
  })

  

  return (
    <View style={{marginBottom: 20}}>
      {waitingListUsers.map(user => (
        <MemberListItem user={user} key={user._id}/>
      ))}
    </View>
  )
}

export default waitlist