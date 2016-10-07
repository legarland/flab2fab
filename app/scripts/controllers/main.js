'use strict';

/**
 * @ngdoc function
 * @name flab2FabApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the flab2FabApp
 */
angular.module('flab2FabApp')
  .controller('MainCtrl', function ($http, $filter, WeightFactory) {

    var self = this;

    WeightFactory.init(function () {
      self.users = WeightFactory.users();
      self.totalPercLost = WeightFactory.totalPercLost();
      self.totalWeightLost = WeightFactory.totalWeightLost();
    });

    this.showStartWeight = function (user) {
      //var show = parseBool(user.show);
      if (user.show)
        return user.startWeight + ' lbs';
      else
        return '<em>hidden</em>';
    };

    this.showCurrentWeight = function (user) {

      if (user.show)
        return user.currentWeight + ' lbs';
      else
        return '<em>hidden</em>';
    };

  });
