/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        // Maintain reference to the tree object
        this.tree = treeObject;

        /**List of all elements that will populate the table.*/
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice();

        ///** Store all match data for the 2018 Fifa cup */
        this.teamData = teamData;

        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** letiables to be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null;


        /** Used for games/wins/losses*/
        this.gameScale = null;

        /**Color scales*/
        /**For aggregate columns*/
        /** Use colors '#feebe2' and '#690000' for the range*/
        this.aggregateColorScale = null;


        /**For goal Column*/
        /** Use colors '#cb181d' and '#034e7b' for the range */
        this.goalColorScale = null;

        this.teamFlag = true;
        this.goalFlag = false;
        this.resultFlag = false;
        this.winFlag = false;
        this.lossFlag = false;
        this.totalGamesFlag = false;
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains
        let that = this;
        let maxGoal = 0, maxGame = 0;
        this.teamData.forEach(team => {
            let tempGoal = 0;
            let tempGame = team.value["TotalGames"];
            if (team.value[that.goalsMadeHeader] > team.value[that.goalsConcededHeader]) {
                tempGoal = team.value[that.goalsMadeHeader];
            } else {
                tempGoal = team.value[that.goalsConcededHeader];
            }
            if (tempGoal > maxGoal) {
                maxGoal = tempGoal;
            }
            if (tempGame > maxGame) {
                maxGame = tempGame;
            }
        });
        
        // Create the axes
        this.goalScale = d3.scaleLinear()
            .domain([0, maxGoal])
            .range([this.cell.buffer, 2 * this.cell.width]);

        this.gameScale = d3.scaleLinear()
            .domain([0, maxGame])
            .range([this.cell.buffer, this.cell.width - this.cell.buffer]);

        this.aggregateColorScale = d3.scaleLinear()
            .domain([0, maxGame])
            .range(["#feebe2","#690000"]);

        this.goalColorScale = d3.scaleLinear()
            .domain([0, maxGoal])
            .range(["#cb181d","#034e7b"]);
        
        //add GoalAxis to header of col 1.
        let goalAxis = d3.axisBottom().scale(this.goalScale);
        let goalAxisGroup = d3.select("#goalHeader")
            .append("svg")
            .attr("height", this.cell.height)
            .attr("width", 2 * (this.cell.width + this.cell.buffer))
            .call(goalAxis)
            .attr("transform", "scale(1, -1)");

        goalAxisGroup.selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "0.3em")
            .attr("dy", "0.4em")
            .attr("transform", "scale(1, -1) translate(0, -22)");

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers
        

        //Set sorting callback for clicking on Team header
        //Clicking on headers should also trigger collapseList() and updateTable().
        d3.select("#team").on("click", function(){ that.sortTeam(); });
        d3.select("#goals").on("click", function(){ that.sortGoals(); });
        d3.select("#result").on("click", function(){ that.sortResult(); });
        d3.select("#wins").on("click", function(){ that.sortWins(); });
        d3.select("#losses").on("click", function(){ that.sortLosses(); });
        d3.select("#totalGames").on("click", function(){ that.sortTotalGames(); });
    }

    sortTeam(){
        let that = this;
        that.teamData.sort(function(a, b){
            if(that.teamFlag)
                return d3.ascending(a.key, b.key);
            return d3.descending(a.key, b.key);
        });
        that.teamFlag = !that.teamFlag;
        that.collapseList();
    }

    sortGoals(){
        let that = this;
        that.teamData.sort(function(a, b){
            if(that.goalFlag)
                return d3.ascending(a.value["Delta Goals"], b.value["Delta Goals"]);
            return d3.descending(a.value["Delta Goals"], b.value["Delta Goals"]);
        });
        that.goalFlag = !that.goalFlag;
        that.collapseList();
    }

    sortResult(){
        let that = this;
        that.teamData.sort(function(a, b){
            if(that.resultFlag)
                return d3.ascending(a.value.Result.ranking, b.value.Result.ranking);
            return d3.descending(a.value.Result.ranking, b.value.Result.ranking);
        });
        that.resultFlag = !that.resultFlag;
        that.collapseList();
    }

    sortWins(){
        let that = this;
        that.teamData.sort(function(a, b){
            if(that.winFlag)
                return d3.ascending(a.value.Wins, b.value.Wins);
            return d3.descending(a.value.Wins, b.value.Wins);
        });
        that.winFlag = !that.winFlag;
        that.collapseList();
    }

    sortLosses(){
        let that = this;
        that.teamData.sort(function(a, b){
            if(that.lossFlag)
                return d3.ascending(a.value.Losses, b.value.Losses);
            return d3.descending(a.value.Losses, b.value.Losses);
        });
        that.lossFlag = !that.lossFlag;
        that.collapseList();
    }

    sortTotalGames(){
        let that = this;
        that.teamData.sort(function(a, b){
            if(that.totalGamesFlag)
                return d3.ascending(a.value.TotalGames, b.value.TotalGames);
            return d3.descending(a.value.TotalGames, b.value.TotalGames);
        });
        that.totalGamesFlag = !that.totalGamesFlag;
        that.collapseList();
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows
        let that = this;
        let table = d3.select("#matchTable").select("tbody").selectAll("tr").data(this.tableElements);
        let tableEnter = table.enter().append("tr");
        table.exit().remove();
        table = tableEnter.merge(table);
        table.on("mouseover", d => that.tree.updateTree(d));
        table.on("mouseout", d => that.tree.clearTree());

        //Append th elements for the Team Names
        let th = table.selectAll("th").data((d, i) => [{name:d.key, type: d.value.type, index: i}]);
        let thVal = th.enter().append("th");
        th.exit().remove();
        th = thVal.merge(th);
        th.text(d => { return d.type === "game" ? "x"+d.name : d.name; })
            .attr("class", d => { return d.type === "game" ? "game" : "aggregate"; })
            .on("click", d => that.updateList(d.index));

        //Append td elements for the remaining columns.
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'vis' :<'bar', 'goals', or 'text'>, 'value':<[array of 1 or two elements]>}
        let td = table.selectAll("td")
            .data(d => [
                {type: d.value.type, vis: "goals", value: {goalsMade: d.value[that.goalsMadeHeader], goalsConceded: d.value[that.goalsConcededHeader], deltaGoals: d.value[that.goalsMadeHeader] - d.value[that.goalsConcededHeader]}},
                {type: d.value.type, vis: "text", value: d.value.Result.label},
                {type: d.value.type, vis: "bar", value: d.value.Wins},
                {type: d.value.type, vis: "bar", value: d.value.Losses},
                {type: d.value.type, vis: "bar", value: d.value.TotalGames}
            ]);
        let tdVal = td.enter().append("td");
        td.exit().remove();
        td = tdVal.merge(td);

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )
        let svg = td.filter(function(d){ return d.vis == "goals"; });
        let svgGroup = svg.selectAll("svg").data(function(d){
            return d3.select(this).data();
        });
        let svgGroupEnter = svgGroup.enter().append("svg");
        svgGroup.exit().remove();
        svgGroup = svgGroupEnter.merge(svgGroup);
        svgGroup.attr("height", this.cell.height)
            .attr("width", 2 * this.cell.width + this.cell.buffer);

        let scoreGroup = svgGroup.selectAll("g").data(function(d){
            return d3.select(this).data();
        });
        let scoreGroupEnter = scoreGroup.enter().append("g");
        scoreGroup.exit().remove();
        scoreGroup = scoreGroupEnter.merge(scoreGroup);

        let scoreBars = scoreGroup.selectAll("rect").data(function(d){
            return d3.select(this).data();
        });
        let scoreBarsEnter = scoreBars.enter().append("rect");
        scoreBars.exit().remove();
        scoreBars = scoreBarsEnter.merge(scoreBars);
        scoreBars.attr("x", d => {
            let retVal = d.value.goalsMade > d.value.goalsConceded ? that.goalScale(d.value.goalsConceded) : that.goalScale(d.value.goalsMade);
            if (d.type === "game") {
                return retVal;
            }
            return retVal;
        })
            .attr("y", d => { return d.type === "game" ? 8 : 5; })
            .attr("height", d => { return d.type === "game" ? 4: 10; })
            .attr("width", d => {
                if (d.value.deltaGoals === 0) {
                    return 0;
                }
                let width = that.goalScale(Math.abs(d.value.deltaGoals))- that.cell.buffer;
                if (d.type === "game") {
                    return width > 10 ? width-10 : 0;
                }
                return Math.abs(width);
            })
            .classed("goalBar", true)
            .style("fill", d => { return d.value.deltaGoals > 0 ? "#364e74" : "#be2714"; });

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

        let scoreCirclesWin = scoreGroup.selectAll("circle").data(function(d){
            return d3.select(this).data();
        });
        let scoreCirclesWinEnter = scoreCirclesWin.enter().append("circle");
        scoreCirclesWin.exit().remove();
        scoreCirclesWin = scoreCirclesWinEnter.merge(scoreCirclesWin);
        scoreCirclesWin.attr("cx", d => { return this.goalScale(d.value.goalsMade)-5; })
            .attr("cy", 10)
            .classed("goalCircle", true)
            .style("fill", d => {return d.type === "game" ? "none" : "#364e74"; })
            .style("stroke", "#364e74");

        let scoreCirclesLoss = scoreGroup.selectAll("circles").data(function(d){
            return d3.select(this).data();
        });
        let scoreCirclesLossEnter = scoreCirclesLoss.enter().append("circle");
        scoreCirclesLoss.exit().remove();
        scoreCirclesLoss = scoreCirclesLossEnter.merge(scoreCirclesLoss);
        scoreCirclesLoss.attr("cx", d => { return this.goalScale(d.value.goalsConceded)-5; })
            .attr("cy", 10)
            .classed("goalCircle", true)
            .style("fill", d => {
                if (d.type === "game") {
                    return "none";
                }
                if (d.value.deltaGoals == 0) {
                    return "grey";
                }
                return "#be2714";
            })
            .style("stroke", d => {
                if (d.value.deltaGoals == 0) {
                    return "grey";
                }
                return "#be2714";
            });

        scoreGroup.on("mouseover", function(d){
            d3.select(this).append("title").text("Goals Scored: " + d.value.goalsMade+" Goals Conceded: " + d.value.goalsConceded);
        });

        scoreGroup.on("mouseout", function(d){
            d3.select(this).selectAll("title").remove();
        });

        let result = td.filter(d => { return d.vis == 'text'; });
        let resultSvg = result.selectAll("svg").data(function(d){
                return d3.select(this).data();
            });
        let resultEnter = resultSvg.enter().append("svg");
        resultSvg.exit().remove();
        resultSvg = resultEnter.merge(resultSvg);
        resultSvg.attr("width", 2 * this.cell.width)
            .attr("height", this.cell.height);

        let resultText = resultSvg.selectAll("text").data(function(d){
            return d3.select(this).data();
        });
        let resultTextEnter = resultText.enter().append("text");
        resultText.exit().remove();
        resultText = resultTextEnter.merge(resultText);
        resultText.attr("y", 15).text(d => d.value);


        let game = td.filter(d => {return d.vis == 'bar'; });
        let gameSvg = game.selectAll("svg").data(function(d){
            return d3.select(this).data();
        });
        let gameSvgEnter = gameSvg.enter().append("svg");
        gameSvg.exit().remove();
        gameSvg = gameSvgEnter.merge(gameSvg);
        gameSvg.attr("width", this.cell.width)
            .attr("height", this.cell.height)
            .attr("transform", "translate(-5, 0)");

        let gameGroup = gameSvg.selectAll("g").data(function(d){
            return d3.select(this).data();
        });
        let gameGroupEnter = gameGroup.enter().append("g");
        gameGroup.exit().remove();
        gameGroup = gameGroupEnter.merge(gameGroup);

        let gameBars = gameGroup.selectAll("rect").data(function(d){
            return d3.select(this).data();
        });
        let gameBarsEnter = gameBars.enter().append("rect");
        gameBars.exit().remove();
        gameBars = gameBarsEnter.merge(gameBars);
        gameBars.attr("x", 5)
            .attr("y", 5)
            .attr("height", 20)
            .attr("width", d => {
                if (d.type === "game"){
                    return 0;
                }
                return this.gameScale(d.value);
            })
            .style("fill", d => { return this.aggregateColorScale(d.value); });

        let gameText = gameGroup.selectAll("text").data(function(d){
            return d3.select(this).data();
        });
        let gameTextEnter = gameText.enter().append("text");
        gameText.exit().remove();
        gameText = gameTextEnter.merge(gameText);
        gameText.attr("x", d => {
            if (d.type === "game") {
                return;
            }
            return this.gameScale(d.value)-10;
        })
            .attr("y", 17)
            .text(d => {return d.type === "game" ? "": d.value; })
            .style("fill", "white");

    };
    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        let selectedTeam = this.tableElements[i];
        if(selectedTeam.value.type === "game"){
            return;
        }
        let gamesArray = selectedTeam.value.games;
        let nextToSelection = this.tableElements[i+1];
        let teamData = this.tableElements.slice();

        //console.log(selectedTeam);

        this.tableElements = [];
        if(nextToSelection!==undefined && nextToSelection.value.type === "game"){
            Array.prototype.push.apply(this.tableElements, teamData.slice(0, i+1));
            Array.prototype.push.apply(this.tableElements, teamData.slice(i + (gamesArray.length+1)));
        } else {
            Array.prototype.push.apply(this.tableElements, teamData.slice(0, i+1));
            Array.prototype.push.apply(this.tableElements, gamesArray);
            Array.prototype.push.apply(this.tableElements, teamData.slice(i+1));
        }
        this.updateTable();
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******
        this.tableElements = this.teamData;
        this.updateTable();
    }
}