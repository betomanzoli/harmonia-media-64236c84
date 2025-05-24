import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const briefingId = searchParams.get('briefing');
  const packageType = searchParams.get('package');
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    if (briefingId && packageType) {
      updateBriefingStatus();
    }
  }, [briefingId, packageType]);

  const updateBriefingStatus = async () => {
    try {
      //
