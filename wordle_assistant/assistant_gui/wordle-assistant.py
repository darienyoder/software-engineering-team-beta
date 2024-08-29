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
    # cArr = Correct Array
    # mArr = Misplaced Array
    # iArr = Incorrect Array
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
    # create root window
    root = Tk()

    # root window title and dimension
    root.title("Wordle Assistant")
    # Set geometry (widthxheight)
    root.geometry('240x260')

    clbl = Label(root, fg = "green", text = "Correct Letters (In order)")
    clbl.grid(column=0, row=0)

    correct_frame = Frame(root)
    correct_frame.grid(row=1, column=0)
    c1 = Entry(correct_frame, width=4)
    c1.grid(column=1, row=0)
    c2 = Entry(correct_frame, width=4)
    c2.grid(column=2, row=0)
    c3 = Entry(correct_frame, width=4)
    c3.grid(column=3, row=0)
    c4 = Entry(correct_frame, width=4)
    c4.grid(column=4, row=0)
    c5 = Entry(correct_frame, width=4)
    c5.grid(column=5, row=0)

    mlbl = Label(root, fg = "red", text = "Misplaced Letters (In Order)")
    mlbl.grid(row=2)

    # The game only allows for a total of 5 misplaced letters, 
    # and order doesnt matter here, only in correct
    # careful with using misplaced letters, specifically when a misplaced letter also exists in the correct letters array
    misplaced_frame1 = Frame(root)
    misplaced_frame1.grid(row=3, column=0)
    m11 = Entry(misplaced_frame1, width=4)
    m11.grid(column=1, row=0)
    m12 = Entry(misplaced_frame1, width=4)
    m12.grid(column=2, row=0)
    m13 = Entry(misplaced_frame1, width=4)
    m13.grid(column=3, row=0)
    m14 = Entry(misplaced_frame1, width=4)
    m14.grid(column=4, row=0)
    m15 = Entry(misplaced_frame1, width=4)
    m15.grid(column=5, row=0)

    misplaced_frame2 = Frame(root)
    misplaced_frame2.grid(row=4, column=0)
    m21 = Entry(misplaced_frame2, width=4)
    m21.grid(column=1, row=0)
    m22 = Entry(misplaced_frame2, width=4)
    m22.grid(column=2, row=0)
    m23 = Entry(misplaced_frame2, width=4)
    m23.grid(column=3, row=0)
    m24 = Entry(misplaced_frame2, width=4)
    m24.grid(column=4, row=0)
    m25 = Entry(misplaced_frame2, width=4)
    m25.grid(column=5, row=0)

    misplaced_frame3 = Frame(root)
    misplaced_frame3.grid(row=5, column=0)
    m31 = Entry(misplaced_frame3, width=4)
    m31.grid(column=1, row=0)
    m32 = Entry(misplaced_frame3, width=4)
    m32.grid(column=2, row=0)
    m33 = Entry(misplaced_frame3, width=4)
    m33.grid(column=3, row=0)
    m34 = Entry(misplaced_frame3, width=4)
    m34.grid(column=4, row=0)
    m35 = Entry(misplaced_frame3, width=4)
    m35.grid(column=5, row=0)

    misplaced_frame4 = Frame(root)
    misplaced_frame4.grid(row=6, column=0)
    m41 = Entry(misplaced_frame4, width=4)
    m41.grid(column=1, row=0)
    m42 = Entry(misplaced_frame4, width=4)
    m42.grid(column=2, row=0)
    m43 = Entry(misplaced_frame4, width=4)
    m43.grid(column=3, row=0)
    m44 = Entry(misplaced_frame4, width=4)
    m44.grid(column=4, row=0)
    m45 = Entry(misplaced_frame4, width=4)
    m45.grid(column=5, row=0)

    misplaced_frame5 = Frame(root)
    misplaced_frame5.grid(row=7, column=0)
    m51 = Entry(misplaced_frame5, width=4)
    m51.grid(column=1, row=0)
    m52 = Entry(misplaced_frame5, width=4)
    m52.grid(column=2, row=0)
    m53 = Entry(misplaced_frame5, width=4)
    m53.grid(column=3, row=0)
    m54 = Entry(misplaced_frame5, width=4)
    m54.grid(column=4, row=0)
    m55 = Entry(misplaced_frame5, width=4)
    m55.grid(column=5, row=0)

    ilbl = Label(root, fg = "grey", text = "Incorrect Letters")
    ilbl.grid(row=8)

    incorrect = Entry(root, width=40)
    incorrect.grid(column=0, row=9)

    returnlbl = Label(root,fg="Purple", text ="")
    returnlbl.grid(row=12)

    def clicked():
        # Here we would call the solving function
        # We would also need to parse individual characters into an array (max size of 21 (26-5 for incorrect))
        cArr = [c1.get().lower(), c2.get().lower(), c3.get().lower(), c4.get().lower(), c5.get().lower()]
        m1Arr = [m11.get().lower(), m21.get().lower(), m31.get().lower(), m41.get().lower(), m51.get().lower()]
        m2Arr = [m12.get().lower(), m22.get().lower(), m32.get().lower(), m42.get().lower(), m52.get().lower()]
        m3Arr = [m13.get().lower(), m23.get().lower(), m33.get().lower(), m43.get().lower(), m53.get().lower()]
        m4Arr = [m14.get().lower(), m24.get().lower(), m34.get().lower(), m44.get().lower(), m54.get().lower()]
        m5Arr = [m15.get().lower(), m25.get().lower(), m35.get().lower(), m45.get().lower(), m55.get().lower()]
        mArr= [m1Arr, m2Arr, m3Arr, m4Arr, m5Arr]
        # This order is basically saying that at m1Arr, these characters have already been tried
        # Which will hopefully allow us to remove words with those characters at that position, 
        # because we know that character at that position is not correct

        iArr = string_to_arr(incorrect.get())

        guess = guess_word(cArr, mArr, iArr)
        returnlbl.configure(text = "Try this word: '" + guess + "'")

    btn = Button(root, text = "Guess", fg = "blue", command=clicked)
    btn.grid(row=11)
    root.mainloop()

window()

if __name__ == "__main__":
    exit(0) #script ends on window close
