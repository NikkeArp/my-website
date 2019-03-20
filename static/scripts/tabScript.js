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
    var undo = new Stack();
    var redo = new Stack();


    $("textarea").keydown(function (e) {

        // Adds new state to undo stack if it differs from
        // state on top of the stack.
        if (undo.isEmpty())
            undo.push($(this).val());
        else if (undo.peek() !== $(this).val())
            undo.push($(this).val());

        /**
         * Event for TAB
         */
        if (e.keyCode === 9) {
            e.preventDefault();

            // Splits lines into an array and pushes them 
            // into Line-object array.
            let text = $(this).val().split("\n");
            let lines = [];
            let lineNum = 1;
            text.forEach(line => {
                lines.push(new Line((line + "\n"), lineNum));
                lineNum++;
            });
            // Pop last empty newline.
            if (lines[lines.length - 1].content === "\n") {
                lines.pop()
            }

            // Defines cursor location.
            let cursorLocation = this.selectionStart;

            // Finds line where tab was pressed.
            // Sets variables for modifying that line.
            let cursorLine = findCursorLine(lines, cursorLocation);
            let end = cursorLine.length;
            let modifiedLine = cursorLine.content;

            // Event for shift + tab 
            if (e.shiftKey) {

                // If cursor is already at the leftmost position,
                // no action is needed. 
                if (cursorLocation === 0) {
                    return;
                }

                // Moves line left one step at a time until it reaches the leftmost
                // position or maximum of 2 steps.
                var cursorMoved = 0;
                while (cursorMoved < 2 && modifiedLine[0] === " ") {
                    modifiedLine = modifiedLine.substring(1, cursorLine.length);
                    cursorMoved++;
                }

                // Sets new modified line value back to lines-array.
                // and compiles all the lines back to one string.
                lines[cursorLine.lineNum - 1].content = modifiedLine;
                let result = "";
                lines.forEach(line => {
                    result += line.content;
                });

                // Sets new value to textarea.
                // Replaces cursor accordingly.
                $(this).val(result);
                this.selectionStart = this.selectionEnd = cursorLocation - cursorMoved;

                // Event handled.
                return;
            }
            else {
                // Inserts two spaces at the cursor location
                modifiedLine = modifiedLine.substring(0, (cursorLocation - cursorLine.charsBefore)) +
                    "  " + modifiedLine.substring((cursorLocation - cursorLine.charsBefore), end);

                // Sets new modified line value back to lines-array.
                // and compiles all the lines back to one string.
                lines[cursorLine.lineNum - 1].content = modifiedLine;
                let result = "";
                lines.forEach(line => {
                    result += line.content;
                });

                // Sets new value to textarea.
                // Replaces cursor accordingly.
                $(this).val(result);
                this.selectionStart = this.selectionEnd = cursorLocation + 2;

                // Event handled.
                return;
            }
        }

        /**
         * Event for CTRL + Z Undo.
         * Moves state from undo stack to redo-stack.
         * If undo-stack is not empty, displays the state
         * on top without popping it.
         */
        else if (event.keyCode === 90) {
            e.preventDefault();

            if (e.ctrlKey) {
                if (!undo.isEmpty()) {

                    let latest = undo.pop();

                    if (redo.isEmpty())
                        redo.push(latest);
                    else if (redo.peek() !== latest)
                        redo.push(latest);
                    if (!undo.isEmpty()) 
                        $(this).val(undo.peek());
                }
            }
            // Event handled.
            return;
        }

        /**
         * Event for CTRL + Y Redo.
         * Moves state from redo-stack to undo-stack.
         * Displays state popped from redo-stack.
         */
        else if (event.keyCode == 89) {
            e.preventDefault();

            if (e.ctrlKey) {
                if (!redo.isEmpty()) {

                    let latest = redo.pop();
                    if (undo.isEmpty())
                        undo.push(latest);
                    else if (undo.peek() !== latest)
                        undo.push(latest);
                    $(this).val(latest);
                }
            }
            // Event handled.
            return;
        }
    });


    /**
     *  Finds the line where cursor was during
     *  the event. Returns the line-object.
     */
    function findCursorLine(lines, cursorIndex) {

        let lineIndex = 0;
        let charsBefore = 0;

        // Subtracts interated line's length from cursor's
        // index until it reaches zero or less. This indicates that
        // cursor is located on that line.
        do {
            cursorIndex -= (lines[lineIndex].length);
            lineIndex++;
        } while (cursorIndex >= 0)

        let result = lines[lineIndex - 1];

        // Find the amount of previous characters.
        for (let i = 0; i < result.lineNum - 1; i++) {
            charsBefore += lines[i].length;
        }
        result.charsBefore = charsBefore;
        return result;
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

/**
 * Class for line-object instaces.
 */
class Line {

    constructor(content, lineNum) {
        this.charsBefore = null;
        this.content = content;
        this.length = content.length;
        this.lineNum = lineNum;
    }
}