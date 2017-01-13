/*
	Utility
*/

var PI = Math.PI;
function cos(degree) {
	return Math.cos(degree * PI / 180);
}
function sin(degree) {
	return Math.sin(degree * PI / 180);
}
var sqrt = Math.sqrt.bind(Math);

var height = view.size.height;
var width = view.size.width;

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

function armPoint(square, n, i) {
	var theta = 90 * i / n;
	var alpha = 135 - theta;
	var p = new Point();
	p.length = sqrt(2) / 2 * square.width / sin(alpha);
	p.angle = theta;
	return square.topLeft + p;
}

function drawSquare(sideLength, center, numPolys, angle) {
	var s = new Rectangle();
	s.size = [sideLength, sideLength];
	s.center = center;

	var poly = new Path();
	for(var i = 0; i < numPolys; i += 2) {
		poly.add(s.topLeft);
		poly.add(armPoint(s, numPolys, i));
		poly.add(s.bottomRight);
		poly.add(armPoint(s, numPolys, i+1));
		poly.closed = true;
	}
	poly.fillColor = 'black';
	poly.rotate(angle);
	return poly;
}

var square1 = drawSquare(300, view.center, 7, 30);
var square2 = drawSquare(300, view.center + new Point(150, 0), 11, 100);

var intersectionLayer = new Layer();
var intersection = square1.intersect(square2);
intersection.fillColor = 'white';
intersectionLayer.addChild(intersection);
intersectionLayer.bringToFront();

function onFrame() {
	// square2.rotate(0.25);
	// intersection = square1.intersect(square2);
	// intersection.fillColor = 'white';
}
