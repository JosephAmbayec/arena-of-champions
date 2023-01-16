import State from "../../../lib/State.js";
import Animation from "../../../lib/Animation.js";
import { keys, images } from "../../globals.js";
import ChampionStateName from "../../enums/ChampionStateName.js";
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import Direction from "../../enums/Direction.js";
import Hitbox from "../../../lib/Hitbox.js";

export default class ChampionAbilityCastingState extends State {
    constructor(champion, animation, sprites = [], abilityDefinition = {}){
        super();
        this.champion = champion;
        this.animation = animation;
        if (sprites.length > 0)
            this.sprites = sprites
        this.abilityDefinition = abilityDefinition;
        this.champion.abilityHitbox = new Hitbox(0,0,0,0)
    }

    enter(){
        this.champion.positionOffset = { x: -this.champion.dimensions.x/2, y: -this.champion.dimensions.y/2 };  
        this.champion.sprites = this.sprites
        this.champion.currentAnimation = this.animation[this.champion.direction];
        this.champion.currentFrame = 0;
    }

    exit() {
        this.champion.positionOffset = { x: 0, y: 0 };
	
        this.champion.sprites = this.champion.initializeSprites();
    }

    update(){
        if (this.champion.currentAnimation.isDone()){
            this.champion.currentAnimation.refresh();
            this.champion.abilityHitbox.set(0, 0, 0, 0);
            this.champion.changeState(ChampionStateName.Idling)
        }

        if (this.champion.currentAnimation.isHalfwayDone()){
            this.setAbilityHitbox();
        }
    }

    setAbilityHitbox(){
        let hitboxX, hitboxY, hitboxWidth, hitboxHeight;

		// The magic numbers here are to adjust the hitbox offsets to make it line up with the sword animation.
		if (this.champion.direction === Direction.Left) {
			hitboxWidth = this.champion.dimensions.x;
			hitboxHeight = this.champion.dimensions.x * 1.25;
			hitboxX = this.champion.position.x - hitboxWidth / 4;
			hitboxY = this.champion.position.y - this.champion.dimensions.y / 3;
		}
		else if (this.champion.direction === Direction.Right) {
			hitboxWidth = this.champion.dimensions.x;
			hitboxHeight = this.champion.dimensions.x * 1.25;
			hitboxX = this.champion.position.x + hitboxWidth / 4;
			hitboxY = this.champion.position.y - this.champion.dimensions.y / 3;
		}

		this.champion.abilityHitbox.set(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
    }
}