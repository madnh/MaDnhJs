module.exports = function (grunt) {

    //Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: 'build/*',
        concat: {
            madnh_with_underscore: {
                src: ['src/underscore.js', 'src/madnh.js'],
                dest: 'build/underscore_madnh.js'
            },
            dialog: {
                src: ['src/extensions/Dialog/dialog.js',
                    'src/extensions/Dialog/dialog_button.js',
                    'src/extensions/Dialog/dialog_helpers.js',
                    'src/extensions/Dialog/templates/Dialogs/bootstrap.js',
                    'src/extensions/Dialog/templates/Buttons/bootstrap.js'
                ],
                dest: 'build/extensions/dialog.js'
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                ext: '.min.js'
            },
            madnh: {
                src: 'src/madnh.js',
                dest: 'build/madnh.min.js'
            },
            madnh_with_underscore: {
                src: 'build/underscore_madnh.js',
                dest: 'build/underscore_madnh.min.js'
            },
            extensions: {
                files: [{
                    expand: true,
                    cwd: 'src/extensions',
                    src: '*.js',
                    dest: 'build/extensions'
                }]
            },
            dialog_concatenated: {
                src: 'build/extensions/dialog.js',
                dest: 'build/extensions/dialog.min.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask('default', ['clean', 'concat', 'uglify']);
};