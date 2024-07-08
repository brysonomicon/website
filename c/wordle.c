#include <emscripten/emscripten.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <ctype.h>

#define WORD 100
#define WORD_LENGTH 6
#define MAX_GUESSES 20

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

char key[WORD_LENGTH];
char display[WORD_LENGTH * 3 - 1];
char guesses[MAX_GUESSES][WORD_LENGTH];
int guessIndex = 0;
int count = 0;

void updateDisplay(char* display, const char* key, const char* guess);

void resetGame() {
    srand(time(NULL));
    int random = rand() % WORD;
    strncpy(key, words[random], WORD_LENGTH - 1);
    key[WORD_LENGTH - 1] = '\0';

    for (int i = 0; i < WORD_LENGTH - 1; i++) {
        display[i * 3] = '[';
        display[i * 3 + 1] = ' ';
        display[i * 3 + 2] = ']';
    }
    guessIndex = 0;
    count = 0;
    memset(guesses, 0, sizeof(guesses));
}

void displayBoard() {
    printf("Guesses: ");
    for (int i = 0; i < guessIndex; i++) {
        if (i % 10 == 0) {
            puts("");
        }
        printf("%s ", guesses[i]);
    }
    printf("\n%s\n", display);
}

void processGuess(const char* guess) {
    strncpy(guesses[guessIndex], guess, WORD_LENGTH - 1);
    guesses[guessIndex][WORD_LENGTH - 1] = '\0';
    guessIndex++;

    updateDisplay(display, key, guess);

    displayBoard();

    count++;
    if (strcmp(guess, key) == 0) {
        printf("You guessed the word in %d tries, good job!\n", count);
    } else if (guessIndex >= MAX_GUESSES) {
        printf("You've reached the maximum number of guesses. The correct word was: %s\n", key);
    }
}

EMSCRIPTEN_KEEPALIVE
void startGame() {
    resetGame();
    emscripten_run_script("clearOutput()"); // Clear the output window
    displayBoard();
}

EMSCRIPTEN_KEEPALIVE
void guess(const char* input) {
    processGuess(input);
}

int main() {
    startGame();
}

void updateDisplay(char* display, const char* key, const char* guess) {
    int matched[WORD_LENGTH] = { 0 };

    for (size_t i = 0; i < WORD_LENGTH; ++i) {
        display[i * 3 + 1] = ' ';
    }

    for (size_t i = 0; i < WORD_LENGTH; ++i) {
        if (key[i] == guess[i]) {
            display[i * 3 + 1] = toupper(guess[i]);
            matched[i] = 1;
        }
    }

    for (size_t i = 0; i < WORD_LENGTH; ++i) {
        if (key[i] != guess[i]) {
            for (size_t j = 0; j < WORD_LENGTH; ++j) {
                if (guess[i] == key[j] && !matched[j]) {
                    display[i * 3 + 1] = guess[i];
                    matched[j] = 1;
                }
            }
        }
    }
}
