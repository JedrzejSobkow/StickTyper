export class Queue {
    constructor(max_size) {
        if (max_size <= 0) {
            max_size = null;
        }
        this.max_size = max_size;
        this.queue = [];
    }

    fillWith(elements) {
        elements.forEach(element => {
            this.enqueue(element);
        });
    }

    enqueue(element) {
        if (this.isFull()) {
            this.dequeue();  
        }

        this.queue.push(element); 

    }

    dequeue() {
        if (this.isEmpty()) {
            return null; 
        }

        return this.queue.shift();
    }

    dequeueAll() {
        const removed_elements = [...this.queue];
        this.queue = []; 
        return removed_elements;  
    }

    getFirst() {
        return this.isEmpty() ? null : this.queue[0];
    }

    getLast() {
        this.isEmpty() ? null : this.queue[this.getSize - 1];
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    getSize() {
        return this.queue.length;
    }

    isFull() {
        return this.max_size !== null && this.queue.length >= this.max_size;
    }

    getList() {
        return this.queue;
    }

    toString() {
        return this.getList().join('');
    }

}