import React from 'react';
import { Plus, FileText, Clock, Send } from 'lucide-react';
import { EmailTemplate } from '../types';

interface DashboardProps {
  onNew: () => void;
  templates: EmailTemplate[];
  onOpen: (template: EmailTemplate) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNew, templates, onOpen }) => {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 mb-2">Добро пожаловать в EmailCraft</h1>
           <p className="text-gray-500">Создавайте профессиональные рассылки за считанные минуты.</p>
        </div>
        <button 
          onClick={onNew}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition transform hover:scale-105"
        >
          <Plus className="w-5 h-5" /> Создать письмо
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Create New Card */}
        <div 
          onClick={onNew}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition group h-64"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
            <Plus className="w-8 h-8 text-brand-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 group-hover:text-brand-700">Новый шаблон</h3>
          <p className="text-sm text-gray-400 mt-2 text-center">Начать с чистого листа</p>
        </div>

        {/* Existing Templates (Mocked) */}
        {templates.map((template) => (
          <div 
            key={template.id}
            onClick={() => onOpen(template)}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col h-64"
          >
            <div className="h-32 bg-gray-100 border-b border-gray-100 flex items-center justify-center relative overflow-hidden">
               {/* Simple preview mock */}
               <div className="space-y-2 w-3/4 opacity-40 transform scale-75 origin-top">
                 <div className="h-4 bg-gray-300 rounded w-full"></div>
                 <div className="h-20 bg-gray-300 rounded w-full"></div>
                 <div className="h-4 bg-gray-300 rounded w-2/3"></div>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-semibold text-gray-800 line-clamp-1">{template.name}</h3>
                 <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Draft</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{template.previewText || 'Нет описания'}</p>
              <div className="flex items-center text-xs text-gray-400 gap-4 mt-auto">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(template.lastModified).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><FileText className="w-3 h-3"/> {template.blocks.length} блоков</span>
              </div>
            </div>
          </div>
        ))}

        {/* Mock History Item */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition opacity-75">
            <div className="h-32 bg-gray-50 border-b border-gray-100 flex items-center justify-center">
               <Send className="w-10 h-10 text-gray-300" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-800">Отправлено: Еженедельный дайджест</h3>
              <p className="text-sm text-gray-500 mt-1">245 получателей</p>
              <div className="mt-4 text-xs text-gray-400">Отправлено 2 дня назад</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
