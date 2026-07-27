import { BasicApplicationShell } from './BasicApplicationShell.jsx';
import { defaultApplicationDefinition } from './basicShellData.js';

// embedded：宿主（陌衡企信演示站 harness 或本地预览）会传入 true/false，必须透传给壳层。
export default function App({ embedded = false }) {
  return <BasicApplicationShell definition={defaultApplicationDefinition} embedded={embedded} />;
}
