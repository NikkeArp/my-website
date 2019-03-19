'use strict';

/**
 * @author Niklas Seppälä
 * @date 19.3.2019
 * @license MIT
 * 
 *  This JavaScript file contains objects used in my website.
 *  Contains following classes:
 *      Line :    Line-object to hold information about itself.
 */

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