import { createRoot } from 'react-dom/client';
import { hello } from '@chihuahua-dashboard/shared';
import { App } from './App';

const root = createRoot(document.getElementById('root')!);

console.log(hello());
root.render(<App />);
