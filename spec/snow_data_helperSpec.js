describe("snow_data_helper", function() {
	var Snow_data_helper = require('../snow_data_helper.js');
	var snowData;

	beforeEach(function() {
		snowData = new Snow_data_helper();
	});

	it("should capitilize the first letter of a string", function() {
		// console.log("In capitilize function")
		var result = snowData.capitalizeFirstLetterResortTitle("test");
		expect(result).toEqual("Test");
	});

	it("should return formatted resort name", function() {
		var result = snowData.transformResortName("Heavenly");
		expect(result).toEqual("heavenly-mountain-resort");
	});

	it("should return a promise with snow data", function() {
		var result = snowData.getSnowData("kirkwood");
		// console.log(result);
		result.then(function(data) {
			expect(result).not.toBe(null);
			done();
		}, function(error) {
    		fail(error);
   			done();
		});
	});

	xit("should format data from html", function() {

	});
});