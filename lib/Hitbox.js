import Direction from "../src/enums/Direction.js";
import { getCollisionDirection, isAABBCollision } from "./CollisionHelpers.js";
import Vector from "./Vector.js";
export default class Hitbox {
	/**
	 * A rectangle that represents the area around a game
	 * entity or object that can collide with other hitboxes.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {string} colour
	 */
	constructor(x = 0, y = 0, width = 0, height = 0, colour = 'red') {
		this.colour = colour;
		this.set(x, y, width, height);
		this.isSolid = true;
		this.isCollidable = true;
		this.wasCollided = true;
	}

	set(x, y, width, height) {
		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);
	}

	didCollide(target) {
		return isAABBCollision(
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			target.position.x,
			target.position.y,
			target.dimensions.x,
			target.dimensions.y,
		);
	}

	getCollisionDirection(target) {
		return getCollisionDirection(
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			target.position.x,
			target.position.y,
			target.dimensions.x,
			target.dimensions.y,
		);
	}

	render(context) {
		context.save();
		context.strokeStyle = this.colour;
		context.beginPath();
		context.rect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);
		context.stroke();
		context.closePath();
		context.restore();
	}

	onCollision(collider) {
		/**
		 * If this object is solid, then set the
		 * collider's position relative to this object.
		 */
		if (this.isSolid) {
			const collisionDirection = this.getCollisionDirection(collider.hitbox);

			switch (collisionDirection) {
				case Direction.Up:
					collider.position.y = this.position.y - Math.abs(collider.position.y - collider.hitbox.position.y) - collider.hitbox.dimensions.y - 1;
					break;
				case Direction.Down:
					collider.position.y = this.position.y + this.dimensions.y - Math.abs(collider.position.y - collider.hitbox.position.y) + 1;
					break;
				case Direction.Left:
					collider.position.x = this.position.x - Math.abs(collider.position.x - collider.hitbox.position.x) - collider.hitbox.dimensions.x - 1;
					break;
				case Direction.Right:
					collider.position.x = this.position.x + this.dimensions.x - Math.abs(collider.position.x - collider.hitbox.position.x) + 1;
					break;
			}
		}

		if (this.wasCollided) {
			return;
		}

		this.wasCollided = true;
	}
}
