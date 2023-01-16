import State from "../../lib/State.js";
import { 	
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
	context,
	images,
	keys,
	sounds,
	stateStack,
	timer, } from "../globals.js";
import PlayState from "./PlayState.js";
import Menu from "../user-interface/elements/Menu.js"
import TransitionState from "./TransitionState.js";
import SoundName from "../enums/SoundName.js";

export default class TitleScreenState extends State {
	constructor() {
		super();
		const items = [
			{ text: "Play", onSelect: () => this.play() },
			{ text: "Load", onSelect: () => this.load() }
		]
		this.playState = new PlayState(null);
		this.menu = new Menu(((CANVAS_WIDTH / 32)/2) - 2.5, ((CANVAS_HEIGHT / 32)/2), 5, 5, items, Menu.TITLE_SCREEN_MENU)
	}

	enter() {
	//	console.log("hello")
	sounds.stop(SoundName.Main)
	sounds.play(SoundName.Main);
	}

	exit() {
		
	}

	update(){
		this.menu.update();
		//if (keys.Enter){
		//	this.play()
	//	}
		
	}

	render(){
		this.menu.render();
		context.save();
		context.font = '60px Aetherius';
		context.fillStyle = 'FireBrick';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Arena of Champions', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
		context.restore();

	}

	play(){
		stateStack.pushWithProperty(new TransitionState(), { fromState: this,
			toState: this.playState
		})
	}

	load(){
		this.playState = new PlayState(JSON.parse(localStorage.getItem("round")))
		stateStack.pushWithProperty(new TransitionState(), { fromState: this,
			toState: this.playState
		})
	}
}
