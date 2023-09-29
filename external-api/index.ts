import * as dotenv from 'dotenv';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as cors from 'cors';

import routes from './routes';

// Config
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Router
app.use('/externalapi', routes);

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
