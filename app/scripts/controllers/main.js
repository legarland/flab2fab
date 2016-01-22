'use strict';

/**
 * @ngdoc function
 * @name flab2FabApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the flab2FabApp
 */
angular.module('flab2FabApp')
  .controller('MainCtrl', function ($http, $filter, $scope) {

    this.users = [];
    var self = this;
    //var url = 'http://spreadsheets.google.com/feeds/list/1tfNxwmS5GdMUX6NW5FIgZcgGXd_XypKmaUiJilL-04Q/od6/public/values?alt=json';
    var url = '/api/info';


    var getWeight = function (tData) {
      var currentPropertiesText = tData;

      // var propsArray = currentPropertiesText.split(", ");
      var re = /(\w+): (.+?(?=(?:, \w+:|$)))/mgi;
      var propsArray = re.exec(currentPropertiesText);
      var props = {};

      while (propsArray != null) {

        var propName = propsArray[1];
        var propValue = propsArray[2];

        props[propName] = propValue;

        propsArray = re.exec(currentPropertiesText);
      }


      return props;
    }

    this.showStartWeight = function (user) {
      //var show = parseBool(user.show);
      if (user.show)
        return user.weights.week0 + ' lbs';
      else
        return '<em>hidden</em>';
    };

    this.showCurrentWeight = function (user) {

      if (user.show)
        return user.currentWeight + ' lbs';
      else
        return '<em>hidden</em>';
    };

    var parseBool = function (bool) {
      if (bool == 'Y')
        return true;
      else
        return false;
    };

    $http.get(url).then(function successCallback(response) {
      console.log(response);
      var users = response.data.feed.entry;

      var totalWeight = 0;
      var currentWeight = 0;

      // Loop through users from spreadsheet
      angular.forEach(users, function(item, index) {
        var userinfo = getWeight(item.content.$t);
        var user = {
          name: item.title.$t,
          paid: parseBool(userinfo.paid),
          show: parseBool(userinfo.show),
          weights: []
        };

        delete userinfo['paid'];
        delete userinfo['show'];
        user.weights = userinfo;

        var i = [];

        // build the index
        for (var x in user.weights) {
          i.push(x);
        }

        user.startWeight = user.weights.week0;
        user.currentWeight = user.weights[i[i.length - 1]];
        user.lastWeekWeight = user.weights[i[i.length - 2]];
        user.overallPercLoss = ((user.startWeight - user.currentWeight) / user.startWeight) * 100;
        user.currentPercLoss = ((user.lastWeekWeight - user.currentWeight) / user.lastWeekWeight) * 100;
        user.overAllPoundsLost = (user.startWeight - user.currentWeight);
        user.currentPoundsLost = (user.lastWeekWeight - user.currentWeight);

        totalWeight = (totalWeight + parseFloat(user.startWeight));
        currentWeight = (currentWeight + parseFloat(user.currentWeight));

        self.users.push(user);
      });

      self.totalWeightLost = totalWeight - currentWeight;
      self.totalPercLost = ((totalWeight - currentWeight) / totalWeight) * 100;

      self.users = $filter('orderBy')(self.users, 'overallPercLoss', true);

    }, function errorCallback(response) {
      console.log(response);
    });


  });
