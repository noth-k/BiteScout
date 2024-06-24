import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const recommend = () => {
    const router = useRouter();
    // const { places } = useLocalSearchParams() as { places: string };
    // const parsedPlaces: Place[] = JSON.parse(places);
  return (
    <SafeAreaView>
        <View>
            {/* header */}
            <View style={styles.header}>
            <FontAwesome
                name="long-arrow-left"
                style={styles.back}
                onPress={() => router.back()}
            />
            <Text style={styles.title}>Recommendation</Text>
            </View>

            {/* main */}
            <View style={styles.mainContainer }>
                <Image />
                <View style={styles.detailContainer}>
                    <Text>Name: </Text>
                    <Text>Placeholder</Text>
                </View>
                <View style={styles.detailContainer}>
                    <Text>Address: </Text>
                    <Text>Placeholder</Text>
                </View>
                
            </View>
        </View>
    </SafeAreaView>
  )
}

export default recommend;

const styles = StyleSheet.create({
    header: {
    },
    back: {
        marginTop:10,
        marginLeft:10,
        fontSize:24,
    },
    title: {
        padding:5,
        fontSize: 20,
        textAlign: 'center',
        fontFamily:'Inter',
        fontWeight: 'bold',
    },
    mainContainer: {
        padding:5,
        margin:15,
        borderWidth:2,
        borderColor:'grey',
        shadowColor:'black',
        shadowOffset:{
            width:-2,
            height:2,
        },
        shadowOpacity:0.2,
        shadowRadius:3,
        backgroundColor:'white',

    },
    detailContainer: {
        padding:10,
        marginLeft: 10,
    }
})