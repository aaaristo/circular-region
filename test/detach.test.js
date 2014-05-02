var should= require('chai').should(),
    assert= require('chai').assert,
    region=  require('../index.js');

var cir= function ()
{
    var a= { nome: 'Andrea' },
        e= { nome: 'Elena' };

    a.figlia= e;
    a.figlia2= e;
    e.papa= a;

    return [a,3,[e,a]];
};

describe('region',function ()
{
       it('can detach a subgraph from a graph, and reattach it', function (done)
       {
           var gph= cir(),
               reg= region({ graph: gph, key: 'nome' }),
               sub= { a: gph[0], e: gph[2][0], x: 5, arr: [gph[0],gph[2][0]] },
               detached= reg.detach(sub),
               attached= reg.attach(detached);

           should.exist(detached); 
           should.exist(detached['@a']);
           detached['@a'].should.equal('Andrea');
           detached['@e'].should.equal('Elena');
           detached.arr[0]['@'].should.equal('Andrea');
           detached.arr[1]['@'].should.equal('Elena');
           detached.x.should.equal(5);

           attached.a.should.equal(gph[0]); 
           attached.e.should.equal(gph[2][0]); 
           attached.arr[0].should.equal(gph[0]); 
           attached.arr[1].should.equal(gph[2][0]); 
           attached.x.should.equal(5); 
           done();
       });
});
