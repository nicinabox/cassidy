_ = require('lodash')

module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)

  config =
    pkg: grunt.file.readJSON('package.json')
    aws: grunt.file.readJSON('s3.json')
    env: grunt.option('e') or 'development'

    s3:
      options:
        key: '<%= aws.key %>'
        secret: '<%= aws.secret %>'
        bucket: '<%= aws.bucket %>'
        access: 'public-read'
        headers:
          # Two Year cache policy (1000 * 60 * 60 * 12 * 730)
          "Cache-Control": "max-age=31536000000, public",
          "Expires": new Date(Date.now() + 31536000000).toUTCString()

      production:
        upload: [
          src: 'dist/**/*'
          rel: 'dist'
          options:
            gzip: true
        ]

    watch:
      options:
        livereload: true
        files: ['.tmp/**/*', 'Gruntfile*']

      gruntfile:
        files: 'Gruntfile*'

      html:
        files: 'app/**/*.html'
        tasks: 'includereplace'

      images:
        files: 'app/images/*'
        tasks: 'copy:images'

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
            'app/javascripts/mixins/*.coffee'
            'app/javascripts/application.coffee'
            'app/environments/<%= env %>.coffee'
            'app/javascripts/*.coffee'
            'app/javascripts/utils/*.coffee'
            'app/javascripts/routers/*.coffee'
            'app/javascripts/models/*.coffee'
            'app/javascripts/collections/*.coffee'
            'app/javascripts/views/*.coffee'
            'app/javascripts/helpers/*.coffee'
            'app/javascripts/initialize.coffee'
          ]

    compass:
      options:
        importPath: [
          'bower_components'
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
      dist: ['dist/*']
      server: '.tmp'

    copy:
      fontawesome:
        expand: true
        cwd: 'bower_components/fontawesome/'
        dest: '.tmp'
        src: [
          'fonts/*'
        ]

      images:
        expand: true
        cwd: 'app/'
        dest: '.tmp'
        src: [
          'images/*'
        ]

      dist:
        expand: true
        cwd: '.tmp'
        dest: 'dist'
        src: [
          'fonts/*'
          'images/*'
          '*.html'
        ]

    useminPrepare:
      options:
        dest: 'dist'
        root: '.tmp'
      html: '.tmp/*.html'

    usemin:
      html: 'dist/*.html'

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

    includereplace:
      html:
        options:
          includesDir: 'app/includes'
          prefix: '{% '
          suffix: ' %}'

        files: [
          expand: true
          flatten: true
          cwd: 'app'
          src: ['*.html']
          dest: '.tmp/'
        ]

    rev:
      options:
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      assets:
        files:
          src: ['dist/**/*.{js,css}']

    appcache:
      options:
        basePath: 'dist'

      all:
        dest: 'dist/manifest.appcache'
        cache: 'dist/**/*'
        network: '*'

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
              connect().use('/vendor', connect.static('./vendor'))
            ]

      dist:
        options:
          open: true
          keepalive: true
          base: 'dist'

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
    'compile'
    'connect:server'
    'watch'
  ]

  grunt.registerTask 'compile', [
    'handlebars'
    'compass:main'
    'coffee'
    'includereplace'
  ]

  grunt.registerTask 'build', [
    'clean'
    'copy:fontawesome'
    'copy:images'
    'includereplace'
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
    'appcache'
  ]

  grunt.registerTask 'deploy', [
    'build'
    's3:production'
    'invalidate_cloudfront'
  ]
