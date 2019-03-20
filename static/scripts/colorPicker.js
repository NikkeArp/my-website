'use strict';

/**
 * @author Niklas Seppälä
 * @date 20.3.2019
 * @license MIT
 * 
 *  This is a script that creates colorpicker using predefined
 *  HTML5 elements. Script only adds functionality to those elements.
 *  Colorpicker operates with mouse hover on colorwheel.
 *  Pixel's (that mouse points at that time) color-data is 
 *  displayd in following formats:
 * 
 *     color's red-value
 *     color's blue-value
 *     color's green-value
 *     RGB-value
 *     Hexadecimal-value.
 *     
 *  Colors can be saved to 6 fields that hold color's hexadecimal
 *  value and sample of that color.
 * 
 * HTML5 Elements required: 
 *      canvas  #picker
 *      div     #color-result
 *      labels  #RedValue, #Bluevalue, #GreenValue
 *              #RGBValue, HEXValue
 *      6 divs  #saved-color 
 *      with following children:
 *              label   #color-value
 *              div
 */


// Flag for colorpickers canvas mousemove event.
//   False -> nothing happens.
//   True  -> handle mousemove event.
var canPreview = true;

// Index for previously saved-color element
// Maximum saved-color elemnt count is 6.
// 7th element replaces 1st and loop continues.
var savedIndex = 0

// Colorwheer canvas
var canvas;
var context;

// Colorwheel element.
var picker = $("#picker");

// DOCUMENT READY
$(function () {

    canvas = document.getElementById("picker"); 
    context = canvas.getContext("2d");

    drawImage("static/colorpicker/colorwheel1.png", 200, 200);
    
    $("#picker").mousemove(function (e) {
        if (canPreview) {

            // Coordinates
            let offset = $(canvas).offset();
            let x = Math.floor(e.pageX - offset.left);
            let y = Math.floor(e.pageY - offset.top);
    
            // Define current pixel
            let imgData = context.getImageData(x, y, 1, 1);
            let pixel = imgData.data;
    
            // Change color-result's background to match selected color.
            let bgColor = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
            $('.color-result').css('backgroundColor', bgColor);
    
            // Set RGB values to html-labels
            $('#RedValue').val(pixel[0]);
            $('#GreenValue').val(pixel[1]);
            $('#BlueValue').val(pixel[2]);
            $('#RGBValue').val(pixel[0] + ',' + pixel[1] + ',' + pixel[2]);
    
            // Calculate and set hexadecimal color value to html-label
            var hexColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
            $('#HEXValue').val('#' + ('0000' + hexColor.toString(16)).substr(-6));
        }
      });


    /**
     * Colorpicker's canvas mouseclick eventhandler.
     * Togles canPreview flag.
     */
    $("#picker").click(function () {
        canPreview = !canPreview;
    });


    /**
     * Colorpicker's canvas mouseEnter eventhandler.
     * Togles canPreview flag.
     */
    $("#picker").mouseenter(function () {
        canPreview = !canPreview;
    });

    
    /**
     * Eventhandler for #saveColorBtn click-event.
     * Elements are accessed by savedIndex variable.
     * Sets color to element on index. Sets highlighting to current field.
     * Removes highlighting from previos field.
     */
    $("#saveColorBtn").click(function () {

        var hexColor = $("#HEXValue").val();

        // Set selected color to field
        $(".saved-color")[savedIndex].children[0].innerText = hexColor;
        $(".saved-color")[savedIndex].children[1].style.backgroundColor = hexColor;
        $(".saved-color")[savedIndex].style.borderColor = "#636363";
        
        //Remove previous highlighting.
        if (savedIndex > 0) {
            $(".saved-color")[savedIndex - 1].style.borderColor = "#2F2F2F";
        }
        else {
            $(".saved-color")[4].style.borderColor = "#2F2F2F";
        } 
        
        // Maximum saved-color element count is 6.
        // Update index. When index hits 5 -> Reset it to 0.    
        savedIndex++;
        if (savedIndex === 5) {
            savedIndex = 0;
        }
    });
});


/**
 * 
 * @param {*} imgSrc 
 * @param {*} width 
 * @param {*} heigth 
 */
function drawImage(imgSrc, width, heigth) {

    // Set image size and source.
    let image = new Image(width, heigth);
    image.src = imgSrc;
    image.onload = function () {
        context.drawImage(image, 0, 0, image.width, image.height);
    }
}