"use strict";

var _require = require('child_process'),
    spawn = _require.spawn; // Define paths to client apps


var clientApps = ['./client/shell-app', './client/user-app', './client/checklist-client', './client/motivationalTips-client', './client/patientPortalApp-client', './client/vitalSigns-client']; // Start each client app

clientApps.forEach(function (appPath) {
  var process = spawn('npm', ['start'], {
    cwd: appPath,
    stdio: 'inherit'
  });
  process.on('exit', function (code) {
    console.log("[".concat(appPath, "]: Process exited with code ").concat(code));
  });
});
//# sourceMappingURL=index.dev.js.map
