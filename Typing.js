import { Queue } from './queue.js';
import { DividedWord } from './divided_word.js';

const MAX_LEFT_WORDS_NUMBER = 9;

export class TypingModel {
    constructor(to_be_typed_text) {
        this.left_words = new Queue(MAX_LEFT_WORDS_NUMBER);
        this.last_entered_char = null;
        this.actual_word = null;
        this.right_words = new Queue(null);

        this.initialize(to_be_typed_text);
    }

    initialize(to_be_typed_text) {
        const words = to_be_typed_text.split(" ");
        this.right_words.fillWith(words);
        this.actual_word = new DividedWord(this.right_words.dequeue());
    }

    isCharacterCorrect(enteredChar) {
        return (enteredChar === this.actual_word.getActualLetter());
    }

    shiftCharToLeft() {
        this.actual_word.moveCharToLeft();
    }

    isActualWordDone() {
        return this.actual_word.isDone();
    }

    shiftWordToLeft() {
        this.left_words.enqueue(this.actual_word.getLeftAsText());
        this.right_words.dequeue();
        this.actual_word = new DividedWord(this.right_words.getFirst());
    }

    getLeftWords() { return this.left_words; }
    getActualWord() { return this.actual_word; }
    getRightWords() { return this.right_words; }
}

export class TypingController {
    constructor(model, view, text_speed_fun_collection) {
        this.model = model;
        this.view = view;

        this.view.setSpeedFunCollection(text_speed_fun_collection);


        this.allowedChars = [
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    ' ', ',', '.', '/', ';', "'", '[', ']', '\\', '!', '#', '$', '%', '&', '(', ')', '*', '+', '-', '=', '?', ':', '"', '<', '>', 
                    '{', '}', '|', '^', '~'
                ];

        this.view.prepareWords(this.model.getActualWord().getRightAsText(), this.model.getRightWords().getList());

        document.addEventListener("keydown", this.onKeydownEvent.bind(this));
    }

    start() {
        this.view.animateWords();
    }

    onKeydownEvent(event) {
        let enteredChar = event.key;
        enteredChar = this.getAlphanumericCharOrNull(enteredChar);
        if (enteredChar !== null) this.characterEntered(enteredChar);
    }

    characterEntered(actual_char) {
        if (this.model.isCharacterCorrect(actual_char)) {
            this.model.shiftCharToLeft();
            this.view.updateActualWord(this.model.getActualWord().getRightAsText());

            if (this.model.isActualWordDone()) {
                this.model.shiftWordToLeft();
                this.view.changeActualWord();
            }
            actual_char = '';
        }
        this.view.updateWronglyEnteredChar(actual_char);
    }

    getAlphanumericCharOrNull(char) {
        return this.allowedChars.includes(char) ? char : null;
    }

    registerListener(event_name, collision_listener) {
        if (event_name == "collision") {
            this.view.registerCollisionListener(collision_listener);
        }
    }

}

export class TypingView {
    constructor() {
        this.wrongly_typed_char = document.getElementById("wrongly_typed_char");
        this.actual_word_right = document.getElementById("actual_word_right");
        this.right_element = document.getElementById("to_be_typed");

        this.actual_word_id = -1;
        this.last_word_id = 0;
        this.last_word_position = -1;
        this.is_in_move = false;
        this.interval_id = null;
        this.collision_listener = null;
    }

    prepareWords(actual_word, right_words) {
        this.actual_word_right.textContent = actual_word;
        this.last_word_position = this.right_element.offsetWidth;

        right_words.unshift(actual_word);

        right_words.forEach(word => {
            this.appendWordIntoRightElement(word);
        });
    }

    animateWords() {
        if (this.is_in_move) return;
        this.is_in_move = true;
        if (this.collision_listener) this.collision_listener.updateCollisionState(false);
        
        this.interval_id = setInterval(() => {
            const words = document.querySelectorAll("#to_be_typed div");
            if (words.length === 0) {
                this.is_in_move = false;
                clearInterval(this.interval_id);
                return;
            }
            

            const first_word = words[0]; 
            let first_word_left = parseInt(first_word.style.left, 10);
            if (first_word_left <= 0) {
                this.is_in_move = false;
                clearInterval(this.interval_id);
                if (this.collision_listener) this.collision_listener.updateCollisionState(true);
                return; 
            }



            const offset = this.speed_fun_collection.getNext();
            // console.log(offset);

            let should_be_block = true;

            words.forEach(word => {
                let currentLeft = parseInt(word.style.left, 10);
                word.style.left = `${currentLeft - offset}px`;

                if (word.style.display === "none") {
                    word.style.display = "block";
                    let should_be_block = this.shouldWordBeVisibleInRight(word);
                    word.style.display = "none";

                    if (should_be_block) {
                        word.style.display = "block";
                        //TODO FADE WHEN CHANGING DISPLAY TO BLOCK
                    } 
                }

                //YES, I'M AWARE THAT currentLeft - offset IS CASTET TO INT BUT IT HAS TO WORK LIKE THIS UNTIL I FIND ANYTHING BETTER
            });
        }, 8);
    }

    changeActualWord() {
        this.actual_word_id++;
        const new_actual_word_element = document.getElementById(this.actual_word_id+1);
        const to_delete_from_right = document.getElementById(this.actual_word_id);
        this.actual_word_right.textContent = new_actual_word_element.textContent;
        to_delete_from_right.remove();
        this.animateWords();
    }

    updateActualWord(actual_right) {
        this.actual_word_right.textContent = actual_right; 
    }

    updateWronglyEnteredChar(newChar) {
        this.wrongly_typed_char.textContent = newChar;
    }

    appendWordIntoRightElement(word) {
        const newElement = document.createElement("div");
        newElement.textContent = word;
        newElement.id = this.last_word_id++;

        newElement.style.position = "absolute";
        newElement.style.left = `${this.last_word_position}px`;
        this.right_element.appendChild(newElement);
        this.last_word_position += newElement.offsetWidth + 20;

        if (this.shouldWordBeVisibleInRight(newElement)) {
            console.log(newElement.getBoundingClientRect().right);
            newElement.style.display = "block";
            console.log("block");
        }
        else {
            console.log(newElement.getBoundingClientRect().right);
            newElement.style.display = "none";
            console.log("none");
        }

        return newElement;
    }

    shouldWordBeVisibleInRight(word_elem) {
        return parseInt(word_elem.getBoundingClientRect().right, 10) < parseInt(this.right_element.getBoundingClientRect().right, 10)
    }

    setSpeedFunCollection(speed_fun_collection) {this.speed_fun_collection = speed_fun_collection; }


    registerCollisionListener(collision_listener) {
        this.collision_listener = collision_listener;
    }
}

//TODO FIRST WORD FROM 🤓RIGHT WORDS IS DIVIDED BY COLOURS!!! OR ACTUAL CHAR IS UNDERLINED!!!
//TODO wal sie na łeb pajacu gupi kocham ce kolego kochaniutki ojojojoj ale jestes piekniutki fajniutki ojeju