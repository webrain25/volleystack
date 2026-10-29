import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: ReactNode;
}

export function PageHeader({ title, description, icon: Icon, actions }: PageHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-8 md:mb-12"
    >
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#38BDF8]/10 rounded-full blur-[60px] pointer-events-none -z-10"></div>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="flex items-center gap-4 md:gap-5">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-surface to-bg-primary border border-[#2A7EA2]/20 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <Icon className="h-6 w-6 md:h-7 md:w-7 text-[#38BDF8]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary">{title}</h1>
            <p className="text-sm md:text-base text-text-tertiary mt-1 md:mt-2 max-w-lg leading-relaxed">{description}</p>
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}
