import { View, Text, Image, StyleSheet, TextInput } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@assets/colors';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';

const loginVector = require("@assets/images/LoginVector.png");



const login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log(email, password);
    }

    return (
        <SafeAreaView>
            <FontAwesome name="long-arrow-left" style={styles.back} onPress={router.back}/>
            <View style={styles.container}>
                <Image source={loginVector} style={styles.vector}/>
                <Text style={styles.title}>Login</Text>
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
                <Text style={styles.changePassword}>Forget your password?</Text>
                <Button text='Log In' onPress={handleLogin}/>
            </View>
        </SafeAreaView>
  )
}

export default login;

const styles = StyleSheet.create({
    back: {
        marginLeft: 20, 
        fontSize:30,
    },
    container: {
        alignSelf:'center',
    },
    vector: {
        height:410,
        width:300,
    },
    title: {
        fontFamily:"Inter",
        fontSize:40,
        fontWeight:"bold",
        color: colors.primary800,

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
    changePassword: {
        textAlign:"right",
        fontFamily:"Inter",
        fontWeight:"300",
        color:colors.primary800,
        marginBottom:15,
        marginTop:5,
    },
    
})