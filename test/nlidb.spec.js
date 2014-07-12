var nlidb = require('../lib/nlidb')();

describe('NLIDB', function () {
  
  it('has function treefy, used to make tree off a query string', function () {
    var str = '';
    var res = nlidb.treefy(str);
    expect(Object.keys(res).length).toBe(2);
    
    var str = 'OneWord';
    var res = nlidb.treefy(str);
    expect(Object.keys(res).length).toBe(2);
    expect(res.value).toBe('OneWord');
    
    var str = 'Two words';
    var res = nlidb.treefy(str);
    expect(Object.keys(res).length).toBe(1);
    expect(res.value.length).toBe(2);
    expect(res.value[0].value).toBe('Two');
    expect(res.value[1].value).toBe('words');
    
    var str = 'And three words';
    var res = nlidb.treefy(str);
    expect(Object.keys(res).length).toBe(1);  
    expect(res.value[0].value).toBe('And');
    expect(res.value[1].value.length).toBe(2);
    expect(res.value[1].value[0].value).toBe('three');
    expect(res.value[1].value[1].value).toBe('words');    
  });
  
});
