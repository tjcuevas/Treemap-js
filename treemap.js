var boxHeight = 0;
var boxWidth = 0;
var remainingHeight = 0;
var remainingWidth = 0;
var element = null;
var colors = ['#990000', '#994c00', '#999900', '#4c9900'];

function drawTreemap(el, vals, options) {
	// array of areas
	element = $(el);
	var orig = vals;
	boxHeight = element.height();
	boxWidth = element.width();
	var boxArea = boxHeight * boxWidth;
	var origTotalArea = totalArea(orig);
	var data = [];
	for(var j = 0; j < orig.length; j++) {
		data.push(boxArea * (orig[j] / origTotalArea))
	}

	remainingHeight = boxHeight;
	remainingWidth = boxWidth;

	var shortestSide = Math.min(remainingHeight, remainingWidth);

	// row loop
	var startIndex = 0;
	while (shortestSide > 0 && startIndex < data.length) {
		
		var direction = shortestSide == remainingHeight ? 'vertical' : 'horizontal';
		
		var endIndex = startIndex;

		var minAspectRatio = undefined;
		var curAspectRatio = undefined;
		var prevRects = [];
		var rects = [];

		while (endIndex < data.length && (minAspectRatio === undefined || curAspectRatio < minAspectRatio)) {
			minAspectRatio = curAspectRatio;
			prevRects = rects;

			endIndex += 1;
			var children = data.slice(startIndex, endIndex);
			rects = getRects(children, shortestSide, direction);

			curAspectRatio = getAspectRatio(rects);
		}

		if (prevRects.length === 0)
			prevRects = rects;

		layoutRow(prevRects, direction);

		startIndex += prevRects.length;
		shortestSide = Math.min(remainingHeight, remainingWidth);
	}
};

function layoutRow(rects, direction) {

	var top = boxHeight - remainingHeight, 
		left = boxWidth - remainingWidth,
		totalHeight = 0,
		totalWidth = 0,
		currentColor;

	for (var i = 0; i < rects.length; i++) {
		if (rects[i].Color) {
			currentColor = rects[i].Color;
		} else {
			//cycle through the default colors
			currentColor = colors.pop();
			colors.unshift(currentColor);
		}
		$('<div/>')
			.css({
				border: '1px solid #000',
				position: 'absolute',
				'background-color': currentColor,
				top: top,
				left: left,
				height: rects[i].height,
				width: rects[i].width
			})
			.appendTo(element);

		if (direction === 'vertical') {
			top += rects[i].height;
		} else {
			left += rects[i].width;
		}
	}

	if (direction === 'vertical') {
		remainingWidth -= rects[0].width;
	} else {
		remainingHeight -= rects[0].height;
	}
}

function getAspectRatio(rects) {
	var max = 0;
	for (var i = 0; i < rects.length; i++) {
		max = Math.max(max, worst(rects[i].height, rects[i].width));
	}

	return max;
}

function getRects(children, shortestSide, direction) {
	var rects = [];
	var fixedSide = totalArea(children) / shortestSide;

	for(var i = 0; i < children.length; i++) {
		var x = fixedSide;
		var y = children[i] / fixedSide;
		
		rects.push({
			width: (direction === 'vertical' ? x : y), 
			height: (direction === 'vertical' ? y : x)
		});
	}

	return rects;
}

function totalArea(children) {
	var area = 0;
	for(var i = 0; i < children.length; i++)
		area += children[i];

	return area;
}

function worst(height, width) {
	return Math.max(height/width, width/height);
}