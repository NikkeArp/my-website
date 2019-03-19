'use strict';

/**
 * @author Niklas Seppälä
 * @date 19.3.2019
 * @license MIT
 * 
 *  This scripts adds new features to HTML-5
 *  textarea-element:
 *      Tab         : Moves current line 4 spaces forward.
 *      Shift + tab : Moves current line maximum of 4 spaces backwards.
 *      Ctr + Z     : Undo
 *      Ctr + Y     : Redo
 * 
 *  These features are achieved with textarea's keydown
 *  event. To make thigns easier with transfering data about current line,
 *  I have defined Line-class at the end of the file.
 *  Stack class is defined to hold user's actions for undo and redo.
 */

$(function () {

    // All textarea actions will be pushed in this stack
    // and popped when user undos their action.
    var actions = new Stack();

    
    $("textarea").keydown(function (e) {

        /**
         * Event for TAB
         */
        if (e.keyCode === 9) {

            // Set up variables.
            // Splits lines into an array and pushes them 
            // into Line-object array. Defines cursor location.
            var text = $(this).val().split("\n");
            var lines = [];
            var cursorLocation = this.selectionStart;

            let lineNum = 1;
            text.forEach(line => {
                lines.push(new Line((line + "\n"), lineNum));
                lineNum++;
            });

            if (lines[lines.length - 1].content === "\n")
                console.log(lines.pop());


            var cursorLine = findCursorLine(lines, cursorLocation);
            var end = cursorLine.length;
            var newLine = cursorLine.content;

            if (window.event.shiftKey) {

                if (cursorLocation === 0) {
                    return false;
                }

                var cursorMoved = 0;
                while (cursorMoved < 2 && newLine[0] === " ") {
                    newLine = newLine.substring(1, cursorLine.length);
                    cursorMoved++;
                }

                lines[cursorLine.lineNum - 1].content = newLine;
                let result = "";
                lines.forEach(line => {
                    result += line.content;
                });

                $(this).val(result);
                this.selectionStart = this.selectionEnd = cursorLocation - cursorMoved;

                return false;
            }
            else {
                newLine = newLine.substring(0, (cursorLocation - cursorLine.charsBefore)) +
                    "  " + newLine.substring((cursorLocation - cursorLine.charsBefore), end);
                let result = "";
                lines[cursorLine.lineNum - 1].content = newLine;
                lines.forEach(line => {
                    result += line.content;
                });

                $(this).val(result);

                this.selectionStart = this.selectionEnd = cursorLocation + 2;
                return false;
        
            }
        }

        /**
         * Event for CTRL + X
         */
        else if (event.keyCode === 90) {
            e.preventDefault();
        }

        /**
         * Event for CTRL + Y
         */
        else if (event.keyCode == 89) {
            e.preventDefault();
        }
    });


    /**
    *	Finds the line where cursor is located at
    *	the time of the event.
    */
    function findCursorLine(lines, cursorIndex) {

        let result;
        let lineIndex = 0;
        let charsBefore = 0;

        do {
            cursorIndex -= (lines[lineIndex].length);
            lineIndex++;
        } while (cursorIndex >= 0)

        result = lines[lineIndex - 1];

        for (let i = 0; i < result.lineNum - 1; i++)
            charsBefore += lines[i].length;

        result.charsBefore = charsBefore;

        return result;
    }


    /**
    *	Class to represent Line-object.
    */
    class Line {

        constructor(content, lineNum) {
            this.charsBefore = null;
            this.content = content;
            this.length = content.length;
            this.lineNum = lineNum;
        }
    }
})


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
