
import React, { useState } from 'react';
import { FileData } from '../types';

interface FileUploaderProps {
  onUpload: (file: FileData) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    if (!file.type.includes('text') && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      setError("Please upload a plain text file (.txt or .md)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onUpload({
        name: file.name,
        content: content,
        size: file.size,
      });
    };
    reader.onerror = () => setError("Failed to read the file.");
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full max-w-md p-10 border-2 border-dashed rounded-3xl transition-all duration-300 ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50 scale-105' 
            : 'border-gray-300 bg-white hover:border-indigo-400'
        }`}
      >
        <div className="mb-6">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <i className="fas fa-file-upload text-3xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Upload Reference File</h2>
          <p className="text-sm text-gray-500">
            Upload a text file to give your chatbot specialized knowledge.
          </p>
        </div>

        <label className="cursor-pointer group">
          <span className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 group-active:scale-95">
            Select File
          </span>
          <input 
            type="file" 
            accept=".txt,.md,.json,.csv" 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </label>
        
        <p className="mt-4 text-xs text-gray-400">
          Supports .txt, .md, .csv (Plain text format)
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg animate-bounce">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
        <FeatureCard 
          icon="fa-search" 
          title="Instant Search" 
          desc="Find details buried in long documents instantly." 
        />
        <FeatureCard 
          icon="fa-feather-pointed" 
          title="Summarization" 
          desc="Get concise summaries of provided text blocks." 
        />
        <FeatureCard 
          icon="fa-shield-halved" 
          title="Context-Aware" 
          desc="AI stays strictly within your uploaded context." 
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
    <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center mb-3">
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="font-bold text-sm text-gray-800 mb-1">{title}</h3>
    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

export default FileUploader;
