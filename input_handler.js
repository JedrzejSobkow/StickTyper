import Queue from './queue.js';

const MAX_TYPED_MEMORY_SIZE = 9;


class InputModel {
    static correctly_typed = new Queue(MAX_TYPED_MEMORY_SIZE);
    static last_entered_char = null;
    static to_be_typed = new Queue(null);

    static initialize(to_be_typed_text) {
        InputModel.to_be_typed.fillWith(Array.from(to_be_typed_text));
    }

    static isCharacterCorrect(enteredChar) {
        //TODO VALIDATE IF CHAR IS ALPHANUMERIC
        //TODO CHECK IF TO_BE_TYPED IS EMPTY
        return (enteredChar === InputModel.to_be_typed.getFirst());
    }

    static shiftCorrectCharacter() {
        InputModel.correctly_typed.enqueue(InputModel.to_be_typed.dequeue());
    }

    static getCorrectlyTyped() {
        return InputModel.correctly_typed;
    }

    static getToBeTyped() {
        return InputModel.to_be_typed;
    }
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

    static characterEntered(actualChar) {
        console.log(`KEYDOWN ${actualChar}`);

        if (InputController.model.isCharacterCorrect(actualChar)) {
            InputController.model.shiftCorrectCharacter();
            actualChar = "";
        }

        InputController.view.updateTexts(
            InputController.queueToString(InputController.model.getCorrectlyTyped()), 
            actualChar, 
            InputController.queueToString(InputController.model.getToBeTyped())
        );
    }

    static getAlphanumericCharOrNull(char) {

        if (InputController.allowedChars.includes(char)) {
            return char;
        }
    
        return null;
    }

    static queueToString(queue) {
        return queue.getList().join('');
    }
}


class InputView {
    static correctly_typed_element = null;
    static actual_character = null;
    static to_be_typed = null;

    static initialize() {
        InputView.correctly_typed_element = document.getElementById("correctly_typed");
        InputView.actual_character = document.getElementById("actual_character");
        InputView.to_be_typed = document.getElementById("to_be_typed");
    }

    static updateTexts(correctly_typed, actual_char, to_be_typed) {
        InputView.correctly_typed_element.textContent = correctly_typed;
        InputView.actual_character.textContent = actual_char;
        InputView.to_be_typed.textContent = to_be_typed;
    }
}

  


const text = "to jest jakis randomowy tekst";

InputModel.initialize(text);
InputView.initialize();

InputController.initialize(InputModel, InputView);


document.addEventListener("keydown", InputController.onKeydownEvent);