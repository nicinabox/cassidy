_ = require('lodash')

module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)

  config =
    pkg: grunt.file.readJSON('package.json')
    aws: grunt.file.readJSON('grunt-aws.json')

    s3:
      options:
        key: '<%= aws.key %>'
        secret: '<%= aws.secret %>'
        bucket: '<%= aws.bucket %>'
        access: 'public-read'
      production:
        upload: [
          src: 'public/**/*'
          rel: 'public'
        ]

    watch:
      options:
        livereload: true
        files: ['public/**/*']

      gruntfile:
        files: 'Gruntfile*'

      scripts:
        files: 'app/javascripts/**/*.coffee'
        tasks: ['coffee']

      styles:
        files: 'app/stylesheets/**/*.scss'
        tasks: ['compass']

      templates:
        files: 'app/templates/**/*.hbs'
        tasks: ['handlebars']

      html:
        files: ['app/*.html']
        tasks: ['copy']

    handlebars:
      compile:
        options:
          namespace: "JST"
          processName: (filePath) ->
            filePath
              .replace('app/templates/', '')
              .replace('.hbs', '')

        files:
          "public/javascripts/templates.js": [
            "app/templates/*.hbs"
          ]

    coffee:
      compileBare:
        files:
          "public/javascripts/application.js": [
            'app/javascripts/*.coffee'
            'app/javascripts/utils/*.coffee'
            'app/javascripts/models/*.coffee'
            'app/javascripts/collections/*.coffee'
            'app/javascripts/views/*.coffee'
            'app/javascripts/helpers/*.coffee'
            'app/javascripts/initialize.coffee'
          ]

    compass:
      options:
        importPath: [
          'bower_components/bootstrap-sass/vendor/assets/stylesheets'
        ]
        sassDir: "app/stylesheets"
      main:
        options:
          cssDir: "public/stylesheets"
          environment: 'development'
      release:
        options:
          cssDir: "release/stylesheets"
          environment: 'production'

    clean: ['release/**/*']

    copy:
      public:
        cwd: 'app/'
        expand: true
        src: ['*.html']
        dest: 'public/'
      release:
        cwd: 'app/'
        expand: true
        src: ['*.html']
        dest: 'release/'

    useminPrepare:
      options:
        dest: 'release'
      html: 'app/index.html'

    usemin:
      html: 'release/index.html'

    htmlmin:
      release:
        options:
          removeComments: true,
          collapseWhitespace: true
        files:
          'release/index.html': 'release/index.html',

    connect:
      server:
        options:
          open: true
          base: 'public'
          livereload: true
          middleware: (connect)  ->
            [
              connect.static('.tmp')
              connect().use('/bower_components', connect.static('./bower_components'))
              connect().use('/node_modules', connect.static('./node_modules'))
              connect.static('public')
            ]

    invalidate_cloudfront:
      options:
        key: '<%= aws.key %>'
        secret: '<%= aws.secret %>'
        distribution: 'E304OOCZVQB21'
      production:
        files: [
          expand: true
          cwd: './public/'
          src: ['**/*']
          filter: 'isFile'
          dest: ''
        ]

  grunt.initConfig config

  grunt.registerTask 'build', [
    'handlebars'
    'copy:public'
    'compass'
    'coffee'
  ]

  grunt.registerTask 'default', [
    'build'
    'connect'
    'watch'
  ]

  grunt.registerTask 'compile', [
    'clean'
    'handlebars'
    'copy:release'
    'compass:release'
    'coffee'
    'useminPrepare'
    'concat'
    'uglify'
    'usemin'
    'htmlmin'
  ]

  grunt.registerTask 'deploy', [
    'compile'
    's3:production'
    'invalidate_cloudfront'
  ]
