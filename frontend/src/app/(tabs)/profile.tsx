import { View, Text } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import Button from '@/components/Button';

const profile = () => {
  const router = useRouter();
  return (
    <View>
      <Text>profile</Text>
      <Button text="Log out" onPress={() => router.push('/')}/>
    </View>
  )
}

export default profile