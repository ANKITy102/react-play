import React, { useEffect, useState } from 'react';
import Drawing from './Drawing';
import words from '../constants/wordList.json';
import Keyboard from './Keyboard';
import Word from './Word';
import { tryAgainIcon } from '../constants/constants';
import { BigContainer, Container, EndGame, Title, TryAgainButton } from '../styled-components';

function getRandomWord(arr: { [key: string]: string }[]) {
  const obj = arr[Math.floor(Math.random() * arr.length)];
  const word = Object.values(obj)[0] as string;

  return { question: Object.keys(obj)[0], word };
}

export default function App() {
  const [wordToGuess, setWordToGuess] = useState<string>('');
  const [hintToGuess, setHintToGuess] = useState<string>('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters.filter((letter) => !wordToGuess.includes(letter));

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess.split('').every((letter) => guessedLetters.includes(letter));

  const addGuessedLetter = (letter: string) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    }
  };

  const restartGame = () => {
    const { word, question } = getRandomWord(words);
    setHintToGuess(question);
    setWordToGuess(word);
    setGuessedLetters([]);
  };

  useEffect(() => {
    restartGame();
    // eslint-disable-next-line
  }, []);

  return (
    <BigContainer>
      <Container>
        <Title>Hangman</Title>

        {!(isWinner || isLoser) ? (
          <Drawing numberOfGuesses={incorrectLetters.length} />
        ) : (
          <EndGame isWinner={isWinner}>
            {isWinner && 'You are a winner!'}
            {isLoser && 'Nice try...'}
          </EndGame>
        )}
        {!(isWinner || isLoser) && (
          <p
            style={{
              marginBottom: '-20px',
              fontSize: '20px'
            }}
          >
            <span style={{ fontWeight: 'bold' }}>Question: {hintToGuess} </span>
          </p>
        )}
        <Word guessedLetters={guessedLetters} reveal={isLoser} wordToGuess={wordToGuess} />

        {(isWinner || isLoser) && (
          <TryAgainButton onClick={restartGame}>{tryAgainIcon}</TryAgainButton>
        )}

        <Keyboard
          addGuessedLetter={addGuessedLetter}
          correctLetters={guessedLetters.filter((letter) => wordToGuess.includes(letter))}
          disabled={isWinner || isLoser}
          incorrectLetters={incorrectLetters}
        />
      </Container>
    </BigContainer>
  );
}
