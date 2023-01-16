import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import StateMachine from "../../lib/StateMachine.js";
import MonsterStateName from "../enums/MonsterStateName.js";
 import SoundName from "../enums/SoundName.js";
import { sounds, timer } from "../globals.js";
import Tile from "../services/Tile.js";
import Map from "../services/Map.js";
import GameEntity from "./GameEntity.js";
import MonsterIdlingState from "../states/monster/MonsterIdlingState.js";
import MonsterWalkingState from "../states/monster/MonsterWalkingState.js";

export default class Monster extends GameEntity {
	static WIDTH = 32;
	static HEIGHT = 32;

	/**
	 * The monster in the game that randomly
	 * walk around the arena and can damage the player.
	 */
	constructor(sprites) {
		super();

		this.sprites = sprites;
		this.position.x = getRandomPositiveInteger(Map.LEFT_EDGE, Map.RIGHT_EDGE - Tile.SIZE);
		this.position.y = getRandomPositiveInteger(Map.TOP_EDGE, Map.BOTTOM_EDGE - Tile.SIZE);
		this.dimensions.x = Monster.WIDTH;
		this.dimensions.y = Monster.HEIGHT;
        this.isAI = true;
        this.canTakeDamage = true;
	}

	receiveDamage(damage) {
        if (this.canTakeDamage){
            this.canTakeDamage = false
            this.health -= damage;
            if (this.health <= 0)
                this.isDead = true;
			sounds.stop(SoundName.Hit);
            sounds.play(SoundName.Hit);
            timer.wait(.25, () => { this.canTakeDamage = true; })
        }

	}

	initializeStateMachine(animations) {
		const stateMachine = new StateMachine();

		stateMachine.add(MonsterStateName.Idling, new MonsterIdlingState(this, animations[MonsterStateName.Idling]));
		stateMachine.add(MonsterStateName.Walking, new MonsterWalkingState(this, animations[MonsterStateName.Walking]));

		stateMachine.change(MonsterStateName.Walking);

		return stateMachine;
	}
}