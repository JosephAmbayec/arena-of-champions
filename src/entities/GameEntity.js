import Direction from "../enums/Direction.js";
import Tile from "../services/Tile.js";
import Vector from "../../lib/Vector.js";
import Hitbox from "../../lib/Hitbox.js";
import { context, DEBUG } from "../globals.js";

export default class GameEntity {
	static WIDTH = 32;
	static HEIGHT = 32;

	/**
	 * The base class to be extended by all entities in the game.
	 * Right now we just have one Player character, but this could
	 * be extended to implement NPCs (Non Player Characters) as well.
	 *
	 * @param {object} entityDefinition
	 */
	constructor(entityDefinition = {}) {
		this.position = entityDefinition.position ?? new Vector();
		this.canvasPosition = new Vector(Math.floor(this.position.x * Tile.SIZE), Math.floor(this.position.y * Tile.SIZE));
		this.dimensions = entityDefinition.dimensions ?? new Vector();
		this.direction = entityDefinition.direction ?? Direction.Right;
		this.stateMachine = null;
		this.currentFrame = 0;
		this.sprites = [];
		this.hitbox = new Hitbox(		
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y);
		this.speed = entityDefinition.speed ?? 1
		this.isDead = false;
	}

	/**
	 * At this time, stateMachine will be null for Pokemon.
	 */
	update(dt) {
		this.stateMachine?.update(dt);
		this.hitbox.set(
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
		);
	}

	render(x, y, scale = { x: 1, y: 1 }) {
		this.stateMachine?.render();
		if (this.sprites[this.currentFrame] == null)
			this.currentFrame = 0;
		this.sprites[this.currentFrame].render(x, y, scale);
		if (DEBUG)
			this.hitbox.render(context)
	}

	changeState(state, params) {
		this.stateMachine?.change(state, params);
	}
}
