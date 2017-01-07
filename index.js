'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var skill = new Alexa.app('movieratings');
var MovieDataHelper = require('./movie_data_helper');



//custom intents
skill.launch(function(req, res) {
  var prompt = 'For movie ratings, tell me a movie title.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

skill.intent('movieRatingsIntent', {
    'slots': {
      'MOVIETITLES': 'MOVIES'
    },
    'utterances': [
      '{|movie} {|info|ratings} {|for} {-|MOVIETITLES}'
    ]
  },
  function(req, res) {
    var movieTitle = req.slot('MOVIETITLES');
    var reprompt = 'Tell me a movie title to get rating information.';
    if (_.isEmpty(movieTitle)) {
      var prompt =
        'I didn\'t hear a movie title. Tell me an movie title.';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var movieHelper = new MovieDataHelper();
      console.log(movieTitle);
      movieHelper.getMovieRating(movieTitle).then(function(movieData) {
        console.log("Movie Data is: "+JSON.stringify(movieData));
        res.say(movieHelper.formatMovieResults(movieData)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I didn\'t have data for a movie title ' + movieTitle;
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
  });

//built-in intents
var cancelIntentFunction = function(request, response) {
  response.say("Goodbye!").shouldEndSession(true);
};

skill.intent("AMAZON.CancelIntent", {}, cancelIntentFunction);
skill.intent("AMAZON.StopIntent", {}, cancelIntentFunction);

skill.intent('AMAZON.HelpIntent', function(req, res) {
  res.say("Test help").shouldEndSession(true).send();
});

module.exports = skill;