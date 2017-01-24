'use strict';
module.change_code = 1;
var SkillId = "amzn1.ask.skill.3a560f55-b79e-4c6f-8fd0-3b118affaac6";
var _ = require('lodash');
var Alexa = require('alexa-app');
var skill = new Alexa.app('snowreport');
var SnowDataHelper = require('./snow_data_helper');

//pre runs beofore any intent handlers
skill.pre = function(req, res, type) {
  var appId = req.data.session.application.applicationId;
  console.log("App Id: "+ appId + " - " + "Skill Id: "+ SkillId);
  if (appId != SkillId) {
    // fail ungracefully
    response.fail("Invalid applicationId");
  }
};

//catch any exceptions and return something useful
skill.post = function(req, res, type, exception) {
  if (exception) {
    // always turn an exception into a successful response
    res.clear().say("Sorry, an error occured: " + exception).send();
  }
};

//handle any errors
skill.error = function(exception, request, response) {
  response.say("Sorry, an error occured" + exception);
};

//launch intent
skill.launch(function(req, res) {
  var prompt = 'For snow report information, tell me a ski resort.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

//intent to get snow report info.
skill.intent('snowReportIntent', {
    'slots': {
      'SKIRESORTS': 'RESORTS'
    },
    'utterances': [
      '{|info|information|report|reports|snow|snowfall} {|for|at|on|about} {-|SKIRESORTS}'
    ]
  },
  function(req, res) {
    // console.log(JSON.stringify(req, null, ' '))
      var skiResort = req.slot('SKIRESORTS');
      var reprompt = 'Tell me a ski resort to get snow report information.';
      if (_.isEmpty(skiResort)) {
        console.log("slot was empty");
        var prompt = 'I didn\'t hear a resort name. Tell me a resort to get started.';
        res.say(prompt).reprompt(reprompt).shouldEndSession(false);
        return true;
      } else {
          var snowHelper = new SnowDataHelper();
          console.log("User asked for... "+skiResort);
          // transform the user untered resort name into the website format
          var trasformedSkiResort = snowHelper.transformResortName(skiResort);
          console.log("Sending "+trasformedSkiResort)
          snowHelper.getSnowData(trasformedSkiResort).then(function(snowData) {
          // send the card with the resort name as the title and snow report data
          res.card(snowHelper.capitalizeFirstLetterResortTitle(skiResort), snowHelper.formatSnowResults(snowData, skiResort));
          // send the user the requested snow report
          res.say(snowHelper.formatSnowResults(snowData, skiResort)).send();
        }).catch(function(err) {
          console.log("valid resort name was not found, server returns " + err.statusCode);
          var prompt = 'Sorry, I couldn\'t find data for that resort, tell me another resort name.';
          res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        });
        return false;
      }
  });

//built-in intents
var cancelIntentFunction = function(req, res) {
  res.say("Goodbye!").shouldEndSession(true);
};

skill.intent("AMAZON.CancelIntent", {}, cancelIntentFunction);
skill.intent("AMAZON.StopIntent", {}, cancelIntentFunction);

skill.intent('AMAZON.HelpIntent', function(req, res) {
  var prompt = "You can ask Tahoe Snow for snowfall information. I can tell you daily snowfall and total snowfall depth. Which Tahoe resort would you like a snow report for?";
  var reprompt = "Tell me a ski resort to get snow report information.";
  res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
});

module.exports = skill;