import MonsterType from "../enums/MonsterType.js";
import Bat from "../entities/Bat.js";
import MegaBat from "../entities/MegaBat.js";
/**
 * Encapsulates all definitions for instantiating new enemies.
 */
export default class MonsterFactory {
	/**
	 * @param {string} type A string using the EnemyType enum.
	 * @param {array} sprites The sprites to be used for the enemy.
	 * @returns An instance of an enemy specified by EnemyType.
	 */
	static createInstance(type, sprites) {
		switch (type) {
			case MonsterType.Bat:
				return new Bat(sprites);
			case MonsterType.MegaBat:
				return new MegaBat(sprites)
		}
	}
}