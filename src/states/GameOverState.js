import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import TitleScreenState from "./TitleScreenState.js";
//import SoundName from "../enums/SoundName.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	sounds,
	stateStack,
	timer
} from "../globals.js";

export default class GameOverState extends State {
	/**
	 * Displays a game over screen where the player
	 * can press enter to go back to the title screen.
	 */
	constructor() {
		super();
	}

	enter() {
		//sounds.stop(SoundName.Music);
	}

	update() {
		if (keys.Enter) {
			keys.Enter = false;
			this.exitGame();
		}
	}

	render() {
		context.save();
		context.fillStyle = 'black';
		context.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
		context.font = '60px Aetherius';
		context.fillStyle = 'crimson';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
		context.font = '30px Aetherius';
		context.fillStyle = 'white';	
		context.fillText('press enter to continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);
		context.restore();
	}

	exitGame(){
		while (!(stateStack.top() instanceof TitleScreenState)){
            stateStack.pop();
        }
		timer.clear();
	}
}