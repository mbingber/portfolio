app.config(function($stateProvider) {
    $stateProvider.state('diamonds', {
        url: '/diamonds',
        templateUrl: 'js/diamonds/diamonds.html',
        controller: function() {
            paper.PaperScript.load();
        }
    });
});