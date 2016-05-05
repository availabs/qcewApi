"use strict";

var compileAssets = [
    'clean:dev',
    'jst:dev',
    'less:dev',
    'copy:dev',
    'coffee:dev',
];


module.exports = function (grunt) {
    grunt.registerTask('compileAssets', compileAssets);
};
