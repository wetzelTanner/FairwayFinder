import dotenv from 'dotenv';
import { feathers } from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors } from '@feathersjs/koa';
import socketio from '@feathersjs/socketio';
import { mongodb } from './mongodb.js'; // MongoDB connection logic
import { services } from './services/index.js'; // Import services
import { channels } from './channels.js';

console.log("running");

// Load environment variables
dotenv.config();

// Feathers app setup
const app = koa(feathers());

// Middleware and configurations
app.configure(configuration())
  .use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? '*'
      : 'http://localhost:5173',
    credentials: true
  }))
  .use(errorHandler())
  .use(parseAuthentication())
  .use(bodyParser());

// Configure Feathers transports
app.configure(rest());
app.configure(socketio({ cors: { origin: app.get('origins') }}));

const psswd = process.env.DATABASE_PSSWD;
console.log("psswd:");
console.log(psswd);

// MongoDB URI and connection setup
const mongoUri = `mongodb+srv://samh:${encodeURIComponent(process.env.DATABASE_PSSWD)}@fairwayfinder.stoif.mongodb.net/FairwayFinderDB?retryWrites=true&w=majority&tls=true`;

// Set MongoDB URI on the app config
app.set('mongodb', mongoUri);

// Initialize MongoDB connection and Feathers app
async function initializeApp() {
  try {
    console.log('Initializing MongoDB connection...');
    
    // Wait for MongoDB to connect and client to be set
    const mongoClient = await app.configure(mongodb);  // Waits for the mongodb.js to finish

    if (!mongoClient) {
      throw new Error('MongoDB client is not set on the app.');
    }

    console.log('MongoDB client connected:', mongoClient);

    // Register services and channels after MongoDB is connected
    app.configure(services);
    app.configure(channels);

    //console.log("TEST");

    // Start the app server
    const port = process.env.PORT || 3031;
    app.listen(port).then(() => {
    console.log(`Feathers app is listening on port ${port}`);
});
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// Run the app initialization
initializeApp();

export default app;
export { app };
