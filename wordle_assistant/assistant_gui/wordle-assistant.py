# All of these imports are built into python
from tkinter import *
import re
import random

# It should be noted that this program uses a text file containing every valid 5 letter word that is used in Wordle

with open("valid-wordle-words.txt","r") as f:
    all_words = f.readlines() # Opens file

all_words = [w.strip() for w in all_words] #removes every non letter character in the word database

def string_to_arr(sampleString):
    newString = re.sub(r'[^a-zA-Z]', '', sampleString) # removes every non letter
    newString = newString.lower() # lowercase forced
    strArr = list(newString)
    return strArr

def unique_char_count(word):
    return len(set(word))

def matches_pattern(word, cArr):
    for i in range(5):
        if cArr[i] and word[i] != cArr[i]:
            return 0
    return 1

def get_misplaced_characters(mArrs):
    chars = []
    for mArr in mArrs:
        for char in mArr:
            if char:
                chars.append(char)
    return chars

def guess_word(cArr, mArr, iArr):
    filter = [word for word in all_words if not any(letter in word for letter in iArr)]
    mChars = get_misplaced_characters(mArr)
    filter = [word for word in filter if all(letter in word for letter in mChars)]
    filter = [word for word in filter if matches_pattern(word, cArr)]
    random.shuffle(filter) #removes alphabetcal order hell
    num_unique_sort = sorted(filter, key=unique_char_count, reverse=TRUE) #forces every character to be checked before even thinking about double letters ('shush' as an example)
    # These filters are ordered in such a way to remove as many strings before the next filter
    # This is because the 'correct_filter' requires more computing resources, the more objects it has to iterate through
    print(num_unique_sort)
    return num_unique_sort[0]

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

    # The game only allows for a total of 5 misplaced letters, 
    # and order doesnt matter here, only in correct
    # careful with using misplaced letters, specifically when a misplaced letter also exists in the correct letters array
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
        mArr = [[entries[row][col].get().lower() for row in range(5)] for col in range(5)]

        iArr = string_to_arr(incorrect.get())

        guess = guess_word(cArr, mArr, iArr)
        returnlbl.configure(text = "Try this word: '" + guess + "'")

    btn = Button(root, text = "Guess", fg = "blue", command=clicked)
    btn.grid(row=11)
    root.mainloop()

window()

if __name__ == "__main__":
    exit(0) #script ends on window close
