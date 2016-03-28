function coolify(center, vector1, vector2, numLines,hue) {
    points1 = [];
    points2 = [];
    for(var i = 0; i <= numLines; i++) {
        points1.push(center + vector1*i/numLines);
        points2.push(center + vector2*i/numLines);
    }
    for(var j = 0; j < numLines + 1; j++) {
        var path = new Path();
        var color = new Color({
            hue: hue,
            saturation: 1 - .5*j/(numLines+1),
            brightness: 1
        })
        path.strokeColor = color;
        path.add(points1[j], points2[numLines-j])
    }
}

var center = view.center;
var length = view.size.height/2;

function drawShape(sides, numLines) {
    var points = [];
    for(var i = 0; i < sides; i++) {
        var vector = new Point();
        vector.length = length;
        vector.angle = i*360/sides;
        points.push(center + vector);
    }
    var hueStart = 360*Math.random();
    for(var i = 0; i < points.length; i++) {
        var vector1 = center - points[i];
        var vector2 = points[i+1] - points[i] || points[0] - points[i];
        var vector3 = points[i-1] - points[i] || points.slice(-1)[0] - points[i];

        coolify(points[i], vector1, vector3, numLines, hueStart + 360*i/(sides));
        coolify(points[i], vector1, vector2, numLines, hueStart + 360*(i+.5)/(sides));
    }
}

drawShape(8,20);
var removeCount;
function onFrame(event) {
    project.activeLayer.rotate(.4, view.center);
    // var sides = 6 + Math.floor(6*Math.random());
    // var lines = 8 + Math.floor(15*Math.random());
    // if(!(event.count % 120)) {
    // //if(!(event.count % 120)) {
    //  project.activeLayer.removeChildren();
    //  // project.view.draw();
    //  // drawShape(sides, lines)
    //  drawShape(sides, lines);
    // }
}
