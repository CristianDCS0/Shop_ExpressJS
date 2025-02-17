import {App} from './app';

async function main() {
    const app = new App();
    await app.start();
}

main().catch((error) => {
    console.error('An error occurred while starting the server:', error);
});