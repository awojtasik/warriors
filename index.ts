import * as express from 'express';
import 'express-async-errors';
import * as methodOverride from 'method-override';
import { static as eStatic, urlencoded } from 'express';
import { engine } from 'express-handlebars';
import { homeRouter } from './routers/home';

const app = express();

app.use(methodOverride('_method'));
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(eStatic('public'));
app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

app.use('/', homeRouter);

// app.use(handleErrors)

app.listen(3000, 'localhost', () => {
  console.log('listening on http://localhost:3000');
});
