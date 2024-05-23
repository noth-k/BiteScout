import { View, Text, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@assets/colors';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';

import api from '../api/client';

const signup = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferences, setPreferences] = useState('');
  const [restrictions, setRestrictions] = useState('');

  const handleSignUp = async () => {
    console.log(email, name, password, preferences, restrictions);
    const res = await api.post('/signup', { email, password, name, preferences, restrictions })
                            .then(res => {
                              console.log(res.data)
                            })
                            .catch(error => console.log(error));
  }

  
  return (
    <SafeAreaView>
      <FontAwesome name="long-arrow-left" style={styles.back} onPress={router.back}/>
      <View style={styles.container}>
        <Text style={styles.title}>Lets get you started</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput 
          value={name}
          onChangeText={setName}
          placeholder="Jon"
          style={styles.input}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput 
          value={email}
          onChangeText={setEmail}
          placeholder="jon@gmail.com"
          style={styles.input}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput 
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <Text style={styles.label}>Preferences</Text>
        <TextInput 
          value={preferences}
          onChangeText={setPreferences}
          placeholder= "Japanese, Thai"
          style={styles.input}
        />
        <Text style={styles.label}>Dietary Restrictions</Text>
        <TextInput 
          value={restrictions}
          onChangeText={setRestrictions}
          placeholder= "Halal"
          style={styles.input}
        />
        <Button text='Sign Up' buttonStyle={{marginTop:40}} onPress={handleSignUp} />
      </View>
    </SafeAreaView>
    
  )
}

export default signup;

const styles = StyleSheet.create({
  back: {
    marginLeft: 20, 
    fontSize:30,
    color: colors.primary800,
  },
  container: {
    padding:"10%",
  },
  title: {
    fontFamily:"Inter",
    fontSize:40,
    fontWeight:'bold',
    color: colors.primary800,
    marginBottom:20,
  },
  label: {
    fontFamily:"Inter",
    fontSize:15,
    fontWeight:"300",
    marginTop:20,
},
input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    backgroundColor: 'white',
},
})