app.config(function($stateProvider) {
    $stateProvider.state('gravity', {
        url: '/gravity',
        templateUrl: 'js/gravity/gravity.html',
        controller: function() {
            paper.PaperScript.load();
        }
    });
});
