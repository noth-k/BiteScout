import { View, Text, ImageBackground, StyleSheet, Image, Pressable, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthContext } from '@/providers/AuthProvider';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BubbleTextComponent from '@/components/BubbleTextComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/Button';

const profileBackground = require("@assets/images/profileBackground.jpg");
const profileMan = require("@assets/images/profileMan.jpg");

const index = () => {
  const { user, dispatch } = useAuthContext();
  const router = useRouter();
  const preferences = user?.preferences || 'undefined'
  const preferencesArr = preferences.split(',');
  const restrictions = user?.restrictions || 'undefined'
  const restrictionsArr = restrictions.split(',');
  

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
    } catch (e) {
      console.log("Failed to remove user token");
    }
  };

  return (
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <ImageBackground source={profileBackground} resizeMode="cover" style={styles.image}>
            <View style={styles.overlay}/>
            <TouchableOpacity style={styles.editComponent} onPress={() => router.push('/profile/editProfile/')}> 
              <FontAwesome
                  name="pencil"
                  style={styles.editPencil}
                />
                <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>
              
              <View style={styles.nameContainer}>
                <Image style={styles.profilePicture} source={profileMan}/>
                <View style={styles.nameDetails}>
                  <View style={{padding: 7, marginLeft:10}}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.details}>{user?.name}</Text>
                  </View>
                  <View style={{padding: 7, marginLeft:10}}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.details}>{user?.email}</Text>
                  </View>          
                </View>
              </View>
          </ImageBackground>
        </View>

        {/* main */}
        <ScrollView style={styles.main}>
          <BubbleTextComponent items={preferencesArr || []} title={'Preferences'}/>
          <BubbleTextComponent items={restrictionsArr || []} title={'Restrictions'}/>
          
          <Text style={{marginTop: 20, marginLeft:20, marginRight:20, fontSize:20, fontFamily:'Inter', fontWeight:'400'}}>Past Recommendations</Text>
          <View style={styles.past}>
            {/* some component for resturants */}
          </View>
          <Button
            text="Log out"
            onPress={() => {
              dispatch({ type: "LOGOUT", payload: null });
              router.push("/");
              logout();
            }}
            style={{margin:'5%'}}
          />
        </ScrollView>
      </View>
    
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    height:'100%',
    backgroundColor:'white',
  },
  header: {
    height:'40%'
  },
  editComponent: {
    alignSelf:'flex-end',
    flexDirection:'row',
  },
  edit: {
    fontFamily:'Inter', 
    fontSize: 15, 
    color:'white', 
    marginTop:16, 
    marginRight:17,
    fontWeight:'600'
  },
  editPencil: {
    fontSize: 20,
    marginRight:10,
    marginTop:15,
    color:'white'
  },
  image: {
    flex:1,
    justifyContent:'center',
    shadowColor:'black',
    shadowOffset:{
      width:-2,
      height:2,
    },
    shadowOpacity:0.5,
    shadowRadius:3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    justifyContent: 'center',
    opacity:0.3,
  },
  nameContainer: {
    flexDirection:'row',
    marginLeft:"10%",
    marginRight:'10%',
    marginTop: '15%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding:10,
    borderRadius:6,
    shadowColor:'black',
    shadowOffset:{
      width:-2,
      height:2,
    },
    shadowOpacity:0.5,
    shadowRadius:5,
  },
  profilePicture: {
    height: 100,
    width: 100,
    borderRadius: 70,
    borderWidth:1,
    borderColor:'grey',
    flex: 1,
  },
  nameDetails: {
    flex:2,
  },
  details: {
    fontFamily:'Inter',
    fontSize:15,
    fontWeight:'300',
  },
  label: {
    fontFamily:'Inter',
    fontSize:16,
    fontWeight:'500',
  },
  main: {
    flex:2,
  },
  past: {
    padding:20,
    margin:'5%',
    borderWidth: 1,
    borderColor:'grey',
    shadowColor:'black',
    shadowOffset:{
      width:-2,
      height:2,
    },
    shadowOpacity:0.5,
    shadowRadius:5,
  }
})