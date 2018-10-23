class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param trendChart an instance of the ShiftChart class
     */
    constructor (trendChart){

        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to electoral-vote chart

        this.trendChart = trendChart;

        this.margin = {top: 30, right: 20, bottom: 20, left: 50};
        let divElectoralVoteChart = d3.select("#electoral-vote").classed("content", true);

        this.svgBounds = divElectoralVoteChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //add the svg to the div
        this.svg = divElectoralVoteChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
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
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }

    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

   update (electionResult, colorScale){
       
       // ******* TODO: PART II *******
       // Group the states based on the winning party for the state;
       // then sort them based on the margin of victory
       let indText = 0, demoText = 0, repText = 0;
       let indData = [], demoData = [], repData = [];
       let electionData = d3.nest().key(d => d.State_Winner)
           .rollup(data => {
               return data.sort((a,b) => d3.ascending(parseFloat(a.RD_Difference), parseFloat(b.RD_Difference)));
           })
           .entries(electionResult);

       //console.log(electionData);

       electionData.forEach(data => {
           if (data.key === 'I') {
               indData = data.value;
               if (indData.length > 0) {
                   indText = parseInt(indData[0].I_EV_Total);
               }
           } else if (data.key === 'D') {
               demoData = data.value;
               demoText = parseInt(demoData[0].D_EV_Total);
           } else if (data.key === 'R') {
               repData = data.value;
               repText = parseInt(repData[0].R_EV_Total);
           }
       });

       repData.sort((a,b) => d3.descending(parseFloat(a.RD_Difference), parseFloat(b.RD_Difference)));

       //console.log(indData);
       //console.log(demoData);
       //console.log(repData);



       let indPositions = [0];
       indData.forEach(result => {
           let length = indPositions.length;
           let width = parseFloat(result.Total_EV);
           indPositions.push(indPositions[length - 1] + width);
       });

        let demoPositions = [0];
        demoData.forEach(result => {
            let length = demoPositions.length;
            let width = parseFloat(result.Total_EV);
            demoPositions.push(demoPositions[length - 1] + width);
        });


        let repPositions = [0];
        repData.forEach(result => {
            let length = repPositions.length;
            let width = parseFloat(result.Total_EV);
            repPositions.push(repPositions[length - 1] + width);
        });


        let totalev = d3.sum(electionResult, d => d.Total_EV);

        let xScale = d3.scaleLinear()
            .domain([0, totalev])
            .range([0, this.svgWidth]);

       // Create the stacked bar chart.
       // Use the global color scale to color code the rectangles for Democrates and Republican.
       // Use #089c43 to color Independent party.
       // HINT: Use .electoralVotes class to style your bars.

        let demoRect = this.svg.selectAll("rect").data(demoData);
        let demoRectEnter = demoRect.enter().append("rect");

        demoRect.exit().remove();
        demoRect = demoRectEnter.merge(demoRect);

        demoRect.attr("x", (d, i) => xScale(demoPositions[i]))
            .attr("y", 30)
            .attr("height", 20)
            .attr("width", function(d, i) {
                if (i === demoPositions.length - 1) {
                    return xScale(parseFloat(d.Total_EV));
                } else {
                    return xScale(demoPositions[i+1] - demoPositions[i]);
                }
            })
            .style("fill",  d => colorScale(parseFloat(d.RD_Difference)))
            .classed("electoralVotes", true);


        let repRect = this.svg.selectAll("rect1").data(repData);
        let repRectEnter = repRect.enter().append("rect");

        repRect.exit().remove();
        repRect = repRectEnter.merge(repRect);

        repRect.attr("x", (d, i) => xScale(repPositions[i]))
            .attr("y", 80)
            .attr("height", 20)
            .attr("width", function(d, i) {
                if (i === repPositions.length - 1) {
                    return xScale(parseFloat(d.Total_EV));
                } else {
                    return xScale(repPositions[i+1] - repPositions[i]);
                }
            })
            .style("fill",  d => colorScale(parseFloat(d.RD_Difference)))
            .classed("electoralVotes", true);


        let indRect = this.svg.selectAll("rect2").data(indData);
        let indRectEnter = indRect.enter().append("rect");

        indRect.exit().remove();
        indRect = indRectEnter.merge(indRect);

        indRect.attr("x", (d, i) => xScale(indPositions[i]))
            .attr("y", 130)
            .attr("height", 20)
            .attr("width", function (d, i) {
                if (i === indPositions.length - 1) {
                    return xScale(parseFloat(d.Total_EV));
                } else {
                    return xScale(indPositions[i + 1] - indPositions[i]);
                }
            })
            .style("fill", "#089c43")
            .classed("electoralVotes", true);

       // Display total count of electoral votes won by the Democrat, Republican and Independent party(if there's candidate).
       // on top of the corresponding groups of bars.
       // HINT: Use the .electoralVoteText class to style your text elements; Use this in combination with
       // Use chooseClass method to get a color based on the party wherever necessary
        this.svg.selectAll(".electoralVoteText").remove();
        if(demoText!==0){
            this.svg.append("text")
                .attr("x", 0)
                .attr("y", 25)
                .text(demoText)
                .attr("class", this.chooseClass("D"))
                .classed("electoralVoteText", true);
        }
        if(repText!==0){
            this.svg.append("text")
                .attr("x", 0)
                .attr("y", 75)
                .text(repText)
                .attr("class", this.chooseClass("R"))
                .classed("electoralVoteText", true);
        }
        if(indText!==0){
            this.svg.append("text")
                .attr("x", 0)
                .attr("y", 125)
                .text(indText)
                .attr("class", this.chooseClass("I"))
                .classed("electoralVoteText", true);
        }
       
       // Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
       // HINT: Use .middlePoint class to style this bar.

        let markerPosition = 268;
        this.svg.selectAll(".middlePoint").remove();
        this.svg.append("rect")
            .attr("x", xScale(markerPosition))
            .attr("y", 20)
            .attr("height", 150)
            .attr("width", 3)
            .classed("middlePoint", true);
       
       // Just above this, display the text mentioning the total number of electoral votes required
       // to win the elections throughout the country
       // HINT: Use .electoralVotesNote class to style this text element
       // HINT: Use the chooseClass method to style your elements based on party wherever necessary.

        this.svg.selectAll(".electoralVotesNote").remove();
        this.svg.append("text")
            .attr("x", xScale(markerPosition))
            .attr("y", 15)
            .text("270 needed to win")
            .classed("electoralVotesNote", true);


       //******* TODO: PART V *******
       
       //Implement brush on the bar chart created above.
       //Implement a call back method to handle the brush end event.
       //Call the update method of shiftChart and pass the data corresponding to brush selection.
       //HINT: Use the .brush class to style the brush.

        let that = this;
        let demobrush = d3.brushX().extent([[xScale(0), 25],[xScale(totalev), 55]]).on("end", function(){
            let selected = d3.event.selection;
            if(selected!==null){
                let min  = xScale.invert(selected[0]);
                let max  = xScale.invert(selected[1]);
                let selectedStates = []
                for (var i = 0; i < demoPositions.length-1; i++) {
                    // selecting the states even if half portion is inside brush selection
                    if((demoPositions[i]>=min && demoPositions[i+1]<=max) ||
                        (demoPositions[i]<min && demoPositions[i+1]>=min) ||
                        (demoPositions[i]<=max && demoPositions[i+1]>max)){
                        selectedStates.push(demoData[i].State);
                    }
                }
                that.trendChart.update(selectedStates);
            }

        });
        this.svg.append("g").attr("class", "brush").call(demobrush);

        let repbrush = d3.brushX().extent([[xScale(0), 75],[xScale(totalev), 105]]).on("end", function(){
            let selected = d3.event.selection;
            if(selected!==null){
                let min  = xScale.invert(selected[0]);
                let max  = xScale.invert(selected[1]);
                let selectedStates = []
                for (var i = 0; i < repPositions.length-1; i++) {
                    // selecting the states even if half portion is inside brush selection
                    if((repPositions[i]>=min && repPositions[i+1]<=max) ||
                        (repPositions[i]<min && repPositions[i+1]>=min) ||
                        (repPositions[i]<=max && repPositions[i+1]>max)){
                        selectedStates.push(repData[i].State);
                    }
                }
                that.trendChart.update(selectedStates);
            }

        });
        this.svg.append("g").attr("class", "brush").call(repbrush);

        let indbrush = d3.brushX().extent([[xScale(0), 125],[xScale(totalev), 155]]).on("end", function(){
            let selected = d3.event.selection;
            if(selected!==null){
                let min  = xScale.invert(selected[0]);
                let max  = xScale.invert(selected[1]);
                let selectedStates = []
                for (var i = 0; i < indPositions.length-1; i++) {
                    // selecting the states even if half portion is inside brush selection
                    if((indPositions[i]>=min && indPositions[i+1]<=max) ||
                        (indPositions[i]<min && indPositions[i+1]>=min) ||
                        (indPositions[i]<=max && indPositions[i+1]>max)){
                        selectedStates.push(indData[i].State);
                    }
                }
                that.trendChart.update(selectedStates);
            }

        });
        this.svg.append("g").attr("class", "brush").call(indbrush);

    };

    
}