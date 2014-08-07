var thesaurusAsync = {
  get: function (word, cb) {
    setTimeout( function () {//get needs to be really async
      cb(null, {occurrences: ['a', 'b']});
    }, 0);
  }
};
var Nlidb = require('../lib/nlidb');
var nlidbAsync = new Nlidb(null, null, thesaurusAsync);

describe('NLIDB', function () {

  it('has function semanity that can be used async-ly, used to extend parse tree leaves with semantic information', function () {
    var tree = {
      value: [
        {isLeaf: true, value: 'a'},
        {isLeaf: true, value: 'b'}
      ]
    };
    nlidbAsync.semantify(tree, function (err, res) {
      expect(res.value[0].occurs[0]).toBe('a');
      expect(res.value[0].occurs[1]).toBe('b');
      expect(res.value[1].occurs[0]).toBe('a');
      expect(res.value[1].occurs[1]).toBe('b');
    });    
  });
  
});
