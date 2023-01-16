import Direction from "../enums/Direction.js";
import Tile from "../services/Tile.js";
import Vector from "../../lib/Vector.js";
import Hitbox from "../../lib/Hitbox.js";
import { context } from "../globals.js";

export default class GameObject {

	constructor(objectDefinition = {}) {
		this.position = objectDefinition.position ?? new Vector();
		this.canvasPosition = new Vector(Math.floor(this.position.x * Tile.SIZE), Math.floor(this.position.y * Tile.SIZE));
		this.dimensions = objectDefinition.dimensions ?? new Vector();
		this.direction = objectDefinition.direction ?? Direction.Right;
		this.currentFrame = 0;
		this.sprites = [];
		this.hitbox = new Hitbox(		
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y)
			this.speed = entityDefinition.speed ?? 1;
	}

	update(dt) {
		this.hitbox.set(
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
		);
	}

	render(x, y) {
		this.sprites[this.currentFrame].render(x, y);
	}
}
