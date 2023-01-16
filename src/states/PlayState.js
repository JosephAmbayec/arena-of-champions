import State from "../../lib/State.js";
import SoundName from "../enums/SoundName.js";
import ChampionName from "../enums/ChampionName.js";
import { keys, stateStack, mapDefinition, sounds} from "../globals.js"
import Map from "../services/Map.js"
import RoundState from "./RoundState.js";
import AINoroChampion from "../entities/AINoroChampion.js";
import NoroChampion from "../entities/NoroChampion.js";
import StateMachine from "../../lib/StateMachine.js";
import Hitbox from "../../lib/Hitbox.js";

export default class PlayState extends State {
	constructor(round) {
		super();
		this.round = round
	}

	enter() {
		if (this.round != null){
			this.roundState = new RoundState(this.round.mapDefinition);
			this.roundState.roundNumber = this.round.roundNumber;
			let tempChamp;
			switch (this.round.map.champion.championName){
				case ChampionName.Noro:
					tempChamp = new NoroChampion();
			}
			Object.assign(tempChamp, this.round.map.champion)
			let tempHitbox = new Hitbox();
			Object.assign(tempHitbox, this.round.map.champion.hitbox);
			tempChamp.stateMachine = tempChamp.initializeStateMachine();
			tempChamp.sprites = tempChamp.initializeSprites();
			tempChamp.hitbox = tempHitbox;
			tempChamp.resetBooleans();
			stateStack.pushWithProperty(this.roundState, tempChamp);
		}
		else
			stateStack.push(new RoundState(mapDefinition))
	}

	exit() {
		
	}
}
