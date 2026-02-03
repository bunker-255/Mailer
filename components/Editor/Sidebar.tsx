import React from 'react';
import { Type, Image as ImageIcon, BoxSelect, Divide, MoveVertical, MousePointerClick } from 'lucide-react';
import { BlockType } from '../../types';

interface SidebarProps {
  onAddBlock: (type: BlockType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddBlock }) => {
  const tools = [
    { type: 'text', label: 'Текст', icon: <Type className="w-5 h-5" /> },
    { type: 'image', label: 'Изображение', icon: <ImageIcon className="w-5 h-5" /> },
    { type: 'button', label: 'Кнопка', icon: <MousePointerClick className="w-5 h-5" /> },
    { type: 'spacer', label: 'Отступ', icon: <MoveVertical className="w-5 h-5" /> },
    { type: 'divider', label: 'Разделитель', icon: <Divide className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full z-10 shadow-sm">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <BoxSelect className="text-brand-600" />
          Инструменты
        </h2>
        <p className="text-xs text-gray-400 mt-1">Нажмите чтобы добавить</p>
      </div>
      
      <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => onAddBlock(tool.type as BlockType)}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 transition-all group"
          >
            <div className="text-gray-500 group-hover:text-brand-600 mb-2">
              {tool.icon}
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-brand-700">
              {tool.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-auto p-4 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-500 leading-relaxed">
          <p className="font-semibold mb-1">Совет:</p>
          Используйте "AI Помощник" в панели свойств для улучшения текста и подбора картинок.
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
