import React from 'react';
import ToolCard from './ToolCard';

const tools = [
  { name: 'GUID Generator', component: 'GUIDGenerator' },
  { name: 'Base64 Encoder', component: 'Base64Encoder' },
];

export default function Sidebar() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTool, setActiveTool] = React.useState('');

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectTool = (tool) => {
    setActiveTool(tool.name);
    const event = new CustomEvent('select-tool', { detail: tool });
    document.dispatchEvent(event);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-[#2a3442] border border-[#344154] rounded-md px-3 py-2 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-[#24e4a7]"
        onChange={e => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <div className="grid grid-cols-2 gap-2">
        {filteredTools.map(tool => (
          <ToolCard 
            key={tool.name} 
            name={tool.name} 
            onClick={() => selectTool(tool)}
            isActive={activeTool === tool.name}
          />
        ))}
      </div>
    </div>
  );
}
