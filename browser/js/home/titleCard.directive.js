app.directive('titleCard', function($state) {
    return {
        restrict: 'E',
        templateUrl: '/js/home/titleCard.html',
        scope: {
            name: '='
        },
        link: function(scope, element, attribute) {

            scope.title = ({
                force: 'Force Direction',
                gravity: 'Gravity',
                dreamcatcher: 'Dreamcatcher',
                mandelbrot: 'Zoomable Mandelbrot',
                klein: 'Klein Bottle',
                torus: 'Torus Surfing'
            })[scope.name];

            scope.show = false;
            scope.showTitle = function() {
                scope.show = true;
            }
            scope.removeTitle = function() {
                scope.show = false;
            }

            scope.href = function() {
                return $state.href(scope.name);
            }

            scope.src = function() {
                return `/img/${scope.name}.png`;
            }

        }
    }
})
