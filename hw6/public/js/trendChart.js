/** Class implementing the trendChart. */
class TrendChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
        this.divTrendChart = d3.select("#shiftChart").classed("sideBar", true);
    };

    /**
     * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
     *
     * @param selectedStates data corresponding to the states selected on brush
     */
    demoUpdate(selectedStates){
     
    // ******* TODO: PART V *******
    //Display the names of selected states in a list
        let li = d3.select("#demostateList").selectAll('li').data(selectedStates);
        let liEnter = li.enter().append('li');

        li.exit().remove();
        li = liEnter.merge(li);

        li.text(d => d).classed("democrat", true);



    //******** TODO: PART VI*******
    //Use the shift data corresponding to the selected years and sketch a visualization
    //that encodes the shift information



    //******** TODO: EXTRA CREDIT I*******
    //Handle brush selection on the year chart and sketch a visualization
    //that encodes the shift informatiomation for all the states on selected years



    //******** TODO: EXTRA CREDIT II*******
    //Create a visualization to visualize the shift data
    //Update the visualization on brush events over the Year chart and Electoral Vote Chart

    };

    repUpdate(selectedStates){

        let li = d3.select("#repstateList").selectAll('li').data(selectedStates);
        let liEnter = li.enter().append('li');

        li.exit().remove();
        li = liEnter.merge(li);

        li.text(d => d).classed("republican", true);
    };

    indUpdate(selectedStates){

        let li = d3.select("#indstateList").selectAll('li').data(selectedStates);
        let liEnter = li.enter().append('li');

        li.exit().remove();
        li = liEnter.merge(li);

        li.text(d => d).classed("independent", true);
    };







    updateYears(selectedYears){
        let li = d3.select("#yearList").selectAll('li').data(selectedYears);
        let liEnter = li.enter().append('li');

        li.exit().remove();
        li = liEnter.merge(li);

        li.text(d => d);
    };

}