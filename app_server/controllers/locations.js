var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};
// if (process.env.NODE_ENV === 'production') {
//   apiOptions.server = "https://protected-spire-18793.herokuapp.com";
// }
/* GET 'home' page */

var _isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var _formatDistance = function(distance) {
  var numDistance, unit;
  if ((distance>=0) && _isNumeric(distance)) {
    if (distance > 1) {
      numDistance = parseFloat(distance).toFixed(1);
      unit = 'km';
    } else {
      numDistance = parseInt(distance * 1000,10);
      unit = 'm';
    }
    return numDistance + unit;
  } else {
    return "?";
  }
};

var renderHomepage = function (req, res, responseBody) {
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No places found nearby";
    }
  }
  res.render('locations-list', { 
    title: 'WiFiDot - find a place to work with wifi',
    pageHeader: {
    	title: 'WiFiDot',
    	strapline: 'Find place to work with wifi near you!'
    },
    sidebar: "Looking for wifi and a seat? WiFiDot helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let WiFiDot help you find the place you're looking for.",
    locations: responseBody,
    message: message
  });
};
module.exports.homelist = function(req, res) {
  var requestOptions, path;
  path = "/api/locations";
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {},
    qs : {
      lng : 121.527121,
      lat : 31.083196,
      maxDistance : 20
    }
  };
  request (
    requestOptions,
    function(err, response, body) {
      var i,data;
      data = body;
      if (response.statusCode === 200 && data.length) {
        for (i = 0; i <data.length; i++) {
          console.log(data[i].distance);
          console.log(typeof(data[i].distance));
          data[i].distance = _formatDistance(data[i].distance);
        }
      }
      renderHomepage(req, res, data);
    });
};

var renderDetailPage = function (req, res, locDetail) {
  res.render('location-info', {
      title: locDetail.name,
      pageHeader: {
        title: locDetail.name
      },
      sidebar: {
        context: 'is on WiFiDot because it has accessible wifi and spance to sit down with your laptop and get some work done.',
        callToAction: 'if you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
      },
      location: locDetail
  });
};

/*GET 'Location info' page */
module.exports.locationInfo = function(req, res) {
  var requestOptions, path;
  path = "/api/locations/" + req.params.locationid;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(
    requestOptions, 
    function(err, response, body){
      var data = body;
      data.coords = {
        lng: body.coords[0],
        lat: body.coords[1]
      }
      renderDetailPage(req, res, data);
  });
};

/* GET 'Add review' page */
module.exports.addReview = function (req, res) {
    res.render('location-review-form', {
        title: 'Review Starcups on WiFiDot',
        pageHeader: {
          title: 'Review Starcups'
        }
    });
};