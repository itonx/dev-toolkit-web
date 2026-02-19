import React, { useState } from 'react';

const Base64Encoder: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const encode = () => {
    setOutput(btoa(input));
  };

  const decode = () => {
    try {
      setOutput(atob(input));
    } catch (e) {
      setOutput('Invalid Base64 string');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl text-white">Base64 Encoder / Decoder</h2>
      <div className="flex flex-col space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-surface border border-border rounded-md px-4 py-2 text-white h-32"
          placeholder="Enter text to encode or decode"
        />
        <textarea
          readOnly
          value={output}
          className="flex-grow bg-surface border border-border rounded-md px-4 py-2 text-white h-32"
          placeholder="Output"
        />
      </div>
       <div className="flex space-x-2">
        <button
          onClick={encode}
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
        >
          Encode
        </button>
        <button
          onClick={decode}
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
        >
          Decode
        </button>
        <button
          onClick={copyToClipboard}
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
        >
          Copy Output
        </button>
      </div>
    </div>
  );
};

export default Base64Encoder;
