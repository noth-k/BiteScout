import { View, Text, Image, StyleSheet } from 'react-native'
import Button from '@/components/Button';
import colors from '../../assets/colors'
import { Redirect, useRouter } from 'expo-router';
import { useAuthContext } from '@/providers/AuthProvider';
import { useEffect } from 'react';

const startVector = require("@assets/images/StartVector.png");

const index = () => {
    const router = useRouter();
    const desc = "Begin your exciting journey of stress free night-outs & adventurous restaurant choices today";
    const { user } = useAuthContext();

    useEffect(() => {
        if (user != null) {
            router.push('/(tabs)/');
        }
    }, [user]);

  return (
    <View style={styles.container}>
      <Image source={startVector} style={styles.vector}/>
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Text style={styles.title}>BiteScout</Text>
      <Text style={styles.desc}>{desc}</Text>
      <Button text="Login" buttonStyle={styles.login} onPress={() => router.push('/(auth)/login')} />
      <Button text="Sign Up" textStyle={{color: colors.primary800}} buttonStyle={styles.signUp} onPress={() => router.push('/(auth)/signup')}/>
    </View>
  )
}

export default index;

const styles = StyleSheet.create({
    container: {
        paddingLeft:"10%",
        paddingRight:"10%",
    },
    vector: {
        height:300,
        width:300,
        marginTop:100,
       
    },
    welcomeText: {
        marginTop:25,
        fontSize:20,
        fontFamily:"Inter",
        fontWeight:"300",
    },
    title: {
        marginTop:15,
        fontSize:40,
        fontFamily:'Inter',
        fontWeight:'bold',
        color: colors.primary800,
    },
    desc: {
        marginTop:20,
        fontSize:14,
        fontFamily:"Inter",
        fontWeight:"300",

    },
    login: {
        marginTop:60,
    },
    signUp: {
        backgroundColor:"white",
        borderColor:colors.primary800, 
        borderWidth:1,
        marginVertical:1,
    }
})