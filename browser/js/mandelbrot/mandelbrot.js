app.config(function($stateProvider) {
    $stateProvider.state('mandelbrot', {
        url: '/mandelbrot',
        templateUrl: 'js/mandelbrot/mandelbrot.html'
    });
});
