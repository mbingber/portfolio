app.factory('Presets', function(Graph, Vertex, Edge) {

    var presets = {};
    presets.loop = function(num) {
        var verts = [];
        for(var i = 0; i < num; i++) {
            verts.push(new Vertex());
        }
        var edges = verts.map(function(v, i) {
            return new Edge(v, verts[(i+1)%num]);
        });
        return new Graph(verts, edges);
    }

    presets.polygon = function(num) {
        var verts = [], edges = [];
        for(var i = 0; i < num; i++) {
            verts.push(new Vertex());
        }
        for(var i = 0; i < verts.length; i++) {
            for(var j = i + 1; j < verts.length; j++) {
                edges.push(new Edge(verts[i], verts[j]));
            }
        }
        return new Graph(verts, edges);
    }

    presets.connectedBoxes = function() {
        var verts = [], edges = [];
        for(var i = 0; i < 10; i++) {
            verts.push(new Vertex());
        }
        var connect = connectGeneral.bind(null, edges, verts);
        connect(0,1);
        connect(0,2);
        connect(1,3);
        connect(2,4);
        connect(3,4);
        connect(3,5);
        connect(4,6);
        connect(5,6);
        connect(5,7);
        connect(6,8);
        connect(7,9);
        connect(8,9);
        return new Graph(verts, edges);
    }

    function connectGeneral(edges, verts, idx1, idx2) {
        edges.push(new Edge(verts[idx1], verts[idx2]));
    }

    return presets;




});
