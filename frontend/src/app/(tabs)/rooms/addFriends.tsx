import { View, Text, Platform, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { searchUserApi, updateRoomApi, updateRoomsApi } from "../../api/api";
import MemberListItem from '@/components/MemberListItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '@/types';
import { useRouter } from 'expo-router';
import { useSelectedUsersContext } from '@/providers/SelectedUsersProvider';
import { useRoute } from '@react-navigation/native';
import { useAuthContext } from '@/providers/AuthProvider';



const addFriendsScreen = () => {
    
    const [search, setSearch] = useState('');
    const { user:authUser } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const router = useRouter();
    const route = useRoute();
    const { previousScreen, currUsers, roomId} = route.params as { previousScreen: string, currUsers:string[], roomId: string };
    const { selectedUsersState, dispatch } = useSelectedUsersContext();
    
    
    

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const initialUsers = await searchUserApi('') as never[];
                console.log("users: ", initialUsers);
                setUsers(initialUsers.filter((user:User) => user._id != authUser?._id));
            } catch (error) {
                console.error('Error fetching initial users:', error);
            }
        };

        fetchUsers();
        setSelectedUsers(selectedUsersState);
    }, []);


    const removeCommonObjects = (array1:User[], array2:User[]) => {
        // Create a set of IDs from array2 for quick lookup
        const idsInArray2 = new Set(array2.map(item => item._id));
        
        // Filter out items from array1 that have IDs present in array2
        const filteredArray1 = array1.filter(item => !idsInArray2.has(item._id));
        
        return filteredArray1;
    };

    const isSelected = (user:User) => {
        return selectedUsers.some(selectedUser => selectedUser._id === user._id)
    }


    const handleSearch = async () => {
        const searchTerm = search;
        setLoading(true);
        const json: any = await searchUserApi(searchTerm);
        setUsers(json);
        setLoading(false);

    }

    const handleSelectUser = (user: User) => {
        if (isSelected(user)) {
            setSelectedUsers(prevSelected => prevSelected.filter(selectedUser => selectedUser._id !== user._id));
            if (user._id) {
                dispatch({ type: "DELETE_USER", payload: user._id });
            }
        } else {
            setSelectedUsers(prevSelected => [...prevSelected, user]);
            console.log(selectedUsers);
        }
        
    };

    //from create
    const handleSubmitUsers = () => {
        router.back();
        //need to make sure the incoming selectedusers is not in the context
        let currSelectedUsers = selectedUsers;
        currSelectedUsers = removeCommonObjects(currSelectedUsers, selectedUsersState);

        //add users to selectedUsersContext
        dispatch({ type: "ADD_USERS", payload: currSelectedUsers });
    }

    //from room
    const handleAddUsers = async() => {

        //filter out the current users
        const newUserIds = selectedUsers.map(user => user?._id || "").filter(userId => !currUsers.includes(userId));
        console.log(newUserIds);

        //update the room to include new users
        const json = await updateRoomApi(roomId, newUserIds);
        console.log("updated room",json)

        //update the rooms array in all new users:
        for (const userId of newUserIds ) {
            const json = await updateRoomsApi(userId, roomId);
            console.log("updated user")
        }
        setSelectedUsers([]);
        router.back();
    }

  return (
    <View style={{backgroundColor:'white', height:'100%'}}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto' }/>
      <View style={styles.search}>
        <TextInput 
            style={styles.searchBar}
            placeholder="Enter friend's email here"
            value={search}
            onChangeText={(text) => setSearch(text)}/>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <FontAwesome6 name="magnifying-glass" style={styles.searchIcon} />
            <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>
      <FlatList 
        data ={users}
        renderItem={({item }:any) => (
            <TouchableOpacity onPress={() => handleSelectUser(item)}>
                <MemberListItem user={item} selected={isSelected(item)}/>
            </TouchableOpacity>
        )}
        style={{marginTop:20, height:'70%'}}/>
        <Text style={styles.submit} onPress={(previousScreen == "Create") ? handleSubmitUsers : handleAddUsers}>Let's go!</Text>
    </View>
  )
}

export default addFriendsScreen;

const styles = StyleSheet.create({
    search: {
        backgroundColor: 'white',
        borderWidth:1, 
        borderColor:'lightgrey',
        borderRadius:25, 
        height:40, 
        width: '90%',
        alignSelf:'center',
        marginTop:10,
        flexDirection:'row'
    },
    searchIcon: {
        color:'white',
        fontSize:22,
        flex:1,
        alignSelf:'center',
        marginLeft:'10%',
        
    },
    searchButton: {
        flexDirection:'row',
        width:'30%',
        height:40,
        alignSelf:'flex-end',
        backgroundColor:'lightgrey',
        borderRadius:25,
        alignContent:'center',
    },
    searchText: {
        alignSelf:'center',
        color:'white',
        flex:1.5,
        marginRight:'9%',
        fontFamily:'Inter',
        fontWeight:'300',
        fontSize:15,
    },
    searchBar: {
        flex:6,
        marginLeft:15,
    },
    submit: {
        margin:25,
        fontFamily:'Inter',
        fontSize: 15,
        textAlign:'center',
    }
})

