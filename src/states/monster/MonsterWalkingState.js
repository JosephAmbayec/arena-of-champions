import Animation from "../../../lib/Animation.js";
import { didSucceedPercentChance, getRandomPositiveInteger, pickRandomElement } from "../../../lib/RandomNumberHelpers.js";
import State from "../../../lib/State.js";
import Monster from "../../entities/Monster.js";
import Direction from "../../enums/Direction.js";
import MonsterStateName from "../../enums/MonsterStateName.js";
import { timer } from "../../globals.js";
import Map from "../../services/Map.js";

export default class MonsterWalkingState extends State {
	static IDLE_CHANCE = 0.5;
	static MOVE_DURATION_MIN = 2;
	static MOVE_DURATION_MAX = 6;

	/**
	 *
	 * @param {Monster} monster
	 * @param {Animation} animation
	 */
	constructor(monster, animation) {
		super();

		this.monster = monster;
		this.animation = animation;
	}

	enter() {
		this.monster.currentAnimation = this.animation[this.monster.direction];

		this.reset();
		this.startTimer();
	}

	update(dt) {
		this.move(dt);
	}

	startTimer() {
		this.timer = timer.wait(this.moveDuration, () => this.decideMovement());
	}

	/**
	 * 50% chance for the snail to go idle for more dynamic movement.
	 * Otherwise, start the movement timer again.
	 */
	decideMovement() {
		if (didSucceedPercentChance(MonsterWalkingState.IDLE_CHANCE)) {
			this.monster.changeState(MonsterStateName.Idling);
		}
		else {
			this.reset();
			this.startTimer();
		}
	}

	/**
	 * 25% chance for the monster to move in any direction.
	 * Reset the movement timer to a random duration.
	 */
	reset() {
		this.monster.direction = pickRandomElement([Direction.Up, Direction.Down, Direction.Left, Direction.Right]);
		this.monster.currentAnimation = this.animation[this.monster.direction];
		this.moveDuration = getRandomPositiveInteger(MonsterWalkingState.MOVE_DURATION_MIN, MonsterWalkingState.MOVE_DURATION_MAX);
	}

	move(dt) {
		if (this.monster.direction === Direction.Down) {
			this.monster.position.y += this.monster.speed * dt;

			if (this.monster.position.y + this.monster.dimensions.y > Map.BOTTOM_EDGE) {
				this.monster.position.y = Map.BOTTOM_EDGE - this.monster.dimensions.y;
				this.reset();
			}
		}
		else if (this.monster.direction === Direction.Right) {
			this.monster.position.x += this.monster.speed * dt;

			if (this.monster.position.x + this.monster.dimensions.x > Map.RIGHT_EDGE) {
				this.monster.position.x = Map.RIGHT_EDGE - this.monster.dimensions.x;
				this.reset();
			}
		}
		else if (this.monster.direction === Direction.Up) {
			this.monster.position.y -= this.monster.speed * dt;

			if (this.monster.position.y < Map.TOP_EDGE - this.monster.dimensions.y / 2) {
				this.monster.position.y = Map.TOP_EDGE - this.monster.dimensions.y / 2;
				this.reset();
			}
		}
		else if (this.monster.direction === Direction.Left) {
			this.monster.position.x -= this.monster.speed * dt;

			if (this.monster.position.x < Map.LEFT_EDGE) {
				this.monster.position.x = Map.LEFT_EDGE;
				this.reset();
			}
		}
	}
}