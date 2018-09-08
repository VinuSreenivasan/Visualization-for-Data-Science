/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
        this.nodeList = [];
        for (let i of json) {
            let node = new Node(i.name, i.parent);
            this.nodeList.push(node);
        }
    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
        let root;
        for (let i = 0; i < this.nodeList.length; i++) {
            let current = this.nodeList[i];
            if (current.parentName === "root") {
                root = current;
            }
            for (let j = 0; j < this.nodeList.length; j++) {
                if (current.name === this.nodeList[j].parentName) {
                    current.addChild(this.nodeList[j]);
                }
                if (current.parentName === this.nodeList[j].name) {
                    current.parentNode = this.nodeList[j];
                }
            }
        }
        this.assignLevel(root, 0);
        this.assignPosition(root, 0);
    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
        node.level = level;
            for (let n of node.children) {
                this.assignLevel(n, level+1);
            }
    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
        node.position = position;

        let minPosition = 1000;
        if (node.parentNode != null) {
            node.parentNode.children.forEach(function(d) {
                if (minPosition > d.position) {
                    minPosition = d.position;
                }
            });
            if (minPosition != -1) {
                node.parentNode.position = minPosition;
            }
        }

        for (let n of node.children) {
            let maxPosition = -1, newPosition;

            this.nodeList.forEach(function(d){
                if (d.level === n.level) {
                    if (d.position > maxPosition) {
                        maxPosition = d.position;
                    }
                }
            });

            if (maxPosition === -1) {
                newPosition = n.parentNode.position;
            } else {
                newPosition = maxPosition + 1;
            }

            this.assignPosition(n, newPosition);
        }
    }


    /**
     * Function that renders the tree
     */
    renderTree() {
        let div = d3.select("body");
        div.append("svg")
            .attr("width", 1200)
            .attr("height", 1200);

        let svg = d3.select("svg");
        let selection = svg.selectAll("line").data(this.nodeList)
        let lines = selection.enter().append("line")
        selection.exit().remove();
        selection = lines.merge(selection);
        selection.attr("x1", (d)=> {return (d.level+1)*150})
                 .attr("y1", (d)=> {return (d.position+1)*100})
                 .attr("x2", (d)=> {return d.parentNode ? (d.parentNode.level+1)*150 : (d.level+1)*150;})
                 .attr("y2", (d)=> {return d.parentNode ? (d.parentNode.position+1)*100 : (d.position+1)*100;});


        let nodes = svg.selectAll("nodeGroup").data(this.nodeList)
        let group = nodes.enter().append("g").classed("nodeGroup", true)
        nodes.exit().remove();
        nodes = group.merge(nodes);

        nodes.append("circle")
            .attr("r", 40);

        nodes.append("text")
            .attr("class", "label")
            .text((d)=> {return d.name.toUpperCase()});

        nodes.attr("transform", (d)=>{return "translate("+[(d.level+1)*150, (d.position+1)*100]+")";});
    }
}