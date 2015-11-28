(function($) {
	var AppController = new window.AppController();
	var colors = ['#71afd8', '#9ed86c', '#fcad4d', '#aa8cd6', '#f0ec6d', '#347097', '#74ab45',
		'#e89126', '#795ca4', '#ffc703', '#abd3ee', '#fccc91', '#c5f19f', '#dac9f3', '#fbf6b1'];

	function layoutRow(rects, dimensions, container, options) {
		var top = dimensions.Height - dimensions.RemainingHeight, 
			left = dimensions.Width - dimensions.RemainingWidth,
			ChildrenField = options.ChildrenField,
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
					border: options.Border,
					position: 'absolute',
					'background-color': currentColor,
					top: top,
					left: left,
					height: rects[i].height,
					width: rects[i].width
				})
				.addClass('treemap-node')
				.appendTo(container);

			if (dimensions.IsVertical) {
				top += rects[i].height;
			} else {
				left += rects[i].width;
			}

			if (rects[i][ChildrenField]) {
				drawTreeMap.call($(newNode), rects[i][ChildrenField], options);
			}
		}

		if (dimensions.IsVertical) {
			dimensions.RemainingWidth -= rects[0].width;
		} else {
			dimensions.RemainingHeight -= rects[0].height;
		}

		dimensions.ShortestSide = Math.min(dimensions.RemainingWidth, dimensions.RemainingHeight);
		dimensions.IsVertical = dimensions.ShortestSide == dimensions.RemainingHeight;
		container.closest('div').css('border-width', '0px');
	}

	function draw(boxDimensions, data, container, options) {
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
			rects = AppController.GetRects(children, boxDimensions.ShortestSide, boxDimensions.IsVertical, options);

			curAspectRatio = AppController.GetAspectRatio(rects);
		}

		if (prevRects.length === 0) {
			prevRects = rects;
		}

		layoutRow(prevRects, boxDimensions, container, options);

		shortestSide = Math.min(boxDimensions.RemainingHeight, boxDimensions.RemainingWidth);

		draw(boxDimensions, data.slice(prevRects.length), container, options);
	}

	function drawTreeMap(nodes, settings) {
		var $treemapContainer = $(this);
		var options = $.extend({}, $.fn.treemap.defaults, settings);
		var chartDimensions = AppController.GetBoxDimensions($treemapContainer.height(), $treemapContainer.width());
		var ValueField = options.ValueField;
		var nodeAreas = [];
		var totalNodeValue = 0; 

		if (!nodes) {
			return;
		}

		totalNodeValue = AppController.GetTotalArea(nodes, options);

		nodes = AppController.SortDataDescending(nodes, options);

		nodeAreas = $.map(nodes, function(el, i) {
			var percentOfTotal = el[ValueField] / totalNodeValue;
			var actualArea = chartDimensions.Area * percentOfTotal;
			var ChildrenField = options.ChildrenField;
			return {
				Value: actualArea,
				Color: el.Color, 
				Children: el[ChildrenField]
			};
		});

		draw(chartDimensions, nodeAreas, $treemapContainer, options);
	}

	$.fn.treemap = drawTreeMap;

	$.fn.treemap.defaults = {
		ValueField: 'Value',
		ColorField: 'Color',
		ChildrenField: 'Children',
		Border: '1px solid #000',
	};

}(jQuery));