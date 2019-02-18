import express from 'express';
import path from 'path';
import { getDataController } from './controller';

const app = express();

app.use(express.static(path.resolve(__dirname, '../dist')));

app.get('/api/data', getDataController);

app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

app.listen(4000, () => console.log(`App is running on 4000`));
