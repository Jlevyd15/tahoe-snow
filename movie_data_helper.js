'use strict';
var _ = require('lodash');
var requestPromise = require('request-promise');
//http://www.omdbapi.com/?tomatoes=true&r=json&plot=short&t=jaws
var ENDPOINT = 'http://www.omdbapi.com/?tomatoes=true&r=json&plot=short&t=';

function MovieDataHelper() {
}

MovieDataHelper.prototype.getMovieRating = function(movieTitle) {
  var options = {
    method: 'GET',
    uri: ENDPOINT + movieTitle,
    json: true
  };
  return requestPromise(options);
};

MovieDataHelper.prototype.formatMovieResults = function(movieResultsObject) {
  // if (movieResultsObject.imdbRating === 'true') {
    var template = _.template('IMBD gave ${movie} a rating of ${movie_rating}.');
    return template({
      movie: movieResultsObject.Title,
      movie_rating: movieResultsObject.imdbRating
    });
  // } 
  //else {
  //   //no delay
  //   var template =_.template('There is currently no delay at ${airport}.');
  //   return template({
  //     airport: aiportStatusObject.name,
  //   });
  // }
};

module.exports = MovieDataHelper;