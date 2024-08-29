with open("words.txt","r") as f:
    rawList = f.readlines()

rawList = [w.strip() for w in rawList]
wordList = []
wordList = [word for word in wordList + rawList if len(word) == 5]

def guess_word(game_state):

    ### Interpreting the game state
    # Words are inputed with a special character before each letter.
    # "-" means that the character was grey.
    # "/" means that the character was yellow.
    # "+" means that the character was green.
    # Ex. "+s-h-a/r/e"
    
    greenLetters = [0, 0, 0, 0, 0]
    yellowLetters = []
    yellowLetterIndexes = []
    greyLetters = []

    for attempt in game_state.split(" "):
        for character in range(len(attempt)):
            match attempt[character]:
                case "-":
                    greyLetters.append(attempt[character + 1])

                case "/":
                    yellowLetters.append(attempt[character + 1])
                    yellowLetterIndexes.append(int(character / 2))

                case "+":
                    greenLetters[int(character / 2)] = attempt[character + 1]

                case _:
                    pass


    ### Choosing a word
    # Each word in the dictionary is given a score based on how common its letters are.
    # Words that don't fit the game_state are filtered out.
    # The word with the highest score is selected and returned.

    wordScores = []
    for wordIndex in range(len(wordList)):

        word = wordList[wordIndex]
        score = 0
        for letterIndex in range(len(word)):

	        # If the word contains any letters that are confirmed to not be in the answer,
            # set the score extremely low
            if word[letterIndex] in greyLetters:
                score = -999999999
            # Otherwise, increase the word's score by how often that letter
            # appears in that position in every word in the dictionary
            else:
                score += letterPositionalFrequency(word[letterIndex], letterIndex)

            # If the word does not have a green letter in its marked spot
	        # set the score extremely low
            if greenLetters[letterIndex] != 0:
                if word[letterIndex] != greenLetters[letterIndex]:
                    score = -999999999

            # If the word has a letter in a spot where that letter was marked yellow
            # set the score extremely low
            for i in range(len(yellowLetters)):
                if (yellowLetterIndexes[i] == letterIndex):
                    if yellowLetters[i] == word[letterIndex]:
                        score = -999999999

	    # If the word does not have a yellow letter anywhere
	    # set the score extremely low
        for yellowLetter in yellowLetters:
            if not yellowLetter in word:
                score = -999999999

        wordScores.append(score)

    # Return the word with the highest score
    print(max(wordScores))
    return wordList[wordScores.index(max(wordScores))]

# Add up every occurance of a letter in the given index of every word in the word list
def letterPositionalFrequency(letter, index):
	score = 0
	for word in wordList:
		if letter == word[index]:
			score += 1
	return score

if __name__ == "__main__":
    while True:
        state = input("Game state?")
        guess = guess_word(state)
        print("You should try '" + guess + "'.")
