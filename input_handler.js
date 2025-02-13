import Queue from './queue.js';
import DividedWord from './divided_word.js';

const MAX_LEFT_WORDS_NUMBER = 9;


class InputModel {
    static left_words = new Queue(MAX_LEFT_WORDS_NUMBER);
    static last_entered_char = null;
    static actual_word = null
    static right_words = new Queue(null);

    static initialize(to_be_typed_text) {
        const words = to_be_typed_text.split(" ");
        InputModel.right_words.fillWith(words);
        InputModel.actual_word = new DividedWord(InputModel.right_words.dequeue());
    }

    static isCharacterCorrect(enteredChar) {
        //TODO VALIDATE IF CHAR IS ALPHANUMERIC
        //TODO CHECK IF TO_BE_TYPED IS EMPTY
        return (enteredChar === InputModel.actual_word.getActualLetter());
    }

    static shiftCharToLeft() {
        InputModel.actual_word.moveCharToLeft();
        if(InputModel.actual_word.isDone()) {
            InputModel.left_words.enqueue(InputModel.actual_word.getLeftAsText());
            InputModel.actual_word = new DividedWord(InputModel.right_words.dequeue())
        }
    }

    static getLeftWords() {return InputModel.left_words;}

    static getActualWord() {return InputModel.actual_word;}

    static getRightWords() {return InputModel.right_words;}
}




class InputController {
    static model = null;
    static view = null;

    static allowedChars = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        ' ', ',', '.', '/', ';', "'", '[', ']', '\\', '!', '#', '$', '%', '&', '(', ')', '*', '+', '-', '=', '?', ':', '"', '<', '>', 
        '{', '}', '|', '^', '~'
    ];

    static initialize(model, view) {
        InputController.model = model;
        InputController.view = view;
    }

    static prepareInputView() {
        updateTexts
    }

    static onKeydownEvent(event) {
        let enteredChar = event.key;

        enteredChar = InputController.getAlphanumericCharOrNull(enteredChar);
        
        if (enteredChar !== null) InputController.characterEntered(enteredChar);
    }

    static characterEntered(actual_char) {
        console.log("BEFORE:");
        console.log(InputController.model.left_words);
        console.log(InputController.model.actual_word.getLeftAsText());
        console.log(InputController.model.actual_word.getRightAsText());
        console.log(InputController.model.right_words);
        if (InputController.model.isCharacterCorrect(actual_char)) {
            InputController.model.shiftCharToLeft();
            actual_char = "";
        }
        console.log("AFTER:");
        console.log(InputController.model.left_words);
        console.log(InputController.model.actual_word.getLeftAsText());
        console.log(InputController.model.actual_word.getRightAsText());
        console.log(InputController.model.right_words);

        InputController.view.updateTexts(
            InputController.model.getLeftWords(), 
            InputController.model.getActualWord().getLeftAsText(),
            InputController.model.getActualWord().getRightAsText(),
            InputController.model.getRightWords(),
            actual_char
        );
    }

    static getAlphanumericCharOrNull(char) {

        if (InputController.allowedChars.includes(char)) {
            return char;
        }
    
        return null;
    }
}


class InputView {
    static left_container = null;
    static actual_word_container = null;
    static right_container = null;

    static initialize() {
        InputView.left_container = document.getElementById("correctly_typed");
        InputView.actual_word_container = document.getElementById("actual_character");
        InputView.right_container = document.getElementById("to_be_typed");
    }

    static updateTexts(left_words, actual_word_left, actual_word_right, right_words, typed_char) {
        //TODO MAYBE I SHOULD ASSIGN A SEPARATE DIV FOR EACH WORD 
        InputView.left_container.textContent = left_words + actual_word_left;
        InputView.actual_word_container.textContent = typed_char;
        InputView.right_container.textContent = actual_word_right + right_words;
    }
}

  


const text = "to jest jakis randomowy tekst";

InputModel.initialize(text);
InputView.initialize();

InputController.initialize(InputModel, InputView);


document.addEventListener("keydown", InputController.onKeydownEvent);