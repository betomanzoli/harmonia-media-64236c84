import { NextApiRequest, NextApiResponse } from 'next';
import { mercadopago } from '@/lib/mercado-pago';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const signature = req.headers['x-signature'];
  const rawBody = await getRawBody(req);

  const isValid = await mercadopago.payment.validateWebhookSignature({
    body: rawBody,
    signature: signature,
    publicKey: process.env.MP_WEBHOOK_PUBLIC_KEY!
  });

  if (!isValid) return res.status(403).json({ error: 'Invalid signature' });

  // Processar notificação
  const paymentId = req.body.data.id;
  const payment = await mercadopago.payment.get(paymentId);
  
  // Atualizar status no Supabase
  await supabase
    .from('payments')
    .update({ status: payment.body.status })
    .eq('mp_id', paymentId);

  res.status(200).end();
}
