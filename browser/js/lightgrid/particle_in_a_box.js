var pi = Math.PI;

function oneDimPhi(n, L, x ,t) {
    return Math.sin(n*pi/L*(x - L/2));
}

function phiGenerator(nx, ny, nz, L) {
    return function(pos, t) {
        var mag = oneDimPhi(nx, L, pos.x, t)*oneDimPhi(ny, L, pos.y, t)*oneDimPhi(nz, L, pos.z, t);
        var phase = -t*pi*pi/(8*L*L)*(nx*nx + ny*ny + nz*nz);
        return CompExp(mag, phase);
    }
}

function wavefunction(L, numStates, maxNodes) {
    var weights = [], states = [];
    var sumOfSquares = 0;
    for(var i = 0; i < numStates; i++) {
        var w = Math.random()-1;
        weights.push(w);
        sumOfSquares += w*w;
        states.push(phiGenerator(rand(maxNodes), rand(maxNodes), rand(maxNodes), L));
    }
    weights = weights.map(function(w) {
        return w / Math.sqrt(sumOfSquares);
    });
    return function(pos, t) {
        return states.reduce(function(sum, phi, idx) {
            return sum.add(phi(pos,t).scale(weights[idx]));
        }, CompXY(0,0)).r
    }
}

function rand(n) {
    return Math.floor(Math.random()*n) + 1;
}

