import React from 'react';
import { Card } from "@/components/ui/card";
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
const Contact: React.FC = () => {
  // Get contact data from site config
  const email = siteConfig.contact.email;
  const whatsapp = siteConfig.contact.whatsapp;
  return;
};
export default Contact;