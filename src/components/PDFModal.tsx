import { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.js?url";
import { X, Download, Loader2 } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PDFModalProps {
  file: string;
  title: string;
  onClose: () => void;
}

const PDFModal = ({ file, title, onClose }: PDFModalProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [loading, setLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const updateWidth = useCallback(() => {
    const container = document.getElementById('pdf-container');
    if (container) {
      setContainerWidth(container.clientWidth);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-2xl w-[95vw] h-[90vh] max-w-5xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-norm-500 truncate pr-4">{title}</h2>
          <div className="flex items-center gap-3">
            <a
              href={file}
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-norm-500 text-white text-sm font-medium rounded-lg hover:bg-norm-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div
          id="pdf-container"
          className="flex-1 overflow-y-auto bg-gray-100 p-4"
        >
          {loading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-norm-500 animate-spin" />
            </div>
          )}
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading=""
            error={
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-lg font-medium">PDF not available yet</p>
                <p className="text-sm mt-2">This file will be added soon.</p>
              </div>
            }
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div key={`page_${index + 1}`} className="mb-4 shadow-lg rounded-lg overflow-hidden bg-white">
                <Page
                  pageNumber={index + 1}
                  width={containerWidth - 32}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PDFModal;
