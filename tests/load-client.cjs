const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Ejecuta los servicios TypeScript reales con almacenamiento y red controlados.
// No requiere un dispositivo ni importa los módulos nativos de React Native.
exports.loadClient = function ({ fetch = async () => { throw new Error('sin red'); }, storage = new Map() } = {}) {
  const clock = { now: 1000000 };
  const asyncStorage = {
    getItem: async (key) => storage.get(key) ?? null,
    setItem: async (key, value) => { storage.set(key, value); },
    removeItem: async (key) => { storage.delete(key); },
    getAllKeys: async () => [...storage.keys()],
    multiGet: async (keys) => keys.map((key) => [key, storage.get(key) ?? null]),
    multiRemove: async (keys) => { keys.forEach((key) => storage.delete(key)); },
  };
  const context = vm.createContext({
    console, fetch, AbortController, setTimeout, clearTimeout,
    process: { env: { EXPO_PUBLIC_API_URL: 'http://api.test/api/v1' } },
    Date: class extends Date { static now() { return clock.now; } },
  });
  const modules = new Map();
  function load(filename) {
    const file = path.resolve(__dirname, '..', filename);
    if (modules.has(file)) return modules.get(file).exports;
    const module = { exports: {} };
    modules.set(file, module);
    const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    });
    const requireLocal = (name) => {
      if (name === '@react-native-async-storage/async-storage') return asyncStorage;
      if (name.startsWith('.')) return load(path.resolve(path.dirname(file), name + '.ts'));
      throw new Error('Dependencia inesperada: ' + name);
    };
    vm.runInContext('(function(require,module,exports){' + outputText + '\n})', context, { filename: file })(requireLocal, module, module.exports);
    return module.exports;
  }
  return {
    api: load('src/services/ServicioApi.ts').ServicioApi.obtenerInstancia(),
    cache: load('src/services/ServicioCache.ts').ServicioCache.obtenerInstancia(),
    storage, clock,
  };
};
