NLIDB - Natural Language Interface to Database
==============================================

Main NLIDB module.

Usage
=====

Firstly you need to configure Nlidb by passing it following objects (all required):

1. an object with method ```streamData(match, relation)```, where match is an object which associate its keys (db attributes) with values, which can be either primitive values or arrays of primitive values; and relation is the name of db entity, containing corresponding attributes (nlidb is db-agonstic, only requirement is the ability to stream data, and to group set of attributes into named entities).
2. links, an object which specifies links between entities. Used to resolve multy-entity queries. Format is the following:
```javascript    
{
  entity1: {
    entity2: {
      attrOfEntity1: attrOfEntity2
    }
  },
  ...
}
```
3. functions:
```javascript
{
  /*
    rel - name of the entity
    k - key to which function is applied
    v - optional value that function can use
    f - array of the others functions that will be applied later.
    You have to push it manually into rel.kvf array as 
    {k: 'someK', v: 'someVoptional', f: 'f'}. 
    It gives you ability to define new attributes of object without losing needed functions. 
  */
  max: function (rel, k, v, f) { 
    if (f.length) {
      rel.kvf.push({k: k, v: v, f: f}); //k can be changed
    }
    return {
      _transform: function (obj, _, cb) {
        if (this.max) {
          if (this.max[0][k] < obj[k]) {
            this.max = [obj];
          } else if(this.max[0][k] === obj[k]) {
            this.max.push(obj);
          }
        } else {
          this.max = [obj];
        }
        cb();   
      },
      _flush: function (cb) {
        for(var i in this.max){
          this.push(this.max[i]);
        }
        cb();
      }
    };
  },
  ...
}
```
When nlidb is configured function accepting one argument is returned.

You need to pass to that function either:

- natural language query parse tree with the following recursive structure:
```
tree is {treeKey: tree}, if there is one child, or
tree is {treeKey: [tree, ...]}, if there is many children
```

or:

- natural language query (in that case predefined structure will be used, but accuracy will be slightly lower)

Nlidb returns an array of streams because of potential ambiguty of initial natural language query.
