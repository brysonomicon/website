// Custom wordle type game using arrays

#define _CRT_SECURE_NO_WARNINGS

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h> // time for srand
#include <ctype.h> // toupper

#define WORD 100
#define WORD_LENGTH 6
#define MAX_GUESSES 20
#define LETTER 26

const char* words[WORD] = 
{
    "apple", "bread", "crane", "drake", "eagle",
    "flame", "grape", "honey", "igloo", "jelly",
    "kiosk", "lemon", "mango", "ninja", "oasis",
    "pearl", "quilt", "river", "snake", "tiger",
    "umbra", "vivid", "whale", "xerox", "yacht",
    "zebra", "adobe", "brave", "cloud", "dance",
    "eager", "fable", "giant", "happy", "image",
    "joint", "knock", "lunar", "medal", "naval",
    "ocean", "piano", "quark", "royal", "sheep",
    "trust", "union", "value", "watch", "xerox",
    "young", "zonal", "angel", "bliss", "creek",
    "dwarf", "exile", "flora", "globe", "house",
    "ideal", "jolly", "kneel", "laser", "mirth",
    "north", "overt", "plume", "quest", "resin",
    "shine", "thorn", "upper", "vocal", "wheat",
    "xenon", "yield", "zesty", "amber", "bloom",
    "charm", "debut", "elbow", "frost", "glade",
    "haunt", "inbox", "joust", "koala", "limit",
    "merry", "night", "ovoid", "punch", "quill"
};

void updateDisplay(char* display, const char* key, const char* guess);

int main(void) 
{
    srand(time(NULL));
    int count = 0;

    // copy a key word into the key array
    int random = rand() % WORD;
    char key[WORD_LENGTH];
    strncpy(key, words[random], WORD_LENGTH - 1);
    key[WORD_LENGTH - 1] = '\0';

    // declare the input and display arrays
    char guess[WORD_LENGTH] = { '\0' };
    char display[WORD_LENGTH * 3 - 1] = { '\0' };
    for (int i = 0; i < WORD_LENGTH - 1; i++) {
        display[i * 3] = '[';
        display[i * 3 + 1] = ' ';
        display[i * 3 + 2] = ']';
    }

    // declare array to store guesses to be displayed
    char guesses[MAX_GUESSES][WORD_LENGTH] = { '\0' };
    int guessIndex = 0;

    do
    {
        // Print the game board
        printf("Guesses: ");
        for (int i = 0; i < guessIndex; i++) {
            if (i % 10 == 0) {
                puts("");
            }
            printf("%s ", guesses[i]);
        }
        printf("\n%s\n", display);

        // NEXT CHANGE INPUT VALIDATION TO MAKE SURE WE GET VALID INPUT AND INTERPRET CAPS AND LOWERCASE THE SAME.
        // also check if word has already been guessed
        // lastly look into checking against a dictionary from CSV for 5 letter words to ensure real word inputs
        puts("Guess a 5-letter word: ");
        scanf("%5s", guess);

        // Store the guess in the guesses array
        strncpy(guesses[guessIndex], guess, WORD_LENGTH - 1);
        guesses[guessIndex][WORD_LENGTH - 1] = '\0';
        guessIndex++;

        // Update the display with the current guess
        updateDisplay(display, key, guess);

        // Clear the screen
        system("cls");

        ++count;
    } while (strcmp(guess, key) != 0 && guessIndex < MAX_GUESSES);

    system("cls");
    for (size_t i = 0; i < WORD_LENGTH; ++i) {
        display[i * 3 + 1] = toupper(display[i * 3 + 1]);
    }
    printf("%s\n", display);
    if (strcmp(guess, key) == 0) {

        printf("You guessed the word in %d tries, good job!\n", count);
    }
    else {
        printf("You've reached the maximum number of guesses. The correct word was: %s\n", key);
    }

    printf("These were your guesses: ");
    for (int i = 0; i < guessIndex; i++) {
        if (i % 10 == 0) {
            puts("");
        }
        printf("%s ", guesses[i]);
    }
}

// if we guess a word with 2 N's and the key only has 1 N, update display should only show one lowercase n instead of two.
void updateDisplay(char* display, const char* key, const char* guess)
{
    int matched[WORD_LENGTH] = { 0 };

    for (size_t i = 0; i < WORD_LENGTH; ++i) 
    {
        display[i * 3 + 1] = ' ';
    }

    for (size_t i = 0; i < WORD_LENGTH; ++i) 
    {
        if (key[i] == guess[i])
        {
            display[i * 3 + 1] = toupper(guess[i]);
            matched[i] = 1; // mark matched index positions to prevent printing dupes when print right char, wrong location
        }
    }

    for (size_t i = 0; i < WORD_LENGTH; ++i) 
    {
        if (key[i] != guess[i]) 
        {
            for (size_t j = 0; j < WORD_LENGTH; ++j) 
            {
                if (guess[i] == key[j] && !matched[j]) 
                {
                    display[i * 3 + 1] = guess[i];
                    matched[j] = 1;  
                }
            }
        }
    }
}