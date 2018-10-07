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

     /**
      * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
      *
      */

     let teamData = d3.nest()
         .key(d => d.Team)
         .rollup(leaves => {
             let obj = {};
             obj["Goals Made"] = d3.sum(leaves, function(l){ return l["Goals Made"]; });
             obj["Goals Conceded"] = d3.sum(leaves, function(l){ return l["Goals Conceded"]; });
             obj["Delta Goals"] = obj["Goals Made"] - obj["Goals Conceded"];
             obj.Wins = d3.sum(leaves, function(l){ return l.Wins; });
             obj.Losses = d3.sum(leaves, function(l){ return l.Losses; });
             obj.Result = {"label": leaves[0].Result, "ranking": ranking[leaves[0].Result]};
             obj.TotalGames = leaves.length;
             obj.type = "aggregate";
             obj.games = d3.nest()
                 .key(d => d.Opponent)
                 .rollup(games => {
                     let leaf = games[0];
                     let game = {};
                     game["Goals Made"] = leaf["Goals Made"];
                     game["Goals Conceded"] = leaf["Goals Conceded"];
                     game["Delta Goals"] = game["Goals Made"] - game["Goals Conceded"];
                     game.Wins = [];
                     game.Losses = [];
                     game.Result = {"label": leaf.Result, "ranking": ranking[leaf.Result]};
                     if(obj.Result.ranking < ranking[leaf.Result]) {
                         obj.Result = game.Result;
                     }
                     game.type = "game";
                     game.Opponent = leaf.Team;
                     return game;
                 })
                 .entries(leaves);
             return obj;
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
