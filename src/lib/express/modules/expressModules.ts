import { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';

export function bodyParsing(app: Express) {
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: false }));
}

export function handleNotFound(app: Express) {
  app.use((req: Request, res: Response) => {
    res.status(404).send("Sorry can't find that!");
  });
}
