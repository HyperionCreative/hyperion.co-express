'use strict';

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var appConfig = {
    dist: 'dist',
    src: 'src'
  };

  grunt.initConfig({
    yeoman: appConfig,

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      html: {
        files: [
          '<%= yeoman.src %>/**/*.html'
        ],
        tasks: ['includereplace']
      },
      js: {
        files: [
          '<%= yeoman.src %>/scripts/**/*.js'
        ],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '.tmp/styles/{,*/}*.css',
          '.tmp/**/*.html',
          '<%= yeoman.src %>/assets/**/*'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        // NOTE Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('.tmp/pages'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.src)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.src %>/scripts/**/*.js'
        ]
      },
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>'
          ]
        }]
      },
      server: '.tmp'
    },

    wiredep: {
      app: {
        src: ['<%= yeoman.src %>/templates/header-files.html', '<%= yeoman.src %>/templates/footer-files.html'],
        ignorePath: /\.\.\/\.\.\//
      },
      sass: {
        src: ['<%= yeoman.src %>/styles/main.scss'],
        ignorePath: /\.\.\/\.\.\//
      }
    },

    compass: {
      options: {
        sassDir: '<%= yeoman.src %>/',
        cssDir: '.tmp',

        importPath: './bower_components',
        imagesDir: '<%= yeoman.src %>'
      },
      oneOff: {
        options: {
          debugInfo: true
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        }
      },
      server: {
        options: {
          debugInfo: true,
          watch: true
        }
      }
    },

    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/**/*.js',
          '<%= yeoman.dist %>/**/*.css',
          '<%= yeoman.dist %>/assets/icons/as-fonts/**/*',
          '<%= yeoman.dist %>/assets/images/**/*',
          '<%= yeoman.dist %>/assets/webfonts/**/*'
        ]
      }
    },

    useminPrepare: {
      html: '.tmp/pages/**/*.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/styles/*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/assets'
        ]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.src %>',
          src: 'assets/images/**/*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          minifyJS: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: '**/*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.src %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '.htaccess',
            'robots.txt',
            'favicon.ico',
            'sitemap.xml',

            'assets/**/*',
            // The images are copied by imagemin
            '!assets/images/**/*',
            // No need to copy the svg icons
            '!assets/icons/as-svg/**/*',

            'php/**/*'
          ]
        }]
      },
      distHtml: {
        files: [{
          expand: true,
          dot: true,
          cwd: '.tmp/pages',
          dest: '<%= yeoman.dist %>',
          src: './**/*.html'
        }]
      }
    },

    concurrent: {
      server: {
        tasks: ['compass:server', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: [
        'compass:dist',
        'imagemin'
      ]
    },

    includereplace: {
      dist: {
        options: {
          includesDir: '<%= yeoman.src %>/templates/',
          docroot: '<%= yeoman.src %>',
          prefix: '<!-- @@',
          suffix: ' -->'
        },
        files: [{
          cwd: '<%= yeoman.src %>',
          src: '**/*.html',
          dest: '.tmp',
          expand: true
        }]
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'includereplace',
      'compass:oneOff',
      'connect:livereload',
      'concurrent:server',
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'includereplace',
    'useminPrepare',
    'concurrent:dist',
    'concat',
    'copy:dist',
    'cssmin', // TODO what is this written twice?
    'uglify',
    'filerev',
    'copy:distHtml',
    'usemin',
    'htmlmin'
  ]);
};
