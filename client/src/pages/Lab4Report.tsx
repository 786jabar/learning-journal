import { CheckCircle2, Database, Globe, Code2, ExternalLink, Laptop, Server } from "lucide-react";

export default function Lab4Report() {
  const handlePrint = () => {
    alert('IMPORTANT: In the print dialog, click "More settings" and turn OFF "Headers and footers" to remove the URL!');
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print Button */}
      <div className="print:hidden fixed top-4 right-4 z-50">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 shadow-lg"
          data-testid="button-print-pdf"
        >
          📄 Print to PDF
        </button>
      </div>

      {/* Instructions */}
      <div className="print:hidden max-w-4xl mx-auto p-6 mt-4">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <p className="font-bold text-amber-900">⚠️ To remove URL from PDF:</p>
          <p className="text-sm text-amber-700">Click "Print to PDF" → Click "More settings" → Turn OFF "Headers and footers"</p>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-5xl mx-auto px-12 py-8 print:px-0">
        
        {/* PAGE HEADER */}
        <div className="print:block hidden print:fixed print:top-0 print:left-0 print:right-0 print:px-12 print:pt-4 print:pb-2 print:bg-white print:border-b-2 print:border-emerald-600 print:z-50">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <div>
              <span className="font-semibold">Md Jawar Safi (2315024)</span>
            </div>
            <div>
              <span className="font-semibold">FGCT6021 Lab 4</span>
            </div>
            <div>
              <span>Page <span className="page-number"></span></span>
            </div>
          </div>
        </div>
        
        {/* COVER PAGE */}
        <div className="page-break text-center py-20">
          <div className="mb-12">
            <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Globe className="w-20 h-20 text-white" />
            </div>
            <div className="border-4 border-gray-900 rounded-lg p-10 inline-block shadow-xl bg-white">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Lab 4 Report
              </h1>
              <div className="h-1.5 w-72 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 mx-auto mb-6 rounded-full"></div>
              <h2 className="text-3xl font-semibold text-gray-700 mb-3">
                API Integration & Web Technologies
              </h2>
              <p className="text-xl text-gray-600 font-medium">Storage, Browser & Third-Party APIs</p>
              <p className="text-lg text-gray-500 mt-2">FGCT6021 Mobile Application Development</p>
            </div>
          </div>
          
          <div className="my-12 bg-gradient-to-br from-gray-50 to-emerald-50 border-2 border-emerald-600 rounded-lg p-8 inline-block text-left shadow-lg">
            <div className="space-y-4 text-lg">
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-44">Submitted By:</span>
                <span className="text-gray-900 font-semibold">Md Jawar Safi</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-44">Student Number:</span>
                <span className="text-gray-900 font-semibold">2315024</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-44">Course:</span>
                <span className="text-gray-900">FGCT6021 Mobile App Development</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-44">Assignment:</span>
                <span className="text-gray-900">Lab 4 - API Integration</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-44">Date Submitted:</span>
                <span className="text-gray-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="mt-16 space-y-4">
            <p className="text-gray-600 italic text-lg mb-8">
              "Exploring Modern Web APIs: From Local Storage to External Services"
            </p>
            
            {/* Live Demo Link */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-600 rounded-xl p-6 inline-block shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <ExternalLink className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-gray-900">Live Application</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">Access the working demo online:</p>
              <a 
                href="https://learning-journal-x05x.onrender.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-semibold text-lg hover:text-emerald-900 underline break-all"
              >
                https://learning-journal-x05x.onrender.com
              </a>
              <p className="text-xs text-gray-600 mt-3">
                Lab 4 Demo: /lab4-demo
              </p>
            </div>

            <div className="mt-10 border-t-2 border-gray-300 pt-6">
              <p className="text-sm text-gray-600 font-semibold">Source Code Repository</p>
              <p className="text-sm text-gray-500 mt-2">GitHub: https://github.com/786jabar/learning-journal.git</p>
            </div>
          </div>
        </div>

        {/* DECLARATION */}
        <div className="page-break py-12">
          <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-emerald-600 pb-3 mb-6">Declaration of Originality</h2>
          
          <div className="bg-gradient-to-br from-gray-50 to-emerald-50 border-2 border-emerald-300 rounded-lg p-8 my-8 shadow-sm">
            <p className="text-gray-800 leading-relaxed mb-6">
              I declare that this assignment is my own work. All the code, implementations, and documentation presented 
              here were developed by me independently. While I used online resources and documentation to understand 
              API concepts and best practices, all implementations were written from scratch based on my understanding. 
              Any external libraries or code snippets are properly attributed in the references section.
            </p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-40">Student Name:</span>
                <span className="text-gray-900 font-semibold">Md Jawar Safi</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-40">Student Number:</span>
                <span className="text-gray-900 font-semibold">2315024</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-40">Date:</span>
                <span className="text-gray-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-start mt-8">
                <span className="font-bold text-gray-700 w-40">Signature:</span>
                <span className="text-gray-900 font-cursive text-2xl">Md Jawar Safi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-20 text-sm text-gray-500">
          <p>*** End of Report ***</p>
          <p className="mt-2">Complete documentation available at the live demo URL above</p>
        </div>

      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 1in;
            size: letter;
          }
          .page-break {
            page-break-after: always;
            page-break-inside: avoid;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
