module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-php');
    grunt.loadNpmTasks('grunt-shell');

    grunt.initConfig({
        php: {
            dist: {
                options: {
                    keepalive: true,
                    open: true,
                    port: 8085,
                    router: "index.php"
                }
            }
        },
        shell: {
            generate: {
                command: 'php generate --destination=../docs'
            }
        }
    });

    grunt.registerTask('default', ['php']);
    grunt.registerTask('docs', ['shell:generate']);
};
