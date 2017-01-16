'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var skill = new Alexa.app('snowreport');
var SnowDataHelper = require('./snow_data_helper');

//custom intents
skill.launch(function(req, res) {
  var prompt = 'For snow report information, tell me a ski resort.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

skill.intent('snowReportIntent', {
    'slots': {
      'SKIRESORTS': 'RESORTS'
    },
    'utterances': [
      '{|snowfall|snow|snowdepth|powder} {|info|report|reports} {|for|at} {-|SKIRESORTS}'
    ]
  },
  function(req, res) {
    var skiResort = req.slot('SKIRESORTS');
    // console.log(JSON.stringify(req,null, ' '))
    var reprompt = 'Tell me a ski resort to get snow report information.';
    if (_.isEmpty(skiResort)) {
      var prompt = 'I didn\'t hear a resort name. Tell me a resort to get started.';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var snowHelper = new SnowDataHelper();
      console.log("User asked for... "+skiResort);
      //transform the user untered resort name into the website format
      var trasformedSkiResort = snowHelper.transformResortName(skiResort);
      console.log("Sending "+trasformedSkiResort)
      snowHelper.getSnowData(trasformedSkiResort).then(function(snowData) {
        // send the card with the resort name as the title and snow report data
        res.card(snowHelper.capitalizeFirstLetterResortTitle(skiResort), snowHelper.formatSnowResults(snowData, skiResort));
        res.say(snowHelper.formatSnowResults(snowData, skiResort)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'Sorry, I couldn\'t find data for that resort, tell me another resort name.';
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
  res.say("You can ask Tahoe Snow for snowfall information. Give me a ski resort and I will tell you how much snow is there. Try this command, ask Tahoe Snow for Heavenly.").shouldEndSession(true).send();
});

module.exports = skill;