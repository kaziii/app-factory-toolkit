import { BasicApplicationShell } from './BasicApplicationShell.jsx';
import { defaultApplicationDefinition } from './basicShellData.js';

export default function App() {
  return <BasicApplicationShell definition={defaultApplicationDefinition} />;
}
