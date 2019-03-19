'use strict';

/**
 * @author Niklas Seppälä
 * @date 19.3.2019
 * @license MIT
 * 
 *  This JavaScript file contains my implementation of most usual datastructures.
 *  Contains following classes:
 *      Stack    : Stack with strict LIFO princible.
 */

/**
 * Class for stack-object instances.
 * Implemented in a way that items can't be accessed all
 * at once. Only allows acces to elements in LIFO princible.
 * 
 * Stack with following methods:
 *    isEmpty()
 *    push()
 *    peek()
 *    pop()
 */
class Stack {

    constructor() {

        var items = [];

        /**
         * Returns false if stack is empty.
         * Otherwise returns true.
         */
        this.isEmpty = function () {

            if (items.length === 0)
                return true;
            return false;
        }


        /**
         * Pushes new item on top of the stack.
         */
        this.push = function (item) {
            items.push(item);
        }

        /**

         * Peeks on top of the stack.
         * Doesn't remove item on top of the stack.
         */
        this.peek = function () {
            if (this.isEmpty())
                return "Empty Stack";
            return items[items.length - 1];
        }


        /**
         * Returns the item on top of the stack
         * and removes it from stack.
         */
        this.pop = function () {
            if (this.isEmpty())
                return "Empty Stack";
            return items.pop();
        }
    }
}