import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// ⚙️ Credenciais do Mercado Pago (definidas no .env do servidor)
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN as string;

// IDs dos planos que você me passou
const PLAN_PREMIUM_ID = '9110a6ece05a482788bb41c570985e2f';  // R$49,90
const PLAN_PRO_ID      = 'b569e61395734036ade08d3b272c4086';  // R$19,90 mensal

// Supabase (service role) – para atualizar o plano do usuário
const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE as string;

const supabase = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: SUPABASE_SERVICE_ROLE,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`,
    'Content-Type': 'application/json',
  },
});

// 🔔 Webhook do Mercado Pago
router.post('/webhook', async (req, res) => {
  try {
    const notification = req.body;
    console.log('MP notification:', JSON.stringify(notification));

    const { type, data } = notification;

    // ⚠️ Isso aqui pode mudar dependendo da config do MP
    // Ajuste 'subscription_preapproval' conforme o tipo real que o MP mandar.
    if (type === 'subscription_preapproval' && data && data.id) {
      const preapprovalId = data.id;

      // 1) Buscar detalhes da pré-aprovação na API do MP
      const mpRes = await axios.get(
        `https://api.mercadopago.com/preapproval/${preapprovalId}`,
        {
          headers: {
            Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          },
        }
      );

      const preapproval = mpRes.data;
      console.log('preapproval:', preapproval);

      const planId = preapproval.preapproval_plan_id;
      const payerEmail = preapproval.payer_email || preapproval.payer?.email;
      const status = preapproval.status; // authorized / active / cancelled etc.

      if (!payerEmail) {
        console.warn('Sem e-mail do pagador. Não consigo vincular ao usuário.');
        return res.status(200).json({ received: true });
      }

      if (status !== 'authorized' && status !== 'active') {
        console.log('Assinatura não ativa, ignorando.');
        return res.status(200).json({ received: true });
      }

      let newPlan: 'premium' | 'pro' | null = null;

      if (planId === PLAN_PREMIUM_ID) newPlan = 'premium';
      if (planId === PLAN_PRO_ID) newPlan = 'pro';

      if (!newPlan) {
        console.warn('Plano desconhecido, planId:', planId);
        return res.status(200).json({ received: true });
      }

      // 2) Atualizar profile no Supabase usando email
      const profilesRes = await supabase.get('/profiles', {
        params: {
          email: `eq.${payerEmail}`,
          select: '*',
        },
      });

      const profiles = profilesRes.data as any[];

      if (!profiles || profiles.length === 0) {
        console.warn('Nenhum profile com esse e-mail:', payerEmail);
        return res.status(200).json({ received: true });
      }

      const profile = profiles[0];

      await supabase.patch('/profiles', {
        plan: newPlan,
        mp_payer_id: preapproval.payer_id,
        mp_preapproval_id: preapproval.id,
      } as any, {
        params: {
          id: `eq.${profile.id}`,
        },
      } as any);

      console.log(`Plano do usuário ${payerEmail} atualizado para ${newPlan}.`);
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Erro no webhook MP:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro no webhook do Mercado Pago' });
  }
});

export default router;

