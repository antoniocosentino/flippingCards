import React, { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { View, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { chunk } from 'lodash';

type TInputContent = {
    wordArray: ReadonlyArray<string | false>,
    wordString: string
};

type TIndividualCharsInput = {
    wordStructure: ReadonlyArray<boolean>;
    autoFocus?: boolean;
    maxBoxesPerLine?: number;
    onChange: ( inputContent: TInputContent ) => any;
};

const individualCharsInputStyles = {
    inputsWrapper: {
        display: 'flex',
        flexDirection: 'column'
    },
    inputWrapper: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
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
        textAlign: 'center',
        paddingTop: 0,
        paddingBottom: 0
    },
    spacer: {
        width: 20
    }
};

const DEFAULT_PROPS = {
    autoFocus: true,
    maxBoxesPerLine: 0
} as Partial<TIndividualCharsInput>;

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

const getWordStringForExternalMethod = ( newWordArray: string[] ): string => {

    const processedArr = [];

    for ( let count = 0; count < newWordArray.length; count++ ) {
        const currentLetter = newWordArray[ count ];

        switch ( currentLetter ) {
            case undefined:
                processedArr.push( ' ' );
                break;
            case '':
                processedArr.push( '' );
                break;

            default:
                processedArr.push( currentLetter );
                break;
        }

    }

    return processedArr.join( '' );
};


export const IndividualCharsInput = ( props: TIndividualCharsInput ) => {

    const mergedProps = {
        ...DEFAULT_PROPS,
        ...props
    } as TIndividualCharsInput;

    const { wordStructure, autoFocus, maxBoxesPerLine, onChange: externalOnChange } = mergedProps;
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

        const inputContent = {
            wordArray: getWordArrayForExternalMethod( typedWordArrayClone ),
            wordString: getWordStringForExternalMethod( typedWordArrayClone )
        } as TInputContent;

        externalOnChange( inputContent  );

    };

    const getWordArrayForExternalMethod = ( newWordArray: string[] ): ReadonlyArray<string | false> => {

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

    const wordStructureRows = maxBoxesPerLine! <= 0 ? [ wordStructure ] : chunk( wordStructure, maxBoxesPerLine );

    return (
        <View style={ individualCharsInputStyles.inputsWrapper as any }>
            { wordStructureRows.map( ( singleRow, rowIndex ) => {
                return (
                    <View key={ rowIndex } style={ individualCharsInputStyles.inputWrapper as any }>

                        { singleRow.map( ( singleInput, indexInRow ) => {

                            const derivedIndex = ( maxBoxesPerLine! * rowIndex ) + indexInRow;

                            if ( singleInput ) {
                                return (
                                    <TextInput
                                        key={ derivedIndex.toString() }
                                        ref={ ( el ) =>  { inputsRef.current[ derivedIndex ] = el; } }
                                        style={ individualCharsInputStyles.singleInput as any }
                                        maxLength={ 1 }
                                        onKeyPress={ ( event ) => onLetterChange( event, derivedIndex ) }
                                        autoCorrect={ false }
                                        autoCapitalize={ 'characters' }
                                    />
                                );
                            } else {
                                return (
                                    <View key={ derivedIndex.toString() } style={ individualCharsInputStyles.spacer } />
                                );
                            }
                        } ) }
                    </View>
                );
            } ) }
        </View>
    );

};
