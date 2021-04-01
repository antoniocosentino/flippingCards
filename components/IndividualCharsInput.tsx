import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { styles } from '../styles/styles';

type TIndividualCharsInput = {
    wordStructure: ReadonlyArray<boolean>
}

const individualCharsInputStyles = {
    inputWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    singleInput: {
        width: 20,
        height: 20,
        borderBottomWidth: 2,
        marginLeft: 1,
        marginRight: 1,
        borderBottomColor: '#666'
    },
    spacer: {
        width: 20
    }
};

export const IndividualCharsInput = ( props: TIndividualCharsInput ) => {

    const { wordStructure } = props;

    return (
        <View style={ individualCharsInputStyles.inputWrapper }>
            { wordStructure.map( ( singleInput, index ) => {
                if ( singleInput ) {
                    return (
                        <TextInput
                            key={ index.toString() }
                            style={ individualCharsInputStyles.singleInput }
                        />
                    );
                } else {
                    return (
                        <View key={ index.toString() } style={ individualCharsInputStyles.spacer } />
                    )
                }
            } ) }
        </View>
    );

};
