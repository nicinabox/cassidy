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

      html:
        files: ['app/*.html']
        tasks: ['copy']

    handlebars:
      compile:
        options:
          namespace: "JST"
          processName: (filePath) ->
            _.last(filePath.split('/')).replace('.hbs', '')

        files:
          "public/javascripts/templates.js": [
            "app/templates/*.hbs"
          ]

    coffee:
      options:
        bare: true
      compileBare:
        files:
          "public/javascripts/application.js": [
            'app/javascripts/**/*.coffee'
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
      html:
        src: 'app/index.html'
        dest: 'public/index.html'

    useminPrepare:
      options:
        dest: 'public'
      html: 'app/index.html'

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
              connect.static('public')
            ]

  grunt.initConfig config

  grunt.registerTask 'compile', [
    'handlebars'
    'compass'
    'coffee'
  ]

  grunt.registerTask 'default', [
    'compile'
    'connect'
    'watch'
  ]
