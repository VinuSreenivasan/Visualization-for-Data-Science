/** Class implementing the tileChart. */
class TileChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(){
        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to tile chart

        let divTileChart = d3.select("#tiles").classed("tile_view", true);
        this.margin = {top: 10, right: 20, bottom: 20, left: 50};
        this.svgBounds = divTileChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth / 2;

        // Legend
        let legendHeight = 100;
        //add the svg to the div
        let legend = d3.select("#legend").classed("tile_view",true);

        // creates svg elements within the div
        this.legendSvg = legend.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",legendHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)");

        this.svg = divTileChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr("transform", "translate(" + this.margin.left + ",0)");
        
        // Intialize tool-tip
        this.tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })
    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party== "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }

    /**
     * Renders the HTML content for tool tip.
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for tool tip
     */
    tooltip_render(tooltip_data) {
        let text = "<h2 class ="  + this.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
        text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
        text += "<ul>"
        tooltip_data.result.forEach((row)=>{
            text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"\t("+row.percentage+"%)" + "</li>"
        });
        text += "</ul>";

        return text;
    }

    /**
     * Creates tiles and tool tip for each state, legend for encoding the color scale information.
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */
    update (electionResult, colorScale){

        let that = this;

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        let toolTip = this.tip.html((d)=>{
            let tooltip_data = {
                "state": d.State,
                "winner": d.State_Winner,
                "electoralVotes": d.Total_EV,
                "result": [
                    {"nominee": d.D_Nominee_prop, "votecount": d.D_Votes, "percentage": d.D_Percentage, "party":"D"},
                    {"nominee": d.R_Nominee_prop, "votecount": d.R_Votes, "percentage": d.R_Percentage, "party":"R"}
                ]
            }
            if(d.I_Votes)
                tooltip_data.result[2] = {"nominee": d.I_Nominee_prop, "votecount": d.I_Votes, "percentage": d.I_Percentage, "party":"I"};
            return that.tooltip_render(tooltip_data);

                    /* populate data in the following format
                     * tooltip_data = {
                     * "state": State,
                     * "winner":d.State_Winner
                     * "electoralVotes" : Total_EV
                     * "result":[
                     * {"nominee": D_Nominee_prop,"votecount": D_Votes,"percentage": D_Percentage,"party":"D"} ,
                     * {"nominee": R_Nominee_prop,"votecount": R_Votes,"percentage": R_Percentage,"party":"R"} ,
                     * {"nominee": I_Nominee_prop,"votecount": I_Votes,"percentage": I_Percentage,"party":"I"}
                     * ]
                     * }
                     * pass this as an argument to the tooltip_render function then,
                     * return the HTML content returned from that method.
                     * */

        });

        // ******* TODO: PART IV *******
        // Transform the legend element to appear in the center 
        // make a call to this element for it to display.

        // Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.
        // column is coded as 'Space' in the data.

        // Display the state abbreviation and number of electoral votes on each of these rectangles

        // Use global color scale to color code the tiles.

        // HINT: Use .tile class to style your tiles;
        // .tilestext to style the text corresponding to tiles

        //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
        //then, vote percentage and number of votes won by each party.
        //HINT: Use the .republican, .democrat and .independent classes to style your elements.
        //Creates a legend element and assigns a scale that needs to be visualized

        this.maxColumns = d3.max(electionResult, d => parseInt(d["Space"]));
        this.maxRows = d3.max(electionResult, d => parseInt(d["Row"]));

        this.legendSvg.append("g")
            .attr("class", "legendQuantile")
            .attr("transform", "translate(50,50)")
            .style("font-size","10px");

        let legendQuantile = d3.legendColor()
            .shapeWidth((this.svgWidth - 2*this.margin.left - this.margin.right)/12)
            .cells(10)
            .orient('horizontal')
            .labelFormat(d3.format('.1r'))
            .scale(colorScale);

        this.legendSvg.select(".legendQuantile").call(legendQuantile);


        let tileWidth = this.svgWidth / (this.maxColumns + 1);
        let tileHeight = this.svgHeight / (this.maxRows + 1);

        let rect = this.svg.selectAll(".tile").data(electionResult);
        let rectEnter = rect.enter().append("rect");

        rect.exit().remove();
        rect = rectEnter.merge(rect);

        rect.attr("x", d => parseInt(d.Space) * tileWidth)
            .attr("y", d => parseInt(d.Row) * tileHeight)
            .attr("height", tileHeight)
            .attr("width", tileWidth)
            .style("fill", d => colorScale(parseFloat(d.RD_Difference)))
            .classed("tile", true);


        let text = this.svg.selectAll(".tilestext") .data(electionResult);
        let textEnter = text.enter().append("text");

        text.exit().remove();
        text = textEnter.merge(text);

        text.attr("x", d => parseInt(d.Space) * tileWidth + tileWidth / 2)
            .attr("y", d => parseInt(d.Row) * tileHeight + tileHeight / 2)
            .text(d => d.Abbreviation)
            .classed("tilestext", true)
            .style("font-size", "15px")
            .append("tspan")
            .text(d => d.Total_EV)
            .attr("x", d => parseInt(d.Space) * tileWidth + tileWidth / 2)
            .attr("y", d => parseInt(d.Row) * tileHeight + tileHeight / 2 + 20);

        this.svg.call(toolTip);
        rect.on("mouseover", toolTip.show);
        rect.on("mouseout", toolTip.hide);
    };

}