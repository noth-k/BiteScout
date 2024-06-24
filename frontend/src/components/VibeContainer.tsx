import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import colors from '@assets/colors';

type VibeContainerProps = {
    selected?: boolean;
    vibe: String;
    onPress: () => void;
};

const VibeContainer = ({ selected, vibe, onPress }: VibeContainerProps) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                selected ? styles.selectedContainer : styles.unselectedContainer
            ]}
            onPress={onPress}
        >
            <Text style={[styles.label, selected ? styles.selectedLabel : styles.unselectedLabel]}>
                {vibe}
            </Text>
        </TouchableOpacity>
    );
};

export default VibeContainer;

const styles = StyleSheet.create({
    container: {
        borderColor: 'lightgrey',
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        paddingVertical: 12,
        paddingHorizontal: 25,
    },
    selectedContainer: {
        backgroundColor: colors.primary400,
        borderWidth: 1,
        borderColor: colors.primary400,
    },
    unselectedContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'lightgrey',
    },
    label: {
<<<<<<< roomBackend
        color:colors.primary400,
        textAlign:'center',
        padding:13,
=======
        fontSize: 16,
        textAlign: 'center',
        fontFamily:'Inter',
        fontWeight:'400',
    },
    selectedLabel: {
        color: 'white',
    },
    unselectedLabel: {
        color: "black",
>>>>>>> main
    }
});
