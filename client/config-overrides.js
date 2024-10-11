// client/config-overrides.js
const { overrideDevServer } = require("customize-cra");

const customDevServerConfig = () => (config) => {
  console.log("Customizing DevServer...");

  // Ensure to remove any deprecated properties if they exist
  if (config.onBeforeSetupMiddleware) {
    console.log("Removing deprecated onBeforeSetupMiddleware...");
    delete config.onBeforeSetupMiddleware;
  }

  if (config.onAfterSetupMiddleware) {
    console.log("Removing deprecated onAfterSetupMiddleware...");
    delete config.onAfterSetupMiddleware;
  }

  config.setupMiddlewares = (middlewares, devServer) => {
    console.log("Setting up middlewares...");

    // Custom middleware logic for before setup
    middlewares.unshift(function (req, res, next) {
      console.log("Before setup middleware...");
      next();
    });

    // Custom middleware logic for after setup
    middlewares.push(function (req, res, next) {
      console.log("After setup middleware...");
      next();
    });

    return middlewares;
  };

  return config;
};

module.exports = {
  devServer: overrideDevServer(customDevServerConfig()),
};
