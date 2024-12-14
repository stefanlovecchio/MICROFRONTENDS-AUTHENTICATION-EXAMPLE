"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('child_process'),
    fork = _require.fork;

var _require2 = require('child_process'),
    execSync = _require2.execSync;

var services = [{
  name: 'Auth Service',
  path: './auth-microservice.js',
  port: 4001
}, {
  name: 'Checklist Service',
  path: './checklist-microservice.js',
  port: 4002
}, {
  name: 'Motivational Tips Service',
  path: './motivationalTips-microservice.js',
  port: 4003
}, {
  name: 'Patient Portal Service',
  path: './patientPortalApp-microservice.js',
  port: 4004
}, {
  name: 'Vital Signs Service',
  path: './vitalSigns-microservice.js',
  port: 4005
}];
var runningServices = 0;
var totalServices = services.length;
console.log("Starting ".concat(totalServices, " microservices...\n"));

var killPortTasks = function killPortTasks(port) {
  try {
    var result = execSync("netstat -ano | findstr :".concat(port), {
      encoding: 'utf-8'
    });
    var lines = result.trim().split('\n');
    var pids = lines.map(function (line) {
      var columns = line.trim().split(/\s+/);
      return columns[columns.length - 1];
    });
    pids.forEach(function (pid) {
      console.log("Killing process with PID: ".concat(pid, " on port ").concat(port));
      execSync("taskkill /PID ".concat(pid, " /F"));
    });
    console.log("Port ".concat(port, " has been freed."));
  } catch (error) {
    console.log("No tasks found on port ".concat(port, "."));
  }
};

var logStatus = function logStatus() {
  console.clear();
  console.log("Microservices Running: ".concat(runningServices, "/").concat(totalServices, "\n"));
  services.forEach(function (service) {
    var status = service.status || {};
    console.log("[".concat(service.name.padEnd(25), "] Port: ").concat(service.port, " | MongoDB: ").concat(status.mongoDB || '❌', " | GraphQL: ").concat(status.graphQL || '❌'));
  });
  console.log('\n----------------------------\n');
};

services.forEach(function (service) {
  killPortTasks(service.port);
  service.status = {
    mongoDB: '❌',
    graphQL: '❌'
  };
  var child = fork(service.path, [], {
    stdio: ['inherit', 'pipe', 'pipe', 'ipc'],
    env: _objectSpread({}, process.env, {
      PORT: service.port
    })
  });
  runningServices++;
  console.log("[".concat(service.name, "] Starting on port ").concat(service.port, "..."));
  logStatus();

  if (child.stdout) {
    child.stdout.on('data', function (data) {
      var output = data.toString().trim();
      console.log("[DEBUG] Output from ".concat(service.name, ":"), output);

      if (output.includes('MongoDB connected')) {
        service.status.mongoDB = '✅';
      }

      if (output.includes('GraphQL server is running')) {
        service.status.graphQL = '✅';
      }

      logStatus();
    });
  }

  if (child.stderr) {
    child.stderr.on('data', function (data) {
      console.error("[".concat(service.name, " Error]: ").concat(data.toString().trim()));
    });
  }

  child.on('exit', function (code) {
    runningServices--;
    service.status.mongoDB = '❌';
    service.status.graphQL = '❌';
    console.log("[".concat(service.name, "] Process exited with code ").concat(code));
    logStatus();
  });
  child.on('error', function (err) {
    console.error("[".concat(service.name, " Error]: Failed to start - ").concat(err.message));
    runningServices--;
    logStatus();
  });
});
//# sourceMappingURL=index.dev.js.map
