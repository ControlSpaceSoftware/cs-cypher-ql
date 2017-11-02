# cs-cypher-ql
fluent api for simple cypher queries 

# Goals
 	Write cyphers with syntactic sugar from fluent api:
 		• only see valid options returned from each element in context
 		• throw errors when bad cypher is written
 		• reuse parts of a cypher to reduce code clutter

I want to be able to write something like this
```
    MATCH (u:Person {key: $personKey})-[:OWNS]->(ctx:Item {key: $itemKey})
    OPTIONAL MATCH (ctx)-[v:Color]-(:Color)
    OPTIONAL MATCH (ctx)<-[s:Size]-()
    RETURN "CTX" as type, toFloat(count(DISTINCT s)) as count,
        ctx.name as name,
        collect(ctx.desc)[0] as latestDesc,
        collect(distinct toFloat(v.price)) as prices
```

 Something like:
```
    Cypher.QL.Match.Node('u', 'Person').WithParam('key', '$personKey').Via.Edge('', 'OWNS').To.Node('ctx', 'Item')
        .Match.Node('ctx').Via.Edge('v', 'Color').Via.Node('', 'Color')
        .Match.Node('ctx').Via.Edge('s', 'Size').Via.Node()
        .Return.Literal('CTX').As('type')
        .And.Float.Count.Distinct.Value('s').As('count')
        .And.Collect.Value('ctx.desc').Sub(0).As('latestDesc')
        .And.Collect.Distinct.Float.Value('v.price').As('prices')
        .toString();
```
