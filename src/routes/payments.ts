
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

router.post('/create-intent', async (req,res)=>{
  const { amount } = req.body;
  try{
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'brl',
      payment_method_types: ['card']
    });
    res.json({ clientSecret: intent.client_secret });
  }catch(err){
    res.status(400).json({ error: err });
  }
});

export default router;
