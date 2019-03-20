'use strict';

/**
 * @author Niklas Seppälä
 * @date 20.3.2019
 * @license MIT
 * 
 *  This script creates colorpicker.
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

    // set JSON data for language. Displays data to #json-text textfield element.
    jsonData = JSON.parse($("#json-text")[0].value)
    $("#json-text")[0].value = JSON.stringify(jsonData, null, 2)
    $("#json-text")[0].hidden = false;


    // Set up for saved-color click-eventhandler.
    var selected = $("#foregroundBtn");
    var earlier;


    /**
     * Eventhandler for each element of .save-color class.
     * Sets color based on event target's id.
     * Sets selected color to json, color-label and color div.
     * Displays Json with updated values.
     */
    $(document).on("click", ".saved-color", function (e) {

        switch (selected.id) {
            case "foregroundBtn":
                jsonData.foreground.color = e.target.innerText;
                addColor(e);
                $(".foreground").css("color", e.target.innerText)
                break;
            case "backgroundBtn":
                jsonData.background.color = e.target.innerText;
                addColor(e);
                break;
            case "keywordsBtn":
                jsonData.keywords.color = e.target.innerText;
                addColor(e);
                $(".keyword").css("color", e.target.innerText)
                break;
            case "classBtn":
                jsonData.class.color = e.target.innerText;
                addColor(e);
                break;
            case "linenumBtn":
                jsonData.linenumbers.color = e.target.innerText;
                addColor(e);
                break;
            case "operatorsBtn":
                jsonData.operators.color = e.target.innerText;
                addColor(e);
                $(".operator").css("color", e.target.innerText);
                break;
            case "methodsBtn":
                jsonData.methods.color = e.target.innerText;
                addColor(e);
                break;
            case "linenumBtn":
                jsonData.linenumbers.color = e.target.innerText;
                addColor(e);
            case "numbersBtn":
                jsonData.numbers.color = e.target.innerText;
                addColor(e);
                $(".number").css("color", e.target.innerText);
                break;
            default:
                break;
        }
        $("#json-text")[0].value = JSON.stringify(jsonData, null, 2)
    });


    /**
     * Helper function for .saved-color eventhandler.
     * Sets Hexadecimal color value to selected element's label
     * and background to element's color display div.
     * @param {*} e 
     */
    function addColor(e) {
        selected.nextSibling.value = e.target.innerText;
        selected.parentElement.getElementsByClassName("color-value")[0].innerText = e.target.innerText;
        var color = selected.parentElement.getElementsByTagName("div")[0];
        $(color).css("background-color", e.target.innerText);
        console.log(e);
    }


    /**
     * @eventhandler
     * This is an eventhandler for #languageInpt focusout-event.
     * Sets language from user input to json-file.
     * Refreshes json text.
     */
    $("#languageInpt").focusout(function (e) {
        jsonData.meta.language = e.target.value;
        $("#json-text")[0].value = JSON.stringify(jsonData, null, 2);
    });


    // Sets Eventhandlers to syntax-buttons
    $("#foregroundBtn").click(function (e) {
        onSyntaxBtnClicked(e, $(this));
    });
    $("#backgroundBtn").click(function (e) {
        onSyntaxBtnClicked(e, $(this));
    });
    $("#keywordsBtn").click(function (e) {
        onSyntaxBtnClicked(e, $(this));
    });
    $("#classBtn").click(function (e) {
        onSyntaxBtnClicked(e, $(this));
    });
    $("#linenumBtn").click(function (e) {
        onSyntaxBtnClicked(e, $(this));
    });
    $("#operatorsBtn").click(function (e) {
        onSyntaxBtnClicked(e, $(this));
    });
    $("#methodsBtn").click(function (e) {
        onSyntaxBtnClicked(e, $(this));
    });
    $("#numbersBtn").click(function (e) {
        onSyntaxBtnClicked(e, $(this));
      })


    /**
     * Helper function for syntaxButtons-click eventhandlers.
     * Sets global variable selected to event's target.
     * Highligths selected element with css box-shadow.
     * Refreshes earlier element and removes box-shadow.
     * @param {event} e 
     * @param {target} elem 
     */
    function onSyntaxBtnClicked(e, elem) {
        selected = e.target;
        elem.css("box-shadow", "5px 5px 5px #141414");

        try {
            earlier.css("box-shadow", "none");
            earlier = elem;
        } catch (error) {
            earlier = elem;
        }
        console.log(selected);
    }


    /**
     * 
     * This is and eventhandler for #add-code-btn click-event.
     * It takes user's code input, splits it into lines and further
     * into words. (3d array)
     * 
     * Then it compares the words to keywords, operators, etc in specified language's
     * syntax.json-file. If a match is found, it wraps the word in html span-tags.
     * class of the span-tag is defined by where the match was found in json. 
     * 
     * @example:
     *    import
     *      --> <span class="keyword">import</span>
     *    replace
     *      --> <span class="foreground">replace</span>
     *    from
     *      --> <span class="keyword">from<span>
     *    string
     *      --> <span class="foreground">string<span>
     *
     * Finally compiles all tags to html-variable.
     * Empty lines are replaced with <br/>-tag.
     * Html-variable is then inserted to #code-div's innerHTML. 
     */
    $("#add-code-btn").click(function (e) {

        // User code input splitted to lines and then into words.
        var input = $("#codeInput").val().split('\n')
        var lines = [];
        input.forEach(line => {
            if (line.includes(' '))
                line = line.split(' ');
            lines.push(line)
        });

        console.log(lines);

        // syntax words specified in language's syntax.json-file
        var keywords = jsonData.keywords.contains;
        var operators = jsonData.operators.contains;

        var html = "";
        for (let i = 0; i < lines.length; i++) {

            if (lines[i][0] != "\n" && lines[i].length > 1) {
                for (let j = 0; j < lines[i].length; j++) {
                    var word = lines[i][j];
                    if (keywords.includes(word))
                        html += '<span class="keyword">' + word + " " + '</span>';
                    else if (operators.includes(word)) 
                        html += '<span class="operator">' + word + " " + '</span>';
                    else if (word === '') 
                        html += '<span class="whitespace">' + '&nbsp' + '</span>';
                    else if (!isNaN(word))
                        html += '<span class="number">' + word + ' ' + '</span>';
                    else 
                        html += '<span class="foreground">' + word + " " + '</span>';
                }
            }
            html += "<br/>"
        }
        // Inserts results to #code's innerHTML.
        $("#code").html(html);
    });
});