import React, { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { View, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

type TIndividualCharsInput = {
    wordStructure: ReadonlyArray<boolean>;
    key: string;
    onChange: ( wordArray: ReadonlyArray<string | false> ) => any;
};

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
        textAlign: 'center'
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

    const { wordStructure, autoFocus, onChange: externalOnChange } = mergedProps;
    const inputsRef = useRef( [] as any );
    const [ activeLetter, setActiveLetter ] = useState( 0 );
    const [ typedWordArray, setTypeWordArray ] = useState( [] as string[] );

    useEffect( () => {
        inputsRef.current = inputsRef.current.slice( 0, wordStructure.length );
    }, [ wordStructure ] );

    useEffect( () => {
        if ( autoFocus ) {
            inputsRef?.current?.[0]?.focus();
        }
    }, [ autoFocus ] );

    useEffect( () => {
        inputsRef?.current?.[activeLetter]?.clear();
        inputsRef?.current?.[activeLetter]?.focus();
    }, [ activeLetter ] );


    const onLetterChange = ( event: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number ) => {

        const { nativeEvent } = event;
        const typedWordArrayClone = typedWordArray.slice();

        if ( nativeEvent.key === 'Backspace' ) {

            if ( !typedWordArray[ index ] ) {
                const prevIndex = getPreviousValidIndex( wordStructure, index );
                setActiveLetter( prevIndex );
                typedWordArrayClone[ prevIndex ] = '';
            } else {
                typedWordArrayClone[ index ] = '';
            }

        } else {
            // TODO: consider filtering chars via regex
            typedWordArrayClone[ index ] = nativeEvent.key;

            const nextIndex = getNextValidIndex( wordStructure, index );
            setActiveLetter( nextIndex );
        }

        setTypeWordArray( typedWordArrayClone );
        externalOnChange( getWordForExternalMethod( typedWordArrayClone ) );

    };

    const getWordForExternalMethod = ( newWordArray: string[] ): ReadonlyArray<string | false> => {

        const wordForExternalMethod = wordStructure.map( ( singleSlot, index ) => {

            if ( singleSlot === false ) {
                return singleSlot;
            }

            if ( newWordArray[ index ] ) {
                return newWordArray[ index ];
            } else {
                return '';
            }
        } );

        return wordForExternalMethod;
    };

    return (
        <View style={ individualCharsInputStyles.inputWrapper as any }>
            { wordStructure.map( ( singleInput, index ) => {

                if ( singleInput ) {
                    return (
                        <TextInput
                            key={ index.toString() }
                            ref={ ( el ) =>  { inputsRef.current[ index ] = el; } }
                            style={ individualCharsInputStyles.singleInput as any }
                            maxLength={ 1 }
                            onKeyPress={ ( event ) => onLetterChange( event, index ) }
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
