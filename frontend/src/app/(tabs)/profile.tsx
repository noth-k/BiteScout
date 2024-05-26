import { View, Text } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import { useAuthContext } from '@/providers/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const profile = () => {
  const router = useRouter();
  const { dispatch } = useAuthContext();
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (e) {
      console.log('Failed to remove user token');
    }
  };
  return (
    <View>
      <Text>profile</Text>
      <Button text="Log out" onPress={() => {
        dispatch({type:'LOGOUT', payload:null});
        router.push('/');
        logout()
    
        }}
      />
    </View>
  )
}

export default profile