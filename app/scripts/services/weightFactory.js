angular.module('flab2FabApp').factory('WeightFactory', function ($filter) {

  var self = this;

  var users = [];
  var totalWeightLost = 0.0;
  var totalPercLost = 0.0;

  var init = function (cb) {

    var totalWeight = 0.0;
    var currentWeight = 0.0;

    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      var user = {};

      user.startWeight = d.start;
      user.currentWeight = d.weeks[d.weeks.length-1].weight;
      user.lastWeekWeight = d.weeks[d.weeks.length-2].weight;
      user.overallPercLoss = ((user.startWeight - user.currentWeight) / user.startWeight) * 100;
      user.currentPercLoss = ((user.lastWeekWeight - user.currentWeight) / user.lastWeekWeight) * 100;
      user.overAllPoundsLost = (user.startWeight - user.currentWeight);
      user.currentPoundsLost = (user.lastWeekWeight - user.currentWeight);

      user.show = d.show;
      user.name = d.name;

      totalWeight = (totalWeight + parseFloat(user.startWeight));
      currentWeight = (currentWeight + parseFloat(user.currentWeight));

      users.push(user);
    }

    totalWeightLost = totalWeight - currentWeight;
    totalPercLost = ((totalWeight - currentWeight) / totalWeight) * 100;

    users = $filter('orderBy')(users, 'overallPercLoss', true);

    cb();
  }

  return {
    init: init,
    users: function () {
      return users;
    },
    totalWeightLost: function () {
      return totalWeightLost;
    },
    totalPercLost: function () {
      return totalPercLost;
    }
  }
});
