import React from 'react';

export default function Base64Encoder() {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  const encode = () => {
    try {
      setOutput(btoa(input));
    } catch (e) {
      setOutput('Error: Invalid input for base64 encoding.');
    }
  };

  const decode = () => {
    try {
      setOutput(atob(input));
    } catch (e) {
      setOutput('Error: Invalid base64 string.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        setInput(result);
        setOutput(result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <button
          className="bg-[#24e4a7] text-[#202833] font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors"
          onClick={encode}
        >
          Encode
        </button>
        <button
          className="bg-[#24e4a7] text-[#202833] font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors"
          onClick={decode}
        >
          Decode
        </button>
         <input
          type="file"
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
          onChange={handleFileChange}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 bg-[#2a3442] border border-[#344154] rounded-md px-3 py-2 text-white"
          placeholder="Input"
        ></textarea>
        <textarea
          readOnly
          value={output}
          className="w-full h-64 bg-[#2a3442] border border-[#344154] rounded-md px-3 py-2 text-white"
          placeholder="Output"
        ></textarea>
      </div>
    </div>
  );
}
