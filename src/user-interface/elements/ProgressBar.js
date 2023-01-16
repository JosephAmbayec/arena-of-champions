import UserInterfaceElement from "../UserInterfaceElement.js";
import Panel from "./Panel.js";
import Colour from "../../enums/Colour.js";
import { roundedRectangle } from "../../../lib/DrawingHelpers.js";
import { context, timer } from "../../globals.js";

export default class ProgressBar extends UserInterfaceElement {
    static PROGRESS_BAR_HEIGHT = .4;
    static BORDER_WIDTH = 5;
    constructor(width, x, y){
        super(x, y, width, ProgressBar.PROGRESS_BAR_HEIGHT);
        this.currentPercentage
        this.currentColor = Colour.Green;
        this.progressPercent = 0;
    }

    render(){
        context.save();
        this.renderBackground();
        this.renderForeground();
        context.restore();
    }

    
	renderBackground() {
		context.fillStyle = Colour.Black;
		roundedRectangle(
			context,
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			ProgressBar.BORDER_WIDTH,
			true,
			false
		);

        context.fillStyle = Colour.White;
        roundedRectangle(
            context,
            this.position.x + ProgressBar.BORDER_WIDTH / 2,
            this.position.y + ProgressBar.BORDER_WIDTH / 2,
            this.dimensions.x - ProgressBar.BORDER_WIDTH,
            this.dimensions.y - ProgressBar.BORDER_WIDTH,
            ProgressBar.BORDER_WIDTH,
            true,
            false
       );
	}

	renderForeground() {
        context.save();

        if (this.progressPercent > 0){
            context.fillStyle = this.currentColor;
            roundedRectangle(
                context,
                this.position.x + ProgressBar.BORDER_WIDTH / 2,
                this.position.y + ProgressBar.BORDER_WIDTH / 2,
                this.dimensions.x - ProgressBar.BORDER_WIDTH - (100 - this.progressPercent) * 2,
                this.dimensions.y - ProgressBar.BORDER_WIDTH,
                ProgressBar.BORDER_WIDTH,
                true,
                false
           );
        }


        context.restore();
      
	}

    // tweens the number over time
    changeProgressPercent(percentage){
        if (percentage <= 0)
        {
            this.progressPercent = 0;
            this.render();
        }
        else {
            timer.tween(this, ['progressPercent'], [percentage], .5, this.render());     
        }

    }
    
}