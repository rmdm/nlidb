module.exports = function (thesaurus, db, links, functions){

  var nlidb_core = new (require('nlidb-core'));
  var nlidb_query = require('nlidb-query')(db, links, functions);
  
  function streams (arg) {
    if (typeof arg === 'string') {
      arg = treefy(arg);
    }
    var query = nlidb_core.process(semantify(arg));
    return nlidb_query(query);
  };
  
  function treefy (str) {
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
  }
  
  function semantify (tree) {
    onLeaf(tree, function (leaf) {
      leaf.occurs = thesaurus.get(leaf.value);
    });
    return tree;
  }
  
  function onLeaf (tree, cb) {
    if (tree.isLeaf) {
      cb(tree);
    } else {
      for (var k in tree) {
        onLeaf(tree[k], cb);
      }
    }
  }

  return {
    streams: streams,
    treefy: treefy,
    semantify: semantify,
    onLeaf: onLeaf
  };
  
};
