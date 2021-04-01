import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { View } from 'react-native';

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
        height: 30,
        borderRadius: 7,
        borderBottomWidth: 1,
        borderBottomColor: '#bbb',
        borderTopWidth: 1,
        borderTopColor: '#bbb',
        borderLeftWidth: 1,
        borderLeftColor: '#bbb',
        borderRightWidth: 1,
        borderRightColor: '#bbb',
        marginLeft: 1,
        marginRight: 1,
        paddingLeft: 4
    },
    spacer: {
        width: 20
    }
};

export const IndividualCharsInput = ( props: TIndividualCharsInput ) => {

    const { wordStructure } = props;

    return (
        <View style={ individualCharsInputStyles.inputWrapper as any }>
            { wordStructure.map( ( singleInput, index ) => {
                if ( singleInput ) {
                    return (
                        <TextInput
                            key={ index.toString() }
                            style={ individualCharsInputStyles.singleInput }
                            maxLength={ 1 }
                        />
                    );
                } else {
                    return (
                        <View key={ index.toString() } style={ individualCharsInputStyles.spacer } />
                    );
                }
            } ) }
        </View>
    );

};
