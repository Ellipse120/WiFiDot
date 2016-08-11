angular
  .module('wifidotApp')
  .controller('homeCtrl', homeCtrl);

function homeCtrl ($scope) {
  $scope.pageHeader = {
    title: 'WiFiDot',
    strapline: 'Find places to work with wifi near you!'
  };
  $scope.sidebar = {
    content: "Looking for wifi and a seat? WiFiDot helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let WiFiDot help you find the place you're looking for."
  };
}