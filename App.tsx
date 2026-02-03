import React, { useState, useEffect } from 'react';
import { ViewMode, EmailBlock, EmailTemplate } from './types';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Editor/Sidebar';
import PropertiesPanel from './components/Editor/PropertiesPanel';
import BlockRenderer from './components/Editor/BlockRenderer';
import { ArrowLeft, Save, Send, Eye, Monitor, Smartphone, GripVertical, CheckCircle2 } from 'lucide-react';
import { generateEmailSubject } from './services/geminiService';

// Mock initial data
const INITIAL_TEMPLATE: EmailTemplate = {
  id: '1',
  name: 'Приветственное письмо',
  previewText: 'Добро пожаловать в наш сервис!',
  lastModified: Date.now(),
  blocks: [
    {
      id: 'b1',
      type: 'image',
      content: { src: 'https://picsum.photos/seed/email/800/400', alt: 'Header Image' },
      style: { borderRadius: '8px 8px 0 0', padding: '0' }
    },
    {
      id: 'b2',
      type: 'text',
      content: { text: 'Добро пожаловать в EmailCraft! \n\nМы рады видеть вас здесь. Это пример простого текстового блока, который вы можете редактировать.' },
      style: { fontSize: '18px', padding: '30px', fontFamily: 'Roboto, sans-serif' }
    },
    {
      id: 'b3',
      type: 'button',
      content: { label: 'Начать работу', url: '#' },
      style: { textAlign: 'center', backgroundColor: '#0ea5e9', color: '#ffffff', borderRadius: '50px' }
    }
  ]
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate>(INITIAL_TEMPLATE);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'info'} | null>(null);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAddBlock = (type: string) => {
    const newBlock: EmailBlock = {
      id: `block-${Date.now()}`,
      type: type as any,
      content: { text: type === 'text' ? 'Новый текстовый блок' : undefined, label: type === 'button' ? 'Кнопка' : undefined },
      style: { padding: '20px' }
    };
    
    setCurrentTemplate(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlock = (updatedBlock: EmailBlock) => {
    setCurrentTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b)
    }));
  };

  const handleDeleteBlock = (id: string) => {
    setCurrentTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id)
    }));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...currentTemplate.blocks];
    if (direction === 'up' && index > 0) {
      [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    } else if (direction === 'down' && index < newBlocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    }
    setCurrentTemplate(prev => ({ ...prev, blocks: newBlocks }));
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    // 1. Generate subject with AI if empty
    let subject = currentTemplate.name;
    if (subject.length < 5) {
       subject = await generateEmailSubject(currentTemplate.blocks.find(b => b.type === 'text')?.content.text || 'Newsletter');
    }

    // 2. Mock Sending
    setTimeout(() => {
      setIsSending(false);
      setNotification({ msg: `Письмо "${subject}" успешно отправлено!`, type: 'success' });
    }, 2000);
  };

  const renderDashboard = () => (
    <Dashboard 
      onNew={() => {
        setCurrentTemplate({ ...INITIAL_TEMPLATE, id: `new-${Date.now()}`, blocks: [], name: 'Новая рассылка' });
        setView(ViewMode.EDITOR);
      }}
      templates={[INITIAL_TEMPLATE]}
      onOpen={(t) => {
        setCurrentTemplate(t);
        setView(ViewMode.EDITOR);
      }}
    />
  );

  const renderEditor = () => {
    const selectedBlock = currentTemplate.blocks.find(b => b.id === selectedBlockId) || null;

    return (
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-6 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setView(ViewMode.DASHBOARD)} className="text-gray-500 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <input 
              value={currentTemplate.name}
              onChange={(e) => setCurrentTemplate(prev => ({ ...prev, name: e.target.value }))}
              className="font-semibold text-lg text-gray-800 bg-transparent border-none focus:ring-0 placeholder-gray-400"
              placeholder="Название рассылки"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-1 rounded-lg flex mr-4">
              <button 
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-white shadow text-brand-600' : 'text-gray-400'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-white shadow text-brand-600' : 'text-gray-400'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={() => setNotification({ msg: 'Черновик сохранен', type: 'info'})}
              className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition"
            >
              <Save className="w-4 h-4" /> Сохранить
            </button>
            <button 
              onClick={handleSendEmail}
              disabled={isSending}
              className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md transition disabled:opacity-50"
            >
              {isSending ? 'Отправка...' : <><Send className="w-4 h-4" /> Отправить</>}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar onAddBlock={handleAddBlock} />

          {/* Canvas */}
          <main className="flex-1 overflow-y-auto bg-gray-100 p-8 flex justify-center relative" onClick={() => setSelectedBlockId(null)}>
            <div 
              className={`bg-white shadow-xl transition-all duration-300 min-h-[600px] flex flex-col ${
                previewDevice === 'mobile' ? 'w-[375px]' : 'w-[650px]'
              }`}
            >
              {currentTemplate.blocks.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                   <p>Перетащите блоки или нажмите, чтобы добавить</p>
                </div>
              )}

              {currentTemplate.blocks.map((block, index) => (
                <div key={block.id} className="relative group">
                   {/* Reorder Controls */}
                   {selectedBlockId === block.id && (
                     <div className="absolute left-full ml-2 top-0 bg-white shadow-md rounded-lg flex flex-col overflow-hidden z-10 border border-gray-100">
                        <button onClick={(e) => {e.stopPropagation(); moveBlock(index, 'up')}} className="p-2 hover:bg-gray-50 text-gray-500 hover:text-brand-600" title="Вверх">
                          <ArrowLeft className="w-4 h-4 rotate-90" />
                        </button>
                        <div className="h-[1px] bg-gray-100"></div>
                        <button onClick={(e) => {e.stopPropagation(); moveBlock(index, 'down')}} className="p-2 hover:bg-gray-50 text-gray-500 hover:text-brand-600" title="Вниз">
                          <ArrowLeft className="w-4 h-4 -rotate-90" />
                        </button>
                     </div>
                   )}
                   
                   <BlockRenderer 
                      block={block} 
                      isSelected={selectedBlockId === block.id} 
                      onClick={() => setSelectedBlockId(block.id)}
                   />
                </div>
              ))}
              
              {/* Footer Mock */}
              <div className="p-8 text-center bg-gray-50 border-t mt-auto">
                <p className="text-xs text-gray-400">Вы получили это письмо, потому что подписались на рассылку.</p>
                <div className="flex justify-center gap-4 mt-2">
                   <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                   <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                   <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </main>

          <PropertiesPanel 
            block={selectedBlock} 
            onUpdate={handleUpdateBlock} 
            onDelete={handleDeleteBlock}
          />
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-fade-in-up">
            {notification.type === 'success' && <CheckCircle2 className="text-green-400 w-5 h-5" />}
            {notification.type === 'info' && <Save className="text-blue-400 w-5 h-5" />}
            {notification.msg}
          </div>
        )}
      </div>
    );
  };

  return view === ViewMode.DASHBOARD ? renderDashboard() : renderEditor();
};

export default App;
