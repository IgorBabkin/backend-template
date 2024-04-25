import { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

export function bodyParsing(app: Express) {
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
}

export function CORS(app: Express) {
  app.use(cors());
}

export function handleNotFound(app: Express) {
  app.use((req: Request, res: Response) => {
    res.status(404).send("Sorry can't find that!");
  });
}
