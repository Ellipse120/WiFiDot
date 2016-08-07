var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var theEarth = (function() {
  var earthRadius = 6371;//km
  var getDistanceFromRads = function(rads) {
    return parseFloat(rads*earthRadius);
  };
  var getRadsFromDistance = function(distance) {
    return parseFloat(distance / earthRadius);
  };
  return {
    getDistanceFromRads : getDistanceFromRads,
    getRadsFromDistance : getRadsFromDistance
  }
})();

//get list of locations  (/api/locations)
module.exports.locationsListByDistance = function(req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(20),
    num: 10
  };
  if (!lng || !lat || !maxDistance) {
    console.log('locationsListByDistance missing params');
    sendJsonRespongse(res, 404, {
      "message": "lng,lat and maxDistance query parameters are all required"
    });
    return;
  }
  Loc.geoNear(point, geoOptions, function(err, results, stats) {
    var locations = [];
    if (err) {
      sendJsonRespongse(res, 404, err);
    } else {
      results.forEach(function(doc) {
        locations.push({
          distance: theEarth.getDistanceFromRads(doc.dis),
          name: doc.obj.name,
          address: doc.obj.address,
          rating: doc.obj.rating,
          facilities: doc.obj.facilities,
          _id: doc.obj._id
        });
      });
      sendJsonResponse(res, 200, locations);
    }
  });
};

//post a new location  (/api/locations)
//mongodb用mongoose存数据时，非required选项，
//必须输入空格(null也不行)，才能识别，否则会出现ValidatorError
module.exports.locationsCreate = function(req, res) {
  console.log(req.body);
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }]
  }, function(err, location) {
    if (err) {
      console.log(err);
      sendJsonResponse(res, 400, err);
    } else {
      console.log(location);
      sendJsonResponse(res, 201, location);
    }
  });
};

//get a location by the id  (/api/locations/:locationid)
module.exports.locationsReadOne = function(req, res) {
  console.log('Finding location details',req.params);
  if (req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec(function(err, location) {
        if(!location) {
          sendJsonRespongse(res, 404, {
            "message": "locationid not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJsonResponse(res, 404, err);
          return;
        }
        console.log(location);
        sendJsonResponse(res, 200, location);
    });  
  } else {
    console.log('No locationid specified');
    sendJsonResponse(res, 404, {
      "message": "No locationid in request"
    });
  }  
};

// put  (/api/locations/:locationid)
module.exports.locationsUpdateOne = function(req, res) {
  sendJsonResponse(res, 200, {"status": "success"});
};

// delete  (/api/locations/:locationid)
module.exports.locationsDeleteOne = function(req, res) {
  sendJsonResponse(res, 200, {"status": "success"});
};