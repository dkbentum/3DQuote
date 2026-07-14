/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Upload, 
  Trash2, 
  Plus, 
  Minus, 
  FileCheck, 
  AlertCircle, 
  HelpCircle 
} from 'lucide-react';
import { STLFile, MaterialType, QuoteFormData } from '../types.ts';

interface QuoteFormProps {
  onBack: () => void;
  onSubmit: (formData: QuoteFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function QuoteForm({ onBack, onSubmit, isSubmitting }: QuoteFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for all fields
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [material, setMaterial] = useState<MaterialType>('PLA');
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<STLFile[]>([]);
  
  // Validation state
  const [formError, setFormError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Material descriptions for helpful customer guidance
  const materialInfo: Record<MaterialType, string> = {
    PLA: 'Most popular, eco-friendly, great for decorative and general parts.',
    PETG: 'Strong, chemically resistant, ideal for functional and outdoor parts.',
    ABS: 'Tough, high-temperature resistance, impact-proof industrial plastic.',
    Resin: 'Ultra-high resolution, extreme detail, perfect for miniatures & molds.',
    TPU: 'Flexible, rubber-like, highly durable and impact-absorbing.',
    Other: 'Need specialized carbon-fiber, nylon or metallic materials? Write details below.',
  };

  // Helper to format file sizes elegantly
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle files adding
  const handleFilesArray = (fileList: FileList) => {
    setFormError(null);
    const newFiles: STLFile[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      // STL Validation
      if (extension !== 'stl') {
        setFormError('Only 3D models with the .stl extension are supported.');
        continue;
      }
      
      // Size check: 1000MB = 1000 * 1024 * 1024 bytes
      const maxSizeBytes = 1000 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setFormError(`File "${file.name}" exceeds the 1000MB limit.`);
        continue;
      }

      // Avoid adding exact duplicate file names
      if (files.some(f => f.name === file.name)) {
        continue;
      }

      newFiles.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        formattedSize: formatBytes(file.size),
      });
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  // File drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFilesArray(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFilesArray(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Quantity handlers
  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  // Submit Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Full Name is required.');
      return;
    }

    if (!whatsapp.trim()) {
      setFormError('WhatsApp Number is required.');
      return;
    }

    if (files.length === 0) {
      setFormError('Please upload at least one .stl 3D model.');
      return;
    }

    // Call upstream submission logic
    await onSubmit({
      name,
      whatsapp,
      material,
      quantity,
      description,
      files,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header View */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 bg-slate-50/50">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          id="btn_back_to_hero"
          className="p-2 rounded-full hover:bg-slate-200/50 text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-display font-bold text-slate-800 text-base">Request 3D Quotation</span>
        <div className="w-8"></div> {/* Spacer for visual balance */}
      </div>

      {/* Form Area Scrollable Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {formError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5 text-rose-700 text-xs"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="font-medium">{formError}</span>
          </motion.div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Customer and Print Specs */}
            <div className="space-y-6">
              {/* Customer Details Section */}
              <div className="space-y-4 bg-slate-50/30 p-4 md:p-5 rounded-2xl border border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contact Details
                </h3>
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="input_full_name" className="text-xs font-semibold text-slate-700 block">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="input_full_name"
                required
                disabled={isSubmitting}
                placeholder="E.g. Kofi Mensah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-1.5">
              <label htmlFor="input_whatsapp" className="text-xs font-semibold text-slate-700 block">
                WhatsApp Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  {/* Ghana country flag graphic & standard dial code */}
                  <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs border-r border-slate-200 pr-3">
                    <span className="text-base select-none">🇬🇭</span>
                    <span>+233</span>
                  </div>
                </div>
                <input
                  type="tel"
                  id="input_whatsapp"
                  required
                  disabled={isSubmitting}
                  placeholder="E.g. 53 709 0117"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full pl-24 pr-4 py-3 border border-slate-200 rounded-2xl text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-normal pl-1">
                Include your mobile network number (MTN, Telecel, AT) to discuss details on WhatsApp.
              </p>
            </div>
          </div>

          {/* Material & Specs (moved to left column) */}
          <div className="space-y-4 bg-slate-50/30 p-4 md:p-5 rounded-2xl border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Print Options (Optional)
            </h3>

            {/* Preferred Material */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Preferred Material
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['PLA', 'PETG', 'ABS', 'Resin', 'TPU', 'Other'] as MaterialType[]).map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setMaterial(mat)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                      material === mat
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    } disabled:opacity-50`}
                  >
                    {mat}
                  </button>
                ))}
              </div>

              {/* Helpful material guide tip */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-100 flex items-start gap-2 text-[10px] text-slate-500 mt-2">
                <HelpCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-700">{material}:</strong> {materialInfo[material]}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Quantity Required
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                  <button
                    type="button"
                    disabled={isSubmitting || quantity <= 1}
                    onClick={decrementQuantity}
                    className="p-3 text-slate-500 hover:bg-slate-50 hover:text-emerald-600 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    disabled={isSubmitting}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center font-bold text-sm text-slate-800 outline-none border-x border-slate-100 py-1"
                  />
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={incrementQuantity}
                    className="p-3 text-slate-500 hover:bg-slate-50 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-xs text-slate-400 font-medium">units</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="textarea_description" className="text-xs font-semibold text-slate-700 block">
                Description / Additional Information
              </label>
              <textarea
                id="textarea_description"
                rows={3}
                disabled={isSubmitting}
                placeholder="Specify infill, resolution, post-processing, color preferences, or other constraints..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all resize-none disabled:bg-slate-50 font-medium"
              />
            </div>
          </div>
        </div> {/* closes left column (div className="space-y-6") */}

        {/* Right Column: Model Upload (with sticky top) */}
        <div className="space-y-6 md:sticky md:top-2">
          {/* Model Upload Section */}
          <div className="space-y-3 bg-slate-50/30 p-4 md:p-5 rounded-2xl border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              3D File Upload
            </h3>
            
            {/* Drag & Drop Canvas */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                dragActive 
                  ? 'border-emerald-500 bg-emerald-50/50' 
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              } ${isSubmitting ? 'pointer-events-none opacity-60' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".stl"
                onChange={handleFileInputChange}
                className="hidden"
                id="input_stl_files_picker"
              />
              <div className="p-4 bg-emerald-50 rounded-full shadow-sm border border-emerald-100 text-slate-500">
                <Upload size={28} className="text-emerald-500 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700">Drag STL here or <span className="text-emerald-600 underline font-semibold">Browse</span></p>
                <p className="text-[10px] text-slate-400 mt-1">Supports multi-file .stl (max 1000MB per file)</p>
              </div>
            </div>

            {/* Uploaded Files Queue */}
            <AnimatePresence>
              {files.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                    Uploaded Files ({files.length})
                  </p>
                  <div className="max-h-64 overflow-y-auto pr-1 space-y-2">
                    {files.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600 shrink-0">
                            <FileCheck size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-[10px] text-slate-400">{file.formattedSize}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          disabled={isSubmitting}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div> {/* Closes grid-cols-2 */}

          {/* Form Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            id="btn_submit_quote_request"
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:pointer-events-none mt-8 text-base"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing & Sending Files...
              </>
            ) : (
              'Submit Design Request'
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
