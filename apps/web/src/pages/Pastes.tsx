
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Gift, Plus, CheckCircle2, X, Sparkles, Loader2, Croissant } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { PageHeader } from '../components/PageHeader';
import { DateTimePicker } from '../components/DateTimePicker';

const pasteSchema = z.object({
  teamMemberId: z.string().min(1, 'Seleziona un giocatore'),
  reason: z.string().min(1, 'La motivazione è obbligatoria'),
  deadline: z.string().optional()
});

type PasteForm = z.infer<typeof pasteSchema>;

export default function Pastes() {
  const { user } = useAuthStore();
  const teamId = user?.memberships?.[0]?.teamId;
  const canManage = user?.memberships?.[0]?.roles?.some((r: any) => ['ADMIN', 'ADMIN', 'CAPTAIN'].includes(r.role)) ?? false;
  
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: pastes, isLoading: pastesLoading } = useQuery({
    queryKey: ['pastes', teamId],
    queryFn: () => api.get(`/teams/${teamId}/pastes`).then(res => res.data),
    enabled: !!teamId,
  });

  const { data: teamMembers } = useQuery({
    queryKey: ['team', teamId, 'members'],
    queryFn: () => api.get(`/teams/${teamId}/members`).then(res => res.data),
    enabled: !!teamId,
  });

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch, control } = useForm<PasteForm>({
    resolver: zodResolver(pasteSchema),
  });

  const selectedMemberId = watch('teamMemberId');

  const handleGenerateAiReason = async () => {
    try {
      setIsGeneratingAi(true);
      const res = await api.post(`/teams/${teamId}/ai/paste-reason`, {
        teamMemberId: selectedMemberId || undefined
      });
      if (res.data?.reason) {
        setValue('reason', res.data.reason, { shouldValidate: true });
      }
    } catch (err: any) {
      alert('Errore durante la generazione con Gemini AI: ' + (err.response?.data?.details || err.message));
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const assignPaste = useMutation({
    mutationFn: (data: PasteForm) => api.post(`/teams/${teamId}/pastes`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pastes', teamId] });
      setShowForm(false);
      reset();
    }
  });

  const deliverPaste = useMutation({
    mutationFn: (pasteId: string) => api.patch(`/teams/${teamId}/pastes/${pasteId}/deliver`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pastes', teamId] });
    }
  });

  if (!teamId) return <div className="p-8 text-center text-text-tertiary">Nessuna squadra associata</div>;

  const pendingPastes = pastes?.filter((p: any) => p.status === 'PENDING') || [];
  const deliveredPastes = pastes?.filter((p: any) => p.status === 'DELIVERED') || [];

  return (
    <div className="space-y-6 relative">
      <PageHeader 
        title="Paste e Pasticcini"
        description="Compleanni o battute sotto rete? Tieni traccia di chi deve portare le paste!"
        icon={Croissant}
        actions={
          canManage && (
            <button 
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-sm font-bold transition-all shadow-[0_4px_20px_rgba(219,39,119,0.3)] flex items-center shrink-0"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Assegna Paste
            </button>
          )
        }
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 /60 backdrop-blur-sm animate-in fade-in">
          <div className="saas-card w-full max-w-md p-6 shadow-2xl relative animate-in slide-in-from-bottom-4">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-text-tertiary hover:text-text-secondary dark:text-text-tertiary dark:hover:text-gray-200 transition-colors">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-1 text-text-primary  flex items-center">
               <Gift className="h-5 w-5 mr-2 text-pink-500" /> Nuova Penalità
            </h2>
            <p className="text-sm text-text-tertiary mb-6">Chi si merita di portare le paste al prossimo allenamento?</p>
            
            <form onSubmit={handleSubmit((d) => assignPaste.mutate(d))} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary dark:text-text-tertiary uppercase tracking-wider mb-2">Giocatore</label>
                <select {...register('teamMemberId')} className="saas-input">
                  <option value="">-- Seleziona un giocatore --</option>
                  {teamMembers?.map((member: any) => (
                    <option key={member.id} value={member.id}>{member.user.name || member.user.email}</option>
                  ))}
                </select>
                {errors.teamMemberId && <p className="text-red-500 dark:text-accent-500 text-xs mt-1">{errors.teamMemberId.message}</p>}
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-text-secondary dark:text-text-tertiary uppercase tracking-wider">
                    Motivazione
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAiReason}
                    disabled={isGeneratingAi}
                    className="inline-flex items-center text-xs font-semibold text-pink-600 hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingAi ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Generazione...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-1" /> Suggerisci con Gemini AI
                      </>
                    )}
                  </button>
                </div>
                <input {...register('reason')} className="saas-input" placeholder="Es. Battuta in rete o invasione colossale" />
                {errors.reason && <p className="text-red-500 dark:text-accent-500 text-xs mt-1">{errors.reason.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary dark:text-text-tertiary uppercase tracking-wider mb-2">Scadenza (Opzionale)</label>
                <Controller
                  name="deadline"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-border/50 dark:border-[#262626] mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="saas-btn-secondary">Annulla</button>
                <button type="submit" disabled={assignPaste.isPending} className="saas-btn-primary bg-pink-600 hover:bg-pink-500">
                  {assignPaste.isPending ? 'Salvataggio...' : 'Assegna Paste'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Da Portare */}
         <div className="saas-card overflow-hidden border-pink-100 dark:border-pink-900/30">
            <div className="p-4 border-b border-border dark:border-[#262626] bg-pink-50/50 dark:bg-pink-950/10 flex items-center justify-between">
               <h2 className="text-sm font-semibold text-text-primary  flex items-center">
                  <Gift className="h-4 w-4 mr-2 text-pink-600 dark:text-pink-500" /> Da Portare ({pendingPastes.length})
               </h2>
            </div>
            
            {pastesLoading ? (
               <div className="p-8 text-center text-text-tertiary">Caricamento...</div>
            ) : pendingPastes.length > 0 ? (
               <div className="divide-y divide-gray-100 dark:divide-[#262626]">
                  {pendingPastes.map((paste: any) => (
                     <div key={paste.id} className="p-4 flex items-center justify-between hover:bg-surface dark:hover:bg-gray-900/30 transition-colors group">
                        <div>
                           <p className="text-sm font-bold text-text-primary ">{paste.teamMember.user.name}</p>
                           <p className="text-xs text-text-tertiary">{paste.reason}</p>
                           {paste.deadline && (
                             <p className="text-[10px] font-semibold text-pink-600 mt-1 uppercase tracking-wider">
                               Entro il: {new Date(paste.deadline).toLocaleDateString('it-IT')}
                             </p>
                           )}
                        </div>
                        {canManage && (
                          <button 
                             onClick={() => deliverPaste.mutate(paste.id)}
                             disabled={deliverPaste.isPending}
                             className="saas-btn-secondary py-1.5 px-3 text-xs bg-transparent hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 dark:hover:bg-pink-500/10 dark:hover:text-pink-400 dark:hover:border-pink-500/30 flex items-center"
                          >
                             <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Consegnate
                          </button>
                        )}
                     </div>
                  ))}
               </div>
            ) : (
               <div className="p-12 text-center text-text-tertiary text-sm">
                  Nessuna pasta da portare al momento. Tutti in regola!
               </div>
            )}
         </div>

         {/* Storico Consegnate */}
         <div className="saas-card overflow-hidden">
            <div className="p-4 border-b border-border dark:border-[#262626] bg-surface dark:bg-[#0a0a0a] flex items-center justify-between">
               <h2 className="text-sm font-semibold text-text-primary  flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-success " /> Storico Consegnate
               </h2>
            </div>
            
            {pastesLoading ? (
               <div className="p-8 text-center text-text-tertiary">Caricamento...</div>
            ) : deliveredPastes.length > 0 ? (
               <div className="divide-y divide-gray-100 dark:divide-[#262626]">
                  {deliveredPastes.map((paste: any) => (
                     <div key={paste.id} className="p-4 flex items-center justify-between hover:bg-surface dark:hover:bg-gray-900/30 transition-colors opacity-75 group-hover:opacity-100">
                        <div>
                           <p className="text-sm font-bold text-text-primary  line-through decoration-gray-400 dark:decoration-gray-600">{paste.teamMember.user.name}</p>
                           <p className="text-xs text-text-tertiary">{paste.reason}</p>
                        </div>
                        <span className="text-[10px] text-text-tertiary dark:text-text-tertiary font-medium">
                           {new Date(paste.deliveredAt).toLocaleDateString('it-IT')}
                        </span>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="p-12 text-center text-text-tertiary text-sm">
                  Ancora nessuno ha portato le paste.
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
