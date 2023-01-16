import State from "../../lib/State.js";
import { keys, stateStack, mapDefinition, context, CANVAS_HEIGHT, CANVAS_WIDTH, timer } from "../globals.js"
import Menu from "../user-interface/elements/Menu.js";
import RoundState from "./RoundState.js";
import GameStateName from "../enums/GameStateName.js";
import TitleScreenState from "./TitleScreenState.js";

export default class MenuState extends State {
    constructor(round) {
        super();
        this.round = round;
        const items = [
            { text: "Resume", onSelect: () => this.resume() },
            { text: "Save", onSelect: () => this.save() },
            { text: "Exit", onSelect: () => this.exitGame() }
        ]
        this.menu = new Menu(13.5, 8, 3, 3, items, Menu.SHOP_MENU)
        this.saved = false;
    }

    enter() {

    }

    exit() {

    }

    render() {
        this.menu.render()
        if (this.saved){
            context.save();
            context.font = '30px Aetherius';
            context.fillStyle = 'white';
            context.textBaseline = 'middle';
            context.textAlign = 'center';
            context.fillText(`Sucessfully Saved!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
            context.restore();

        }
    }

    update() {
        this.menu.update()
        if (keys.Escape){
            keys.Escape = false;
            this.resume();
        }
    }

    resume() {
        stateStack.pop();
    }

    save() {

        // Since my objects have circular dependencies, i need a replacer to replace circular dependencies.
        // https://stackoverflow.com/questions/11616630/how-can-i-print-a-circular-structure-in-a-json-like-format
        JSON.safeStringify = (obj, indent = 2) => {
            let cache = [];
            const retVal = JSON.stringify(
                obj,
                (key, value) =>
                    typeof value === "object" && value !== null
                        ? cache.includes(value)
                            ? undefined // Duplicate reference found, discard key
                            : cache.push(value) && value // Store value in our collection
                        : value,
                indent
            );
            cache = null;
            return retVal;
        };
        localStorage.setItem('round', JSON.safeStringify(this.round))
        this.saved = true;

    }

    exitGame() {
        while (!(stateStack.top() instanceof TitleScreenState)){
            stateStack.pop();
        }
        timer.clear();
    }
}
