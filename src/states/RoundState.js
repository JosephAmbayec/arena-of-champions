import State from "../../lib/State.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	DEBUG,
	images,
	timer,
	mapDefinition,
	stateStack,
	keys
} from "../globals.js";
import Map from "../services/Map.js";
import GameOverState from "./GameOverState.js";
import MenuState from "./MenuState.js";
import ShopState from "./ShopState.js";
import TransitionState from "./TransitionState.js";
import GameStateName from "../enums/GameStateName.js";

export default class RoundState extends State{
    constructor(mapDefinition){
		super();
		this.mapDefinition = mapDefinition
		this.roundNumber = 1;
    }
	
	enter(champion) {
		if (champion != null){
			champion.position.x = 70;
			champion.position.y = 323;
		}

		this.map = new Map(mapDefinition, champion);
		this.map.aiChampion.setArmorRating(this.roundNumber + 1);
		this.map.aiChampion.rollDice();
		this.map.aiChampion.getRandomUpgrade(this.roundNumber);
		this.map.addMonsters(this.roundNumber)
		
	}

	exit() {

	}

	update(dt){
		this.map.update(dt)
		if (this.map.entities.length == 1 && !this.map.entities[0].isAI){
			this.map.entities[0].experience += 50 + (5 * this.roundNumber);

			stateStack.push(new ShopState(this.map.entities[0]))
			this.roundNumber++;
		}
		else if (this.checkGameOver()){
			stateStack.pushWithProperty(new TransitionState(), { fromState: this,
				toState: new GameOverState()
			})
		}
		if (keys.Escape){
			keys.Escape = false;
			stateStack.push(new MenuState(this));
		}
	}

	checkGameOver(){
		let isOver = true;
		this.map.entities.forEach(entity => {
			if (!entity.isAI)
				isOver = false;
		})
		return isOver;
	}

	render(){
		this.map.render()
		// Render UI
		context.save();
		
		context.font = '32px Aetherius';
		context.fillStyle = 'white';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.strokeStyle = 'black'
		context.lineWidth = .5;
		
		context.fillText(`XP: ${this.map.champion.experience }`, CANVAS_WIDTH - 70, 15);
		context.fillText(`HP: ${this.map.champion.health}/${this.map.champion.maxHealth}`, 75, 15);
		context.fillText(`Round ${this.roundNumber}`, CANVAS_WIDTH / 2, 15);

		context.strokeText(`XP: ${this.map.champion.experience }`, CANVAS_WIDTH - 70, 15);
		context.strokeText(`HP: ${this.map.champion.health}/${this.map.champion.maxHealth}`, 75, 15);
		context.strokeText(`Round ${this.roundNumber}`, CANVAS_WIDTH / 2, 15);

		context.restore();
	}

}