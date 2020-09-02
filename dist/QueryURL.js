(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.QueryURL = {}));
}(this, (function (exports) { 'use strict';

    const defaults = {
        queries : [],
        alias : {},
        ignore : [],

        prefix : "",

        types : {
        } 
    };

    const __typeCast = function( str, type ){

        if ( type === "integer") {
            return parseInt( str );
        }

        if ( type === "number") {
            return parseFloat( str );
        }

        if ( type === "plainJSON" ) {
            return str;
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
                if ( val ) {
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
                return this._parse( qry, res ); 
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
                        res[i] = __typeCast( res, this.options.types[ qry ] );
                    }
                }
                
            }

            return res;
        }
    });

    exports.QueryURL = QueryURL;
    exports.default = QueryURL;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
