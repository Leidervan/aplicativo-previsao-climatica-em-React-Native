import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from './App';

if (Platform.OS !== 'web') {
  registerRootComponent(App);
}

if (Platform.OS === 'web') {
  import('react-dom/client').then(({ createRoot }) => {
    import('react').then((React) => {
      const container = document.getElementById('root') || document.getElementById('app');
      if (container) {
        const root = createRoot(container);
        root.render(React.createElement(App));
      }
    });
  });
} else {
  // Fallback para versões mais antigas do Expo
  registerRootComponent(App);
}