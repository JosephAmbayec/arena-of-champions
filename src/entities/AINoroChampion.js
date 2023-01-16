import StateMachine from "../../lib/StateMachine.js";
import ChampionStateName from "../enums/ChampionStateName.js";
import GameEntity from "./GameEntity.js";
import Vector from "../../lib/Vector.js";
import Sprite from "../../lib/Sprite.js";
import { context, images, keys, canvas, timer, DEBUG } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import ChampionWalkingState from "../states/champion/ChampionWalkingState.js";
import NoroChampion from "./NoroChampion.js";
import Animation from "../../lib/Animation.js";
import Direction from "../enums/Direction.js";
import ChampionIdlingState from "../states/champion/ChampionIdlingState.js";
import ChampionAbilityCastingState from "../states/champion/ChampionAbilityCastingState.js";
import Hitbox from "../../lib/Hitbox.js";
import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js"
import Map from "../services/Map.js";
import ChampionDamageTaken from "../states/champion/ChampionDamageTakenState.js";
import ChampionDyingState from "../states/champion/ChampionDyingState.js";

export default class AINoroChampion extends NoroChampion {
    static RUN_RANGE = 200;
    constructor(entityDefinition = {}, map){
        super(entityDefinition);
        this.stateMachine = this.initializeStateMachine();
        this.tookDamage = false;
        this.tweenTask = null;
        this.canTakeDamage = true;
        this.damage = 10;
        this.attackRange = 50;
        this.isAI = true;        
        this.map = map
        this.armor = 0.1 * Math.log(2); // Represents reduce damage taken
        this.level = 0;
    }

    update(dt){
        super.update(dt);
        if (this.isCloseToPlayer() && !this.isDying){
            if (this.map.champion.position.x < this.position.x)
                this.direction = Direction.Left;
            else
                this.direction = Direction.Right;
        }

        if (this.didCollide && !this.isDying){
            this.stateMachine.change(ChampionStateName.Idling);
            this.removeTweenTask();
            this.didCollide = false;
        }

        if(this.checkTweenTask())
            this.stateMachine.change(ChampionStateName.Walking)
    }

    render() {
        super.render();
        if (DEBUG)
            this.abilityHitbox.render(context)
    }

    initializeStateMachine(){
        const stateMachine = new StateMachine();
        let swordSprites = this.initializeSwordSprites();
        stateMachine.add(ChampionStateName.Idling, new ChampionIdlingState(this, this.idleAnimation, true));
        stateMachine.add(ChampionStateName.Walking, new ChampionWalkingState(this, this.walkingAnimation, true));
        stateMachine.add(ChampionStateName.Hit, new ChampionDamageTaken(this, this.hitAnimation));
        stateMachine.add(ChampionStateName.AbilityCasting, new ChampionAbilityCastingState(this, this.abilityCastingAnimation, swordSprites, true));
        stateMachine.add(ChampionStateName.Dying, new ChampionDyingState(this, this.deathAnimation))
        stateMachine.change(ChampionStateName.Idling, new ChampionIdlingState(this, this.idleAnimation, true));
        return stateMachine;
    }

    handleAbilities(){

    }

    rollDice(){
        let randomDuration = getRandomPositiveInteger(1, 2.5)
        if (!this.isCloseToPlayer()  && !this.isDying){
            // Roam mode
            let choice = getRandomPositiveInteger(1, 3)
         
            if (choice == 1){
                this.stateMachine.change(ChampionStateName.Idling)
            }
                
            else if (choice == 2 || choice == 3){
                let randomXY = this.randomPositionWithSpeed();
                randomDuration = randomXY[2]
    
                if (randomXY[0] > this.position.x)
                    this.direction = Direction.Right;
                else
                    this.direction = Direction.Left;
    
                this.stateMachine.states[ChampionStateName.Walking] = new ChampionWalkingState(this, this.walkingAnimation, true);
                this.stateMachine.change(ChampionStateName.Walking)
                this.tweenTask = timer.tween(this.position, [ 'x', 'y' ], [randomXY[0], randomXY[1]], randomDuration, () => { this.stateMachine.change(ChampionStateName.Idling)  });
            }
        }
        else if (!this.isDying){
            // Attack mode
            randomDuration = 0.5 
            if (this.position.y + this.attackRange > this.map.champion.position.y && (this.position.y - this.map.champion.position.y < 10)){
                this.stateMachine.states[ChampionStateName.Walking] = new ChampionWalkingState(this, this.walkingAnimation, true);
                this.stateMachine.change(ChampionStateName.Walking)
                this.tweenTask = timer.tween(this.position, [ 'x', 'y' ], [this.position.x, this.position.y + 2], 0.1, () => { });
               
            }
            this.stateMachine.change(ChampionStateName.AbilityCasting)
            this.currentFrame = 0;
        }
        if (!this.isDying)
            timer.wait(randomDuration, () => { this.rollDice(); })
    }

    randomPositionWithSpeed(){
        let x = getRandomPositiveInteger(this.position.x - AINoroChampion.RUN_RANGE, this.position.x + AINoroChampion.RUN_RANGE)
        let y = getRandomPositiveInteger(this.position.y - AINoroChampion.RUN_RANGE, this.position.y + AINoroChampion.RUN_RANGE)

        if (x < Map.LEFT_EDGE + this.dimensions.x || x > Map.RIGHT_EDGE - this.dimensions.x || y > Map.BOTTOM_EDGE - this.dimensions.y || y < Map.TOP_EDGE + this.dimensions.y)
            return this.randomPositionWithSpeed();

        let speed = (Math.abs(this.position.x - x) + Math.abs(this.position.y - y)) / this.speed;
        return [ x, y, speed ]
    }

    removeTweenTask(){
        timer.tasks.forEach((task) => {
            if (task == this.tweenTask)
                task.isDone = true;
        })
    }

    checkTweenTask(){
        timer.tasks.forEach((task) => {
            if (task == this.tweenTask)
                return true;
        })
    }

    isCloseToPlayer(){
        let deltaX = Math.abs(this.map.champion.position.x - this.position.x)
        let deltaY = Math.abs(this.map.champion.position.y - this.position.y)
        return deltaX < this.attackRange && deltaY < this.attackRange
    }

    receiveDamage(damage){
        this.removeTweenTask();
        damage *= (1 - this.armor);
        super.receiveDamage(damage)
        if (this.health <= 0){
            this.changeState(ChampionStateName.Dying)
            this.canTakeDamage = false
            return;
        }
    }

    setArmorRating(roundNumber){
        this.armor *= Math.log(roundNumber + 1)  
    }

    getRandomUpgrade(roundNumber){
        for (let i = 0; i < roundNumber; i++){
            let chance = getRandomPositiveInteger(0, 2);
            switch (chance){
                case 0:
                    this.health += 10;
                    break;
                case 1:
                    this.damage += 10;
                    break;
                case 2:
                    this.speed += 10;
                    break;
            }
        }
        this.level = roundNumber
        console.log(`AI Champions new stats: ${this.health} HP | ${this.damage} damage | ${this.speed} speed | ${this.armor} armor`)
    }

}