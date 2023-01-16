import State from "../../../lib/State.js";
import Animation from "../../../lib/Animation.js";
import { keys, images } from "../../globals.js";
import ChampionStateName from "../../enums/ChampionStateName.js";
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import Direction from "../../enums/Direction.js";
import Hitbox from "../../../lib/Hitbox.js";

export default class ChampionIdlingState extends State {
    constructor(champion, animation, isAI = false){
        super();
        this.champion = champion;
        this.animation = animation;
        this.isAI = isAI;
    }

    enter(){
        this.champion.currentAnimation = this.animation[this.champion.direction];
    }

    update(){
        this.champion.currentAnimation = this.animation[this.champion.direction];
        this.champion.abilityHitbox = new Hitbox(0,0,0,0, 'blue')
        if (!this.isAI){
            if (keys.a)
                this.champion.direction = Direction.Left
            else if (keys.d)
                this.champion.direction = Direction.Right
            if (keys.w || keys.s || keys.d || keys.a){
                this.champion.changeState(ChampionStateName.Walking)
            }
        }
    }
}