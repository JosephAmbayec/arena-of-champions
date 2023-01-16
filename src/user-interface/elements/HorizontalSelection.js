import UserInterfaceElement from "../UserInterfaceElement.js";
//import SoundName from "../../enums/SoundName.js";
import { context, keys, sounds } from "../../globals.js";
import Vector from "../../../lib/Vector.js";

export default class HorizontalSelection extends UserInterfaceElement {
	/**
	 * A UI element that gives us a list of textual items that link to callbacks;
	 * this particular implementation only has one dimension of items (vertically),
	 * but a more robust implementation might include columns as well for a more
	 * grid-like selection, as seen in many other kinds of interfaces and games.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {array} items Elements are objects that each
	 * have a string `text` and function `onSelect` property.
	 */
	constructor(x, y, width, height, items) {
		super(x, y, width, height);

		this.gapWidth = this.dimensions.y / (items.length + 1);
		this.items = this.initializeItems(items);
		this.currentSelection = 0;
		this.font = this.initializeFont();
	}

	update() {
		if (keys.a || keys.ArrowLeft) {
			this.navigateLeft();
		}
		else if (keys.d || keys.ArrowRight) {
			this.navigateRight();
		}
		else if (keys.Enter || keys[' ']) {
			this.select();
		}
	}

	render() {
		this.items.forEach((item, index) => {
			this.renderSelectionItem(item, index);
		});
	}

	renderSelectionItem(item, index) {
		if (index === this.currentSelection) {
			this.renderSelectionArrow(item);
		}

		context.save();	
		context.textAlign = 'left';
		context.textBaseline = 'left';
		context.font = this.font;
		context.fillText(item.text, item.position.x, item.position.y);
		context.restore();
	}

	renderSelectionArrow(item) {
		context.save();
		context.translate(item.position.x, this.position.y + this.dimensions.y / 2);
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(6, 5);
		context.lineTo(0, 10);
		context.closePath();
		context.fill();
		context.restore();
	}

	navigateLeft() {
		keys.a = false;
		keys.ArrowLeft = false;

		//sounds.play(SoundName.SelectionMove);

		if (this.currentSelection === 0) {
			this.currentSelection = this.items.length - 1;
		}
		else {
			this.currentSelection--;
		}
	}

	navigateRight() {
		keys.d = false;
		keys.ArrowRight = false;

	//	sounds.play(SoundName.SelectionMove);

		if (this.currentSelection === this.items.length - 1) {
			this.currentSelection = 0;
		}
		else {
			this.currentSelection++;
		}
	}

	select() {
		keys.Enter = false;
		keys[' '] = false;

	//	sounds.play(SoundName.SelectionChoice);
		this.items[this.currentSelection].onSelect();
	}

	/**
	 * Adds a position property to each item to be used for rendering.
	 *
	 * @param {array} items
	 * @returns The items array where each item now has a position property.
	 */
	initializeItems(items) {
		let currentX = this.position.x;

		items.forEach((item) => {
			const padding = currentX + this.gapWidth;

			item.position = new Vector(padding, this.position.y + this.dimensions.y / 2);

			currentX += this.gapWidth;
		});

		return items;
	}

	/**
	 * Scales the font size based on the size of this Selection element.
	 */
	initializeFont() {
		return `${Math.min(UserInterfaceElement.FONT_SIZE, this.gapWidth)}px ${UserInterfaceElement.FONT_FAMILY}`;
	}
}
