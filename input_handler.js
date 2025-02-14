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
    }

    static isActualWordDone() {
        return InputModel.actual_word.isDone();

    }

    static shiftWordToLeft() {
        InputModel.left_words.enqueue(InputModel.actual_word.getLeftAsText());
        InputModel.actual_word = new DividedWord(InputModel.right_words.dequeue());
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

        InputController.view.prepareAllWords(InputController.model.getActualWord().getRightAsText(), InputController.model.getRightWords().getList());
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
        if (InputController.model.isCharacterCorrect(actual_char)) {
            InputController.model.shiftCharToLeft();
            InputController.view.updateActualWord(InputController.model.getActualWord().getRightAsText())
            
            if (InputController.model.isActualWordDone()) {
                InputController.model.shiftWordToLeft();
                InputController.view.changeActualWord();
            }
            else {

            }

            actual_char = " ";
        }
        InputController.view.updateWronglyEnteredChar(actual_char);
    }


    static getAlphanumericCharOrNull(char) {

        if (InputController.allowedChars.includes(char)) {
            return char;
        }
    
        return null;
    }
}


class InputView {
    // moving_left_element = null;
    // actual_word_left = null;
    wrongly_typed_char = null;
    actual_word_right = null;
    right_element = null;

    actual_word_id = -1;
    last_word_id = -1;

    static initialize() {
        // InputView.moving_left_element = document.getElementById("moving_words_left");
        // InputView.actual_word_left = document.getElementById("actual_word_left");
        InputView.wrongly_typed_char = document.getElementById("wrongly_typed_char");
        InputView.actual_word_right = document.getElementById("actual_word_right");
        InputView.right_element = document.getElementById("to_be_typed");

        InputView.actual_word_id = -1;
        InputView.last_word_id = 0;
    }

    static prepareAllWords(actual_word, right_words) {
        InputView.actual_word_right.textContent = actual_word

        right_words.forEach(word => {
            const div = InputView.transformWordIntoDiv(word);
            InputView.right_element.appendChild(div);
        });
    }




    // static updateTexts(left_words, actual_word_left, actual_word_right, right_words, typed_char) {
    //     //TODO MAYBE I SHOULD ASSIGN A SEPARATE DIV FOR EACH WORD 
    //     InputView.moving_left_element.document
    //     InputView.actual_word_element.textContent = typed_char;
    //     InputView.right_element.textContent = actual_word_right + right_words;
    // }

    static changeActualWord() {
        console.log(InputView.actual_word_id);
        InputView.actual_word_id++;
        const new_actual_word_element = document.getElementById(InputView.actual_word_id);
        InputView.actual_word_right.textContent = new_actual_word_element.textContent;
        new_actual_word_element.remove();
    }

    static updateActualWord(actual_right) {
        InputView.actual_word_right.textContent = actual_right; 
    }

    static updateWronglyEnteredChar(newChar) {
        InputView.wrongly_typed_char.textContent = newChar;
    }


    static transformWordIntoDiv(word) {

        const newElement = document.createElement("div");
        newElement.textContent = word;

        newElement.id = InputView.last_word_id;
        InputView.last_word_id++;

        return newElement;
    }
}



const text = `The world is rapidly changing, and technology plays a crucial role in this transformation. Over the past few decades, advancements in various fields, from artificial intelligence to renewable energy, have reshaped the way we live, work, and interact with each other. As we move further into the 21st century, the pace of innovation is only accelerating, and it's clear that technology will continue to shape our future. One of the most significant technological developments is the rise of the internet. The internet has revolutionized communication, allowing people to connect instantly with others across the globe. It has also transformed the way businesses operate, providing new opportunities for marketing, e-commerce, and remote work. The rise of social media platforms has allowed individuals to share their thoughts and ideas with a global audience, creating a new kind of interconnected world.In addition to communication, technology has made great strides in healthcare. Medical innovations, such as telemedicine and wearable health devices, have improved access to healthcare services and enabled early detection of diseases. Artificial intelligence is also being used to assist doctors in diagnosing and treating patients, while research into personalized medicine is paving the way for more effective treatments tailored to individuals' genetic profiles.`;

InputModel.initialize(text);
InputView.initialize();

InputController.initialize(InputModel, InputView);


document.addEventListener("keydown", InputController.onKeydownEvent);