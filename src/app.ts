import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import userRouters from './routes/User';
import Authentication from './routes/Authentication';
import Class from './routes/Class';
import Workshop from './routes/Workshop';
import Subscription from './routes/Subscriptions';
import Notification from './routes/Notification';

const app = express();
app.use(cors({
    origin: 'http://localhost:8080',
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(userRouters);
app.use(Class);
app.use(Workshop);
app.use('/auth', Authentication);
app.use(Subscription);
app.use('/webhook', Notification);

app.use((req, res) => {
    res.status(404).send('<h1>Page not found!</h1>');
});


app.listen(3000, () => {
    console.log('Local Server...');
});