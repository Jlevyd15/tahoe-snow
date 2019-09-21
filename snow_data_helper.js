'use strict';
var requestPromise = require('request-promise');
var cheerio = require('cheerio');

var ENDPOINT_BASE = "http://www.onthesnow.com/california/";
var ENDPOINT_PAGE = "/skireport.html";

function SnowDataHelper() {
}

SnowDataHelper.prototype.capitalizeFirstLetterResortTitle = function (resortName) {
	if (resortName) {
		resortName = resortName.split('');
		var uppercaseLetter = resortName[0].toUpperCase();
		resortName.splice(resortName[0], 1, uppercaseLetter)
		return resortName.join('');
	} else
		return resortName;
};

SnowDataHelper.prototype.transformResortName = function (resortName) {
	//input will be "tahoe", "heavenly"
	//output will be tahoe-doner
	resortName = resortName.toLowerCase();
	switch (resortName) {
		case "bear mountain":
			resortName = "bear-mountain";
			break;
		case "bear valley":
			resortName = "bear-valley";
			break;
		case "boreal mountain resort":
		case "boreal mountain":
		case "boreal":
			resortName = "boreal";
			break;
		case "dodge ridge":
		case "dodge":
			resortName = "dodge-ridge";
			break;
		case "donner ski ranch":
		case "donner ranch":
		case "donner":
			resortName = "donner-ski-ranch";
			break;
		case "homewood mountain resort":
		case "homewood mountain":
		case "homewood":
			resortName = "homewood-mountain-resort";
			break;
		case "june mountain":
		case "june":
			resortName = "june-mountain";
			break;
		case "mammoth mountain ski area":
		case "mammoth mountain":
		case "mammoth":
			resortName = "mammoth-mountain-ski-area";
			break;
		case "mountain high":
			resortName = "mountain-high";
			break;
		case "mt baldy":
		case "baldy":
			resortName = "mt-baldy";
			break;
		case "mt shasta ski park":
		case "mt shasta":
		case "shasta":
			resortName = "mount-shasta-board-ski-park"
			break;
		case "sierra-at-tahoe":
		case "sierra tahoe":
		case "sierra":
			resortName = "sierra-at-tahoe";
			break;
		case "ski china peak":
		case "china peak":
		case "china":
			resortName = "ski-china-peak";
			break;
		case "snow summit":
			resortName = "snow-summit";
			break;
		case "snow valley":
			resortName = "snow-valley"
			break;
		case "soda springs":
		case "soda":
			resortName = "soda-springs";
			break;
		case "squaw valley - alpine meadows":
		case "squaw valley":
		case "squaw":
			resortName = "squaw-valley-usa";
			break;
		case "sugar bowl resort":
		case "sugar bowl":
			resortName = "sugar-bowl-resort";
			break;
		case "badger pass":
		case "badger":
		case "yosemite ski & snowboard area":
			resortName = "badger-pass";
			break;
		case "tahoe":
			resortName = "tahoe-donner";
			break;
		case "heavenly mountain resort":
		case "heavenly ski resort":
		case "heavenly resort":
		case "heavenly":
			resortName = "heavenly-mountain-resort";
			break;
		case "northstar":
		case "north star":
			resortName = "northstar-california";
			break;
	}
	return resortName;
};

SnowDataHelper.prototype.getSnowData = function (resortName) {
	console.log(ENDPOINT_BASE + resortName + ENDPOINT_PAGE)
	var options = {
		method: 'GET',
		uri: ENDPOINT_BASE + resortName + ENDPOINT_PAGE,
		json: true
	};
	return requestPromise(options);
};

SnowDataHelper.prototype.formatSnowResults = function (snowDataHTML, resortName) {
	var $ = cheerio.load(snowDataHTML);
	var currentSnow, snowDepth;
	var json = { currentSnow: "" };

	json.resortName = $("h1 > .resort_name").text();
	json.currentSnow = $(".today .predicted_snowfall .bluePill").text();
	console.log(JSON.stringify(json))
	//check if the resort isn't found
	if (!json.currentSnow) {
		return `I'm haveing trouble getting the snow report for ${resortName} right now, please try again later`;
	}
	if (snowDataHTML) {
		return `${json.resortName} got ${json.currentSnow} of snow today.`;
	} else {
		//not valid resort no data was returned from the server
		return 'Sorry, I don\'t have data for that resort, tell me another resort name.';
	}
};

module.exports = SnowDataHelper;