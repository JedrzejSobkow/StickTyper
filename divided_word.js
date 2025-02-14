import Queue from "./queue.js";

class DividedWord {
    constructor(word) {
        this.left = new Queue(word.length);
        this.right = new Queue(word.length);
        this.right.fillWith(word.split(''));
    }

    getLeftAsText() {return this.left.toString();}
    getActualLetter() {return this.right.getFirst();}
    getRightAsText() {return this.right.toString();}
    isDone() {return this.right.isEmpty();}

    moveCharToLeft() {
        this.left.enqueue(this.right.dequeue());
    }

}

export default DividedWord;