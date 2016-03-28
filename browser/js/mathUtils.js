var sin = Math.sin;
var cos = Math.cos;
var tan = Math.tan;
var sinh = Math.sinh;
var cosh = Math.cosh;
var pi = Math.PI;

function VectorCyl(rho, phi, z) {
    var x = rho*cos(phi);
    var y = rho*sin(phi);
    return new THREE.Vector3(x,y,z);
}

function VectorSph(r, theta, phi) {
    var x = r*cos(phi)*sin(theta);
    var y = r*sin(phi)*sin(theta);
    var z = r*cos(theta);
    return new THREE.Vector3(x,y,z);
}

function VectorCart(x,y,z) {
    return new THREE.Vector3(x,y,z);
}

function VectorTor(sigma, tau, phi) {
    var denom = cosh(tau) - cos(sigma)
    var x = sinh(tau)*cos(phi)/denom;
    var y = sinh(tau)*sin(phi)/denom;
    var z = sin(sigma)/denom;
    return new THREE.Vector3(x, y, z);
}
