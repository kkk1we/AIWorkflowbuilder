// Add this new sidebar alongside your current layout
// Place this in your main layout or page (next to the module builder sidebar)

import {
    LayoutGrid,
    User,
    Settings,
    FileText,
    ShieldCheck,
    BarChart3,
    BookOpen,
    HelpCircle,
    LogOut
  } from 'lucide-react';
  
  export default function AppSidebar() {
    return (
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col justify-between h-screen shadow-sm">
        {/* Top Logo */}
        <div>
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-indigo-600 tracking-tight">ModularAI</h2>
          </div>
  
          {/* Navigation */}
          <nav className="px-3 py-4 space-y-1 text-sm text-gray-700">
            <SidebarItem icon={<LayoutGrid size={18} />} label="Dashboard" active />
            <SidebarItem icon={<FileText size={18} />} label="Workflows" />
            <SidebarItem icon={<BarChart3 size={18} />} label="Usage Analytics" />
            <SidebarItem icon={<User size={18} />} label="Account" />
            <SidebarItem icon={<Settings size={18} />} label="Settings" />
            <SidebarItem icon={<BookOpen size={18} />} label="Docs" />
            <SidebarItem icon={<HelpCircle size={18} />} label="Support" />
          </nav>
        </div>
  
        {/* Bottom User Section */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-gray-800">Edward</p>
              <p className="text-gray-400">Admin</p>
            </div>
            <button className="text-gray-400 hover:text-red-500">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  function SidebarItem({ icon, label, active = false }) {
    return (
      <button
        className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-150 hover:bg-indigo-50 hover:text-indigo-600 ${active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
      >
        <div className="mr-2">
          {icon}
        </div>
        {label}
      </button>
    );
  }
  