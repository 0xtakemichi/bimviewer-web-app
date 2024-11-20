/// <reference types="vite/client" />

import 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number; // La posición Y final de la última tabla
    };
  }
}