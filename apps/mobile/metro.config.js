const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

config.resolver.disableHierarchicalLookup = false;

const FORCE_FROM_MOBILE = new Set([
  "react",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "react-dom",
  "react-native",
  "react-native-web",
  "react-native-reanimated",
  "react-native-gesture-handler",
  "react-native-safe-area-context",
  "react-native-screens",
  "react-native-svg",
  "@babel/runtime",
  "scheduler",
]);

const mobileNodeModules = path.resolve(projectRoot, "node_modules");

function resolveFromMobile(name) {
  const direct = path.resolve(mobileNodeModules, name);
  if (fs.existsSync(direct)) return direct;
  const root = name.split("/")[0];
  const rootPath = path.resolve(mobileNodeModules, root);
  if (fs.existsSync(rootPath)) {
    return path.resolve(mobileNodeModules, name);
  }
  return null;
}

const upstreamResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (FORCE_FROM_MOBILE.has(moduleName) || FORCE_FROM_MOBILE.has(moduleName.split("/")[0])) {
    const forced = resolveFromMobile(moduleName);
    if (forced) {
      return context.resolveRequest({ ...context, originModulePath: path.join(mobileNodeModules, "_pin.js") }, moduleName, platform);
    }
  }
  if (upstreamResolveRequest) return upstreamResolveRequest(context, moduleName, platform);
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
