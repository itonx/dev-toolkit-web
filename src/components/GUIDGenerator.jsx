import React from 'react';

export default function GUIDGenerator() {
  const [guid, setGuid] = React.useState('');

  const generateGuid = () => {
    setGuid(crypto.randomUUID());
  };

  return (
    <div>
      <button
        className="bg-[#24e4a7] text-[#202833] font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors"
        onClick={generateGuid}
      >
        Generate GUID
      </button>
      <input
        type="text"
        readOnly
        value={guid}
        className="w-full bg-[#2a3442] border border-[#344154] rounded-md px-3 py-2 mt-4 text-white"
        placeholder="Click the button to generate a GUID"
      />
    </div>
  );
}
