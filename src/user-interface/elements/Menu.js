import HorizontalSelection from "./HorizontalSelection.js";
import Panel from "./Panel.js";
import Selection from "./Selection.js";

export default class Menu extends Panel {

	static TITLE_SCREEN_MENU = {
		borderColour: 'rgba(0, 0, 0, 0',
		panelColour: "rgba(0, 0, 0, 0",	
		fontColour: "#F8F8FF"
	}

	static SHOP_MENU = {
		borderColour: 'rgba(0, 0, 0, 1)',
		panelColour: "rgba(74, 74, 74, 0.47)",
		fontColour: "#FFFFFF"
	}
	/**
	 * A UI element that is a Selection on a Panel.
	 * More complicated Menus may be collections
	 * of Panels and Selections that form a greater whole.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {array} items Elements are objects that each
	 * have a string `text` and function `onSelect` property.
	 */
	constructor(x, y, width, height, items, options = {}) {
		super(x, y, width, height, options);

		this.selection = new Selection(x, y, width, height, items, options);
	}

	update() {
		this.selection.update();
	}

	render() {
		super.render();
		this.selection.render();
	}
}
