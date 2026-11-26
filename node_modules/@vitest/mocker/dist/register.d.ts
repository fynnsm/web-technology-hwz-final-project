import { ModuleMockerInterceptor, ModuleMockerCompilerHints, ModuleMocker } from './browser.js';
import '@vitest/spy';
import './registry.d-BhU0J9Zt.js';
import './index.d-BZ5MXwli.js';

declare function registerModuleMocker(interceptor: (accessor: string) => ModuleMockerInterceptor): ModuleMockerCompilerHints;
declare function registerNativeFactoryResolver(mocker: ModuleMocker): void;

export { registerModuleMocker, registerNativeFactoryResolver };
