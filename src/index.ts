import dotenv from 'dotenv';
import App from './App';


dotenv.config();

const app = new App();

app.init();

// Enable graceful stop
process.once('SIGINT', () => app.destroy('SIGINT'));
process.once('SIGTERM', () => app.destroy('SIGTERM'));
