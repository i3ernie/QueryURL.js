import QueryURL from "../../src/QueryURL.es.js"


const myURL = new QueryURL({

    queries:["age", "time", "name", "id"], 

    types : { "age" : "integer" },
    alias : { "id" : ["lizenz", "lizno"] },
    ignore : ["lizenz", "OKPage"],

    prefix : "OKP"

});

console.log( myURL.getAll() ); 
console.log( myURL.getQuery("age"), myURL.getQuery("id") );