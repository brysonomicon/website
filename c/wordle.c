#include <emscripten/emscripten.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <ctype.h>

#define WORD_LENGTH 6
#define MAX_GUESSES 20
#define MAX_WORDS 15000

char* words[MAX_WORDS];
char key[WORD_LENGTH];
char display[WORD_LENGTH * 3 - 1];
char guesses[MAX_GUESSES][WORD_LENGTH];
int guessIndex = 0;
int count = 0;
int word_count = 0;

void updateDisplay(char* display, const char* key, const char* guess);

void resetGame() {
    srand(time(NULL));
    int random = rand() % word_count;
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

void toLowerCase(char* str) {
    for (int i = 0; str[i]; i++) {
        str[i] = tolower((unsigned char)str[i]);
    }
}

int isValidWord(const char* word) {
    if (strlen(word) != WORD_LENGTH - 1) {
        return 0;
    }
    
    char lowerWord[WORD_LENGTH];
    strncpy(lowerWord, word, WORD_LENGTH - 1);
    lowerWord[WORD_LENGTH - 1] = '\0';
    toLowerCase(lowerWord);

    for (int i = 0; i < word_count; i++) {
        char lowerListWord[WORD_LENGTH];
        strncpy(lowerListWord, words[i], WORD_LENGTH - 1);
        lowerListWord[WORD_LENGTH - 1] = '\0';
        toLowerCase(lowerListWord);

        if (strcmp(lowerListWord, lowerWord) == 0) {
            return 1;
        }
    }
    return 0;
}

void processGuess(const char* guess) {
    if (!isValidWord(guess)) {
        printf("Invalid word!\n");
        return;
    }

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

void loadWords() {
    FILE* file = fopen("words", "rb");
    if (!file) {
        printf("Failed to open word list.\n");
        return;
    }

    char line[WORD_LENGTH];
    while (fgets(line, sizeof(line), file) && word_count < MAX_WORDS) {

        line[strcspn(line, "\r\n")] = 0;
        if (strlen(line) == WORD_LENGTH - 1) {
            words[word_count] = strdup(line);
            word_count++;
        }
    }

    fclose(file);
}

EMSCRIPTEN_KEEPALIVE
void startGame() {
    loadWords();
    resetGame();
    emscripten_run_script("clearOutput()"); 
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
