var cluster = require('cluster');

if (cluster.isMaster) {
var cpuCount = require("os").cpus().length;
console.log(cpuCount)
}