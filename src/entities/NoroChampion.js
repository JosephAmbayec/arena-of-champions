import StateMachine from "../../lib/StateMachine.js";
import ChampionStateName from "../enums/ChampionStateName.js";
import GameEntity from "./GameEntity.js";
import Vector from "../../lib/Vector.js";
import Sprite from "../../lib/Sprite.js";
import { context, images, keys, canvas, timer, DEBUG, CANVAS_HEIGHT, CANVAS_WIDTH, sounds } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import ChampionWalkingState from "../states/champion/ChampionWalkingState.js";
import Champion from "./Champion.js";
import Animation from "../../lib/Animation.js";
import Direction from "../enums/Direction.js";
import ChampionIdlingState from "../states/champion/ChampionIdlingState.js";
import ChampionAbilityCastingState from "../states/champion/ChampionAbilityCastingState.js";
import Hitbox from "../../lib/Hitbox.js";
import Map from "../services/Map.js";
import ChampionDamageTaken from "../states/champion/ChampionDamageTakenState.js";
import ChampionDyingState from "../states/champion/ChampionDyingState.js";
import ChampionName from "../enums/ChampionName.js";
import SoundName from "../enums/SoundName.js";
import Tile from "../services/Tile.js";

export default class NoroChampion extends Champion{
    constructor(entityDefinition = {}){
        super(entityDefinition);
        this.dimensions = new Vector(GameEntity.WIDTH, GameEntity.HEIGHT);

        this.idleAnimation = { 
                [Direction.Right]: new Animation([10, 11, 12, 13, 14, 15, 16, 17], .2), 
                [Direction.Left]: new Animation([30, 31, 32, 33, 34, 35, 36, 37], .2)
        } 
        this.walkingAnimation = { 
                [Direction.Right]: new Animation([0, 1, 2, 3, 4, 5, 6, 7], .1),
                [Direction.Left]: new Animation([20, 21, 22, 23, 24, 25, 26, 27], .1)
        }
        this.abilityCastingAnimation = { 
            [Direction.Right]: new Animation([0, 1, 2, 3, 4], .1, 1),
            [Direction.Left]: new Animation([5, 6, 7, 8, 9], .1, 1)
        }
        this.hitAnimation = { 
            [Direction.Right]: new Animation([40, 41, 42, 43, 44], .1, 1),
            [Direction.Left]:  new Animation([40, 41, 42, 43, 44], .1, 1)
        }
        this.deathAnimation = {
            [Direction.Right]: new Animation([50, 51, 52, 53, 54, 55, 56, 57, 58, 59], .25, 1),
            [Direction.Left]:  new Animation([50, 51, 52, 53, 54, 55, 56, 57, 58, 59], .25, 1)
        }
        this.sprites = this.initializeSprites()
        this.stateMachine = this.initializeStateMachine();

        
        this.currentAnimation = this.stateMachine.currentState.animation[this.direction];
        this.abilityHitbox = new Hitbox(0, 0, 0, 0, 'blue');

        this.positionOffset = { x: 0, y: 0 };

        this.allowSword = true; 
        this.isDead = false;
        this.isAI = false;
        this.championName = ChampionName.Noro;
        this.dashRange = 100;
        this.abilityCooldown = .15;
        this.dashCooldown = 3;
    }

    update(dt){

        super.update(dt);
        this.currentAnimation.update(dt);
        this.stateMachine.currentState.update(dt);

        this.currentFrame = this.currentAnimation.getCurrentFrame();
        if (!this.stateMachine.currentState.isAI)
            this.handleAbilities()

        if (this.isDying)
            this.stateMachine.change(ChampionStateName.Dying)
    }

    render() {
        super.render(this.positionOffset);
        if (DEBUG)
            this.abilityHitbox.render(context)
    }

    initializeStateMachine(){
        const stateMachine = new StateMachine();
        let swordSprites = this.initializeSwordSprites();
        stateMachine.add(ChampionStateName.Idling, new ChampionIdlingState(this, this.idleAnimation));
        stateMachine.add(ChampionStateName.Walking, new ChampionWalkingState(this, this.walkingAnimation));
        stateMachine.add(ChampionStateName.Hit, new ChampionDamageTaken(this, this.hitAnimation)); 
        stateMachine.add(ChampionStateName.AbilityCasting, new ChampionAbilityCastingState(this, this.abilityCastingAnimation, swordSprites));
        stateMachine.add(ChampionStateName.Dying, new ChampionDyingState(this, this.deathAnimation));
        stateMachine.change(ChampionStateName.Idling, new ChampionIdlingState(this, this.idleAnimation));
        return stateMachine;
    }

    initializeSprites() {
		return Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.NoroSprites),
			Tile.SIZE,
			Tile.SIZE,
		);
	}

    initializeSwordSprites(){
        return Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.NoroSword),
			Tile.SIZE * 2,
			Tile.SIZE * 2,
		);
    }

    handleAbilities(){
        if (keys.e && this.allowAbility){
            let deltaX = Math.abs(this.position.x - keys.mousemove.x)
            let deltaY = Math.abs(this.position.y - keys.mousemove.y)
            let x;
            let y;

            if (deltaX > this.dashRange){
                if (this.position.x < keys.mousemove.x)
                    x = this.position.x + this.dashRange;
                else
                    x = this.position.x - this.dashRange;
            }
            else
                x = keys.mousemove.x - this.dimensions.x / 2;

            if (deltaY > this.dashRange){
                if (this.position.y < keys.mousemove.y)
                    y = this.position.y + this.dashRange;
                else
                    y = this.position.y - this.dashRange;
            }
 
            else 
                y = keys.mousemove.y - this.dimensions.y / 2;    
            


            if (this.validDashPosition(x, y)){
                sounds.play(SoundName.Dash);
                timer.tween(this.position, [ 'x', 'y' ], [x, y], (.1 * Champion.DEFAULT_SPEED/this.speed), () => { timer.wait(this.dashCooldown, () => 
                    { 
                        this.allowAbility = true; 
                    }) 
                });
                keys.e = false;
                this.allowAbility = false;
            }
            else
                this.allowAbility = true;

        }

        if (keys[' '] && this.allowSword){
            this.allowSword = false;
            timer.wait(this.abilityCooldown, () => { this.allowSword = true; this.abilityHitbox.set(0, 0, 0, 0); })
            this.stateMachine.change(ChampionStateName.AbilityCasting)
            
        }
    }

    validDashPosition(x, y){
        return (x > Map.LEFT_EDGE && x < Map.RIGHT_EDGE) && (y > Map.TOP_EDGE && y < Map.BOTTOM_EDGE)
    }

    receiveDamage(damage){
        super.receiveDamage(damage)
        if (this.health <= 0){
            this.changeState(ChampionStateName.Dying)
            this.canTakeDamage = false
            return;
        }
            
    }
}