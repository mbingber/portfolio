app.factory('Vector', function() {

    function Vector(x,y) {
        x = x || 0, y = y || 0;
        this.arr = [x,y];
        Object.defineProperty(this, 'x', {
            get: () => this.arr[0],
            set: newX => this.arr[0] = newX
        });
        Object.defineProperty(this, 'y', {
            get: () => this.arr[1],
            set: newY => this.arr[1] = newY
        });
    }

    Vector.prototype.add = function(vector) {
        return new Vector(...this.arr.map((coord,i) => coord + vector.arr[i]));
    }

    Vector.prototype.diff = function(vector) {
        return new Vector(...this.arr.map((coord, i) => coord - vector.arr[i]));
    }

    Vector.prototype.scale = function(c) {
        return new Vector(...this.arr.map(coord => coord*c));
    }

    Vector.prototype.magnitude = function() {
        return Math.sqrt(this.arr.reduce((total, el) => total + el*el, 0));
    }

    return Vector;
});

app.factory('Vertex', function(Vector) {

    function Vertex(x,y) {
        this.position = new Vector(x||Math.random(),y||Math.random());
        this.selected = false;
        this.force = new Vector();
        this.forceColor = 0;
        Object.defineProperty(this, 'x', {
            get: () => this.position.x,
            set: newX => this.position.x = newX
        });
        Object.defineProperty(this, 'y', {
            get: () => this.position.y,
            set: newY => this.position.y = newY
        });
    }

    Vertex.prototype.distanceTo = function(v) {
        return this.position.diff(v.position).magnitude();
    }

    Vertex.prototype.select = function() {
        this.selected = !this.selected;
    }

    return Vertex;

});

app.factory('Edge', function(Vertex) {

    function Edge(vertex1, vertex2) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
    }

    Edge.prototype.getLength = function() {
        return this.vertex1.distanceTo(this.vertex2);
    }

    return Edge;
});

app.factory('Graph', function(Vector, Vertex, Edge) {

    function Graph(vertices, edges) {
        this.vertices = vertices;
        this.edges = edges;
    }

    Graph.prototype.addVertex = function(x,y) {
        this.vertices.push(new Vertex(x,y));
    }

    Graph.prototype.removeVertices = function() {
        this.vertices = this.vertices.filter(vertex => {
            return !vertex.selected;
        });
        this.edges = this.edges.filter(edge => {
            return !edge.vertex1.selected && !edge.vertex2.selected;
        });
    }

    Graph.prototype.connectSelected = function() {
        var selected = this.vertices.filter(vertex => vertex.selected);
        for(var i = 0; i < selected.length; i++) {
            for(var j = i + 1; j < selected.length; j++) {
                if(!this.edges.some(edge => {
                    return edge.vertex1 === selected[i] && edge.vertex2 === selected[j];
                })) this.edges.push(new Edge(selected[i], selected[j]));
            }
            selected[i].selected = false;
        }
    }

    Graph.prototype.areDirectlyConnected = function(vertex1, vertex2) {
        return this.edges.some(function(edge) {
            return (edge.vertex1 === vertex1 && edge.vertex2 === vertex2) ||
                   (edge.vertex1 === vertex2 && edge.vertex2 === vertex1)
        });
    }

    // Graph.prototype.verticesConnectedTo = function(vertex) {
    //     return this.edges.filter(edge => {
    //         return edge.vertex1 === vertex || edge.vertex2 === vertex;
    //     }).map(edge => {
    //         return edge.vertex1 === vertex ? edge.vertex2 : edge.vertex1;
    //     });
    // }

    // Graph.prototype.filterByConnectednessTo = function(vertex) {

    // }

    // imagine that every node repels every other node, like two electric charges of same sign
    // in addition, if nodes are connected, there is an attractive force between them as if they were connected by a spring
    Graph.prototype.computeForce = function(forcedVertex, sourceVertex, h, c) {
        var rVector = forcedVertex.position.diff(sourceVertex.position);
        var distance = rVector.magnitude();
        var coulombRepulsive = rVector.scale(c/Math.pow(distance,2));
        var hookesAttractive = new Vector();
        if(this.areDirectlyConnected(forcedVertex, sourceVertex)) {
            hookesAttractive = rVector.scale(-h*20);
        }
        return coulombRepulsive.add(hookesAttractive);
    }

    // in each step, we compute the force on each node from every other node, add up those forces,
    // and move each node by its net force vector
    Graph.prototype.step = function(hooke, coulomb) {
        var netForces = [];
        for(var i = 0; i < this.vertices.length; i++) {
            for(var j = i + 1; j < this.vertices.length; j++) {
                var forceComponent = this.computeForce(this.vertices[i], this.vertices[j], hooke, coulomb);
                this.vertices[i].force = this.vertices[i].force.add(forceComponent);
                this.vertices[j].force = this.vertices[j].force.diff(forceComponent);
            }
        }
        for(var i = 0; i < this.vertices.length; i++) {
            var vertex = this.vertices[i];
            vertex.position = vertex.position.add(vertex.force);
            netForces.push(vertex.force);
            vertex.forceColor = vertex.force.magnitude();
            vertex.force = new Vector();
        }
        return netForces;
    }

    // // putting it all together, we simply call step over and over until we reach an equilibrium,
    // // where every force is below a certain tolerance, meaning our vertices are happy and stable.
    // Graph.prototype.useTheForce = function(hooke, coulomb, tolerance) {
    //     var velocities;
    //     var count = 0;
    //     do {
    //         velocities = this.step(hooke, coulomb);
    //         count++;
    //     } while(velocities.some(v => v.magnitude() > tolerance) && count < 1000);
    //     console.log(count);
    //     return this.vertices;
    // }

    return Graph;

});
