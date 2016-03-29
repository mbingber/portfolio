$(document).ready(function() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    $(renderer.domElement).addClass('kleinCanvas');
    $('#main')[0].appendChild( renderer.domElement );

    var geometry = new THREE.ParametricGeometry(function(u,v) {
        u = pi*u, v = 2*pi*v;
        var x = -2/15*cos(u)*(3*cos(v) - 30*sin(u) + 90*sin(u)*Math.pow(cos(u), 4) - 60*sin(u)*Math.pow(cos(u), 6) + 5*cos(u)*sin(u)*cos(v));
        var y = -2-1/15*sin(u)*(3*cos(v) - 3*Math.pow(cos(u),2)*cos(v) - 48*Math.pow(cos(u), 4)*cos(v) + 48*Math.pow(cos(u), 6)*cos(v) - 60*sin(u) + 5*cos(u)*sin(u)*cos(v) - 5*Math.pow(cos(u),3)*sin(u)*cos(v) - 80*Math.pow(cos(u),5)*sin(u)*cos(v) + 80*Math.pow(cos(u),7)*sin(u)*cos(v));
        var z = 2/15*(3 + 5*sin(u)*cos(u))*sin(v);
        return VectorCart(x,y,z);
    }, 100, 100);
    var surfaceMaterial = new THREE.MeshNormalMaterial( { wireframe: true } );
    var surface = new THREE.Mesh( geometry, surfaceMaterial );

    scene.add( surface );

    var x = 1.5, y = 0, z = -3.5;

    var position = VectorCart(x,y,z);
    camera.position.copy(position);

    var controls = new THREE.OrbitControls( camera, renderer.domElement );

    function animate() {

        requestAnimationFrame( animate );
        controls.update();
        render();
    }

    function render() {

        renderer.render( scene, camera );
    }

    animate();
});
