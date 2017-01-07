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
  if (movieResultsObject.Response === 'True') {
    var template = _.template('IMBD gave ${movie} a rating of ${movie_rating}.');
    return template({
      movie: movieResultsObject.Title,
      movie_rating: movieResultsObject.imdbRating
    });
  } 
  else {
    //no valid movie
    var template =_.template('Sorry, I don\'t have data for that movie title.');
    return template({
      movie: movieResultsObject.Title,
    });
  }
};

module.exports = MovieDataHelper;