exec = require('child_process').exec
sys = require 'sys'

task 'watch', 'watch all files and compile them as needed', (options) ->
  child = exec 'coffee -w -c -o public/js/compiled app'
  child.stdout.on 'data', (data) -> sys.print data
