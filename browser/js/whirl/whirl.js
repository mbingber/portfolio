app.config(function($stateProvider) {
    $stateProvider.state('whirl', {
        url: '/whirl',
        templateUrl: 'js/whirl/whirl.html',
        controller: function() {
            paper.PaperScript.load();
        }
    });
});