_ = require('lodash')

module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)

  config =
    pkg: grunt.file.readJSON('package.json')

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
      dist:
        options:
          importPath: [
            'bower_components/bootstrap-sass/vendor/assets/stylesheets'
          ]
          sassDir: "app/stylesheets"
          cssDir: "public/stylesheets"

    copy:
      main:
        cwd: 'app/'
        src: ['*.html', 'CNAME']
        dest: 'public/'
        expand: true

    useminPrepare:
      options:
        dest: 'public'
        root: './'
      html: 'public/index.html'

    usemin:
      html: 'public/index.html'

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

  grunt.initConfig config

  grunt.registerTask 'build', [
    'handlebars'
    'copy'
    'compass'
    'coffee'
  ]

  grunt.registerTask 'default', [
    'build'
    'connect'
    'watch'
  ]

  grunt.registerTask 'compile', [
    'build'
    'useminPrepare'
    'concat'
    'uglify'
    'usemin'
  ]

  grunt.registerTask 'deploy', [
    'build'
  ]
