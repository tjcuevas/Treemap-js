AppController = function() {
	function sortDataDescending(list, options) {
		return list.sort(function(a, b) {
			return b[options.ValueField] - a[options.ValueField];
		});
	}

	function getTotalArea(nodes, options) {
		var ValueField = options.ValueField;
		var area = 0;

		if (!Array.isArray(nodes)) {
			throw "Expecting an array as first argument";
		}

		for(var i = 0; i < nodes.length; i++) {
			area += nodes[i][ValueField];
		}

		return area;
	}

	function getBoxDimensions(containerHeight, containerWidth) {
		var boxArea = containerHeight * containerWidth;
		var remainingHeight = containerHeight;
		var remainingWidth = containerWidth;
		var shortestSide = Math.min(remainingWidth, remainingHeight);
		var isVertical = shortestSide == remainingHeight;

		return {
			Height: containerHeight,
			Width: containerWidth,
			Area: boxArea,
			RemainingHeight: remainingHeight,
			RemainingWidth: remainingWidth,
			ShortestSide: shortestSide,
			IsVertical: isVertical
		};
	}

	//Get the highest aspect ratio from a set of rectangles
	function getAspectRatio(rects) {
		var max = 0;

		if (!Array.isArray(rects)) {
			throw "Expecting an array as first argument";
		}

		for (var i = 0; i < rects.length; i++) {
			max = Math.max(max, worst(rects[i].height, rects[i].width));
		}

		return max;
	}

	//Calculate aspect ratio for a single rectangle in both directions
	//Return the higher of the two
	function worst(height, width) {
		return Math.max(height/width, width/height);
	}

	//Find the dimensions for each rectangle that allow the set of 
	//children to take up a full row
	function getRects(children, shortestSide, isVertical, options) {
		var fixedSide = getTotalArea(children, options) / shortestSide;
		var rects = [];

		for(var i = 0; i < children.length; i++) {
			var x = fixedSide;
			var y = children[i][options.ValueField] / fixedSide;
			
			rects.push({
				width: (isVertical ? x : y), 
				height: (isVertical ? y : x),
				Color: children[i][options.ColorField],
				Children: children[i][options.ChildrenField]
			});
		}

		return rects;
	}

	return {
		SortDataDescending: sortDataDescending,
		GetRects: getRects,
		GetTotalArea: getTotalArea,
		GetAspectRatio: getAspectRatio,
		GetBoxDimensions: getBoxDimensions,
		//Exposed for testing
		Worst: worst
	};
}