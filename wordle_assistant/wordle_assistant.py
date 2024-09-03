from random import randrange

with open("words.txt","r") as f:
    rawWordList = f.readlines()

rawWordList = [w.strip() for w in rawWordList]
wordList = []
# wordList = [word for word in wordList + rawWordList if len(word) == 5]
wordList = rawWordList

difficultWords = ['awash', 'backs', 'bakes', 'beaus', 'blobs', 'blows', 'bonus', 'brays', 'broom', 'cafes', 'cakes', 'claws', 'clays', 'combs', 'comma', 'coxed', 'coxes', 'craws', 'damps', 'dares', 'dazed', 'deeds', 'deems', 'dikes', 'diver', 'dives', 'dizzy', 'doges', 'domes', 'doves', 'dozed', 'dozes', 'draws', 'drays', 'dregs', 'dukes', 'dupes', 'eager', 'eared', 'eases', 'eater', 'eaves', 'ebbed', 'edges', 'eider', 'erode', 'every', 'faked', 'faxed', 'faxes', 'fifes', 'fixed', 'fixes', 'flows', 'fowls', 'foxed', 'foxes', 'foyer', 'frank', 'frays', 'gales', 'galls', 'games', 'gated', 'gates', 'gawky', 'gazed', 'gazes', 'gears', 'genus', 'giver', 'gives', 'glaze', 'gofer', 'golds', 'gongs', 'gowns', 'grams', 'graze', 'greys', 'grove', 'gusts', 'hafts', 'halls', 'hangs', 'hared', 'hares', 'hatch', 'hated', 'hates', 'haves', 'hawks', 'hears', 'heeds', 'hider', 'hides', 'hiked', 'hiker', 'hikes', 'hills', 'hints', 'hived', 'hives', 'hocks', 'holds', 'holly', 'homed', 'hoods', 'hoofs', 'hoops', 'hoped', 'hosts', 'hound', 'hours', 'hover', 'howls', 'huffy', 'hulls', 'humps', 'jaded', 'jades', 'jails', 'james', 'jaunt', 'jawed', 'jazzy', 'jeans', 'jeeps', 'jests', 'jesus', 'jilts', 'jinks', 'jived', 'jives', 'joist', 'joked', 'joker', 'jokes', 'jolly', 'jolts', 'jowls', 'jumps', 'keels', 'kelts', 'keyed', 'kicks', 'kills', 'kilts', 'kings', 'kinks', 'kitty', 'krill', 'lasts', 'lemur', 'lined', 'lines', 'louts', 'lover', 'lower', 'lulls', 'lusty', 'makes', 'males', 'mares', 'match', 'mates', 'mayas', 'mazes', 'miles', 'minus', 'mixer', 'mixes', 'mover', 'moves', 'mowed', 'mower', 'muggy', 'mummy', 'nears', 'newer', 'night', 'nines', 'nulls', 'oozed', 'oozes', 'pawed', 'payed', 'payer', 'ploys', 'preys', 'raked', 'rakes', 'rayed', 'razed', 'razes', 'rears', 'reefs', 'rider', 'river', 'rover', 'rower', 'scare', 'screw', 'seems', 'shahs', 'shame', 'shave', 'sizes', 'skies', 'skims', 'skips', 'slabs', 'slavs', 'slays', 'slyer', 'smell', 'sofas', 'swabs', 'swags', 'swarm', 'sways', 'swore', 'taxed', 'taxes', 'texts', 'tiger', 'tufts', 'udder', 'vales', 'vamps', 'vanes', 'vases', 'vents', 'vests', 'vines', 'voles', 'volts', 'vowed', 'wades', 'wafer', 'wafts', 'wager', 'wages', 'wails', 'waked', 'wakes', 'wales', 'walls', 'wands', 'wanes', 'wards', 'wares', 'warms', 'warps', 'warts', 'wasps', 'waste', 'watch', 'water', 'waved', 'waves', 'waxed', 'waxes', 'wears', 'weeds', 'weeks', 'weeps', 'wells', 'wends', 'wider', 'wides', 'wiles', 'wills', 'wilts', 'wined', 'wines', 'wings', 'wired', 'wirer', 'wires', 'witch', 'wives', 'wodge', 'wolds', 'woods', 'wordy', 'worry', 'wound', 'wowed', 'xrays', 'yanks', 'yards', 'yawed', 'yawns', 'years', 'yells', 'yokes', 'yours', 'zappy', 'zeals', 'zulus']

def guess_word(game_state):

    ### Interpreting the game state
    # Words are inputed with a special character before each letter.
    # "-" means that the character was grey.
    # "/" means that the character was yellow.
    # "+" means that the character was green.
    # Ex. "+s-h-a/r/e"

    global guessCount, greenLetters, yellowLetters, yellowLetterIndexes, greyLetters
    guessCount = len(game_state.split(" "))
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

    strategy = "win"
    newLetterFrequency = []

    if guessCount < 6 and greenLetters.count(0) <= 4:
        strategy = "learn"
        for letterIndex in range(26):
            letter = chr(letterIndex + 97)
            score = 0
            if (not letter in greyLetters) and (not letter in yellowLetters) and (not letter in greenLetters):
                for newWord in getPossibleWords():
                    if letter in newWord:
                        score += 1
            newLetterFrequency.append(score)

    wordScores = []
    for wordIndex in range(len(wordList)):
        word = wordList[wordIndex]
        score = 0

        if strategy == "win":
            for letterIndex in range(len(word)):

                # If the word contains any letters that are confirmed to not be in the answer,
                # set the score extremely low
                if word[letterIndex] in greyLetters:
                    score = -999999999
                # Otherwise, increase the word's score by how often that letter
                # appears in that position in every word in the dictionary
                else:
                    score += getLetterFrequency(word[letterIndex], letterIndex)

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

        elif strategy == "learn":
            for letterIndex in range(len(word)):
                score += newLetterFrequency[ord(word[letterIndex]) - 97]


        wordScores.append(score)

    # Return the word with the highest score
    return wordList[wordScores.index(max(wordScores))]

# Returns a list of words that could be the answer based on the known information
def getPossibleWords():
    words = []
    for word in wordList:
        possible = True
        for letterIndex in range(len(word)):
            if word[letterIndex] in greyLetters:
                possible = False
            if greenLetters[letterIndex] != 0:
                if word[letterIndex] != greenLetters[letterIndex]:
                    possible = False
            for i in range(len(yellowLetters)):
                if (yellowLetterIndexes[i] == letterIndex):
                    if yellowLetters[i] == word[letterIndex]:
                        possible = False
        for yellowLetter in yellowLetters:
            if not yellowLetter in word:
                possible = False
        if possible:
            words.append(word)
    return words

letterFrequency = []

# Add up every occurance of a letter in the given index of every word in the word list
def setupLetterFrequency():
    global letterFrequency
    letterFrequency = [[], [], [], [], []]
    for index in range(5):
        for letterIndex in range(26):
            score = 0
            letter = chr(letterIndex + 97)
            for word in wordList:
                if word[index] == letter:
                    score += 1
            letterFrequency[index].append(score)

def getLetterFrequency(letter, index):
    return letterFrequency[index][ord(letter) - 97]

# Given the answer, attempts to solve the puzzle without having to input the game state
def auto_solve(keyword):
    print()
    print("Word is " + keyword)
    state = ""
    for guess_count in range(6):
        guess = guess_word(state)
        print_string = str(guess_count + 1) + ". "
        for letter_index in range(len(guess)):
            if guess[letter_index] == keyword[letter_index]:
                state += "+" + guess[letter_index]
                print_string += "[" + guess[letter_index] + "] "
            elif guess[letter_index] in keyword:
                state += "/" + guess[letter_index]
                print_string += "<" + guess[letter_index] + "> "
            else:
                state += "-" + guess[letter_index]
                print_string += " " + guess[letter_index] + "  "
        state += " "
        # print(print_string)
        if guess == keyword:
            return True
    return False

previousInput = ""

if __name__ == "__main__":
    setupLetterFrequency()
    while True:
        state = input("Game state? ")

        # If input begins with a caret, include previous input
        if state.startswith("^"):
            state = state.replace("^", "")
            state = state.strip()
            state = previousInput + " " + state

        # Set previousInput so that the caret can be used for the next input
        previousInput = state

        # Ends the program
        if state == "exit":
            break

        # Tests all words and returns the success rate
        elif state == "all":
            wordCount = 0
            solved = 0
            unsolved_list = []
            for word in wordList:
                wordCount += 1
                if auto_solve(word):
                    solved += 1
                else:
                    unsolved_list.append(word)
            print()
            print("Tried " + str(wordCount) + " words.")
            print("Solved " + str(solved) + ". (" + str(int(solved / wordCount * 10000) / 100) + "%)")
            print("Could not solve " + str(wordCount - solved) + ":")
            print(unsolved_list)

        # Tests a given number of random words and returns the success rate
        elif state.startswith("sample"):
            sampleSize = state.split(" ")
            if len(sampleSize) == 1 or int(sampleSize[1]) == 0:
                print("Enter a valid sample size")
            else:
                sample = []
                for i in range(min( int(sampleSize[1]), len(wordList) )):
                    word = ""
                    while word == "" or word in sampleSize:
                        word = wordList[randrange(0, len(wordList))]
                    sample.append(word)

                solved = 0
                unsolved_list = []
                for word in sample:
                    if auto_solve(word):
                        solved += 1
                    else:
                        unsolved_list.append(word)
                print()
                print("Tried " + str(int(sampleSize[1])) + " words.")
                print("Solved " + str(solved) + ". (" + str(int(solved / int(sampleSize[1]) * 10000) / 100) + "%)")
                print("Could not solve " + str(int(sampleSize[1]) - solved) + ":")
                print(unsolved_list)

        # Simulates a series of guesses to solve a five letter word
        elif len(state) == 5:
            auto_solve(state)

        # Suggests the next word to guess given a series of hints
        else:
            guess = guess_word(state)
            print("You should try '" + guess + "'.")
