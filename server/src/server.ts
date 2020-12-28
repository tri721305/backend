import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { Request, Response } from 'express';
import * as expressSanitizer from 'express-sanitizer';
import * as helmet from 'helmet';
import * as jwt from 'jsonwebtoken';
import * as morgan from 'morgan';
import * as path from 'path';
import { schema } from './database/schema';
import * as eventRoute from './routes/event-route';
import * as tripDayRoute from './routes/trip-day-route';
import * as tripRoute from './routes/trip-route';
import * as userRoute from './routes/user-route';

schema();

const app = express();

app.set('superSecret', 'TripPlannerRestfulApis'); // TODO , should store in the config file
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client'), { index: false }));
app.use(expressSanitizer());
app.use(morgan('dev'));
app.use(helmet()); // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet

const corsHeader = (req: any, res: any, next: any) => {
  const allowedOrigins = ['http://localhost:8080', 'http://localhost:8000'];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
app.use(corsHeader);

const jwtAuthentication = (req: Request, res: Response, next: any) => {
  const _cleanToken = (message: string) => {
    res.clearCookie('jwt');
    return res.status(401).send({
      success: false,
      error: message,
    });
  };

  if (req.cookies && req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, app.get('superSecret'), (error: Error, decodedToken: any) => {
      if (error) {
        _cleanToken('Authentication failed. Please login.');
      }

      if (decodedToken.exp <= Date.now() / 1000) {
        _cleanToken('Session expired. Please login again.');
      }

      req['user'] = decodedToken;
      next();
    });
  } else {
    _cleanToken('Authentication failed. Please login.');
  }
};

app.use('/api/trip', jwtAuthentication);
app.use('/api/event', jwtAuthentication);
app.use('/api/user/update', jwtAuthentication);

app.use('/api/trip', tripRoute);
app.use('/api/trip', tripDayRoute);
app.use('/api/event', eventRoute);
app.use('/api/user', userRoute);

app.get('/*', (req: Request, res: Response) => res.sendFile(path.resolve(__dirname, '../client', 'index.html')));

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next) => {
  const err = new Error('Not Found');
  next(err);
});

export = app;
