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

function drawSquare(sideLength, pos0, vel0, spin0, numSections, angle) {
	var s = new Rectangle();
	s.size = [sideLength, sideLength];
	s.center = pos0;

	var square = new Path();
	for(var i = 0; i < numSections; i += 2) {
		square.add(s.topLeft);
		square.add(armPoint(s, numSections, i));
		square.add(s.bottomRight);
		square.add(armPoint(s, numSections, i+1));
		square.closed = true;
	}
	square.fillColor = 'black';
	square.rotate(angle);
	square.velocity = vel0;
	square.spin = spin0;
	return square;
}

function evolve(square) {
	square.position = square.position + square.velocity;
	square.rotate(square.spin);
	var x = square.position.x;
	var y = square.position.y;
	if (x < 0 || x > width) {
		square.velocity.x *= -1;
		square.spin = randomSpin();
	}
	if (y < 0 || y > height) {
		square.velocity.y *= -1;
		square.spin = randomSpin();
	}
}

function randomPoint() {
	return Point.random() * view.size;
}

function randomVelocity() {
	return Point.random() * 5;
}

function randomSpin() {
	return Math.random() * 0.6;
}

var square1 = drawSquare(400, randomPoint(), randomVelocity(), randomSpin(), 5, 30);
var square2 = drawSquare(300, randomPoint(), randomVelocity(), randomSpin(), 9, 100);

var squares = [square1, square2];

var intersection = new Path();

function onFrame(e) {
	if (e.count % 2) return;
	squares.forEach(evolve);
	intersection.remove();
	intersection = square1.intersect(square2);
	intersection.fillColor = 'white';
}
