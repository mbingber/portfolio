app.config(function ($stateProvider) {
    $stateProvider.state('force', {
        url: '/force',
        templateUrl: 'js/forceDirection/forceDirection.html',
        controller: 'ForceCtrl'
    });
});
