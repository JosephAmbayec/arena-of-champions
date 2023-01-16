import MonsterStateName from "../enums/MonsterStateName.js";
import Direction from "../enums/Direction.js";
import Animation from "../../lib/Animation.js";
import Monster from "./Monster.js";
import { timer } from "../globals.js";

export default class MegaBat extends Monster {
	static SPEED = 50;
	static SCALE = 2;

	constructor(sprites) {
		super(sprites);
		this.speed = MegaBat.SPEED;
        this.damage = 15;
        this.health = 30;
		this.dimensions.x *= MegaBat.SCALE;
		this.dimensions.y *= MegaBat.SCALE;

		const animations = {
			[MonsterStateName.Idling]: {
                [Direction.Up]: new Animation([0, 1, 2], .2, 1),
				[Direction.Down]: new Animation([0, 1, 2], .2, 1),
				[Direction.Left]: new Animation([0, 1, 2], .2, 1),
				[Direction.Right]: new Animation([0, 1, 2], .2, 1),
			},
			[MonsterStateName.Walking]: {
                [Direction.Up]: new Animation([0, 1, 2], .2, 1),
				[Direction.Down]: new Animation([0, 1, 2], .2, 1),
				[Direction.Left]: new Animation([0, 1, 2], .2, 1),
				[Direction.Right]: new Animation([0, 1, 2], .2, 1),
			}
		};

		this.stateMachine = this.initializeStateMachine(animations);
        this.nextFrame = true;
	}

	update(dt){
		super.update(dt);
		this.hitbox.set(this.position.x, this.position.y + (this.dimensions.y / 5), this.dimensions.x, this.dimensions.y / 1.5)
	}

    render(x, y) {
        //this.animation = new Animation([0, 1, 2], .2, 1)
        if (this.nextFrame){
            this.nextFrame = false
            timer.wait(.1, () => {
                this.currentFrame++;
                this.nextFrame = true;
            })
        }
        super.render(x, y, { x: MegaBat.SCALE, y: MegaBat.SCALE})
    }
}