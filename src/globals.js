import Fonts from "../lib/Fonts.js";
import Images from "../lib/Images.js";
import Sounds from "../lib/Sounds.js";
import StateStack from "../lib/StateStack.js";
import Timer from '../lib/Timer.js'

export const canvas = document.createElement('canvas');
export const context = canvas.getContext('2d') || new CanvasRenderingContext2D();

// Replace these values according to how big you want your canvas.
export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 640;

export const keys = {};
export const images = new Images(context);
export const fonts = new Fonts();
export const stateStack = new StateStack();
export const timer = new Timer();
export const sounds = new Sounds();

export const DEBUG = false;

export const mapDefinition = await fetch("./config/map.json").then((response) => response.json());