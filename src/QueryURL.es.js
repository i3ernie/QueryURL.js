const defaults = {
    queries : [],
    alias : {},
    ignore : [],

    prefix : "",

    types : {
    } 
};

const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const __typeCast = function( str, type ){

    if ( type === "integer" ) {
        return parseInt( str );
    }

    if ( type === "number" ) {
        let num = parseFloat( str );
        return isNaN( num )? null : num;
    }

    if ( type === "boolean" ) {

        if ( str === "true" || str === "1" )
        {
            return true;
        }
        if ( str==="false" || str === "0" ){
            return false;
        }
        return null;
    }

    if ( type === "plainJSON" ) {
        let ret = str;

        try {
            let res = {};
            str.split( ',' ).forEach( function ( el ) { 
                let q = el.split( ':' );
                
                res[ q[0] ] = q[1];
                
            } );
            ret = res;
        } catch ( e ) {
            console.error( "ERROR in Parameter " + str + ": " + type, e );
        }
        return ret;
    }

    if ( type === "list" ) {
        let ret = str;

        try {
            let res = [];

            str.split( ',' ).forEach( function ( el ) {     
                res.push( el );
            } );

            ret = res;
        } catch ( e ) {
            console.error( "ERROR in Parameter " + str + ": " + type, e );
        }
        return ret;
    }

    if ( type === "uuid") { 
        return uuidV4Regex.test( str )? str : null;
    }

    return str;
};

const QueryURL = function( urlStr, opts ) {

    if ( typeof urlStr === "string") {
        this.url = new URL( urlStr );
        
    } else {
        this.url = new URL( document.location.href );
        opts = urlStr;
    }

    if ( !opts ) return;

    this.options = Object.assign( {}, defaults );

    if ( typeof opts.queries === "object" ) {
        this.options.queries = opts.queries;
    }
    if ( typeof opts.alias === "object" ) {
        this.options.alias = opts.alias;
    }
    if ( typeof opts.prefix === "string" ) {
        this.options.prefix = opts.prefix;
    }
    if ( typeof opts.types === "object" ) {
        this.options.types = opts.types;
    }
    if ( typeof opts.ignore === "object" ) {
        this.options.ignore = opts.ignore;
    }
};

QueryURL.prototype = Object.assign( Object.create( QueryURL.prototype ), {

    setQueries : function( queries ) {
        this.options.queries = queries;
    },

    setType : function( param, type ){
        this.options.types[param] = type;
    },

    setPrefix : function( pref ){
        if ( typeof pref === "string" ) {
            this.options.prefix = pref;
        }
    },

    addQuery : function(){

    },

    addAlias : function( param, alias) {

        if ( !this.options.alias[param] ) {
            this.options.alias[param] = [];
        }
        if ( typeof alias === "string" ) {
            this.options.alias[param].push( alias );
        }

    },

    getAll : function( ) {
        
        let ret = {};

        let qry, val;

        for ( let i = 0; i < this.options.queries.length; i++ ) {
            qry = this.options.queries[i];
            val = this.getQuery( qry );
            if ( val !== null && val !== undefined ) {
                ret[ qry ] = val;
            }
        }

        return ret;
    },

    getQuery : function( qry ) {
        let params = this.url.searchParams;


        if ( typeof qry !== "string" ) {
            console.error( "Failed execute 'getQuery': 1 argument type of 'string' required" );
            return null;
        }

        let alias = this.options.alias[qry];
        if ( alias ) {

            let res = null;
            for ( let i = 0; i < alias.length; i++ ) {
                
                if( this.options.ignore.indexOf( alias[i] ) < 0 && params.has( alias[i] ) ) { 
                    res =  params.getAll( alias[i] );
                    break;
                    
                }
            }
            if (res) return this._parse( qry, res ); 
        }

        if ( this.options.ignore.indexOf( this.options.prefix + qry ) < 0 && params.has( this.options.prefix + qry) ) {          
            return this._parse( qry, params.getAll( this.options.prefix + qry ) ); 
        }
        
        if( this.options.ignore.indexOf( qry ) < 0 && params.has( qry ) ) {   
            return this._parse( qry, params.getAll( qry ) ); 
        }

        return null;
    },

    _parse : function( qry, res ) {

        if( res.length === 1) {
            res = res[0];

            if ( this.options.types[ qry ] )
            {
                return __typeCast( res, this.options.types[ qry ] );
            }

        } else {

            if ( this.options.types[ qry ] )
            {
                for ( let i = 0; i < res.length; i++ ) {
                    res[i] = __typeCast( res, this.options.types[ qry ] )
                }
            }
            
        }

        return res;
    }
});

export default QueryURL;
export { QueryURL };