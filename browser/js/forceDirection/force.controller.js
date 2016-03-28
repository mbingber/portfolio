app.controller('ForceCtrl', function($scope, $window, $timeout, Vector, Vertex, Edge, Graph, $interval) {

    function setDimensions() {
        var graphDiv = document.getElementsByClassName('graph')[0];
        $scope.graphWidth = graphDiv.offsetWidth;
        $scope.graphHeight = graphDiv.offsetHeight;
        $timeout();
    }
    angular.element(document).ready(setDimensions);
    angular.element($window).bind('resize', setDimensions);

    $scope.g = new Graph([], []);

    $scope.selectAll = function() {
        $scope.g.vertices.forEach(vertex => vertex.selected = true);
    }

    $scope.deselectAll = function() {
        $scope.g.vertices.forEach(vertex => vertex.selected = false);
    }

    $scope.numSelected = function() {
        return $scope.g.vertices.filter(v => v.selected).length;
    }

    var l = 0, r = 1, t = 0, b = 1;
    $scope.getVertexPos = function(vertex, noPx) {
        var left = (vertex.x - l)/(r-l)*$scope.graphWidth;
        var top = (vertex.y - t)/(b-t)*$scope.graphHeight;
        return noPx ? new Vector(left, top) : { left: left + 'px', top: top + 'px' };
    }

    $scope.addVertex = function() {
        $scope.g.addVertex(l + (r-l)*Math.random(), t + (b-t)*Math.random());
    }

    $scope.normalize = function(a) {
        a = a || 0;
        if($scope.g.vertices.length <= 1) return;
        var maxX = -Infinity, maxY = -Infinity, minX = Infinity, minY = Infinity;
        $scope.g.vertices.forEach(function(vertex) {
            if(vertex.x > maxX) maxX = vertex.x;
            if(vertex.y > maxY) maxY = vertex.y;
            if(vertex.x < minX) minX = vertex.x;
            if(vertex.y < minY) minY = vertex.y;
        });
        l = minX - a*(maxX - minX);
        r = maxX + a*(maxX - minX);
        t = minY - a*(maxY - minY);
        b = maxY + a*(maxY - minY);
    }

    $scope.getEdgePos = function(edge) {
        var v1 = $scope.getVertexPos(edge.vertex1, true);
        var v2 = $scope.getVertexPos(edge.vertex2, true);
        var otherLeft = edge.vertex2.x*$scope.graphWidth;
        var otherTop = edge.vertex2.y*$scope.graphHeight;
        var angle = Math.atan2(v1.y-v2.y, v1.x-v2.x) + Math.PI;
        return {
            'width': v1.diff(v2).magnitude() + 'px',
            left: (v1.x + 25) + 'px',
            top: (v1.y + 25) + 'px',
            transform: `rotate(${angle}rad)`,
            'transform-origin': '0% 0%'
        }
    }
    var int;
    $scope.useTheForce = function(h, c) {
        $scope.playing = true;
        int = $interval(function() {
            $scope.g.step(h,c);
            $scope.normalize();
        }, 25);
    }

    $scope.stop = function() {
        $scope.playing = false;
        $interval.cancel(int);
    }

})
