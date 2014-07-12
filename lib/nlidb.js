module.exports = function (db, links, functions){

  var nlidb_core = new (require('nlidb-core'));
  var nlidb_query = require('nlidb-query')(db, links, functions);
  
  function streams (arg) {
    if (typeof arg === 'string') {
      arg = treefy(arg);
    }
    var query = nlidb_core.process(arg);
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

  return {
    streams: streams,
    treefy: treefy
  };
  
};
