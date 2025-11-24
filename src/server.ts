
import express from 'express';
import cors from 'cors';
import jobsRouter from './routes/jobs';
import paymentsRouter from './routes/payments';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req,res)=>res.json({status:'ok'}));

app.use('/jobs', jobsRouter);
app.use('/payments', paymentsRouter);

app.listen(4000, ()=> console.log('API running on 4000'));
