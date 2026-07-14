/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface STLFile {
  id: string;
  file: File;
  name: string;
  size: number;
  formattedSize: string;
}

export type MaterialType = 'PLA' | 'PETG' | 'ABS' | 'Resin' | 'TPU' | 'Other';

export interface QuoteFormData {
  name: string;
  whatsapp: string;
  material: MaterialType;
  quantity: number;
  description: string;
  files: STLFile[];
}

export interface SubmissionResponse {
  success: boolean;
  simulated?: boolean;
  message?: string;
  orderId?: string;
  error?: string;
  uploadedFiles?: {
    filename: string;
    success: boolean;
    error?: string;
  }[];
}
