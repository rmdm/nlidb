module.exports = Nlidb;

function Nlidb (nlidb_core, nlidb_query, thesaurus) {
  this.ncore = nlidb_core;
  this.nquery = nlidb_query;
  this.thesaurus = thesaurus;
}

Nlidb.prototype.streams = function (arg, alt, cb) {
  if (typeof alt === 'function') {
    cb = alt;
  }
  that = this;
  arg = this.treefy(arg, alt);
  this.semantify(arg, function (err, tree) {
    if (err) return cb(err);
    try { 
      var query = that.ncore.process(tree);
      var strms = that.nquery.process(query);
    } catch (e) {
      return cb(e);
    }
    return cb(null, strms);
  });
};
  
Nlidb.prototype.treefy = function (str, alt) {
  var els = str.split(' ');
  var als = str.split(' ');
  var len = els.length;
  var tree = {};
  var t = tree;
  for (var i = 0; i < len - 1; i++) {
    t.value = [{value: els[i], alt: als[i], isLeaf: true}, {}];
    t = t.value[1];
  }
  if (len) {
    t.value = els[len - 1];
    t.alt = als[len - 1];
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
        if (!extLeaf || !extLeaf.occurrences || !extLeaf.occurrences.length) {
          that.thesaurus.get(leaf.alt, function (err, extLeaf) {
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
        } else {
          leafsExtended++;
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
