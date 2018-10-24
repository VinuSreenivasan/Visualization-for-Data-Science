/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
		// Follow the constructor method in yearChart.js
		// assign class 'content' in style.css to vote percentage chart

        this.margin = {top: 10, right: 20, bottom: 20, left: 50};
        let divVotePercentageChart = d3.select("#votes-percentage").classed("sub_content", true);

        this.svgBounds = divVotePercentageChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //add the svg to the div
        this.svg = divVotePercentageChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)


		//for reference: https://github.com/Caged/d3-tip
		//Use this tool tip element to handle any hover over the chart
		this.tip = d3.tip().attr('class', 'd3-tip')
			.direction('s')
			.offset(function() {
				return [0,0];
			});
    }


	/**
	 * Returns the class that needs to be assigned to an element.
	 *
	 * @param party an ID for the party that is being referred to.
	 */
	chooseClass(data) {
	    if (data == "R"){
	        return "republican";
	    }
	    else if (data == "D"){
	        return "democrat";
	    }
	    else if (data == "I"){
	        return "independent";
	    }
	}

	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
	tooltip_render (tooltip_data) {
	    let text = "<ul>";
	    tooltip_data.result.forEach((row)=>{
			text += "<li class = " + this.chooseClass(row.party)+ ">" 
				 + row.nominee+":\t\t"+row.votecount+"\t("+row.percentage+")" + 
				 "</li>"
	    });
	    return text;
	}

	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
	update (electionResult){

		let that = this;
        let indPercentage = parseFloat(electionResult[0].I_PopularPercentage === "" ? 0: electionResult[0].I_PopularPercentage);
        let demoPercentage = parseFloat(electionResult[0].D_PopularPercentage);
        let repPercentage = parseFloat(electionResult[0].R_PopularPercentage);

		let indData = [], demoData = [], repData = [];
		indData.push({party: "I", percentage: indPercentage, nominee: electionResult[0].I_Nominee_prop});
		demoData.push({party: "D", percentage: demoPercentage, nominee: electionResult[0].D_Nominee_prop});
		repData.push({party: "R", percentage: repPercentage, nominee: electionResult[0].R_Nominee_prop});

		let toolTip = this.tip.html((d)=> {

		    let tooltip_data = {};
		    if (electionResult[0].I_Nominee_prop === " ") {
		        tooltip_data = {
		            "result": [
                        {"nominee": electionResult[0].D_Nominee_prop, "votecount": electionResult[0].D_Votes_Total, "percentage": demoPercentage+"%", "party":"D"} ,
                        {"nominee": electionResult[0].R_Nominee_prop, "votecount": electionResult[0].R_Votes_Total, "percentage": repPercentage+"%", "party":"R"}
                    ]
                };
		    } else {
                tooltip_data = {
                    "result": [
                        {"nominee": electionResult[0].D_Nominee_prop, "votecount": electionResult[0].D_Votes_Total, "percentage": demoPercentage+"%", "party":"D"} ,
                        {"nominee": electionResult[0].R_Nominee_prop, "votecount": electionResult[0].R_Votes_Total, "percentage": repPercentage+"%", "party":"R"} ,
                        {"nominee": electionResult[0].I_Nominee_prop, "votecount": electionResult[0].I_Votes_Total, "percentage": indPercentage+"%", "party":"I"}
                    ]
                };
            }

            return that.tooltip_render(tooltip_data);

	                /* populate data in the following format
	                 * tooltip_data = {
	                 * "result":[
	                 * {"nominee": D_Nominee_prop,"votecount": D_Votes_Total,"percentage": D_PopularPercentage,"party":"D"} ,
	                 * {"nominee": R_Nominee_prop,"votecount": R_Votes_Total,"percentage": R_PopularPercentage,"party":"R"} ,
	                 * {"nominee": I_Nominee_prop,"votecount": I_Votes_Total,"percentage": I_PopularPercentage,"party":"I"}
	                 * ]
	                 * }
	                 * pass this as an argument to the tooltip_render function then,
	                 * return the HTML content returned from that method.
	                 * */

		});

   			  // ******* TODO: PART III *******

		    //Create the bar chart.
		    //Use the global color scale to color code the rectangles.
		    //HINT: Use .votesPercentage class to style your bars.

        let xScale = d3.scaleLinear()
            .domain([0, 65])
            .range([0, this.svgWidth]);

        let demoRect = this.svg.selectAll("rect").data(demoData);
        let demoRectEnter = demoRect.enter().append("rect");

        demoRect.exit().remove();
        demoRect = demoRectEnter.merge(demoRect);

        demoRect.attr("y", 30)
            .attr("height", 20)
            .attr("width", d => xScale(d.percentage))
            .attr("class", d => that.chooseClass(d.party))
            .classed("votesPercentage", true);

        let repRect = this.svg.selectAll("rect1").data(repData);
        let repRectEnter = repRect.enter().append("rect");

        repRect.exit().remove();
        repRect = repRectEnter.merge(repRect);

        repRect.attr("y", 80)
            .attr("height", 20)
            .attr("width", d => xScale(d.percentage))
            .attr("class", d => that.chooseClass(d.party))
            .classed("votesPercentage", true);

        let indRect = this.svg.selectAll("rect2").data(indData);
        let indRectEnter = indRect.enter().append("rect");

        indRect.exit().remove();
        indRect = indRectEnter.merge(indRect);

        indRect.attr("y", 130)
            .attr("height", 20)
            .attr("width", d => xScale(d.percentage))
            .attr("class", d => that.chooseClass(d.party))
            .classed("votesPercentage", true);

		    //Display the total percentage of votes won by each party
		    //on top of the corresponding groups of bars.
		    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
		    // chooseClass to get a color based on the party wherever necessary

        let demoText = this.svg.selectAll("text").data(demoData);
        let demoTextEnter = demoText.enter().append("text");

        demoText.exit().remove();
        demoText = demoTextEnter.merge(demoText);

        demoText.attr("y", 25)
            .text(d => d.percentage===0 ? "" : d.percentage+"%")
            .attr("class", d => that.chooseClass(d.party))
            .style("font-size", "20px")
            .classed("votesPercentageText", true);

        let repText = this.svg.selectAll("text1").data(repData);
        let repTextEnter = repText.enter().append("text");

        repText.exit().remove();
        repText = repTextEnter.merge(repText);

        repText.attr("y", 75)
            .text(d => d.percentage===0 ? "" : d.percentage+"%")
            .attr("class", d => that.chooseClass(d.party))
            .style("font-size", "20px")
            .classed("votesPercentageText", true);

        let indText = this.svg.selectAll("text2").data(indData);
        let indTextEnter = indText.enter().append("text");

        indText.exit().remove();
        indText = indTextEnter.merge(indText);

        indText.attr("y", 125)
            .text(d => d.percentage===0 ? "" : d.percentage+"%")
            .attr("class", d => that.chooseClass(d.party))
            .style("font-size", "20px")
            .classed("votesPercentageText", true);


        let demoNominee = this.svg.selectAll("demoNominee").data(demoData);
        let demoNomineeEnter = demoNominee.enter().append("text");

        demoNominee.exit().remove();
        demoNominee = demoNomineeEnter.merge(demoNominee);

        demoNominee.attr("x", 100)
            .attr("y", 25)
            .text(d => d.nominee)
            .attr("class", d => that.chooseClass(d.party))
            .style("font-size", "20px")
            .classed("nomineeInfoText", true);

        let repNominee = this.svg.selectAll("repNominee").data(repData);
        let repNomineeEnter = repNominee.enter().append("text");

        repNominee.exit().remove();
        repNominee = repNomineeEnter.merge(repNominee);

        repNominee.attr("x", 100)
            .attr("y", 75)
            .text(d => d.nominee)
            .attr("class", d => that.chooseClass(d.party))
            .style("font-size", "20px")
            .classed("nomineeInfoText", true);

        let indNominee = this.svg.selectAll("indNominee").data(indData);
        let indNomineeEnter = indNominee.enter().append("text");

        indNominee.exit().remove();
        indNominee = indNomineeEnter.merge(indNominee);

        indNominee.attr("x", 100)
            .attr("y", 125)
            .text(d => d.nominee)
            .attr("class", d => that.chooseClass(d.party))
            .style("font-size", "20px")
            .classed("nomineeInfoText", true);

		    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
		    //HINT: Use .middlePoint class to style this bar.

        let markerPosition = 50;
        this.svg.selectAll(".middlePoint").remove();
        this.svg.append("rect")
            .attr("x", xScale(markerPosition))
            .attr("y", 20)
            .attr("height", 150)
            .attr("width", 3)
            .classed("middlePoint", true);

		    //Just above this, display the text mentioning details about this mark on top of this bar
		    //HINT: Use .votesPercentageNote class to style this text element
        this.svg.selectAll(".votesPercentageNote").remove();
        this.svg.append("text")
            .attr("x", xScale(markerPosition))
            .attr("y", 15)
            .classed("votesPercentageNote", true)
            .text("50%")
            .style("font-size", "15px");

		    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
		    //then, vote percentage and number of votes won by each party.

        this.svg.call(toolTip);
        demoRect.on("mouseover", toolTip.show);
        demoRect.on("mouseout", toolTip.hide);
        repRect.on("mouseover", toolTip.show);
        repRect.on("mouseout", toolTip.hide);
        indRect.on("mouseover", toolTip.show);
        indRect.on("mouseout", toolTip.hide);

			//HINT: Use the chooseClass method to style your elements based on party wherever necessary.
			
	};

}