Treemap-js
==========

A simple jQuery plugin for drawing squarified treemaps.

## Usage
To use the treemap plugin all you need is jQuery and then you can include the `treemap.min.js` file on your page. Once you have the script included simply select the element you want to draw the treemap in and call the `treemap()` function with your data.

There are three fields that can be used for every node you intend to render in the treemap:
* Value (Required): the value of the node. If for some reason you want to use a property name other than `Value`, you can override the `ValueField` setting.
* Color (Optional): the color you wish to use for this node. If not specified a default color is used. If for some reason you want to use a property name other than `Color`, you can override the `ColorField` setting.
* Children (Optional): A list of additional nodes to render inside the main node. If for some reason you want to use a property name other than `Children`, you can override the `ChildrenField` setting.

A 1 pixel black border is used to separate the nodes. If you wish to change this you can override the `Border` setting.

**Example**
```javascript

var list = [
				{
					Value: 24,
					Children: [{Value: 13}, {Value: 3}]
				},
				{
					Value: 21,
				},
				{
					Value: 13,
					Children: [{Value: 13}, {Value: 8}, {Value: 23}, {Value: 22}, {Value: 3}]
				},
				{
					Value: 5
				}
			];

var settings = {
  Border: '1px solid #ccc'
};

$('.treemap-container').treemap(list, settings);
```

## Making changes
**Prequisites:**
Make sure you have npm and gulp installed.

Run `npm install` to install the required packages. Then simply make your changes and run `gulp`. The default gulp task will clean the `dist` folder, run the tests, then minify the code and publish it to the `dist` folder. If you'd like to check your work there's a `treemap.html` file included under the `Demo` folder that has an example set up. 
