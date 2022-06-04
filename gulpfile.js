const { src, dest, watch, parallel } = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// JAVASCRIPT
const terser = require('gulp-terser-js');

function css( done ){
    src('src/scss/**/*.scss') // Identificar el archivo .SCSS a compilar
        .pipe( sourcemaps.init() )
        .pipe( plumber() ) // Para que no se detenga el workflow
        .pipe( sass() ) // Compilar
        .pipe( postcss( [ autoprefixer(), cssnano() ] ) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/css') ) // Almacenarla en el disco duro

    done();
}

function imagenes( done ) {
// OPTIMIZAR Y ALIGERAR IMAGENES
    const opciones = {
        optimizationLevel : 3
    };

    src('src/img/**/*.{jpg}')
        .pipe( cache( imagemin(opciones) ) )
        .pipe( dest('build/img') )

    done();
}

function versionWebp( done ){
// PASAR IMAGENES A WEBP
    const opciones = {
        quality : 50
    };

    src('src/img/**/*.{jpg}')
        .pipe( webp(opciones) )
        .pipe( dest('build/img') )

    done();
}

function versionAvif( done ){
    // PASAR IMAGENES A AVIF
        const opciones = {
            quality : 50
        };
    
        src('src/img/**/*.{jpg}')
            .pipe( avif(opciones) )
            .pipe( dest('build/img') )
    
        done();
}

function javascript( done ){

    src('src/js/**/*.js')
        .pipe( sourcemaps.init() )
        .pipe( terser() )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/js') )

    done();
}

function dev( done ){

    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);

    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( imagenes, versionWebp, versionAvif, javascript, dev );