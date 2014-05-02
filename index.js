var clone= require('circularclone'),
    traverse= require('circularjs'),
    _= require('underscore');

module.exports= function (opts)
{
   opts= _.defaults(opts || {},{ key: '_id', ref: '@' });

   var idmap= {},
       _contains= function (val)
       {
          return val&&val[opts.key]&&!!idmap[val[opts.key]];
       },
       _get= function (key)
       {
          return idmap[key];
       },
       _set= function (key,node)
       {
          idmap[key]= node;
       };

   if (opts.graph)
     traverse(opts.graph,
     function (node)
     {
        var key= node[opts.key];

        if (key!==undefined)
          _set(key,node);
     });

   return {
             set: _set,
             unset: function (key)
             {
                idmap[key]= undefined;
             },
             get: _get,
             contains: _contains,
             detach: function (sub)
             {
                return clone(sub,function (key,clonedValue,clone,node,origValue)
                {
                  if (_contains(origValue))
                  {
                     if (typeof key=='number')
                     {
                        var r= {};
                        r[opts.ref]= origValue[opts.key];
                        return r;
                     }
                     else
                     {
                        clone[opts.ref+key]= origValue[opts.key];
                        return undefined;
                     }
                  }
                  else
                    return clonedValue;
                },
                _contains);
             },
             attach: function (sub)
             {
                return clone(sub,function (key,clonedValue,clone,node,origValue)
                {
                  if (typeof key=='number'&&origValue[opts.ref]!==undefined)
                    return _get(origValue[opts.ref]);
                  else
                  if (key.indexOf(opts.ref)==0)
                  {
                    clone[key.substring(opts.ref.length)]= _get(origValue);
                    return undefined;
                  }
                  else
                    return clonedValue;
                });
             } 
          };
};
