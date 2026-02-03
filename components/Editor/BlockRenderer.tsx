import React from 'react';
import { EmailBlock } from '../../types';

interface BlockRendererProps {
  block: EmailBlock;
  isSelected: boolean;
  onClick: () => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, isSelected, onClick }) => {
  const { type, content, style } = block;

  const baseClasses = `relative group cursor-pointer border-2 transition-all duration-200 ${
    isSelected ? 'border-brand-500 ring-2 ring-brand-100' : 'border-transparent hover:border-gray-300'
  }`;

  const commonStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor || 'transparent',
    color: style.color || '#000000',
    padding: style.padding || '10px',
    fontFamily: style.fontFamily || 'Roboto, sans-serif',
    textAlign: style.textAlign || 'left',
    fontSize: style.fontSize || '16px',
    fontWeight: style.fontWeight || 'normal',
    borderRadius: style.borderRadius || '0px',
  };

  const renderContent = () => {
    switch (type) {
      case 'text':
        return (
          <div style={{...commonStyle, whiteSpace: 'pre-wrap'}}>
            {content.text || 'Введите ваш текст здесь...'}
          </div>
        );
      
      case 'image':
        return (
          <div style={{...commonStyle, textAlign: 'center', padding: '0' }} className="overflow-hidden">
             <img 
               src={content.src || 'https://picsum.photos/600/300'} 
               alt={content.alt || 'Image'} 
               style={{ maxWidth: '100%', height: 'auto', display: 'inline-block', borderRadius: style.borderRadius }}
             />
          </div>
        );

      case 'button':
        return (
          <div style={{ padding: style.padding || '20px', textAlign: style.textAlign || 'center' }}>
            <a
              href={content.url || '#'}
              onClick={(e) => e.preventDefault()}
              style={{
                display: 'inline-block',
                backgroundColor: style.backgroundColor || '#3b82f6',
                color: style.color || '#ffffff',
                padding: '12px 24px',
                textDecoration: 'none',
                borderRadius: style.borderRadius || '4px',
                fontSize: style.fontSize || '16px',
                fontWeight: style.fontWeight || 'bold',
                fontFamily: style.fontFamily,
              }}
            >
              {content.label || 'Нажми меня'}
            </a>
          </div>
        );

      case 'divider':
        return (
          <div style={{ padding: '20px 0' }}>
            <hr style={{ borderTop: `2px solid ${style.color || '#e5e7eb'}`, margin: 0 }} />
          </div>
        );

      case 'spacer':
        return <div style={{ height: content.height || '30px' }} />;

      default:
        return <div>Unknown Block</div>;
    }
  };

  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onClick(); }} 
      className={baseClasses}
    >
      {renderContent()}
      
      {isSelected && (
        <div className="absolute -top-3 -right-3 bg-brand-500 text-white text-xs px-2 py-1 rounded shadow-sm z-10">
          Редактирование
        </div>
      )}
    </div>
  );
};

export default BlockRenderer;
