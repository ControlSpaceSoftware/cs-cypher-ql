# cs-cypher-ql
fluent api for simple cypher queries 

# Goals
 	Write cyphers with syntactic sugar from fluent api:
 		• only see valid options returned from each element in context
 		• throw errors when bad cypher is written
 		• reuse parts of a cypher to reduce code clutter

I want to be able to write something like this
```
    MATCH (u:Person {key: $personKey})-[:OWNS]->(item:Item {key: $itemKey})
    OPTIONAL MATCH (item)-[v:Color]->(:Color)
    OPTIONAL MATCH (item)<-[s:Size]-(:Size)
    RETURN "ITEM" as type, toFloat(count(DISTINCT s)) as count,
        item.name as name,
        collect(item.desc)[0] as latestDesc,
        collect(distinct toFloat(v.price)) as prices
```

 Something like:
```
    Cypher.QL.Match.Node('u', 'Person').WithParam('key', '$personKey').Via.Edge('', 'OWNS').To.Node('item', 'Item')
        .Optional.Match.Node('item').Via.Edge('v', 'Color').To.Node('', 'Color')
        .Optional.Match.Node('item').To.Edge('s', 'Size').Via.Node('', 'Size')
        .Return.Literal('ITEM').As('type')
        .And.Value('item.name').As('name')
        .And.Float.Count.Distinct.Value('s').As('count')
        .And.Collect.Value('item.desc').Sub(0).As('latestDesc')
        .And.Collect.Distinct.Float.Value('v.price').As('prices')
        .toString();
```
