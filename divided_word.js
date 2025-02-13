import Queue from "./queue.js";

class DividedWord {
    constructor(word) {
        this.left = new Queue(word.length);
        this.right = new Queue(word.length);
        this.right.fillWith(word.split(''));
        console.log(word.split(''));
    }

    getLeftAsText() {return this.left.toString();}
    getActualLetter() {return this.right.getFirst();}
    getRightAsText() {return this.right.toString();}
    isDone() {return this.right.isEmpty();}

    moveCharToLeft() {
        console.log("MOVE_CHAR");
        console.log(this.left.getList());
        console.log(this.right.getList());
        this.left.enqueue(this.right.dequeue());
        console.log(this.left.getList());
        console.log(this.right.getList());
    }

}

export default DividedWord;