import State from "../../lib/State.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	DEBUG,
	images,
	timer,
	mapDefinition,
	stateStack
} from "../globals.js";
import Map from "../services/Map.js";
import HorizontalMenu from "../user-interface/elements/HorizontalMenu.js";
import Menu from "../user-interface/elements/Menu.js";
import Panel from "../user-interface/elements/Panel.js";
import Textbox from "../user-interface/elements/Textbox.js";

export default class ShopState extends State{
    constructor(champion){
		super();
		this.champion = champion
		this.healthMenuItems = [
			{ text: "Upgrade Health", onSelect: () => this.addHealth() },
			{ text: "Upgrade Damage", onSelect: () => this.addDamage()},
			{ text: "Upgrade Speed", onSelect: () => this.addSpeed()},
			{ text: "Return to Battle!", onSelect: () => this.exitShop() }
			//{ text: "Remove", onSelect: () => this.removeHealth() }
		]
		this.menu = new Menu(8, 7, 6, 5, this.healthMenuItems, Menu.SHOP_MENU)
		this.currentStatsMenu = this.currentStats();
    }

	addHealth(){
		if (this.champion.experience - this.champion.xpCost >= 0){
			this.champion.experience -= this.champion.xpCost;
			this.champion.maxHealth += 10;
			this.champion.xpCost += 10;
			this.currentStatsMenu = this.currentStats();
			console.log("Health: " + this.champion.maxHealth)
		}
	}

	addDamage(){
		if (this.champion.experience - this.champion.xpCost >= 0){
			this.champion.experience -= this.champion.xpCost;
			this.champion.damage += 10;
			this.champion.xpCost += 10;
			this.currentStatsMenu = this.currentStats();
			console.log("Damage: " + this.champion.damage)
		}
	}

	addSpeed(){
		if (this.champion.experience - this.champion.xpCost >= 0){
			this.champion.experience -= this.champion.xpCost;
			this.champion.speed += 10;
			this.champion.xpCost += 10;
			this.currentStatsMenu = this.currentStats();
			console.log("Speed: " +this.champion.speed)
		}
	}

	exitShop(){
		stateStack.pop();
		stateStack.top().enter(this.champion);
	}

	currentStats(){
		return new Textbox(16, 7, 9, 5, `Current Max Health: ${this.champion.maxHealth}\nCurrent Damage: ${this.champion.damage}\nCurrent Speed: ${this.champion.speed}\nRemaining XP: ${this.champion.experience}\nUpgrade Cost: ${this.champion.xpCost}`, { isAdvanceable: false, borderColour: 'rgba(0, 0, 0, 1)', panelColour: "rgba(74, 74, 74, 0.47)", fontColour: "#FFFFFF"});
	}
	
	enter() {

	}

	exit() {
		
	}

	update(dt){
		this.menu.update()
	}

	render(){
		context.save()
		this.menu.render()
		this.currentStatsMenu.render()
		context.restore
	}

}