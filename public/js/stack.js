/**
 * Implementation of a Stack class.
 * I found this code on geeksforgeeks.org.
 *
 * @author contribute@geeksforgeeks.org 
 * @see https://www.geeksforgeeks.org/implementation-stack-javascript/
 */
export default class Stack {

    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        if (this.items.length == 0)
            return;
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length == 0;
    }

    clear() {
        this.items = [];
    }

    printStack() {
        let str = "";
        for (let i = 0; i < this.items.length; i++)
            str += this.items[i] + " ";
        return str;
    }

}