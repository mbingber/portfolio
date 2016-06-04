function Complex(type, value) {
    if(type === 'cart') {
        this.x = value.x;
        this.y = value.y;
        this.r = Math.sqrt(value.x*value.x + value.y*value.y);
        this.th = Math.atan(value.y / value.x);
    } else if (type === 'polar') {
        this.r = value.r;
        this.th = value.th;
        this.x = value.r*Math.cos(value.th);
        this.y = value.r*Math.sin(value.th);
    }
}

function CompXY(x,y) {
    return new Complex('cart', {x: x, y: y});
}

function CompExp(r, th) {
    return new Complex('polar', {r: r, th: th});
}

Complex.prototype.add = function(c) {
    return CompXY(this.x + c.x, this.y + c.y);
}

Complex.prototype.conjug = function() {
    return CompXY(this.x, - this.y);
}

Complex.prototype.scale = function(factor) {
    return CompXY(factor*this.x, factor*this.y);
}

Complex.prototype.subtract = function(c) {
    return this.add(c.scale(-1));
}

Complex.prototype.multiply = function(c) {
    return CompExp(this.r*c.r, this.th + c.th);
}
