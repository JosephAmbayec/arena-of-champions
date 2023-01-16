import State from "../../../lib/State.js";
import Animation from "../../../lib/Animation.js";
import { keys, images, timer } from "../../globals.js";
import ChampionStateName from "../../enums/ChampionStateName.js";
import GameEntity from "../../entities/GameEntity.js";
import Tile from "../../services/Tile.js";
import Map from "../../services/Map.js";
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import Direction from "../../enums/Direction.js";

export default class ChampionWalkingState extends State {
    constructor(champion, animation, isAI = false){
        super();
        this.champion = champion;
        this.animation = animation;
		this.isAI = isAI;
    }

    enter(){
        this.champion.currentAnimation = this.animation[this.champion.direction];
		if (this.isAI)
			this.aiMovement();
      //  this.handleMovement();
    }

    update(dt){
		if (!this.isAI){
        	this.handleMovement(dt);
			this.champion.handleAbilities()
		}
    }

	aiMovement(){
	//	timer.tween(this.champion.position, ['x, y'], [ this.finalX, this.finalY ], 2)
	}

	handleMovement(dt) {
		this.champion.currentAnimation = this.animation[this.champion.direction];
		if (keys.s) {
		//	this.champion.direction = Direction.Down;
			if (!(keys.d && keys.a) && (keys.d || keys.a)){
				this.champion.position.y  += this.champion.speed * dt / 2;
			}
			else
            	this.champion.position.y  += this.champion.speed * dt;

			if (this.champion.position.y + this.champion.dimensions.y >= Map.BOTTOM_EDGE) {
				this.champion.position.y = Map.BOTTOM_EDGE - this.champion.dimensions.y;
			}
		}
		if (keys.d) {
            this.champion.direction = Direction.Right;
            this.champion.position.x  += this.champion.speed * dt;

                if (this.champion.position.x + this.champion.dimensions.x >= Map.RIGHT_EDGE) {
                    this.champion.position.x = Map.RIGHT_EDGE - this.champion.dimensions.x;
                }
		}
		if (keys.w) {
			//this.champion.direction = Direction.Up;
			if (!(keys.d && keys.a) && (keys.d || keys.a)){
				this.champion.position.y  -= this.champion.speed * dt / 2;
			}
			else
				this.champion.position.y  -= this.champion.speed * dt;

			if (this.champion.position.y <= Map.TOP_EDGE - this.champion.dimensions.y) {
				this.champion.position.y = Map.TOP_EDGE - this.champion.dimensions.y;
			}
		}
		if (keys.a) {
			this.champion.direction = Direction.Left;
			this.champion.position.x  -= this.champion.speed * dt;

			if (this.champion.position.x <= Map.LEFT_EDGE) {
				this.champion.position.x = Map.LEFT_EDGE;
			}
		}
		if (!keys.s && !keys.d && !keys.w && !keys.a) {
			this.champion.changeState(ChampionStateName.Idling);
		}
	}
}