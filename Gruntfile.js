module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    //Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            main: 'dist/*'
        },
        copy: {
            main: {
                src: 'src/underscore.js',
                dest: 'dist/underscore.js'
            }
        },
        concat: {
            madnhjs: {
                src: ['src/core/core.js',
                    'src/core/extensions/flag.js',
                    'src/core/extensions/base_class.js',
                    'src/core/extensions/pre_options.js',
                    'src/core/extensions/content_manager.js',
                    'src/core/extensions/priority.js',
                    'src/core/extensions/waiters.js',
                    'src/core/extensions/event_emitter.js',
                    'src/core/extensions/cache.js',
                    'src/core/extensions/task.js',
                    'src/core/extensions/app.js',
                    'src/core/extensions/ajax.js'],
                dest: 'dist/madnh.js'
            },
            madnh_with_underscore: {
                src: ['src/underscore.js', 'dist/madnh.js'],
                dest: 'dist/underscore_madnh.js'
            },
            dialog: {
                src: ['src/extensions/Dialog/dialog.js',
                    'src/extensions/Dialog/dialog_button.js',
                    'src/extensions/Dialog/dialog_helpers.js',
                    'src/extensions/Dialog/templates/Dialogs/bootstrap.js',
                    'src/extensions/Dialog/templates/Buttons/bootstrap.js'
                ],
                dest: 'dist/extensions/dialog.js'
            },
            madnhjs_extensions: {
                src: [
                    'src/extensions/app_dom_plugin.js',
                    'src/extensions/template.js',
                    'src/extensions/jform.js',
                    'dist/extensions/dialog.js'
                ],
                dest: 'dist/madnh_extensions.js'
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                ext: '.min.js'
            },
            madnh: {
                src: 'dist/madnh.js',
                dest: 'dist/madnh.min.js'
            },
            madnh_with_underscore: {
                src: 'dist/underscore_madnh.js',
                dest: 'dist/underscore_madnh.min.js'
            },
            extensions: {
                src: 'dist/madnh_extensions.js',
                dest: 'dist/madnh_extensions.min.js'
            },
            dialog_concatenated: {
                src: 'dist/extensions/dialog.js',
                dest: 'dist/extensions/dialog.min.js'
            }
        }
    });

    
    grunt.registerTask('build', ['clean:main', 'copy:main', 'concat', 'uglify']);
    grunt.registerTask('default', ['build']);
};