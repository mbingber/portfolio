app.config(function($stateProvider) {
  $stateProvider.state('painting-prices', {
    url: '/painting-prices',
    templateUrl: 'js/painting-prices/painting_prices.html',
    controller: 'PaitingCtrl'
  });
});

app.controller('PaitingCtrl', function($scope) {
  $scope.method = 'area';
  // $scope.method = 'side'

  $scope.output = {};

  $scope.training = [
    {
      height: 16,
      width: 16,
      lower: 800,
      upper: 900
    }, {
      height: 72,
      width: 72,
      lower: 8000,
      upper: 8500
    }
  ];

  $scope.getPrice = function(output) {
    if(!output.width || !output.height) return 0;
    var points = $scope.training.map(exampleToPoint);
    var line = getLine.apply(null, points);
    var area = output.height * output.width;
    var x = $scope.method === 'area' ? area : Math.sqrt(area);
    return Math.round(line.slope * x + line.intercept);
  }

  function getLine(point1, point2) {
    var slope = (point1.y - point2.y) / (point1.x - point2.x)
    return {
      slope: slope,
      intercept: point1.y - slope * point1.x
    };
  }

  function exampleToPoint(example) {
    var area = example.height * example.width;
    var upper = example.upper || example.lower;
    return {
      x: $scope.method === 'area' ? area : Math.sqrt(area),
      y: 0.5 * (example.lower + upper)
    };
  }

});