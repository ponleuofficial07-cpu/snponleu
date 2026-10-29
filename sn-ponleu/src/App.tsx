import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { AIChatbotModal } from './components/AIChatbotModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { PersonalPage } from './pages/PersonalPage.tsx';
import { WorkingPage } from './pages/WorkingPage.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.tsx';
import { SoftwarePage } from './pages/SoftwarePage.tsx';
import { SoftwareDetailPage } from './pages/SoftwareDetailPage.tsx';
import { BlogPage } from './pages/BlogPage.tsx';
import { BlogDetailPage } from './pages/BlogDetailPage.tsx';
import { AIToolsPage } from './pages/AIToolsPage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { SearchPage } from './pages/SearchPage.tsx';
import { AdminLoginPage } from './pages/AdminLoginPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { MessageSquareCode } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentRoute, routeParam, admin, setIsChatOpen, t } = useApp();

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'personal':
        return <PersonalPage />;
      case 'working':
        return <WorkingPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'project-detail':
        return <ProjectDetailPage slug={routeParam || 'nimbus-cloud-console'} />;
      case 'software':
        return <SoftwarePage />;
      case 'software-detail':
        return <SoftwareDetailPage slug={routeParam || 'ponleu-fastsystem-cleaner'} />;
      case 'blog':
        return <BlogPage />;
      case 'blog-detail':
        return <BlogDetailPage slug={routeParam || 'fix-100-percent-disk-usage-windows-11'} />;
      case 'ai-tools':
        return <AIToolsPage />;
      case 'services':
        return <ServicesPage />;
      case 'contact':
        return <ContactPage />;
      case 'search':
        return <SearchPage />;
      case 'admin-login':
        return <AdminLoginPage />;
      case 'admin':
        return admin ? <AdminDashboard /> : <AdminLoginPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] dark:bg-[#0B1220] text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1 w-full">{renderCurrentPage()}</main>
      <Footer />
      <AIChatbotModal />

      {/* Floating Action Button for Gemini AI ICT Assistant */}
      <button
        onClick={() => setIsChatOpen(true)}
        title={t.btn_open_chat}
        className="fixed bottom-6 right-6 z-30 p-3.5 bg-gradient-to-r from-[#1677FF] to-[#42ADF5] text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center group"
      >
        <MessageSquareCode className="w-5 h-5" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
          {t.btn_open_chat}
        </span>
      </button>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
