$(document).ready(function() {
    var main = document.getElementById("myCanvas");
    var c = main.getContext("2d");

    c.canvas.width  = window.innerWidth;
    c.canvas.height = window.innerHeight;

    // read the width and height of the canvas
    var width = c.canvas.width;
    var height = c.canvas.height;

    // initialize overlay
    var overlay = document.getElementById('overlay');
    var o = overlay.getContext('2d');
    o.canvas.width  = window.innerWidth;
    o.canvas.height = window.innerHeight;
    o.globalAlpha = 0.5;
    o.fillStyle = '#eee';
    // o.fillRect(20,20,100,100)


    var left = -2;
    var right = 1;
    var top = 1;
    var bottom = -1;
    var pixel1 = [0,0];
    var point1;
    var makeOverlay = false;

    // create a new pixel array
    var imageData = c.createImageData(width, height);
    mandelbrot(imageData, width, height, left, right, top, bottom);
    c.putImageData(imageData, 0, 0);

    overlay.addEventListener('mousedown', function(event) {
        pixel1 = [event.pageX, event.pageY];
        point1 = getXY(event.pageX, event.pageY, width, height, left, right, top, bottom);
        makeOverlay = true;
    });

    overlay.addEventListener('mousemove', function(event) {
        if (makeOverlay) setOverlay(o, pixel1, [event.pageX, event.pageY])
    })

    overlay.addEventListener('mouseup', function(event) {
        var point2 = getXY(event.pageX, event.pageY, width, height, left, right, top, bottom);
        left = Math.min(point1[0], point2[0]);
        right = Math.max(point1[0], point2[0]);
        top = Math.max(point1[1], point2[1]);
        bottom = top - 2/3*(right-left);
        // bottom = top - height/width*(right-left);
        c.clearRect(0,0,width,height)
        o.clearRect(0,0,width,height)
        mandelbrot(imageData, width, height, left, right, top, bottom)
        c.putImageData(imageData,0,0);
        makeOverlay = false;
    });
});

function mandelbrot(imageData, width, height, left, right, top, bottom) {
    for(var pixelX = 0; pixelX < width; pixelX++) {
        for(var pixelY = 0; pixelY < height; pixelY++) {
            var coords = getXY(pixelX, pixelY, width, height, left, right, top, bottom);
            var x0 = coords[0];
            var y0 = coords[1];
            var x = 0;
            var y = 0;
            var iteration = 0;
            var maxIteration = 500;
            if(testToSkip(x0,y0)) {
                iteration = maxIteration;
            }
            else {
                while(x*x + y*y < 4 && iteration < maxIteration) {
                    // re = e^x cos y
                    //var xTemp = Math.exp(x)*Math.cos(y) + x0;
                    // im = e^x sin y
                    //var y = Math.exp(x)*Math.cos(x) + y0;

                    var xTemp = x*x - y*y + x0;
                    y = 2*x*y + y0;
                    x = xTemp
                    iteration++
                }
            }
            if(iteration < maxIteration) {
                var log_zn = Math.log(x*x + y*y)/2;
                var nu = Math.log(log_zn / Math.log(2))/Math.log(2);
                iteration = iteration + 1 - nu;
            }
            var i = iteration/maxIteration;
            var hue = 360*(2*i - Math.pow(i,2));
            hue %= 360;
            var saturation = 1;
            var brightness = 1 - iteration/maxIteration;
            var color = HSBtoRGB(hue,saturation,brightness);
            setPixel(imageData,pixelX,pixelY,color,255);
        }
    }
}

function setPixel(imageData, x, y, color, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = color[0];
    imageData.data[index+1] = color[1];
    imageData.data[index+2] = color[2];
    imageData.data[index+3] = a;
}

function testToSkip(x,y) {
    var p = Math.sqrt(Math.pow(x-0.25,2) + y*y);
    var inBulb = Math.pow(x+1,2) + y*y < 1/16;
    var inCardioid = x < p - 2*p*p + 1/4;
    return inBulb || inCardioid;
}

function HSBtoRGB(hue, sat, bright) {
    var c = bright*sat;
    var x = c * (1 - Math.abs(hue/60 % 2 - 1));
    var m = bright - c;

    var r = hue >= 120 && hue < 240 ? 0 : hue < 60 || hue >= 300 ? c : x;
    var g = hue >= 240 ? 0 : hue >= 60 && hue < 180 ? c : x;
    var b = hue < 120 ? 0 : hue >= 180 && hue < 300 ? c : x;

    var red = 255*(r + m);
    var green = 255*(g + m);
    var blue = 255*(b + m);
    return [red,green,blue];
}

function RGBtoHSB(red, blue, green) {
    var r = red/255;
    var g = green/255;
    var b = blue/255;
    var Cmax = Math.max(r,g,b);
    var Cmin = Math.min(r,g,b);
    var delta = Cmax - Cmin;
    var hue;
    if(delta === 0) hue = 0;
    else if (Cmax === r) hue = 60 * ((g-b)/delta)%6;
    else if (Cmax === g) hue = 60 * ((b-r)/delta + 2);
    else hue = 60 * ((r-g)/delta + 4);
    // var hue = delta === 0 ? 0 : Cmax === r ? 60 * ((g-b)/delta)%6 : Cmax === g ? 60 * (b-r)/delta + 2 : Cmax === b ? 60 * (r-g)/delta + 4;
    var saturation = Cmax === 0 ? 0 : delta/Cmax;
    var brightness = Cmax;
    return [hue, saturation, brightness];
}

function getXY(pixelX, pixelY, width, height, left, right, top, bottom) {
    var x = (right-left)/width*pixelX + left;
    var y = (bottom-top)/height*pixelY + top;
    return [x,y];
}

function setOverlay(overlayContext, pixel1, pixel2) {
    overlayContext.clearRect(0,0,window.innerWidth,window.innerHeight);
    //overlayContext.fillRect(pixel1[0], pixel1[1], pixel2[0]-pixel1[0], pixel2[1]-pixel1[1]);
    var left = Math.min(pixel1[0], pixel2[0]);
    var right = Math.max(pixel1[0], pixel2[0]);
    var top = Math.max(pixel1[1], pixel2[1]);
    var bottom = top - 2/3*(right-left);
    // bottom = top - height/width*(right-left);
    overlayContext.fillRect(left, top, right-left, bottom-top)
}
