import Validation from "./Validation";
import Rect from "./models/Rect";
import Box from "./models/Box";
import Project from "./models/Project";
import { default as data } from "./input/codeCharta";
import { default as schema } from "./schema";
import { default as squarify } from "./squarified";
import { default as sliceAndDice } from "./sliceAndDice";
import { select, event } from "d3-selection";

/* Check input data validity */
const errors = Validation.checkData(data, schema);
if (errors.length !== 0) {
    let message: string = "";
    for (const error of errors) {
        message += "\n" + error.keyword + ": " + error.message;
    }
    throw new Error(message);
}

const svg_width: number = 800; // width of the treemap
const svg_height: number = 600; // height of the treemap
const canvas: Rect = new Rect([0, 0], [svg_width, svg_height]); // canvas on which the treemap is drawn
const margin = { top: 1, right: 1, bottom: 1, left: 1 }; // margin for file nodes to make underlying folder nodes visible
const boxLabels = false // set to true, to have node names displayed
const project: Project = Project.create(data); // project instance created from input data
const attribute: string = "rloc"; // attribute to use for node size
const algorithms = [squarify, sliceAndDice]; // implemented algorithms used for dropdown menu

let boxes: Box[] = squarify(project.nodes, canvas, attribute);

const svg = select("body")
    .append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height);

createBoxes(boxLabels);
createTreemapDropdown();


/**
* Draws boxes with d3
* 
* @param useText 'true' enables name labels on boxes (not recommended for larger projects)
*/
function createBoxes(useText: boolean) {
    const groups = svg.selectAll(".groups")
        .data(boxes)
        .enter()
        .append("g")
        .attr("class", "box");

    groups.append('rect')
        .attr("x", (d: Box): number => { return d.rect.posX() + (isFile(d) ? margin.left : 0) })
        .attr("y", (d: Box): number => { return d.rect.posY() + (isFile(d) ? margin.top : 0) })
        .attr("height", (d: Box): number => { return d.rect.height() - (isFile(d) ? margin.top + margin.bottom : 0) })
        .attr("width", (d: Box): number => { return d.rect.width() - (isFile(d) ? margin.left + margin.right : 0) })
        .attr("fill", (d: Box): string => { return isFile(d) ? "LightSteelBlue" : "SteelBlue" })
        .on("mouseover", () => { select(event.currentTarget).style("fill", "lightgrey") })
        .on("mouseout", (d: Box) => { select(event.currentTarget).style("fill", (isFile(d) ? "LightSteelBlue" : "SteelBlue")) })
        .on("click", createAttributeList);

    if (useText) {
        groups.append('text')
            .text((d: Box): string => { return isFile(d) ? d.name : "" })
            .attr("x", (d: Box): number => { return d.rect.posX() + d.rect.width() / 2 })
            .attr("y", (d: Box): number => { return d.rect.posY() + d.rect.height() / 2 })
            .attr("text-anchor", "middle");
    }
}

/**
 * Creates the Dropdown Menu for Treemap Selection
 */
function createTreemapDropdown() {
    const dropDown = select("body")
        .append("select")
        .attr("id", "selectBox");

    const selectBox = document.getElementById("selectBox");
    if (!selectBox) throw new Error("selectBox not found");
    selectBox.onchange = (e: any) => {
        const algName = e.target.options[e.target.selectedIndex].value
        const treemap = algorithms.find(alg => { return alg.name === algName; });
        if (treemap) {
            boxes = treemap(project.nodes, canvas, attribute);
            createBoxes(false);
        } else {
            throw new Error("function '" + algName + "' does not exist.");
        }
    }

    dropDown.selectAll("options")
        .data(algorithms)
        .enter()
        .append("option")
        .text((d) => d.name)
        .attr("value", (d) => d.name);
}

/**
 * 
 * Creates the attribute table for a box
 * 
 * @param box box with parameters 
 */
function createAttributeList(box: Box) {

    let table = createTable();
    let header_row: HTMLElement = document.createElement("tr");
    let header_cell1: HTMLElement = document.createElement("th");
    let header_cell2: HTMLElement = document.createElement("th");

    table.appendChild(header_row);
    header_row.appendChild(header_cell1);
    header_row.appendChild(header_cell2);
    header_cell1.appendChild(document.createTextNode("name"));
    header_cell2.appendChild(document.createTextNode(box.name));

    box.attributes.forEach((paramValue: number, paramKey: string) => {
        let row: HTMLElement = document.createElement("tr");
        let cell1: HTMLElement = document.createElement("td");
        let cell2: HTMLElement = document.createElement("td");

        table.appendChild(row);
        row.appendChild(cell1);
        row.appendChild(cell2);
        cell1.appendChild(document.createTextNode(paramKey));
        cell2.appendChild(document.createTextNode(paramValue.toString()));
    });
}

/**
 * Creates a new HTML table for the attribute list
 */
function createTable(): HTMLElement {
    let body: HTMLElement = document.body;
    let attrList: HTMLElement | null = document.getElementById("attrList");
    /* remove attribute list if one is displayed already */
    if (attrList) {
        body.removeChild(attrList);
    }
    let table: HTMLElement = document.createElement("table");
    table.setAttribute("id", "attrList");
    table.style.cssText = 'float:right;';
    body.append(table);
    return table;
}

function isFile(box: Box): boolean {
    return box.type === "File";
}