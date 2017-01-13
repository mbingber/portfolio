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

	var square = new Group();
	for(var i = 0; i < numPolys; i += 2) {
		var poly = new Path();
		poly.add(s.topLeft);
		poly.add(armPoint(s, numPolys, i));
		poly.add(s.bottomRight);
		poly.add(armPoint(s, numPolys, i+1));
		poly.closed = true;
		poly.fillColor = 'black';
		square.addChild(poly);
	}
	square.rotate(angle);
	return square;
}

function getIntersection(group1, group2) {
	var intersection = new Group();
	group1.children.forEach(function(path1) {
		group2.children.forEach(function(path2) {
			if (!path1.intersect || !path2.intersect) return;
			var subInt = path1.intersect(path2);
			if (subInt.area) intersection.addChild(subInt);
		});
	});
	return intersection;
}

var square1 = drawSquare(300, view.center, 17, 30);
var square2 = drawSquare(300, view.center + new Point(150, 0), 15, 100);

var intersection = getIntersection(square1, square2);
intersection.fillColor = 'white';

function onFrame() {
	// square2.rotate(0.25);
}
