/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
    // ****** TODO: PART II ******
    let aBarChart = document.getElementById("aBarChart");
    let barHeight = new Array();

    let i = 0;
    for (let child of aBarChart.children) {
        barHeight[i] = child.attributes.width.value;
        i++;
    }

    barHeight.sort(function(a, b) {
        return parseInt(a) - parseInt(b);
    });

    i = 0;
    for (let child of aBarChart.children) {
        child.attributes.width.value = barHeight[i];
        i++;
    }
}

/**
 * Render the visualizations
 * @param data
 */
function update(data) {
    /** 
     * D3 loads all CSV data as strings. While Javascript is pretty smart
     * about interpreting strings as numbers when you do things like
     * multiplication, it will still treat them as strings where it makes
     * sense (e.g. adding strings will concatenate them, not add the values
     * together, or comparing strings will do string comparison, not numeric 
     * comparison).
     *
     * We need to explicitly convert values to numbers so that comparisons work
     * when we call d3.max()
     **/

    for (let d of data) {
        d.a = +d.a; //unary operator converts string to number
        d.b = +d.b; //unary operator converts string to number
    }

    // Set up the scales
    let aScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.a)])
        .range([0, 140]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 140]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([10, 120]);


    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
    let aBarChart = d3.select("#aBarChart");
    let aBar = aBarChart.selectAll("rect").data(data);
    let newaBar = aBar.enter().append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => { return iScale(i+1); })
        .attr("width", (d) => { return aScale(d.a); })
        .attr("height", 10)
        .style("opacity", 0);

    aBar.exit()
        .style("opacity", 1)
        .transition()
        .duration(2000)
        .style("opacity", 0)
        .remove();

    aBar = newaBar.merge(aBar);

    aBar.transition()
        .duration(2000)
        .attr("x", 0)
        .attr("y", (d, i) => { return iScale(i+1); })
        .attr("width", (d, i) => { return aScale(d.a); })
        .attr("height", 10)
        .style("opacity", 1);

    // TODO: Select and update the 'b' bar chart bars
    let bBarChart = d3.select("#bBarChart");
    let bBar = bBarChart.selectAll("rect").data(data);
    let newbBar = bBar.enter().append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => { return iScale(i+1); })
        .attr("width", (d, i) => { return bScale(d.b); })
        .attr("height", 10)
        .style("opacity", 0);

    bBar.exit()
        .style("opacity", 1)
        .transition()
        .duration(2000)
        .style("opacity", 0)
        .remove();

    bBar = newbBar.merge(bBar);

    bBar.transition()
        .duration(2000)
        .attr("x", 0)
        .attr("y", (d, i) => { return iScale(i+1); })
        .attr("width", (d, i) => { return bScale(d.b); })
        .attr("height", 10)
        .style("opacity", 1);

    // TODO: Select and update the 'a' line chart path using this line generator
    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));

    let aLine = d3.select("#aLineChart").data(data)
        .transition()
        .duration(2000)
        .style("opacity", 1)
        .attr("d", aLineGenerator(data));

    // TODO: Select and update the 'b' line chart path (create your own generator)
    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => bScale(d.b));

    let bLine = d3.select("#bLineChart").data(data)
        .transition()
        .duration(2000)
        .style("opacity", 1)
        .attr("d", bLineGenerator(data));

    // TODO: Select and update the 'a' area chart path using this area generator
    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.a));

    let aArea = d3.select("#aAreaChart").data(data)
        .transition()
        .duration(2000)
        .style("opacity", 1)
        .attr("d", aAreaGenerator(data));

    // TODO: Select and update the 'b' area chart path (create your own generator)
    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => bScale(d.b));

    let bArea = d3.select("#bAreaChart").data(data)
        .transition()
        .duration(2000)
        .style("opacity", 1)
        .attr("d", bAreaGenerator(data));

    // TODO: Select and update the scatterplot points
    let scatterplot = d3.select("#scatterplot");
    let circles = scatterplot.selectAll("circle").data(data);
    let newCircles = circles.enter().append("circle")
        .attr("cx", (d, i) => { return aScale(d.a+10); })
        .attr("cy", (d, i) => { return bScale(d.b+10); })
        .attr("r", 5);

    circles.exit()
        .style("opacity", 1)
        .transition()
        .duration(2000)
        .style("opacity", 0)
        .remove();

    circles = newCircles.merge(circles);

    circles.transition()
        .duration(2000)
        .attr("cx", (d, i) => { return aScale(d.a); })
        .attr("cy", (d, i) => { return bScale(d.b); })
        .attr("r", 5)
        .style("opacity", 1);

    // ****** TODO: PART IV ******

}

/**
 * Update the data according to document settings 
 */
async function changeData() {
    //  Load the file indicated by the select menu
    let dataFile = document.getElementById('dataset').value;
    try{
        const data = await d3.csv('data/' + dataFile + '.csv'); 
        if (document.getElementById('random').checked) { // if random
            update(randomSubset(data));                  // update w/ random subset of data
        } else {                                         // else
            update(data);                                // update w/ full data
        }
    } catch (error) {
        alert('Could not load the dataset!');
    }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
    return data.filter( d => (Math.random() > 0.5));
}