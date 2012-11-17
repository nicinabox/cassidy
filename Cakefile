{spawn, exec} = require 'child_process'

run = (name, args) ->
  proc =           spawn name, args
  proc.stderr.on   'data', (buffer) -> console.log buffer.toString()
  proc.stdout.on   'data', (buffer) -> console.log buffer.toString()
  proc.on          'exit', (status) -> process.exit(1) if status != 0

task 'watch', 'Watch source files and build JS & CSS', (options) ->
  run 'coffee', ['-cw', '-o', 'public/javascripts', 'app/assets/javascripts']
  run 'compass', ['watch']