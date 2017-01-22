'use strict';
module.change_code = 1;
var SkillId = "amzn1.ask.skill.3a560f55-b79e-4c6f-8fd0-3b118affaac6";
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
      '{|info|information|report|reports|snow|snowfall|amount} {|for|at} {-|SKIRESORTS}'
    ]
  },
  function(req, res) {
    // console.log(JSON.stringify(req, null, ' '))
    var appId = req.data.session.application.applicationId;
    //check SkillId and AppId Match
    console.log("App Id: "+ appId + " - " + "Skill Id: "+ SkillId);
    if(SkillId === appId) {
      var skiResort = req.slot('SKIRESORTS');
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
    } 
    else {
      console.log("Bad Request 400");
      return 400;
    }
  });

//built-in intents
var cancelIntentFunction = function(request, response) {
  response.say("Goodbye!").shouldEndSession(true);
};

skill.intent("AMAZON.CancelIntent", {}, cancelIntentFunction);
skill.intent("AMAZON.StopIntent", {}, cancelIntentFunction);

skill.intent('AMAZON.HelpIntent', function(req, res) {
  var prompt = "You can ask Tahoe Snow for snowfall information. I can tell you daily snowfall and total snowfall depth. Which Tahoe resort would you like a snow report for?";
  var reprompt = "Tell me a ski resort to get snow report information.";
  res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
});

module.exports = skill;