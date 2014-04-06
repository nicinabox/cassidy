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
          src: 'dist/**/*'
          rel: 'dist'
        ]

    watch:
      options:
        livereload: true
        files: ['.tmp/**/*', 'Gruntfile*']

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

    handlebars:
      compile:
        options:
          namespace: "JST"
          processName: (filePath) ->
            filePath
              .replace('app/templates/', '')
              .replace('.hbs', '')

        files:
          ".tmp/javascripts/templates.js": [
            "app/templates/*.hbs"
          ]

    coffee:
      compileBare:
        files:
          ".tmp/javascripts/application.js": [
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
          cssDir: ".tmp/stylesheets"
          environment: 'development'

      dist:
        options:
          cssDir: "dist/stylesheets"
          environment: 'production'

    clean:
      dist: [
        '.tmp'
        'dist/*'
      ]
      server: '.tmp'

    copy:
      dist:
        expand: true
        cwd: 'app'
        dest: 'dist'
        src: [
          'images/*'
          '*.html'
        ]

    useminPrepare:
      options:
        dest: 'dist'
        root: '.tmp'
      html: 'app/index.html'

    usemin:
      html: 'dist/index.html'

    htmlmin:
      dist:
        options:
          removeComments: true,
          collapseWhitespace: true
        files: [
          expand: true
          cwd: 'dist'
          src: '*.html'
          dest: 'dist'
        ]

    rev:
      options:
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      assets:
        files:
          src: ['dist/**/*.{js,css}']

    connect:
      server:
        options:
          open: true
          base: '.tmp'
          livereload: true
          middleware: (connect)  ->
            [
              connect.static('.tmp')
              connect().use('/bower_components', connect.static('./bower_components'))
              connect().use('/node_modules', connect.static('./node_modules'))
              connect.static('app')
            ]

    invalidate_cloudfront:
      options:
        key: '<%= aws.key %>'
        secret: '<%= aws.secret %>'
        distribution: 'E304OOCZVQB21'
      production:
        files: [
          expand: true
          cwd: 'dist'
          src: ['**/*.{html,png}']
          filter: 'isFile'
          dest: ''
        ]

  grunt.initConfig config

  grunt.registerTask 'default', [
    'handlebars'
    'compass:main'
    'coffee'
    'connect'
    'watch'
  ]

  grunt.registerTask 'build', [
    'clean'
    'useminPrepare'
    'handlebars'
    'compass:dist'
    'coffee'
    'concat'
    'uglify'
    'copy:dist'
    'rev'
    'usemin'
    'htmlmin'
  ]

  grunt.registerTask 'deploy', [
    'build'
    's3:production'
    'invalidate_cloudfront'
  ]
