# Wordle Assistant
This program accepts 5 types of commands:
1. Type the given hints to receive a suggestion for the next word.
    - "+" before a letter indicates that the letter is present in the answer and in the correct spot.
    - "/" before a letter indicates that the letter is present in the answer, but in the wrong spot.
    - "-" before a letter indicates that the letter is not present in the answer.
    - Ex. "+s-h-a/r/e"
2. Type a five-letter word without hints to have the program attempt to solve the word automatically.
3. Type "sample ##" to test a given number of random words and receive the ratio it gets correct afterward.
4. Type "all" to test all words in the word list and receive the ratio it gets correct afterward.
5. Type "exit" to quit.
