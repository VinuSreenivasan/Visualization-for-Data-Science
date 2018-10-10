    /**
     * Loads in the table information from fifa-matches-2018.json
     */
d3.json('data/fifa-matches-2018.json').then( data => {

    /**
     * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
     *
     */
    d3.csv("data/fifa-tree-2018.csv").then(csvData => {

        //Create a unique "id" field for each game
        //csvData.forEach( (d, i) => {
        //    d.id = d.Team + d.Opponent + i;
        //});

        //Create Tree Object
        //let tree = new Tree();
        //tree.createTree(csvData);

        //Create Table Object and pass in reference to tree object (for hover linking)

        //let table = new Table(data,tree);

        //table.createTable();
        //table.updateTable();
    });
});



// // ********************** HACKER VERSION ***************************
/**
 * Loads in fifa-matches-2018.csv file, aggregates the data into the correct format,
 * then calls the appropriate functions to create and populate the table.
 *
 */

d3.csv("data/fifa-matches-2018.csv").then( matchesCSV => {

    let ranking = {
        "Winner": 7,
        "Runner-Up": 6,
        "Third Place": 5,
        "Fourth Place": 4,
        "Semi Finals": 3,
        "Quarter Finals": 2,
        "Round of Sixteen": 1,
        "Group": 0
    };

    let rankOrder = function(d){
        for(let iter in ranking) {
            if (ranking[iter] == d) {
                return iter;
            }
        }
    };

     /**
      * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
      *
      */

     let teamData = d3.nest()
         .key(d => d.Team)
         .rollup(leaves => {
             let myObj = new Object;
             let rankIndex = d3.max(leaves, d=>ranking[d.Result]);
             myObj["Goals Made"] = d3.sum(leaves, function(l){ return l["Goals Made"]; });
             myObj["Goals Conceded"] = d3.sum(leaves, function(l){ return l["Goals Conceded"]; });
             myObj["Delta Goals"] = myObj["Goals Made"] - myObj["Goals Conceded"];
             myObj.Wins = d3.sum(leaves, function(l){ return l.Wins; });
             myObj.Losses = d3.sum(leaves, function(l){ return l.Losses; });
             myObj.Result = {"label": rankOrder(rankIndex), "ranking": rankIndex};
             myObj.TotalGames = leaves.length;
             myObj.type = "aggregate";
             myObj.games = d3.nest()
                 .key(d => d.Opponent)
                 .rollup(games => {
                     let leaf = games[0];
                     let gameObj = new Object;
                     let gameIndex = d3.max(games, d=>ranking[d.Result]);
                     gameObj["Goals Made"] = leaf["Goals Made"];
                     gameObj["Goals Conceded"] = leaf["Goals Conceded"];
                     gameObj["Delta Goals"] = gameObj["Goals Made"] - gameObj["Goals Conceded"];
                     gameObj.Wins = [];
                     gameObj.Losses = [];
                     gameObj.Result = {"label": rankOrder(gameIndex), "ranking": gameIndex};
                     gameObj.type = "game";
                     gameObj.Opponent = leaf.Team;
                     return gameObj;
                 })
                 .entries(leaves);
             myObj.games.sort(function(x, y){
                 return d3.descending(x.value.Result.ranking, y.value.Result.ranking);
             });
             return myObj;
         })
         .entries(matchesCSV);

     //console.log(teamData);

     d3.csv("data/fifa-tree-2018.csv").then( treeCSV => {

        // ******* TODO: PART I *******
         //Create a unique "id" field for each game
         treeCSV.forEach( (d, i) => {
             d.id = d.Team + d.Opponent + i;
         });

         //Create Tree Object
         let tree = new Tree();
         tree.createTree(treeCSV);

         //Create Table Object and pass in reference to tree object (for hover linking)

         let table = new Table(teamData,tree);

         table.createTable();
         table.updateTable();
     });
});
// ********************** END HACKER VERSION ***************************
