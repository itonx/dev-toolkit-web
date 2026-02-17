import React, { useState } from 'react';

const GuidGenerator: React.FC = () => {
  const [guid, setGuid] = useState<string>('');

  const generateGuid = () => {
    setGuid(crypto.randomUUID());
  };

  const copyToClipboard = () => {
    if (guid) {
      navigator.clipboard.writeText(guid);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl text-white">GUID Generator</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          readOnly
          value={guid}
          className="flex-grow bg-surface border border-border rounded-md px-4 py-2 text-white"
          placeholder="Click 'Generate' to create a new GUID"
        />
        <button
          onClick={copyToClipboard}
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
        >
          Copy
        </button>
      </div>
      <button
        onClick={generateGuid}
        className="bg-accent text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
      >
        Generate
      </button>
    </div>
  );
};

export default GuidGenerator;
