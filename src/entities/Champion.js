import StateMachine from "../../lib/StateMachine.js";
import ChampionStateName from "../enums/ChampionStateName.js";
import GameEntity from "./GameEntity.js";
import Vector from "../../lib/Vector.js";
import Sprite from "../../lib/Sprite.js";
import { context, images, timer, sounds } from "../globals.js";
import ChampionIdlingState from "../states/champion/ChampionIdlingState.js";
import ImageName from "../enums/ImageName.js";
import ChampionName from "../enums/ChampionName.js";
import ChampionWalkingState from "../states/champion/ChampionWalkingState.js";
import SoundName from "../enums/SoundName.js";

export default class Champion extends GameEntity{
    static DEFAULT_SPEED = 100;
    constructor(entityDefinition = {}){
        super(entityDefinition);
        this.dimensions = new Vector(GameEntity.WIDTH, GameEntity.HEIGHT);
        this.sprites = []
        this.stateMachine = null;
        this.currentAnimation //= this.stateMachine.currentState.animation[this.direction];
        this.maxHealth = 100;
        this.allowAbility = true;
        this.health = this.maxHealth;
        this.damage = 10;
        this.isDying = false;
        this.experience = 0;
        this.xpCost = 10;
        this.canTakeDamage = true;
    }

    update(dt){
        super.update(dt);
        this.currentAnimation.update(dt);
        this.stateMachine.currentState.update(dt);

        this.currentFrame = this.currentAnimation.getCurrentFrame();
    }

    render(offset = { x: 0, y: 0 }){
		const x = this.position.x + offset.x;
		const y = this.position.y + offset.y;
        super.render(x,y);
    }

    receiveDamage(damage) {
        if (this.canTakeDamage && !this.isDying){
            this.stateMachine.change(ChampionStateName.Hit)
            sounds.play(SoundName.Hit);
            this.health -= damage;    
            this.canTakeDamage = false;        
        }
        if (this.isDying)
            this.stateMachine.change(ChampionStateName.Dying)
        timer.wait(1, () => { this.canTakeDamage = true; });
	}

    resetBooleans(){
        this.allowAbility = true;
        this.health = this.maxHealth;
        this.isDying = false;
        this.canTakeDamage = true;
    }
}