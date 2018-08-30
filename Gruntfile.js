module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      

      /*bower: {
        install: {
            options: {
                targetDir: "static/bower_components",
                install: true,
                verbose: false,
                cleanTargetDir: true,
                cleanBowerDir: false,
                bowerOptions: {
                    directory : "./bower_components"
                }
            }
        },
      },*/

      clean: {
        options: {
              force: true,
              expand: true
          },
        coverage: ['tests/coverage'],
        all: ['bower_components'],
        apidocs: ['apidoc']
      },

      watch: {
          sass: {
            files: ['static/sass/*.scss'],
            tasks: ['sass:dist']
          },
      },

      availabletasks: {
          tasks: {
              options: {
                  filter: 'include',
                  tasks: ['dev-setup'],
                  groups: {
                    'Dev build tasks': ['dev-setup']
                  },
                  descriptions: {
                    'dev-setup': 'Install necessary npm modules and project code into the ./dist directory. (Only needed once per branch unless you are changing runtime node or bower component dependencies.',
                  }
              }
          }
      },

      jshint: {
          options: {
            // options here to override JSHint defaults
            globals: {
              jQuery: true,
              console: true,
              module: true,
              document: true
            },
          },
          browser: {
              files: {
                src: ['static/**/*.js', '!static/bower_components/**', '!static/js/date.js']
              }
          },
          server: {
              files: {
                src: ['routes/**/*.js', 'app.js']
              }
          }
      }
    });
  
    grunt.loadNpmTasks('grunt-available-tasks');
    grunt.loadNpmTasks('grunt-bower-installer');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-istanbul');
  
    // Default task(s).
    grunt.registerTask('dev-setup', ['clean:all', /*'bower', 'sass:dist',*/ 'jshint:browser']);
    grunt.registerTask('dev-test-cov', ['clean:coverage']);
    
  
  };