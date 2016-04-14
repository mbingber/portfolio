$(document).ready(function() {

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    $(renderer.domElement).addClass('torusCanvas');
    $('#main')[0].appendChild( renderer.domElement );

    var a = 3, c = 4;

    function rhoT(u,v) {
        return c + a*cos(2*pi*v);
    }
    function phiT(u,v) {
        return 2*pi*(u%1);
    }
    function zT(u,v) {
        return a*sin(2*pi*v);
    }
    function ParametricTorus(u,v) {
        var rho = rhoT(u,v);
        var phi = phiT(u,v);
        var z = zT(u,v);
        return VectorCyl(rho,phi,z);
    }

    function uAccel(u,v,udot,vdot) {
        return 4*pi*udot*vdot*zT(u,v)/rhoT(u,v);
    }

    function vAccel(u,v,udot,vdot) {
        return -2*pi*udot*udot*rhoT(u,v)*zT(u,v)/(a*a);
    }

    function Normal(u,v) {
        return VectorCyl(-cos(2*pi*v), 2*pi*(u%1), -sin(2*pi*v)).normalize();
    }

    function Tangent(u,v,udot,vdot) {
        var x = -rhoT(u,v)*sin(2*pi*u)*udot - a*sin(2*pi*v)*cos(2*pi*u)*vdot;
        var y = rhoT(u,v)*cos(2*pi*u)*udot - a*sin(2*pi*v)*sin(2*pi*u)*vdot;
        var z = vdot*a*cos(2*pi*v);
        return VectorCart(x, y, z);
    }

    var geometry = new THREE.ParametricGeometry(ParametricTorus, 60, 60);

    var surfaceMaterial = new THREE.MeshNormalMaterial( { wireframe: true } );
    var surface = new THREE.Mesh( geometry, surfaceMaterial );

    scene.add( surface );

    function setCameraStuff(u,v,udot,vdot) {
        var point = ParametricTorus(u,v);
        var position = new THREE.Vector3();
        var normal = Normal(u,v);
        var tangent = Tangent(u,v,udot,vdot).normalize();
        position.addVectors(point, normal.multiplyScalar(0.1));
        camera.position.copy(position);
        camera.up.copy(normal);
        var toLook = new THREE.Vector3();
        toLook.addVectors(position, tangent);
        camera.lookAt(toLook);
    }

    var u = Math.random(), v = Math.random(), udot = .001 + Math.random()/1000, vdot = 1.25/400;

    setCameraStuff(u,v,udot,vdot);

    function animate() {
        requestAnimationFrame(animate);
        udot += uAccel(u,v,udot,vdot);
        vdot += vAccel(u,v,udot,vdot);
        u += udot;
        v += vdot;
        setCameraStuff(u,v,udot,vdot);
        render();
    }

    function render() {
        renderer.render(scene, camera);
    }

    animate();
});
