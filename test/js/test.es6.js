import QueryURL from "../../src/QueryURL.es.js"


const myURL = new QueryURL({

    queries:["age", "time", "name", "id", "variants", "shadow"], 

    types : { 
        "age" : "integer", 
        "variants" :"list",
        "id" : "uuid",
        "shadow" : "boolean"
    },
    alias : { "id" : ["lizenz", "lizno"] },
    ignore : ["lizenz", "OKPage"],

    prefix : "OKP"

});

console.log( myURL.getAll() ); 
console.log( myURL.getQuery("age"), myURL.getQuery("id") );