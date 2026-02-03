import React, { useState } from 'react';
import { EmailBlock } from '../../types';
import { Wand2, AlignLeft, AlignCenter, AlignRight, Type, Palette, Layout, Trash2, Loader2 } from 'lucide-react';
import { improveText, generateImagePrompt } from '../../services/geminiService';

interface PropertiesPanelProps {
  block: EmailBlock | null;
  onUpdate: (updatedBlock: EmailBlock) => void;
  onDelete: (id: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ block, onUpdate, onDelete }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!block) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Выберите элемент письма для редактирования</p>
      </div>
    );
  }

  const handleStyleChange = (key: string, value: string) => {
    onUpdate({
      ...block,
      style: { ...block.style, [key]: value }
    });
  };

  const handleContentChange = (key: string, value: string) => {
    onUpdate({
      ...block,
      content: { ...block.content, [key]: value }
    });
  };

  const handleAiImprove = async (tone: 'professional' | 'friendly' | 'sales') => {
    if (block.type !== 'text' || !block.content.text) return;
    
    setIsAiLoading(true);
    const improved = await improveText(block.content.text, tone);
    handleContentChange('text', improved);
    setIsAiLoading(false);
  };

  const handleAiImage = async () => {
     if (block.type !== 'image') return;
     setIsAiLoading(true);
     // Use the alt text as description
     const newSrc = await generateImagePrompt(block.content.alt || 'office business');
     handleContentChange('src', newSrc);
     setIsAiLoading(false);
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col w-80 shadow-lg z-20">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Palette className="w-4 h-4" /> Настройки
        </h3>
        <button 
          onClick={() => onDelete(block.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
          title="Удалить блок"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
        
        {/* TEXT CONTENT */}
        {block.type === 'text' && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Содержание</label>
            <textarea
              value={block.content.text}
              onChange={(e) => handleContentChange('text', e.target.value)}
              className="w-full p-3 border rounded-md text-sm focus:ring-2 focus:ring-brand-500 outline-none min-h-[120px]"
              placeholder="Введите текст..."
            />
            
            {/* AI Assistant */}
            <div className="bg-brand-50 p-3 rounded-md border border-brand-100">
              <div className="flex items-center gap-2 text-brand-700 text-sm font-medium mb-2">
                <Wand2 className="w-4 h-4" /> AI Помощник
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => handleAiImprove('professional')}
                  disabled={isAiLoading}
                  className="text-xs bg-white border border-brand-200 text-brand-700 py-1 px-2 rounded hover:bg-brand-100 flex items-center justify-center gap-1"
                >
                  {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : 'Деловой стиль'}
                </button>
                <button 
                  onClick={() => handleAiImprove('friendly')}
                  disabled={isAiLoading}
                  className="text-xs bg-white border border-brand-200 text-brand-700 py-1 px-2 rounded hover:bg-brand-100 flex items-center justify-center gap-1"
                >
                  {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : 'Дружелюбный стиль'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IMAGE SETTINGS */}
        {block.type === 'image' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Ссылка на изображение</label>
              <input
                type="text"
                value={block.content.src}
                onChange={(e) => handleContentChange('src', e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
             <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Alt Текст (для AI)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={block.content.alt}
                  onChange={(e) => handleContentChange('alt', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Описание..."
                />
                <button 
                  onClick={handleAiImage}
                  disabled={isAiLoading}
                  className="bg-brand-100 text-brand-600 p-2 rounded hover:bg-brand-200"
                  title="Найти картинку с AI"
                >
                  {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Wand2 className="w-4 h-4"/>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BUTTON SETTINGS */}
        {block.type === 'button' && (
          <div className="space-y-4">
             <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Текст кнопки</label>
              <input
                type="text"
                value={block.content.label}
                onChange={(e) => handleContentChange('label', e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Ссылка</label>
              <input
                type="text"
                value={block.content.url}
                onChange={(e) => handleContentChange('url', e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
             <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Цвет кнопки</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={block.style.backgroundColor || '#3b82f6'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-10 h-10 border rounded cursor-pointer"
                />
                <span className="text-sm text-gray-500">{block.style.backgroundColor}</span>
              </div>
            </div>
          </div>
        )}

        {/* COMMON STYLES (Typography, Align, Spacing) */}
        <hr className="border-gray-100" />
        
        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
            <Layout className="w-3 h-3" /> Оформление
          </label>

          {/* Alignment */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['left', 'center', 'right'].map((align) => (
              <button
                key={align}
                onClick={() => handleStyleChange('textAlign', align)}
                className={`flex-1 p-2 rounded-md flex justify-center transition ${
                  block.style.textAlign === align ? 'bg-white shadow-sm text-brand-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {align === 'left' && <AlignLeft className="w-4 h-4" />}
                {align === 'center' && <AlignCenter className="w-4 h-4" />}
                {align === 'right' && <AlignRight className="w-4 h-4" />}
              </button>
            ))}
          </div>

          {/* Font Family */}
          {(block.type === 'text' || block.type === 'button') && (
            <div className="space-y-2">
              <label className="text-xs text-gray-500">Шрифт</label>
              <select 
                value={block.style.fontFamily} 
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                className="w-full p-2 border rounded text-sm bg-white"
              >
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
                <option value="'Lato', sans-serif">Lato</option>
                <option value="'Montserrat', sans-serif">Montserrat</option>
                <option value="'Merriweather', serif">Merriweather</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
              </select>
            </div>
          )}

           {/* Font Size */}
           {(block.type === 'text' || block.type === 'button') && (
            <div className="space-y-2">
              <label className="text-xs text-gray-500">Размер шрифта</label>
              <input 
                type="range" 
                min="12" 
                max="48" 
                value={parseInt(block.style.fontSize || '16')} 
                onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                className="w-full accent-brand-500"
              />
              <div className="text-right text-xs text-gray-500">{block.style.fontSize}</div>
            </div>
          )}

          {/* Padding */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500">Отступы</label>
            <input 
              type="range" 
              min="0" 
              max="60" 
              value={parseInt(block.style.padding || '10')} 
              onChange={(e) => handleStyleChange('padding', `${e.target.value}px`)}
              className="w-full accent-brand-500"
            />
             <div className="text-right text-xs text-gray-500">{block.style.padding}</div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-xs text-gray-500 mb-1 block">Текст</label>
               <input
                type="color"
                value={block.style.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-full h-8 border rounded cursor-pointer"
              />
             </div>
             {block.type !== 'image' && block.type !== 'divider' && (
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Фон</label>
                <input
                  type="color"
                  value={block.style.backgroundColor === 'transparent' ? '#ffffff' : block.style.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-full h-8 border rounded cursor-pointer"
                />
              </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
