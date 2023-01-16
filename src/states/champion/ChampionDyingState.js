import State from "../../../lib/State.js";
import Animation from "../../../lib/Animation.js";
import { keys, images } from "../../globals.js";
import ChampionStateName from "../../enums/ChampionStateName.js";
import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import Direction from "../../enums/Direction.js";
import Hitbox from "../../../lib/Hitbox.js";

export default class ChampionDyingState extends State {
    constructor(champion, animation){
        super();
        this.champion = champion;
        this.animation = animation;
    }

    enter(){
        this.champion.currentAnimation = this.animation[this.champion.direction];
        this.champion.isDying = true;
    }

    update(){
        if (this.champion.currentAnimation.isDone()){
            this.champion.isDead = true;
        }
    }
}