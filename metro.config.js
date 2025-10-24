const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// For web: Add webpack configuration to bypass CORS during development
if (process.env.EXPO_PLATFORM === 'web') {
  config.resolver = {
    ...config.resolver,
    resolverMainFields: ['browser', 'module', 'main'],
  };
  
  // Note: You can also use a CORS proxy for development
  // Example: https://cors-anywhere.herokuapp.com/
}

module.exports = config;
