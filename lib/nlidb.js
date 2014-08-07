module.exports = Nlidb;

function Nlidb (nlidb_core, nlidb_query, thesaurus) {
  if (!thesaurus.get) {
    throw new Error('Thesaurus should have method "get".');// get needs to be really async
  }
  this.isCb = thesaurus.get.length === 2;
  this.ncore = nlidb_core;
  this.nquery = nlidb_query;
  this.thesaurus = thesaurus;
}

Nlidb.prototype.streams = function (arg, cb) {
  if (this.isCb && !cb) {
    throw new Error('You have to pass a callback due to async thesaurus.');
  }
  if (typeof arg === 'string') {
    arg = this.treefy(arg);
  } else if (!arg || typeof arg !== 'object') {
    return [];
  }
  if (this.isCb) {
    this.semantify(arg, function (err, tree) {
      if (err) return cb(err);
      var query = this.ncore.process(tree);
      var strms = this.nquery(query);
      cb(null, strms);
    });
  } else {
    var query = this.ncore.process(this.semantify(arg));
    var strms = this.nquery(query);
    if (cb) {
      cb(null, strms);
    } else {
      return strms;
    }
  }  
};
  
Nlidb.prototype.treefy = function (str) {
  var els = str.split(' ');
  var len = els.length;
  var tree = {};
  var t = tree;
  for (var i = 0; i < len - 1; i++) {
    t.value = [{value: els[i], isLeaf: true}, {}];
    t = t.value[1];
  }
  if (len) {
    t.value = els[len - 1];
    t.isLeaf = true;
  }
  return tree;
};
  
Nlidb.prototype.semantify = function (tree, cb) {
  var that = this;
  if (cb) {
    var leafCount = 0;
    var leafsExtended = 0;
    this.onLeaf(tree, function (leaf) {
      leafCount++;
      that.thesaurus.get(leaf.value, function (err, extLeaf) {
        if (err) return cb(err); 
        leafsExtended++;
        if (!extLeaf || !extLeaf.occurrences) {
          leaf.occurs = [];
        } else {
          leaf.occurs = extLeaf.occurrences;
        }
        if (leafsExtended === leafCount) {
          cb(null, tree);
        }
      });
    });
  } else {
    this.onLeaf(tree, function (leaf) {
      leaf.occurs = that.thesaurus.get(leaf.value);
    });
    return tree;
  }
};
  
Nlidb.prototype.onLeaf = function onLeaf (tree, cb) {
  if (tree.isLeaf) {
    cb(tree);
  } else {
    for (var k in tree) {
      onLeaf(tree[k], cb);
    }
  }
};
