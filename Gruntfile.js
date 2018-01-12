module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: ['client/scripts/*.js',
              'client/scripts/**/*.js',
              'client/scripts/**/**/*.js',
              'client/scripts/**/**/**/*.js'],
        dest: 'app/static/scripts/client.min.js'
      }
    },
    copy: {
      bgimage: {
        expand: true,
        cwd: 'client/bgimage/',
        src: ['*.jpg'],
        dest: 'app/static/bgimage/'
      },
      html: {
        expand: true,
        cwd: 'client/views',
        src: ['index.html',
              '**/*.html',
              '**/**/*.html',
              '**/**/**/*.html'],
        dest: 'app/static/views/'
      },
      css: {
        expand: true,
        cwd: 'client/styles',
        src: ['style.css'],
        dest: 'app/static/styles/'
      },
      bootstrap: {
        expand: true,
        cwd: 'node_modules/bootstrap/dist/',
        src: ['css/bootstrap.css',
              'fonts/*.*'],
        dest: 'app/static/vendors/bootstrap/'
      },
      angular: {
        expand: true,
        cwd: 'node_modules/angular/',
        src: ['angular.js',
              'angular.min.js',
              'angular.min.js.map'],
        dest: 'app/static/vendors/angular/'
      },
      angularRoute: {
        expand: true,
        cwd: 'node_modules/angular-route/',
        src: ['angular-route.js',
              'angular-route.min.js',
              'angular-route.min.js.map'],
        dest: 'app/static/vendors/angular-route/'
      },
      angularbootstrap: {
        expand: true,
        cwd: 'node_modules/angular-ui-bootstrap/dist',
        src: 'ui-bootstrap.js',
        dest: 'app/static/vendors/angular-ui-bootstrap/'
      },
    },
    // watch: {
    //   options: {
    //     livereload: true
    //   },
    //   files: [
    //     'client/**/*.*',
    //     'client/**/**/*.*',
    //     'client/**/**/**/*.*'
    //   ],
    //   //'uglify',
    //   tasks: ['uglify', 'copy']
    // }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-watch');

  //'watch'
  grunt.registerTask('default', ['uglify', 'copy']);
};
