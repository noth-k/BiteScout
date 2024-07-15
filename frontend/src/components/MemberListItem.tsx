import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { User } from '@/types';
import { FontAwesome5 } from '@expo/vector-icons';

type MemberListItemProps = {
    user?: User | null,
    selected?: boolean,
    deletable?: boolean,
    deletableFunc?: () => void
}

const avatarImages: { [key: string]: any } = {
  man_1: require('@assets/images/man_1.png'),
  man_2: require('@assets/images/man_2.png'),
  man_3: require('@assets/images/man_3.png'),
  man_4: require('@assets/images/man_4.png'),
  man_5: require('@assets/images/man_5.png'),
  man_6: require('@assets/images/man_6.png'),
  man_7: require('@assets/images/man_7.png'),
  man_8: require('@assets/images/man_8.png'),
  woman_1: require('@assets/images/woman_1.png'),
  woman_2: require('@assets/images/woman_2.png'),
  woman_3: require('@assets/images/woman_3.png'),
  woman_4: require('@assets/images/woman_4.png'),
  woman_5: require('@assets/images/woman_5.png'),
  woman_6: require('@assets/images/woman_6.png'),
  woman_7: require('@assets/images/woman_7.png'),
  woman_8: require('@assets/images/woman_8.png'),
};

const MemberListItem = ({ user, selected, deletable, deletableFunc }: MemberListItemProps) => {
  const avatarSource = avatarImages[user?.avatar || 'man_1'];
  return (
    <View style={!selected ? styles.memberContainer : [styles.memberContainer,{backgroundColor:'lightgrey'}]}>
      <Image source={avatarSource} resizeMode="contain" style={styles.picture}/>
      <View style={{flex:7}}>
        <Text style={styles.label}>{user?.name}</Text>
        <Text style={styles.label}>{user?.email}</Text>
      </View>
      { deletable && <FontAwesome5
      name="times"
      onPress={deletableFunc}
      style={styles.cross}
      />}
    </View>
  )
}

export default MemberListItem;

const styles = StyleSheet.create({
    memberContainer: {
        backgroundColor:'white',
        marginHorizontal:15,
        flexDirection:'row',
        borderColor:'lightgrey',
        borderWidth:2,
        borderRadius: 10,
        padding:8,
        alignItems:'center',
        marginBottom:7,
    },
    picture: {
        height: 40,
        width:40,
        flex:1,
    },
    label: {
        fontFamily:'Inter',
        fontWeight:'400',
        marginLeft: 20,
        fontSize:14,
    },
    cross: {
      fontSize:20,
      color: 'lightgrey',
      marginRight:10,
    }
})