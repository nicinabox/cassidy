{spawn, exec} = require 'child_process'

task 'watch', 'continually build', ->
    coffee = spawn 'coffee', ['-cw', '-o', 'public/javascripts', 'app/assets/javascripts']
    coffee.stdout.on 'data', (data) -> console.log data.toString().trim()