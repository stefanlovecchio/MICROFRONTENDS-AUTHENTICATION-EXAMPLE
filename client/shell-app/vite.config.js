// shell-app/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
//
export default defineConfig({
    plugins: [
        react(),
        federation({
            name: 'shellApp',
            remotes: {
                userApp: 'http://localhost:3001/dist/assets/remoteEntry.js',
                productApp: 'http://localhost:3002/dist/assets/remoteEntry.js',
                motivationalTipsApp: 'http://localhost:3003/dist/assets/remoteEntry.js',
                patientPortalApp: 'http://localhost:3004/dist/assets/remoteEntry.js'
            },
            shared: ['react', 'react-dom', '@apollo/client', 'graphql'],
        }),
    ],
});