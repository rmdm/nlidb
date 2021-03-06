var thesaurus = {
  get: function (word) {
  return ['a', 'b'];
  }
};
var Nlidb = require('../lib/nlidb');
var nlidb = new Nlidb(null, null, thesaurus);

describe('NLIDB', function () {
  
  it('has function treefy, used to make tree off a query string', function () {
    var str = '';
    var alt = '';
    var res = nlidb.treefy(str, alt);
    expect(Object.keys(res).length).toBe(3);
    
    var str = 'OneWord';
    var alt = 'oneword';
    var res = nlidb.treefy(str, alt);
    expect(Object.keys(res).length).toBe(3);
    expect(res.value).toBe('OneWord');
    
    var str = 'Two words';
    var alt = 'two words'
    var res = nlidb.treefy(str, alt);
    expect(Object.keys(res).length).toBe(1);
    expect(res.value.length).toBe(2);
    expect(res.value[0].value).toBe('Two');
    expect(res.value[1].value).toBe('words');
    
    var str = 'And three words';
    var alt = 'and three words';
    var res = nlidb.treefy(str, alt);
    expect(Object.keys(res).length).toBe(1);  
    expect(res.value[0].value).toBe('And');
    expect(res.value[1].value.length).toBe(2);
    expect(res.value[1].value[0].value).toBe('three');
    expect(res.value[1].value[1].value).toBe('words');    
  });
  
  it('has function semanity, used to extend parse tree leaves with semantic information', function () {
    var tree = {
      value: [
        {isLeaf: true, value: 'a'},
        {isLeaf: true, value: 'b'}
      ]
    };
    var res = nlidb.semantify(tree);
    expect(res.value[0].occurs[0]).toBe('a');
    expect(res.value[0].occurs[1]).toBe('b');
    expect(res.value[1].occurs[0]).toBe('a');
    expect(res.value[1].occurs[1]).toBe('b');
  });
  
  it('has function onLeaf, used to make some action when leaf is encountered', function () {
    var tree = {
      value: {
        value: [
          {
            value: {isLeaf: true, value: 'a'}
          },
          {isLeaf: true, value: 'b'}
        ]
      }
    };
    nlidb.onLeaf(tree, function (leaf) {
      expect(leaf.value === 'a' || leaf.value === 'b').toBe(true);
    });
  });
  
});
