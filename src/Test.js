require('./AppController.js');

describe('AppController', function() {
	var app;
	var options = {
		ValueField: 'Value'
	};

	beforeEach(function() {
		app = new AppController();
	});

	afterEach(function() {
		app = null;
	});

	describe('GetTotalArea', function() {
		it('Total Area Adds up', function() {
			var nodes = [
				{
					Value: 5
				},
				{
					Value: 10
				},
				{
					Value: 3
				},
				{
					Value: 12
				}
			];
			var expected = 30;
			var actual = app.GetTotalArea(nodes, options);

			expect(actual).toBe(expected);
		});

		it('Returns 0 with empty list', function() {
			var nodes = [];
			var expected = 0;
			var actual = app.GetTotalArea(nodes, options);

			expect(actual).toBe(expected);
		});

		it('Throws with null list', function() {
			var nodes = null;
			var expected = "Expecting an array as first argument";

			expect(function() {
				app.GetTotalArea(nodes, options);
			}).toThrow(expected);
		});
	});

	describe('Worst', function() {
		it('Returns greater aspect ratio for height', function() {
			var height = 5;
			var width = 7;
			var expected = 7 / 5;
			var actual = app.Worst(height, width);

			expect(actual).toBe(expected);
		});

		it('Returns greater aspect ratio for width', function() {
			var height = 7;
			var width = 5;
			var expected = 7 / 5;

			var actual = app.Worst(height, width);

			expect(actual).toBe(expected);
		});	
	});

	describe('GetAspectRatio', function() {
		it('Gets highest aspect ratio', function() {
			var rects = [
				{
					height: 5,
					width: 7
				},
				{
					height: 1,
					width: 3
				},
				{
					height: 2,
					width: 4
				},
				{
					height: 6,
					width: 7
				},
			]
			var expected = 3 / 1;
			var actual = app.GetAspectRatio(rects);
			
			expect(actual).toBe(expected); 
		});

		it('Throws error with null list', function() {
			expect(function() {
				app.GetAspectRatio();
			}).toThrow();
		});
	});

	describe('SortDataDescending', function() {
		it('Returns nodes highest to lowest', function() {
			var nodes = [
				{
					Value: 5
				},
				{
					Value: 10
				},
				{
					Value: 3
				},
				{
					Value: 12
				}
			];
			var expected = [
				{
					Value: 12
				},
				{
					Value: 10
				},
				{
					Value: 5
				},
				{
					Value: 3
				}
			];
			var actual = app.SortDataDescending(nodes, options);

			expect(actual).toEqual(expected);
		});

		it('Sorts by VauleField in options', function() {
			options = {
				ValueField: 'Foo'
			};
			var nodes = [
				{
					Foo: 5
				},
				{
					Foo: 10
				},
				{
					Foo: 3
				},
				{
					Foo: 12
				}
			];
			var expected = [
				{
					Foo: 12
				},
				{
					Foo: 10
				},
				{
					Foo: 5
				},
				{
					Foo: 3
				}
			];
			var actual = app.SortDataDescending(nodes, options);

			expect(actual).toEqual(expected);
		});
	});

	describe('GetBoxDimensions', function() {
		it('Returns proper dimensions', function() {
			var expected = {
				Height: 3,
				Width: 5,
				Area: 15,
				RemainingHeight: 3,
				RemainingWidth: 5,
				ShortestSide: 3,
				IsVertical: true
			};

			expect(app.GetBoxDimensions(3, 5)).toEqual(expected);
		});
	});
});