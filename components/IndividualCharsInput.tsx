import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { View, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { chunk } from 'lodash';

type TInputContent = {
    wordArray: ReadonlyArray<string | false>,
    wordString: string
};

type TWordStructure = ReadonlyArray<boolean>;

type TLineBreakOnSpace = 'always' | 'auto' | 'never'; // auto doesn't work yet

type TSmartChunkedArray = ReadonlyArray<TWordStructure>;

type TIndividualCharsInput = {
    wordStructure: TWordStructure;
    autoFocus?: boolean;
    maxBoxesPerLine?: number;
    lineBreakOnSpace?: TLineBreakOnSpace;
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
        width: 26,
        height: 34,
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
    maxBoxesPerLine: 0,
    lineBreakOnSpace: 'always'
} as Partial<TIndividualCharsInput>;


const transformWordStructureToString = ( wordStructure: TWordStructure ): string => {
    return wordStructure.map( ( singleLetter ) => {
        if ( singleLetter ) {
            return 'L';
        } else {
            return 'S';
        }
    } ).join( '' );
};

const transformStringWordStructureToSArr = ( wordStructureAsString: ReadonlyArray<string> ): TSmartChunkedArray => {

    return wordStructureAsString.map( ( singleBlock ) => {
        const singleBlockAsArr = singleBlock.split( '' );
        return singleBlockAsArr.map( ( singleLetter ) => ( singleLetter === 'L' ? true : false ) );
    } );
};

const getSmartChunkedArray = (
    wordStructure: TWordStructure,
    lineBreakOnSpace: TLineBreakOnSpace,
    maxBoxesPerLine: number,
): TSmartChunkedArray => {

    if ( maxBoxesPerLine <= 0 ) {
        return [ wordStructure ];
    }

    if ( lineBreakOnSpace === 'never' ) {
        return chunk( wordStructure, maxBoxesPerLine );
    }

    // If we reach here we are in the "auto" or "always" case

    const wordStructureAsString = transformWordStructureToString( wordStructure );
    const spaceChunks = wordStructureAsString.split( 'S' );

    const spaceChunksWithSpaceRow = [] as string[];

    spaceChunks.forEach( ( spaceChunk, index ) => {
        spaceChunksWithSpaceRow.push( spaceChunk );

        if ( index % 2 === 0 ) {
            spaceChunksWithSpaceRow.push( 'S' );
        }
    } );

    const processedSpaceChunks = spaceChunksWithSpaceRow.map( ( singleChunk ) => {
        if ( singleChunk.length <= maxBoxesPerLine ) {
            return singleChunk;
        } else {
            return chunk( singleChunk, maxBoxesPerLine );
        }
    } );

    const flattenedArray = [] as any; // TODO: type!

    processedSpaceChunks.forEach( ( singleChunk ) => {
        if ( Array.isArray( singleChunk ) ) {
            singleChunk.forEach( ( nestedChunk ) => {
                flattenedArray.push( nestedChunk.join( '' ) );
            } );
        } else {
            flattenedArray.push( singleChunk );
        }
    } );

    const reconstructedArr = transformStringWordStructureToSArr( flattenedArray );

    return reconstructedArr;

    // TODO: the 'auto' case is not ready yet

};


const getNextValidIndex = ( wordStructure: TWordStructure, currentIndex: number ): number => {

    if ( currentIndex > wordStructure.length ) {
        return currentIndex;
    }

    if ( wordStructure[ currentIndex + 1 ] ) {
        return currentIndex + 1;
    }

    return getNextValidIndex( wordStructure, currentIndex + 1 );
};

const getPreviousValidIndex = ( wordStructure: TWordStructure, currentIndex: number ): number => {

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


const getDerivedIndex = ( smartChunkedArray: TSmartChunkedArray, rowIndex: number, indexInRow: number ) => {
    if ( rowIndex === 0 ) {
        return indexInRow;
    }

    let previousRowsTotalCount = 0;

    for ( let rowCount = 0; rowCount < rowIndex; rowCount++ ) {
        previousRowsTotalCount = previousRowsTotalCount + smartChunkedArray[ rowCount ].length;
    }

    return previousRowsTotalCount + indexInRow;
};

export const IndividualCharsInput = ( props: TIndividualCharsInput ) => {

    const mergedProps = {
        ...DEFAULT_PROPS,
        ...props
    } as TIndividualCharsInput;

    const { wordStructure, autoFocus, maxBoxesPerLine, lineBreakOnSpace, onChange: externalOnChange } = mergedProps;
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

    const wordStructureRows = getSmartChunkedArray( wordStructure, lineBreakOnSpace!, maxBoxesPerLine! );

    return (
        <View style={ individualCharsInputStyles.inputsWrapper as any }>
            { wordStructureRows.map( ( singleRow, rowIndex ) => {
                return (
                    <ScrollView keyboardShouldPersistTaps='never' key={ rowIndex } contentContainerStyle={ individualCharsInputStyles.inputWrapper as any }>

                        { singleRow.map( ( singleInput, indexInRow ) => {

                            const derivedIndex = getDerivedIndex( wordStructureRows, rowIndex, indexInRow );

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
                    </ScrollView>
                );
            } ) }
        </View>
    );

};
