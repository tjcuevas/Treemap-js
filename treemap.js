(function($) {
	var colors = ['#71afd8', '#9ed86c', '#fcad4d', '#aa8cd6', '#f0ec6d', '#347097', '#74ab45',
		'#e89126', '#795ca4', '#ffc703', '#abd3ee', '#fccc91', '#c5f19f', '#dac9f3', '#fbf6b1'];

	//sort a list from largest to smallest
	function initializeData(list) {
		var ValueField = $.fn.treemap.defaults.ValueField;
		return list.sort(function(a, b) {
			return b[ValueField] - a[ValueField];
		});
	}

	//get the total area of a set of nodes 
	function getTotalArea(nodes) {
		var ValueField = $.fn.treemap.defaults.ValueField,
			area = 0;

		for(var i = 0; i < nodes.length; i++)
			area += nodes[i][ValueField];

		return area;
	}

	//Calculate aspect ratio for a single rectangle in both directions
	//Return the higher of the two
	function worst(height, width) {
		return Math.max(height/width, width/height);
	}

	//Get the highest aspect ratio from a set of rectangles
	function getAspectRatio(rects) {
		var max = 0;
		for (var i = 0; i < rects.length; i++) {
			max = Math.max(max, worst(rects[i].height, rects[i].width));
		}

		return max;
	}

	//Find the dimensions for each rectangle that allow the set of 
	//children to take up a full row
	function getRects(children, shortestSide, direction) {
		var fixedSide = getTotalArea(children) / shortestSide,
			ValueField = $.fn.treemap.defaults.ValueField,
			ColorField = $.fn.treemap.defaults.ColorField,
			ChildrenField = $.fn.treemap.defaults.ChildrenField,
			rects = [];

		for(var i = 0; i < children.length; i++) {
			var x = fixedSide;
			var y = children[i][ValueField] / fixedSide;
			
			rects.push({
				width: (direction === 'vertical' ? x : y), 
				height: (direction === 'vertical' ? y : x),
				Color: children[i][ColorField],
				Children: children[i][ChildrenField]
			});
		}

		return rects;
	}

	function layoutRow(rects, dimensions) {

		var top = dimensions.Height - dimensions.RemainingHeight, 
			left = dimensions.Width - dimensions.RemainingWidth,
			ChildrenField = $.fn.treemap.defaults.ChildrenField,
			totalHeight = 0,
			totalWidth = 0;

		for (var i = 0; i < rects.length; i++) {
			if (rects[i].Color) {
				currentColor = rects[i].Color;
			} else {
				currentColor = colors[0];
				colors.unshift(colors.pop());
			}

			var newNode = $('<div/>')
				.css({
					border: $.fn.treemap.defaults.Border,
					position: 'absolute',
					'background-color': currentColor,
					top: top,
					left: left,
					height: rects[i].height,
					width: rects[i].width
				})
				.addClass('treemap-node')
				.appendTo(dimensions.Element);

			if (dimensions.Direction === 'vertical') {
				top += rects[i].height;
			} else {
				left += rects[i].width;
			}

			if (rects[i][ChildrenField])
				drawTreeMap.apply($(newNode), [rects[i][ChildrenField]]);
		}

		if (dimensions.Direction === 'vertical') {
			dimensions.RemainingWidth -= rects[0].width;
		} else {
			dimensions.RemainingHeight -= rects[0].height;
		}

		dimensions.ShortestSide = Math.min(dimensions.RemainingWidth, dimensions.RemainingHeight);
		dimensions.Direction = dimensions.ShortestSide == dimensions.RemainingHeight ? 'vertical' : 'horizontal';
		dimensions.Element.closest('div').css('border-width', '0px');
	}

	function draw(boxDimensions, data) {
		var endIndex = 0,
			minAspectRatio = undefined,
			curAspectRatio = undefined,
			prevRects = [],
			rects = [];

		if (data.length === 0)
			return;

		while (endIndex < data.length && (minAspectRatio === undefined || curAspectRatio < minAspectRatio)) {
			minAspectRatio = curAspectRatio;
			prevRects = rects;

			endIndex += 1;
			var children = data.slice(0, endIndex);
			rects = getRects(children, boxDimensions.ShortestSide, boxDimensions.Direction);

			curAspectRatio = getAspectRatio(rects);
		}

		if (prevRects.length === 0)
			prevRects = rects;

		layoutRow(prevRects, boxDimensions);

		shortestSide = Math.min(boxDimensions.RemainingHeight, boxDimensions.RemainingWidth);

		draw(boxDimensions, data.slice(prevRects.length));

	}

	function getBoxDimensions(box) {
		var boxHeight = box.height(),
			boxWidth = box.width(),
			boxArea = boxHeight * boxWidth,
			remainingHeight = boxHeight,
			remainingWidth = boxWidth,
			shortestSide = Math.min(remainingWidth, remainingHeight),
			direction = shortestSide == remainingHeight ? 'vertical' : 'horizontal';

		return {
			Height: boxHeight,
			Width: boxWidth,
			Area: boxArea,
			RemainingHeight: remainingHeight,
			RemainingWidth: remainingWidth,
			ShortestSide: shortestSide,
			Direction: direction,
			Element: box
		};
	}

	function drawTreeMap(nodes) {
		var box = $(this),
			boxDimensions = getBoxDimensions(box),
			ValueField = $.fn.treemap.defaults.ValueField,
			nodeAreas = [],
			totalNodeValue = 0; 

		if (!nodes)
			return;

		totalNodeValue = getTotalArea(nodes);

		nodes = initializeData(nodes);

		nodeAreas = $.map(nodes, function(el, i) {
			var percentOfTotal = el[ValueField] / totalNodeValue;
			var actualArea = boxDimensions.Area * percentOfTotal;
			var ChildrenField = $.fn.treemap.defaults.ChildrenField;
			return {
				Value: actualArea,
				Color: el.Color, 
				Children: el[ChildrenField]
			};
		});

		draw(boxDimensions, nodeAreas);
	}

	$.fn.treemap = drawTreeMap;

	$.fn.treemap.defaults = {
		ValueField: 'Value',
		ColorField: 'Color',
		ChildrenField: 'Children',
		Border: '1px solid #000',
	};

}(jQuery));