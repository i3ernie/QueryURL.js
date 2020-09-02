const gulp = require('gulp');
const rollup  = require('rollup');
const rollupTerser = require('rollup-plugin-terser');

gulp.task("buildAMD", ( done ) => {
    return rollup.rollup({
        input : 'src/QueryURL.es.js'
        
        ,plugins:[
        ]
    }).then(( bundle ) => { 
        bundle.write({
            file: './dist/QueryURL.js',
            
            format: 'umd',
            name: 'QueryURL',
            exports: 'named',
            sourcemap: false
          });
          done();
    }).catch(
        (err)=>{console.error(err);}
    );
});

//plugins: []

gulp.task("buildAMDmin", ( done ) => {
    return rollup.rollup({
        input : 'src/QueryURL.es.js'
        
        ,plugins:[
            rollupTerser.terser()
        ]
    }).then(( bundle ) => { 
        bundle.write({
            file: './dist/QueryURL.min.js',
            
            format: 'umd',
            name: 'QueryURL',
            exports: 'named',
            sourcemap: true
          });
          done();
    }).catch(
        (err)=>{console.error(err);}
    );
});

gulp.task("buildES", ( done ) => {
    return rollup.rollup({
        input : 'src/QueryURL.es.js'
        ,plugins:[ ]
    }).then(( bundle ) => { 
        bundle.write({
            file: './dist/QueryURL.es.js',
            
            format: 'es',
            name: 'QueryURL',
            exports: 'named',
            sourcemap: false
          });
          done();
    }).catch(
        (err)=>{console.error(err);}
    );
});

gulp.task("buildESmin", ( done ) => {
    return rollup.rollup({
        input : 'src/QueryURL.es.js'
        
        ,plugins:[
            rollupTerser.terser()
        ]
    }).then(( bundle ) => { 
        bundle.write({
            file: './dist/QueryURL.es.min.js',
            
            format: 'es',
            name: 'QueryURL',
            exports: 'named',
            sourcemap: true
          });
          done();
    }).catch(
        (err)=>{console.error(err);}
    );
});

gulp.task("build", gulp.parallel("buildES", "buildAMD", "buildESmin", "buildAMDmin") );