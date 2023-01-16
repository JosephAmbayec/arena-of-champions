import Hitbox from "../../lib/Hitbox.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import { context, DEBUG } from "../globals.js";

export default class Tile {
	static SIZE = 32;
	static GRASS = 6;

	/**
	 * Represents one tile in a Layer and on the screen.
	 *
	 * @param {number} id
	 * @param {array} sprites
	 */
	constructor(id, sprites) {
		this.sprites = sprites;
		this.id = id;
		this.hitbox = null
	}

	render(x, y) {
		this.sprites[this.id].render(x * Tile.SIZE, y * Tile.SIZE);
	//	this.hitbox = new Hitbox(x, y, Tile.SIZE, Tile.SIZE)
		if (this.hitbox && DEBUG)
			this.hitbox.render(context)
	}
}