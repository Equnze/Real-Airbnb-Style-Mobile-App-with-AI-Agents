const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = withNativewind(getDefaultConfig(__dirname));

// NativeWind redirects `react-native` imports to react-native-css's wrapper, which (on RC 3.1.0-rc.0
// with RN 0.88) doesn't re-export AssetRegistry. expo-asset needs it to load fonts and images, and
// renders no components, so it gets the real module. Native only: web keeps Expo's react-native-web alias.
const nativewindResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform !== "web" &&
    moduleName === "react-native" &&
    /[\\/]node_modules[\\/]expo-asset[\\/]/.test(context.originModulePath)
  ) {
    return context.resolveRequest(context, moduleName, platform);
  }
  return nativewindResolveRequest(context, moduleName, platform);
};

module.exports = config;
