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
    constructor(model, view, text_speed) {
        this.model = model;
        this.view = view;

        this.view.setSpeed(text_speed);


        this.allowedChars = [
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    ' ', ',', '.', '/', ';', "'", '[', ']', '\\', '!', '#', '$', '%', '&', '(', ')', '*', '+', '-', '=', '?', ':', '"', '<', '>', 
                    '{', '}', '|', '^', '~'
                ];

        this.view.prepareAllWords(this.model.getActualWord().getRightAsText(), this.model.getRightWords().getList());

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
        this.is_in_move = false;

        this.collision_listener = null;
    }

    prepareAllWords(actual_word, right_words) {
        this.actual_word_right.textContent = actual_word;
        let position = this.right_element.offsetWidth;

        right_words.unshift(actual_word);

        right_words.forEach(word => {
            const div = this.transformWordIntoDiv(word);
            div.style.position = "absolute";
            div.style.left = `${position}px`;
            this.right_element.appendChild(div);
            position += div.offsetWidth + 20;
        });
    }

    animateWords() {        
        const move = () => {
            const words = document.querySelectorAll("#to_be_typed div");
            if (words.length === 0) {
                this.is_in_move = false;
                return;
            }
            
            const firstWord = words[0]; 
            let firstWordLeft = parseInt(firstWord.style.left, 10);
            if (firstWordLeft <= 0) {
                this.is_in_move = false;
                if (this.collision_listener) this.collision_listener.updateCollisionState(true);
                return; 
            }
            words.forEach(word => {
                let currentLeft = parseInt(word.style.left, 10);
                word.style.left = `${currentLeft - this.speed}px`;
            });
            requestAnimationFrame(move);
        };

        if (!this.is_in_move) {
            this.is_in_move = true;
            if (this.collision_listener) this.collision_listener.updateCollisionState(false);
            move();
        }
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

    transformWordIntoDiv(word) {
        const newElement = document.createElement("div");
        newElement.textContent = word;
        newElement.id = this.last_word_id++;
        return newElement;
    }

    setSpeed(speed) {this.speed = speed; }


    registerCollisionListener(collision_listener) {
        this.collision_listener = collision_listener;
    }
}



// document.addEventListener("DOMContentLoaded", () => {
//     const text = `The world is rapidly changing, and technology plays a crucial role in this transformation. Over the past few decades, advancements in various fields, from artificial intelligence to renewable energy, have reshaped the way we live, work, and interact with each other. As we move further into the 21st century, the pace of innovation is only accelerating, and it's clear that technology will continue to shape our future.`;

//     const model = new TypingModel(text);
//     const view = new TypingView();
//     new TypingController(model, view);
// });
