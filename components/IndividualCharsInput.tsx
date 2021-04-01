import React, { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { View, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

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

const defaultProps = {
    autoFocus: true
};

const getNextValidIndex = ( wordStructure: ReadonlyArray<boolean>, currentIndex: number ): number => {

    if ( currentIndex > wordStructure.length ) {
        return currentIndex;
    }

    if ( wordStructure[ currentIndex + 1 ] ) {
        return currentIndex + 1;
    }

    return getNextValidIndex( wordStructure, currentIndex + 1 );
};

const getPreviousValidIndex = ( wordStructure: ReadonlyArray<boolean>, currentIndex: number ): number => {

    if ( currentIndex <= 0 ) {
        return currentIndex;
    }

    if ( wordStructure[ currentIndex - 1 ] ) {
        return currentIndex - 1;
    }

    return getPreviousValidIndex( wordStructure, currentIndex - 1 );
};


export const IndividualCharsInput = ( props: TIndividualCharsInput ) => {

    const mergedProps = {
        ...defaultProps,
        ...props
    };

    const { wordStructure, autoFocus } = mergedProps;

    const inputsRef = useRef( [] as any );

    const [ activeLetter, setActiveLetter ] = useState( 0 );

    useEffect( () => {
        inputsRef.current = inputsRef.current.slice( 0, wordStructure.length );
    }, [ wordStructure ] );

    useEffect( () => {
        if ( autoFocus ) {
            inputsRef?.current?.[0]?.focus();
        }
    }, [ autoFocus ] );

    useEffect( () => {
        inputsRef?.current?.[activeLetter]?.focus();
    }, [ activeLetter ] );

    const onType = ( letter: string, index: number ) => {
        const nextIndex = getNextValidIndex( wordStructure, index );

        if ( letter ) {
            setActiveLetter( nextIndex );
            inputsRef?.current?.[nextIndex]?.clear();
        }
    };

    const checkForBackspace = ( event: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number ) => {

        const { nativeEvent } = event;

        if ( nativeEvent.key === 'Backspace' ) {
            const prevIndex = getPreviousValidIndex( wordStructure, index );
            setActiveLetter( prevIndex );
            inputsRef?.current?.[prevIndex]?.clear();
        }
    };

    return (
        <View style={ individualCharsInputStyles.inputWrapper as any }>
            { wordStructure.map( ( singleInput, index ) => {

                if ( singleInput ) {
                    return (
                        <TextInput
                            key={ index.toString() }
                            ref={ ( el ) =>  { inputsRef.current[ index ] = el; } }
                            style={ individualCharsInputStyles.singleInput }
                            maxLength={ 1 }
                            onChangeText={ ( letter ) => onType( letter, index )  }
                            onKeyPress={ ( event ) =>  checkForBackspace( event, index ) }
                            autoCorrect={ false }
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
