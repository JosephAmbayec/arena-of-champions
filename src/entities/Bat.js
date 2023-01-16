import MonsterStateName from "../enums/MonsterStateName.js";
import Direction from "../enums/Direction.js";
import Animation from "../../lib/Animation.js";
import Monster from "./Monster.js";
import { timer } from "../globals.js";

export default class Bat extends Monster {
	static SPEED = 50;

	constructor(sprites) {
		super(sprites);
		this.speed = Bat.SPEED;
        this.damage = 5;
        this.health = 20;

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

    render(x, y) {
        //this.animation = new Animation([0, 1, 2], .2, 1)
        if (this.nextFrame){
            this.nextFrame = false
            timer.wait(.1, () => {
                this.currentFrame++;
                this.nextFrame = true;
            })
        }
        super.render(x, y)
    }
}