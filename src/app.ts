import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import userRouters from './routes/User';
// import adminRoutes from './routes/admin';
// import shopRoutes from './routes/shoping';

const app = express();
app.use(cors({
    origin: 'http://localhost:8080',
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(userRouters);
// app.use('/admin', adminRoutes); //* I should use this kind of url to teachers. But instead of use 'admin', I should use 'teacher' or something like that
// app.use(shopRoutes);

app.use((req, res) => {
    res.status(404).send('<h1>Page not found!</h1>');
});


app.listen(3000, () => {
    console.log('Local Server...');
});