"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vite = require("vite");

var _pluginReact = _interopRequireDefault(require("@vitejs/plugin-react"));

var _vitePluginFederation = _interopRequireDefault(require("@originjs/vite-plugin-federation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//
var _default = (0, _vite.defineConfig)({
  server: {
    port: 3004 // Specify the port to avoid conflicts

  },
  plugins: [(0, _pluginReact["default"])(), (0, _vitePluginFederation["default"])({
    name: 'patientPortalApp',
    filename: 'remoteEntry.js',
    exposes: {
      './App': './src/App' // Adjust the path to your main App or specific component

    },
    shared: ['react', 'react-dom', '@apollo/client', 'graphql'],
    remotes: {
      userApp: 'http://localhost:3001/dist/assets/remoteEntry.js'
    }
  })],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
});

exports["default"] = _default;
//# sourceMappingURL=vite.config.dev.js.map
