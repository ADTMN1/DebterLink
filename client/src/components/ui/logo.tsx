import { GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Logo({ className = "", collapsed = false }: { className?: string, collapsed?: boolean }) {
  const { t } = useTranslation();
  
  return (
    <div className={`flex items-center gap-2 font-bold text-xl tracking-tight h-20 ${className}`}>
      <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
        <GraduationCap size={24} />
      </div>
      {!collapsed && (
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">
          {t('app.name')}
        </span>
      )}
    </div>
  );
}
