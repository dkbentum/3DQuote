/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { upload } from '@vercel/blob/client';
import HeroScreen from './components/HeroScreen.tsx';
import QuoteForm from './components/QuoteForm.tsx';
import SuccessScreen from './components/SuccessScreen.tsx';
import { QuoteFormData, SubmissionResponse } from './types.ts';

type AppScreen = 'HERO' | 'FORM' | 'SUCCESS';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('HERO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isSimulated, setIsSimulated] = useState(false);

  // Submit the multi-part Form to the Express Backend API
  const handleSubmitQuote = async (formData: QuoteFormData) => {
    setIsSubmitting(true);

    try {
      // 1. Upload all selected STL files directly to Vercel Blob Storage
      const fileUrls: { name: string; url: string }[] = [];

      for (const stlFile of formData.files) {
        const blob = await upload(stlFile.file.name, stlFile.file, {
          access: 'public',
          handleUploadUrl: '/api/blob/upload',
        });
        fileUrls.push({ name: stlFile.file.name, url: blob.url });
      }

      // 2. Send the form data and the uploaded file URLs to the API
      const payload = {
        name: formData.name,
        whatsapp: formData.whatsapp,
        material: formData.material,
        quantity: formData.quantity,
        description: formData.description,
        fileUrls: fileUrls,
      };

      // Execute request
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit request to server.');
      }

      const result: SubmissionResponse = await response.json();

      if (result.success) {
        setCustomerName(formData.name);
        setOrderId(result.orderId || '');
        setIsSimulated(!!result.simulated);
        setActiveScreen('SUCCESS');
      } else {
        throw new Error(result.error || 'An error occurred during submission.');
      }

    } catch (err: any) {
      console.error('Submission failed:', err);
      alert(`Submission Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset App to clean state for another design submission
  const handleResetForm = () => {
    setCustomerName('');
    setOrderId('');
    setIsSimulated(false);
    setActiveScreen('HERO');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 md:p-6 lg:p-8">
      {/* 
        This is a fully responsive web card. On mobile, it expands seamlessly 
        to occupy the full screen. On PC/Desktop, it transforms into a spacious, premium card 
        styled with elegant rounded corners, subtle shadows, and crisp border boundaries.
      */}
      <div className="w-full md:max-w-4xl lg:max-w-5xl min-h-screen md:min-h-[720px] md:max-h-[860px] bg-white md:rounded-[32px] md:shadow-2xl md:shadow-slate-100/80 md:border border-slate-100 overflow-hidden relative flex flex-col">

        {/* Dynamic Screen View Layer */}
        <div className="flex-1 overflow-hidden relative bg-white">
          <AnimatePresence mode="wait">
            {activeScreen === 'HERO' && (
              <motion.div
                key="hero-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="absolute inset-0 overflow-y-auto"
              >
                <HeroScreen onStartUpload={() => setActiveScreen('FORM')} />
              </motion.div>
            )}

            {activeScreen === 'FORM' && (
              <motion.div
                key="form-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <QuoteForm
                  onBack={() => setActiveScreen('HERO')}
                  onSubmit={handleSubmitQuote}
                  isSubmitting={isSubmitting}
                />
              </motion.div>
            )}

            {activeScreen === 'SUCCESS' && (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute inset-0 overflow-y-auto"
              >
                <SuccessScreen
                  onReset={handleResetForm}
                  customerName={customerName}
                  orderId={orderId}
                  isSimulated={isSimulated}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
