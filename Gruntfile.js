module.exports = function (grunt) {

    //Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            main: 'dist/build/*',
            docs: 'dist/docs/*'
        },
        copy: {
            docs: {
                src: 'logo.png',
                dest: 'dist/docs/img/logo.png'
            },
            docs_build: {
                files: [{
                    expand: true,
                    cwd: 'dist/build/',
                    src: '**',
                    dest: 'dist/docs/scripts/madnhjs/'
                }]
            }
        },
        concat: {
            madnh_with_underscore: {
                src: ['src/underscore.js', 'src/madnh.js'],
                dest: 'dist/build/underscore_madnh.js'
            },
            dialog: {
                src: ['src/extensions/Dialog/dialog.js',
                    'src/extensions/Dialog/dialog_button.js',
                    'src/extensions/Dialog/dialog_helpers.js',
                    'src/extensions/Dialog/templates/Dialogs/bootstrap.js',
                    'src/extensions/Dialog/templates/Buttons/bootstrap.js'
                ],
                dest: 'dist/build/extensions/dialog.js'
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                ext: '.min.js'
            },
            madnh: {
                src: 'src/madnh.js',
                dest: 'dist/build/madnh.min.js'
            },
            madnh_with_underscore: {
                src: 'dist/build/underscore_madnh.js',
                dest: 'dist/build/underscore_madnh.min.js'
            },
            extensions: {
                files: [{
                    expand: true,
                    cwd: 'src/extensions',
                    src: '*.js',
                    dest: 'dist/build/extensions'
                }]
            },
            dialog_concatenated: {
                src: 'dist/build/extensions/dialog.js',
                dest: 'dist/build/extensions/dialog.min.js'
            }
        },
        jsdoc: {
            dist: {
                src: ['src/madnh.js'],
                options: {
                    destination: 'dist/docs',
                    configure: 'jsdoc_config.json',
                    template: 'node_modules/ink-docstrap/template',
                    readme: 'README.md',
                    tutorials: "tutorials"
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('build', ['clean:main', 'concat', 'uglify']);
    grunt.registerTask('docs', ['clean:docs', 'jsdoc', 'copy:docs', 'copy:docs_build']);
    grunt.registerTask('default', ['build', 'docs']);
};