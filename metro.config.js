const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Required for @better-auth packages which use package exports
config.resolver.unstable_enablePackageExports = true;

// Required for Drizzle SQL migrations
config.resolver.sourceExts.push('sql');

module.exports = withNativeWind(config, { input: './global.css' });
