$(function () {
    var canPreview = true;

    var canvas = document.getElementById('picker');
    var ctx = canvas.getContext('2d');

    var image = new Image(200, 200);
    image.onload = function () {
        ctx.drawImage(image, 0, 0, image.width, image.height);
    }

    image.src = 'static/colorpicker/colorwheel1.png';

    $('#picker').mousemove(function (e) {
        if (canPreview) {
            var canvasOffset = $(canvas).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);

            var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
            var pixel = imageData.data;

            var pixelColor = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
            $('.color-result').css('backgroundColor', pixelColor);
            $(".keyword").css("color", pixelColor);

            $('#rVal').val(pixel[0]);
            $('#gVal').val(pixel[1]);
            $('#bVal').val(pixel[2]);
            $('#rgbVal').val(pixel[0] + ',' + pixel[1] + ',' + pixel[2]);

            var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
            $('#hexVal').val('#' + ('0000' + dColor.toString(16)).substr(-6));
        }
    });
    $('#picker').click(function () {
        canPreview = !canPreview;
    });

    var savedIndex = 0
    $("#saveColorBtn").click(function () {
        if (savedIndex < 5) {
            var color = $("#hexVal").val();
            $(".saved-color")[savedIndex].children[0].innerText = color;
            $(".saved-color")[savedIndex].children[1].style.backgroundColor = color;
            $(".saved-color")[savedIndex].style.borderColor = "#636363";
            if (savedIndex > 0) {
                $(".saved-color")[savedIndex - 1].style.borderColor = "#2F2F2F";
            }
            else {
                $(".saved-color")[4].style.borderColor = "#2F2F2F";
            }

            savedIndex++;
            if (savedIndex === 5)
                savedIndex = 0;
        }
    })
});