import Point from "./Point";

export default class Rectangle {
    public topLeft: Point;
    public width: number;
    public height: number;
    
    constructor(topLeft: Point, width: number, height: number) {
        this.topLeft = topLeft;
        this.width = width;
        this.height = height;
    }
    
    /**
     * Gets length of the shorter side if the rectangle
     */
    public shorterSide(): number {
        return this.width > this.height ? this.height : this.width;
    }

    /**
     * Returns true if rectangle's width is smaller than rectangle's height
     */
    public isVertical(): boolean {
        return this.height > this.width;
    }
}