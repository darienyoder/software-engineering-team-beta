# All of these imports are built into python
from tkinter import *
import re
import random
from collections import Counter

# It should be noted that this program uses a text file containing every valid 5 letter word that is used in Wordle

with open("valid-wordle-words.txt","r") as f:
    all_words = f.readlines() # Opens file

all_words = [w.strip() for w in all_words] #removes every non letter character in the word database

def string_to_arr(sampleString):
    newString = re.sub(r'[^a-zA-Z]', '', sampleString) # removes every non letter
    newString = newString.lower() # lowercase forced
    strArr = list(newString)
    return strArr

def guess_word(cArr, mArr, iArr):
    
    def unique_char_count(word):
        return len(set(word))

    def matches_pattern(word, cArr):
        for i in range(5):
            if cArr[i] and word[i] != cArr[i]:
                return 0
        return 1

    def remove_misplaced_matches(mArrs, wordList):
        for mArr in mArrs:
            for i in range(5):
                if mArr[i]:
                    wordList = [word for word in wordList if word[i] != mArr[i] and mArr[i] in word]
        return wordList

    def sort_word_prob(wordList):
        letter_counts = Counter(''.join(wordList))
        return sorted(wordList, key=lambda word: (sum(letter_counts[char] for char in set(word)), unique_char_count(word)), reverse=True)

    def get_misplaced_characters(mArrs):
        chars = []
        for mArr in mArrs:
            for char in mArr:
                if char:
                    chars.append(char)
        return chars
    
    mChars = get_misplaced_characters(mArr)

    filter = [word for word in all_words if not any(letter in word for letter in iArr)] # removes any word that contains any incorrect letter
    filter = [word for word in filter if all(letter in word for letter in mChars)] # removes any word that doesn't contain every unique misplaced character
    filter = [word for word in filter if matches_pattern(word, cArr)] # keeps only words that match the pattern of letters in the correct letters list
    filter = remove_misplaced_matches(mArr, filter) # removes any words that match the regex provided by misplaced words, reducing repetition of same character in same spot
    
    sort = sort_word_prob(filter)
    sort = sorted(sort, key=unique_char_count, reverse=True) # forces every character to be checked before even thinking about double letters
    # print(sort)
    return sort[0] if sort else None

def auto_solve(output_file="auto_solve_results.txt"):
    with open(output_file, "w") as f:
        for target_word in all_words:
            correct_arr = [''] * 5
            misplaced_arr = [[''] * 5 for _ in range(5)]
            incorrect_letters = []

            guess_count = 0
            word_found = False

            while not word_found:
                guess_count += 1
                guess = guess_word(correct_arr, misplaced_arr, incorrect_letters)

                if not guess:  # If no valid guess is found
                    print(f"No valid guess for word: {target_word.upper()}. Fail.")
                    result = f"Word: {target_word.upper()} - Fail\n"
                    f.write(result)
                    break

                if guess == target_word:
                    word_found = True
                    result = f"Word: {target_word.upper()} - Solved in {guess_count} guesses"
                    if guess_count > 6:
                        f.write(result + '\n')
                    print(result)
                    break

                # Update correct, misplaced, and incorrect arrays based on the guess
                for i in range(5):
                    if guess[i] == target_word[i]:
                        correct_arr[i] = guess[i]
                    elif guess[i] in target_word:
                        if guess[i] != correct_arr[i] and guess[i] not in [arr[i] for arr in misplaced_arr]:
                            for misplaced in misplaced_arr:
                                if misplaced[i] == '':
                                    misplaced[i] = guess[i]
                                    break
                    else:
                        if guess[i] not in correct_arr and guess[i] not in incorrect_letters:
                            incorrect_letters.append(guess[i])

                # Safety break after too many guesses
                if guess_count > 100:  # Adjust this threshold as needed
                    print(f"Too many guesses for word: {target_word.upper()}. Moving to the next word.")
                    result = f"Word: {target_word.upper()} - Too many guesses (>100)"
                    f.write(result + '\n')
                    break

    print(f"Results written to {output_file}")

def window():
    root = Tk()
    root.title("Wordle Assistant")
    root.geometry('240x260')

    clbl = Label(root, fg = "green", text = "Correct Letters (In order)")
    clbl.grid(column=0, row=0)

    correct_frame = Frame(root)
    correct_frame.grid(row=1, column=0)

    correct_row = []
    for l in range(1, 6):
        entry = Entry(correct_frame, width=4)
        entry.grid(column=l, row=0)  # Place each entry in the correct column
        correct_row.append(entry)

    mlbl = Label(root, fg = "red", text = "Misplaced Letters (In Order)")
    mlbl.grid(row=2)

    frames = []
    entries = []

    for i in range(1, 6):
        misplaced_frame = Frame(root)
        misplaced_frame.grid(row=i+2, column=0)  # Adjust the row number dynamically
        frames.append(misplaced_frame)
    
        row_entries = []
        for j in range(1, 6):
            entry = Entry(misplaced_frame, width=4)
            entry.grid(column=j, row=0)  # Place each entry in the correct column
            row_entries.append(entry)
    
        entries.append(row_entries)

    ilbl = Label(root, fg = "grey", text = "Incorrect Letters")
    ilbl.grid(row=8)

    incorrect = Entry(root, width=40)
    incorrect.grid(column=0, row=9)

    returnlbl = Label(root,fg="Purple", text ="")
    returnlbl.grid(row=12)

    def clicked():
        # Here we would call the solving function
        cArr = [correct_row[col].get().lower() for col in range(5)]
        mArr = [[entries[row][col].get().lower() for col in range(5)] for row in range(5)]

        iArr = string_to_arr(incorrect.get())

        guess = guess_word(cArr, mArr, iArr)
        returnlbl.configure(text = "Try this word: '" + guess.upper() + "'")

    btn = Button(root, text = "Guess", fg = "blue", command=clicked)
    btn.grid(row=11)
    root.mainloop()

def main():
    choice = input("Choose an option:\n1. Run Auto Solve\n2. Launch GUI\nEnter 1 or 2: ")

    if choice == "1":
        auto_solve()
    elif choice == "2":
        window()
    else:
        print("Invalid choice. Please enter 1 or 2.")

if __name__ == "__main__":
    main()