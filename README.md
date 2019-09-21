# Tahoe Snow :snowflake: :snowman:

## The Tahoe Snow Skill provides daily snowfall and total snow depth for Tahoe-area ski and snowboard resorts.

## The Tahoe Snow Skill provides daily snowfall and total snow depth for Tahoe-area ski and snowboard resorts.Enable the skill to get started: say “Alexa, ask Tahoe Snow …” Use the skill to check snow conditions for 45+ resorts. Contact Us: Please send us your feedback on ways to improve this skill. [Contact Us](mailto:J@JustLevy.com?Subject=Tahoe%20Snow%20Alexa%20Skill)


## Development

`yarn install`

Run this to test the requests & responses from AWS Lambda. Note, this command runs the Lambda locally.

`lambda-local -l index.js -h handler -e ./res/event.json`


## Deployment

Either upload the files via zip or copy/paste into the Lambda function editior directly on AWS for small changes

https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/snowreport?tab=graph

1. index.js
2. snow_data_helper.js
3. package.json


## Testing

After deployment test the live changes here: 

https://developer.amazon.com/alexa/console/ask/test/amzn1.ask.skill.3a560f55-b79e-4c6f-8fd0-3b118affaac6/development/en_US/