/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, MessageCircle, RotateCcw, AlertTriangle, ShieldCheck, Copy } from 'lucide-react';

interface SuccessScreenProps {
  onReset: () => void;
  customerName: string;
  orderId?: string;
  isSimulated?: boolean;
}

export default function SuccessScreen({ onReset, customerName, orderId, isSimulated = false }: SuccessScreenProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Prefilled WhatsApp message text for quick customer engagement
  const whatsappUrl = `https://wa.me/233537090117?text=Hello%20Instant%203D%2C%20I%20just%20submitted%20a%203D%20printing%20request%20for%20${encodeURIComponent(customerName)}!%20Could%20you%20please%20review%20my%20STL%20files%20and%20give%20me%20a%20quote%3F`;

  return (
    <div className="flex flex-col h-full justify-between p-6 bg-white rounded-3xl">
      {/* Visual Animation Zone */}
      <div className="my-auto py-8 text-center flex flex-col items-center">

        {/* Animated Checkmark Badge */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1.1, 0.95, 1], opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-24 h-24 mb-6 flex items-center justify-center text-emerald-500"
        >
          {/* Pulsing ring */}
          <span className="absolute inset-0 flex h-full w-full">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
          </span>
          <CheckCircle2 size={80} className="stroke-[1.5] relative" />
        </motion.div>

        {/* Messaging */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xs space-y-3"
        >
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
            Request Sent Successfully
          </span>

          <h2 className="text-2xl font-extrabold font-display text-slate-900 tracking-tight">
            Thank you, {customerName}!
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            We've received your 3D files and will contact you on WhatsApp with a quotation as soon as we've reviewed your design.
          </p>

          {orderId && (
            <div
              onClick={handleCopy}
              className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors flex items-center justify-between group"
            >
              <div className="flex flex-col items-start">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Order ID</span>
                <span className="font-mono text-slate-800 font-bold">{orderId}</span>
              </div>
              <div className="text-slate-400 group-hover:text-emerald-500 transition-colors">
                {copied ? <span className="text-xs font-bold text-emerald-500">Copied!</span> : <Copy size={16} />}
              </div>
            </div>
          )}
        </motion.div>

        {/* Sandbox Simulation Notice */}
        {isSimulated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left space-y-2 max-w-sm"
          >
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <AlertTriangle size={16} className="shrink-0" />
              <span>Developer Sandbox Mode</span>
            </div>
            <p className="text-[11px] text-amber-700 leading-normal font-medium">
              Your request was simulated successfully. The server-side API handled the model correctly but since no
              <strong> TELEGRAM_BOT_TOKEN</strong> or <strong>TELEGRAM_CHAT_ID</strong> is configured in your secrets,
              the actual Telegram transmission was bypassed.
            </p>
          </motion.div>
        )}

        {/* Action Button Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full mt-8 max-w-xs space-y-3"
        >
          {/* Direct WhatsApp trigger */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="btn_whatsapp_contact_direct"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-md shadow-emerald-500/10 active:scale-[0.98] transition-all cursor-pointer text-sm"
          >
            <MessageCircle size={18} />
            Contact on WhatsApp
          </a>

          {/* Reset form */}
          <button
            onClick={onReset}
            id="btn_submit_another_design"
            className="w-full flex items-center justify-center gap-2 py-3 px-5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl active:scale-[0.98] transition-all cursor-pointer text-sm"
          >
            <RotateCcw size={16} />
            Submit Another Design
          </button>
        </motion.div>
      </div>

      {/* Trust & Operations Label */}
      <div className="border-t border-slate-100 pt-4 mt-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
          <ShieldCheck size={12} className="text-slate-400" />
          <span>Triple Dimension Fabrication — Apemso, Kumasi</span>
        </div>
      </div>
    </div>
  );
}
