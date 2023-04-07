const fs = require("fs");

class ZoneCache {
    constructor() {
        this.zones = {};
        this.tree = {};
    }

    loadFromJson() {
        const data = fs.readFileSync("cache/zones.json");
        this.zones = JSON.parse(data);
        this.RecursiveBuild();

        fs.writeFileSync("cache/zonesTree.json", JSON.stringify(this.tree, null, 4));
    }

    //build a tree of zones, steps are as follows:
    //1. find the zone that has no parent, this is the root
    //2. find all zones that have the root as a parent and add them to the root's children
    //3. repeat step 2 for each child
    RecursiveBuild() {
        //find the root
        let root = null;
        for (let key in this.zones) {
            if (this.zones[key].parentId == null) {
                root = this.zones[key];
                break;
            }
        }

        //build the tree
        this.tree = this.BuildTree(root);
    }

    BuildTree(zone) {
        const tree = {
            name: zone.name, 
            zoneId: zone.zoneId, 
            parentId: zone.parentId,
            children: {}
        };

        for (let key in this.zones) {
            if (this.zones[key].parentId == zone.zoneId) {
                tree.children[this.zones[key].name] = this.BuildTree(this.zones[key]);
            }
        }

        return tree;
    }

    //search the tree for a zone
    binarySearchTree(key) {
        return this.binarySearch(this.tree, key, key);
    }
     
    //search the tree for a zone
    binarySearch(tree, key, steps) {
        if (tree.name == key) {
            return {result: tree, steps};
        }

        for (let child in tree.children) {
            const res = this.binarySearch(tree.children[child], key, steps);
            if (res != null) return {result: res.result, steps:  tree.name + "|" + res.steps};
        }

        return null;
    }
        

}

module.exports = ZoneCache;