import React from "react";

const FileFormats: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 p-8 rounded-lg border border-gray-300 text-center shadow-md">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-8">
        Supported File Formats
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
        {[
          { icon: "📄", label: "PDF" },
          { icon: "🖼️", label: "JPG" },
          { icon: "🖼️", label: "JPEG" },
          { icon: "📄", label: "PNG" },
          { icon: "📊", label: "PPTX" },
          { icon: "📄", label: "DOCX" },
        ].map((format, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white p-6 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transform transition duration-300"
          >
            <span className="text-4xl">{format.icon}</span>
            <span className="text-sm font-semibold text-gray-800 mt-3">
              {format.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-center gap-2">
        <span className="text-xl text-blue-600">ℹ️</span>
        <span className="text-sm font-medium text-gray-800">
          PDF is best optimized for printing results
        </span>
      </div>
    </div>
  );
};

export default FileFormats;
