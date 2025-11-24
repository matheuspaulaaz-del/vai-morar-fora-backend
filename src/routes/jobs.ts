
import express from 'express';
const router = express.Router();

router.post('/search', async (req,res)=>{
  const { query, country } = req.body;
  return res.json({
    status: 'mock',
    query,
    country,
    results: [
      { title: 'Software Engineer', company: 'TechCorp', location: 'Remoto' },
      { title: 'Analista de Dados', company: 'DataFlow', location: 'Lisboa' }
    ]
  });
});

export default router;
