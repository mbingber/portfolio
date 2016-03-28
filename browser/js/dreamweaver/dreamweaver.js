app.config(function($stateProvider) {
    $stateProvider.state('dreamcatcher', {
        url: '/dreamcatcher',
        templateUrl: 'js/dreamweaver/dreamweaver.html',
        controller: function() {
            paper.PaperScript.load();
        }
    });
});
