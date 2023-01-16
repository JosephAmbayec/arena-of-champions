/**
 * Arena Of Champions
 *
 * Joseph Ambayec
 *
 *
 * Asset sources
 * Bat and Samurai:
 * https://gikeota.itch.io/samurai
 * 
 * Tileset:
 * https://cainos.itch.io/pixel-art-top-down-basic
 * 
 * Fonts:
 * https://www.1001freefonts.com/aetherius.font
 * https://www.1001freefonts.com/caesar-dressing.font
 * 
 * Sounds:
 * https://www.fesliyanstudios.com/royalty-free-music/download/8-bit-nostalgia/2289
 * 
 */

import GameStateName from "./enums/GameStateName.js";
import Game from "../lib/Game.js";
import {
	canvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	fonts,
	images,
	keys,
	sounds,
	stateStack,
} from "./globals.js";
import PlayState from "./states/PlayState.js";
import GameOverState from "./states/GameOverState.js";
import VictoryState from "./states/VictoryState.js";
import TitleScreenState from "./states/TitleScreenState.js";
import Vector from "../lib/Vector.js";

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1'); // Allows the canvas to receive user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);

// Fetch the asset definitions from config.json.
const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
} = await fetch('./config/assets.json').then((response) => response.json());

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);



// Add all the states to the state machine.
stateStack.push(new TitleScreenState());

// Add event listeners for player input.
canvas.addEventListener('keydown', event => {
	keys[event.key] = true;
});

canvas.addEventListener('keyup', event => {
	keys[event.key] = false;
});

canvas.addEventListener('mousemove', function(e) {
    keys.mousemove = e
	getCursorPosition(canvas, e)
})

function getCursorPosition(canvas, e) {
    const rect = canvas.getBoundingClientRect()
    var x = (e.clientX - rect.left) * (canvas.width / rect.width);
    var y = (e.clientY - rect.top) * (canvas.height / rect.height);

	keys[e.type] = new Vector(x,y)
}

const game = new Game(stateStack, context, canvas.width, canvas.height);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();
