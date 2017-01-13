app.config(function($stateProvider) {
    $stateProvider.state('checkerboard', {
        url: '/checkerboard',
        templateUrl: 'js/checkerboard/checkerboard.html',
        controller: function() {
            paper.PaperScript.load();
        }
    });
});