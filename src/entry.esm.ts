import { App, Plugin } from 'vue';

// Import vue components
import * as components from '@/lib-components/index';

// install function executed by Vue.use()
const install: Exclude<Plugin['install'], undefined> = function installEasyInterfacing(app: App) {
  Object.entries(components).forEach(([componentName, component]) => {
    app.component(componentName, component);
  });
  const $percent = (percent: number, unit: number) => unit * (percent / 100);
  const $vw = (percent: number) => $percent(percent, window.innerWidth);
  const $vh = (percent: number) => $percent(percent, window.innerHeight);
  app.config.globalProperties = {
    ...app.config.globalProperties,
    $percent,
    $vw,
    $vh,
  };
};

// Create module definition for Vue.use()
export default install;
export * from '@/lib-components/index';
