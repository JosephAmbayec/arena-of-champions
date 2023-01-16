import Colour from "../enums/Colour.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import NoroChampion from "../entities/NoroChampion.js";
import AINoroChampion from "../entities/AINoroChampion.js";
import ImageName from "../enums/ImageName.js";
import Tile from "./Tile.js";
import Layer from "./Layer.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	DEBUG,
	images,
	timer
} from "../globals.js";
import ChampionName from "../enums/ChampionName.js";
import ChampionStateName from "../enums/ChampionStateName.js";
import MonsterFactory from "./MonsterFactory.js";
import MonsterType from "../enums/MonsterType.js";
import { pickRandomElement } from "../../lib/RandomNumberHelpers.js";
import Champion from "../entities/Champion.js";
import Monster from "../entities/Monster.js";
import MegaBat from "../entities/MegaBat.js";
import XPValues from "../enums/XPValues.js";

export default class Map {
	static LEFT_EDGE = Tile.SIZE;
	static RIGHT_EDGE = CANVAS_WIDTH - Tile.SIZE;
	static TOP_EDGE = Tile.SIZE * 2;
	static BOTTOM_EDGE = CANVAS_HEIGHT - Tile.SIZE * 2;
	static PLAYER_SPAWN =  new Vector(70, 323);
	static AI_SPAWN = new Vector(850, 323);
	/**
	 * The collection of layers, sprites,
	 * and characters that comprises the world.
	 *
	 * @param {object} mapDefinition JSON from Tiled map editor.
	 */
	constructor(mapDefinition, champion = null) {
		const sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Tiles),
			Tile.SIZE,
			Tile.SIZE,
		);

		this.bottomLayer = new Layer(mapDefinition.layers[Layer.BOTTOM], sprites);
        this.shadowLayer = new Layer(mapDefinition.layers[Layer.SHADOW], sprites);
        this.middleLayer = new Layer(mapDefinition.layers[Layer.MIDDLE], sprites);
		this.collisionLayer = new Layer(mapDefinition.layers[Layer.COLLISION], sprites);
		
		this.topLayer = new Layer(mapDefinition.layers[Layer.TOP], sprites);
		if (champion == null)
			this.champion = new NoroChampion({ position: Map.PLAYER_SPAWN, speed: Champion.DEFAULT_SPEED }, this);
		else {
			this.champion = champion;
			this.champion.health = champion.maxHealth;
		}
			

		this.aiChampion = new AINoroChampion({ position: Map.AI_SPAWN, speed: Champion.DEFAULT_SPEED }, this);
		this.entities = [];
		this.entities.push(this.champion);
		this.entities.push(this.aiChampion);
		this.objects = []
		this.addHitboxes();
	}

	update(dt) {
		timer.updateTasks(dt)
		timer.removeFinishedTasks();
		this.updateEntities(dt);
		this.cleanUpEntities();

		
		this.objects.forEach((object) => {
			if (object != null && object.didCollide(this.champion.hitbox)) {
				if (object.isCollidable) {
					object.onCollision(this.champion);
				}

			}
			if (object != null && object.didCollide(this.aiChampion.hitbox)) {
				if (object.isCollidable) {
					object.onCollision(this.aiChampion);
					this.aiChampion.didCollide = true
				}

			}
		});



	}

	render() {
		this.bottomLayer.render();
        this.shadowLayer.render();
        this.middleLayer.render();
		this.collisionLayer.render();
		this.renderEntities();
		this.topLayer.render();

		if (DEBUG) {
		//	Map.renderGrid();
		}
	}

	addHitboxes(){
		let tileHitboxes = [];
		for (let x = 0; x < CANVAS_WIDTH / Tile.SIZE; x++){
			for (let y = 0; y < CANVAS_HEIGHT / Tile.SIZE; y++){
				let temp = this.collisionLayer.addHitbox(x, y)
				if (temp != null)
				tileHitboxes.push(temp)
			}
		}
		this.objects = tileHitboxes;
	}

	/**
	 * Draws a grid of squares on the screen to help with debugging.
	 */
	static renderGrid() {
		context.save();
		context.strokeStyle = Colour.White;

		for (let y = 1; y < CANVAS_HEIGHT / Tile.SIZE; y++) {
			context.beginPath();
			context.moveTo(0, y * Tile.SIZE);
			context.lineTo(CANVAS_WIDTH, y * Tile.SIZE);
			context.closePath();
			context.stroke();

			for (let x = 1; x < CANVAS_WIDTH / Tile.SIZE; x++) {
				context.beginPath();
				context.moveTo(x * Tile.SIZE, 0);
				context.lineTo(x * Tile.SIZE, CANVAS_HEIGHT);
				context.closePath();
				context.stroke();
			}
		}

		context.restore();
	}

	addMonsters(monsterCount){
		const sprites = Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.Monsters), Tile.SIZE, Tile.SIZE)
		const monsterType = MonsterType[pickRandomElement(Object.keys(MonsterType))];
		
		if (monsterType == MonsterType.MegaBat)
			monsterCount = Math.ceil(monsterCount / 2)

		for (let i = 0; i < monsterCount; i++) {
			this.entities.push(MonsterFactory.createInstance(monsterType, sprites));
		}
	}

	renderEntities(){
		this.entities.forEach(entity => {
			entity.render(entity.position.x, entity.position.y);
		})
	}

	updateEntities(dt){
		this.entities.forEach(entity => {
			entity.update(dt);
			if (entity instanceof Champion && !(entity instanceof AINoroChampion)){
				if (entity.hitbox.didCollide(this.aiChampion.abilityHitbox)) {
					if (!entity.isDying){
						entity.receiveDamage(this.aiChampion.damage)
					}
					this.champion = entity;
				}
			}
			else if (entity instanceof Champion){
				if (entity.hitbox.didCollide(this.champion.abilityHitbox)) {
					if (!entity.isDying){
						entity.receiveDamage(this.champion.damage)
					}
				}
			}
			else if (entity instanceof Monster){
				if (entity.hitbox.didCollide(this.champion.abilityHitbox))
					entity.receiveDamage(this.champion.damage)
				if (entity.hitbox.didCollide(this.champion.hitbox)){
					if (!this.champion.isDying){
						if (this.champion.canTakeDamage){
							this.champion.changeState(ChampionStateName.Hit)
							this.champion.receiveDamage(entity.damage)
						}
					}
					else
						this.champion.changeState(ChampionStateName.Dying)
				}
			}

			if (entity === this.champion) {
				return;
			}
		})
	}

	cleanUpEntities(){
		this.grantXP();
		this.entities = this.entities.filter((entity) => !entity.isDead);
		this.entities = this.entities.filter((entity) => entity != null);
		
	}

	grantXP(){
		let addedXP = 0;
		this.entities.forEach((entity) => {
			if (entity.isAI && entity.isDead){
				if (entity instanceof MegaBat)
					addedXP += XPValues.MegaBat;
				else if (entity instanceof AINoroChampion)
					addedXP += XPValues.Champion + (entity.level * 5);
				else
					addedXP += XPValues.Bat;
			}
		})
		this.champion.experience += addedXP;
	}
}