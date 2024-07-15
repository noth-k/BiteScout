import { View, StyleSheet, Image } from 'react-native';
import React from 'react';

type AvatarListItemProps = {
  avatar: string;
  selected: boolean;
};

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

const AvatarListItem = ({ avatar, selected }: AvatarListItemProps) => {
  const avatarVector = avatarImages[avatar];

  return (
    <View style={[styles.card, selected && styles.selected]}>
      <Image source={avatarVector} style={styles.avatar} resizeMode="contain" />
    </View>
  );
};

export default AvatarListItem;

const styles = StyleSheet.create({
  card: {
    height: 150,
    width: 150,
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderColor: 'blue',
    backgroundColor: 'lightblue',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
