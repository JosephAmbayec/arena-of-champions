import Animation from "../../../lib/Animation.js";
import { getRandomPositiveInteger } from "../../../lib/RandomNumberHelpers.js";
import State from "../../../lib/State.js";
import Monster from "../../entities/Monster.js";
import MonsterStateName from "../../enums/MonsterStateName.js";
import { timer } from "../../globals.js";

export default class MonsterIdlingState extends State {
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
		this.monster.currentAnimation = this.animation;
		this.idleDuration = getRandomPositiveInteger(MonsterIdlingState.MOVE_DURATION_MIN, MonsterIdlingState.MOVE_DURATION_MAX);

		this.startTimer();
	}

	update(dt) { }

	startTimer() {
		this.timer = timer.wait(this.idleDuration, () => this.monster.changeState(MonsterStateName.Walking));
	}
}