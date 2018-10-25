class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param trendChart instance of TrendChart
     * @param electionWinners data corresponding to the winning parties over multiple election years
     */
    constructor (electoralVoteChart, tileChart, votePercentageChart, trendChart, electionWinners) {

        //Creating YearChart instance
        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.trendChart = trendChart;
        this.votePercentageChart = votePercentageChart;
        // the data
        this.electionWinners = electionWinners;

        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 20, left: 50};
        let divyearChart = d3.select("#year-chart").classed("content", true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //add the svg to the div
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R") {
            return "yearChart republican";
        }
        else if (party == "D") {
            return "yearChart democrat";
        }
        else if (party == "I") {
            return "yearChart independent";
        }
    }

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update () {

        let that = this;

        let minYear = d3.min(that.electionWinners, function (d) {
            return d.YEAR;
        });
        let maxYear = d3.max(that.electionWinners, function (d) {
            return d.YEAR;
        });

        let yearScale = d3.scaleLinear()
            .domain([minYear, maxYear])
            .range([that.margin.left, that.svgWidth - that.margin.right]);

        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //ColorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

        this.svg.append("line")
            .attr("x1", 0)
            .attr("y1", that.svgHeight / 2)
            .attr("x2", that.svgWidth)
            .attr("y2", that.svgHeight / 2)
            .classed("lineChart", true);

        // ******* TODO: PART I *******
        // Create the chart by adding circle elements representing each election year
        // The circles should be colored based on the winning party for that year
        // HINT: Use the .yearChart class to style your circle elements
        // HINT: Use the chooseClass method to choose the color corresponding to the winning party.
        let circles = this.svg.selectAll("circle").data(that.electionWinners);
        let circlesEnter = circles.enter().append("circle");

        circles.exit().remove();
        circles = circlesEnter.merge(circles);

        circles.attr("cx", (d) => yearScale(d.YEAR))
            .attr("cy", that.svgHeight / 2)
            .attr("class", (d) => that.chooseClass(d.PARTY))
            .attr("r", 10);

        // Append text information of each year right below the corresponding circle
        // HINT: Use .yeartext class to style your text elements
        let texts = this.svg.selectAll("text").data(that.electionWinners);
        let textsEnter = texts.enter().append("text");

        texts.exit().remove();
        texts = textsEnter.merge(texts);

        texts.attr("x", (d) => yearScale(d.YEAR) - 2)
            .attr("y", that.svgHeight / 2 + 35)
            .style("font-size", "15px")
            .classed("yeartext", true)
            .text(d => d.YEAR);

        // Style the chart by adding a dashed line that connects all these years.
        // HINT: Use .lineChart to style this dashed line

        // Clicking on any specific year should highlight that circle and  update the rest of the visualizations
        // HINT: Use .highlighted class to style the highlighted circle

        // Election information corresponding to that year should be loaded and passed to
        // the update methods of other visualizations

        // Note: you may want to initialize other visulaizations using some election from the get go, rather than waiting for a click (the reference solution uses 2012)

        circles.on("mouseover", function (d) {
            d3.select(this).classed("highlighted", true);
        });
        circles.on("mouseout", function (d) {
            d3.select(this).classed("highlighted", false);
        });

        circles.on("click", function(d){
            d3.selectAll(".selected").classed("selected", false);
            d3.selectAll(".yearChart").attr("r", 10);
            d3.select(this).classed("selected", true);

            d3.csv("data/Year_Timeline_"+d.YEAR+".csv").then(electionResult => {
                console.log(electionResult);
                that.electoralVoteChart.update(electionResult, that.colorScale);
                that.votePercentageChart.update(electionResult);
                that.tileChart.update(electionResult, that.colorScale);
            });
        });


       //******* TODO: EXTRA CREDIT *******
       //Implement brush on the year chart created above.
       //Implement a call back method to handle the brush end event.
       //Call the update method of shiftChart and pass the data corresponding to brush selection.
       //HINT: Use the .brush class to style the brush.

        let brush = d3.brushX().extent([[0, that.svgHeight / 2 + 15],[that.svgWidth, that.svgHeight / 2 + 40]]).on("end", function() {
            let selected = d3.event.selection;
            let selectedYears = [];
            let i = 0;
            if(selected) {
                that.svg.selectAll("circle").attr("cx", function() {
                    let cx = parseFloat(d3.select(this).attr("cx"));
                    let r = parseFloat(d3.select(this).attr("r"));
                    if(cx - r - 5 >= selected[0] && cx - r - 5 < selected[1]) {
                        //Selection should fully cover the text to be displayed
                        if((cx + r + 5) <= selected[1]) {
                            selectedYears[i++] = d3.select(this).data()[0].YEAR;
                        }
                    }
                    return cx;
                });
            }
            that.trendChart.updateYears(selectedYears);
        });
        that.svg.append("g").attr("class", "brush").call(brush);

    };

}