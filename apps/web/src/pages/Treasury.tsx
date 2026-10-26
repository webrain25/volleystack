
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WalletIcon, Plus, InfoIcon, Euro, X, CheckCircle2, FileText, Banknote, Landmark } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { PageHeader } from '../components/PageHeader';

const ruleSchema = z.object({
  reason: z.string().min(1, 'La motivazione è obbligatoria'),
  defaultAmountEuros: z.number().min(0.50, 'L\'importo minimo è 0.50€')
});

const paymentSchema = z.object({
  amountEuros: z.number().min(0.50, 'Importo minimo 0.50€'),
  method: z.enum(['CASH', 'TRANSFER'])
});

export default function Treasury() {
  const { user } = useAuthStore();
  const teamId = user?.memberships?.[0]?.teamId;
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<'RULES' | 'FINES' | 'PAYMENTS' | 'LEDGER'>('FINES');
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showLedgerForm, setShowLedgerForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);

  const { data: rules, isLoading: rulesLoading } = useQuery({
    queryKey: ['fine-rules', teamId],
    queryFn: () => api.get(`/teams/${teamId}/fine-rules`).then(res => res.data),
    enabled: !!teamId,
  });

  const { data: members } = useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => api.get(`/teams/${teamId}/members`).then(res => res.data),
    enabled: !!teamId,
  });

  const { data: fines, isLoading: finesLoading } = useQuery({
    queryKey: ['fines', teamId],
    queryFn: () => api.get(`/teams/${teamId}/fines`).then(res => res.data),
    enabled: !!teamId && activeTab === 'FINES',
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments', teamId],
    queryFn: () => api.get(`/teams/${teamId}/payments`).then(res => res.data),
    enabled: !!teamId && activeTab === 'PAYMENTS',
  });

  const { data: ledger, isLoading: ledgerLoading } = useQuery({
    queryKey: ['ledger', teamId],
    queryFn: () => api.get(`/teams/${teamId}/ledger`).then(res => res.data),
    enabled: !!teamId && activeTab === 'LEDGER',
  });

  const { data: teamData } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => api.get(`/teams/${teamId}`).then(res => res.data),
    enabled: !!teamId,
  });

  const { register: registerRule, handleSubmit: handleRuleSubmit, formState: { errors: ruleErrors }, reset: resetRule } = useForm<z.infer<typeof ruleSchema>>({
    resolver: zodResolver(ruleSchema),
    defaultValues: { defaultAmountEuros: 1 }
  });

  const assignSchema = z.object({
    teamMemberId: z.string().min(1, 'Seleziona un giocatore'),
    fineRuleId: z.string().min(1, 'Seleziona una tariffa')
  });

  const { register: registerAssign, handleSubmit: handleAssignSubmit, formState: { errors: assignErrors }, reset: resetAssign } = useForm<z.infer<typeof assignSchema>>({
    resolver: zodResolver(assignSchema),
  });

  const { register: registerPayment, handleSubmit: handlePaymentSubmit, formState: { errors: paymentErrors }, reset: resetPayment } = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amountEuros: 1, method: 'CASH' }
  });

  const ledgerSchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE']),
    amountEuros: z.number().min(0.50, 'Inserisci un importo valido'),
    description: z.string().min(1, 'La descrizione è obbligatoria')
  });

  const { register: registerLedger, handleSubmit: handleLedgerSubmit, formState: { errors: ledgerErrors }, reset: resetLedger } = useForm<z.infer<typeof ledgerSchema>>({
    resolver: zodResolver(ledgerSchema),
    defaultValues: { type: 'EXPENSE', amountEuros: 10 }
  });

  const createRule = useMutation({
    mutationFn: (data: z.infer<typeof ruleSchema>) => api.post(`/teams/${teamId}/fine-rules`, { ...data, defaultAmountCents: Math.round(data.defaultAmountEuros * 100) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fine-rules', teamId] });
      setShowRuleForm(false);
      resetRule();
    }
  });

  const assignFine = useMutation({
    mutationFn: (data: z.infer<typeof assignSchema>) => api.post(`/teams/${teamId}/fines`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fines', teamId] });
      setShowAssignForm(false);
      resetAssign();
      setActiveTab('FINES');
    }
  });

  const updatePaypalLink = useMutation({
    mutationFn: (link: string) => api.patch(`/teams/${teamId}/paypal-link`, { paypalLink: link }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team', teamId] }),
  });

  const declarePayment = useMutation({
    mutationFn: (data: { amountCents: number, method: 'CASH' | 'TRANSFER' }) => api.post(`/teams/${teamId}/payments/declarations`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', teamId] });
      setShowPaymentForm(false);
      resetPayment();
      setActiveTab('PAYMENTS');
    }
  });

  const confirmPayment = useMutation({
    mutationFn: (paymentId: string) => api.patch(`/teams/${teamId}/payments/${paymentId}/confirm`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', teamId] });
    }
  });

  const createLedgerTx = useMutation({
    mutationFn: (data: z.infer<typeof ledgerSchema>) => api.post(`/teams/${teamId}/ledger`, { ...data, amountCents: Math.round(data.amountEuros * 100) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledger', teamId] });
      setShowLedgerForm(false);
      resetLedger();
    }
  });

  if (!teamId) return <div className="p-8 text-center text-text-tertiary">Nessuna squadra associata</div>;

  return (
    <div className="space-y-6 relative">
      <PageHeader 
        title="Tesoreria"
        description="Gestisci le multe, i pagamenti e la cassa della squadra in un unico posto."
        icon={WalletIcon}
        actions={
          <>
            <button 
              onClick={() => { setShowPaymentForm(false); setShowRuleForm(false); setShowLedgerForm(true); setShowAssignForm(false); }}
              className="saas-btn-secondary flex items-center shrink-0"
            >
              <Landmark className="h-4 w-4 mr-1.5" /> Nuova Transazione
            </button>
            <button 
              onClick={() => { setShowLedgerForm(false); setShowRuleForm(false); setShowPaymentForm(true); setShowAssignForm(false); }}
              className="saas-btn-secondary flex items-center hover:border-[#00F59B]/40 hover:text-[#00F59B] shrink-0"
            >
              <Banknote className="h-4 w-4 mr-1.5" /> Paga Multe
            </button>
            <button 
              onClick={() => { setShowLedgerForm(false); setShowRuleForm(false); setShowPaymentForm(false); setShowAssignForm(true); }}
              className="saas-btn-secondary flex items-center hover:border-amber-500/40 hover:text-amber-400 shrink-0"
            >
              <Euro className="h-4 w-4 mr-1.5 text-amber-400" /> Assegna Multa
            </button>
            <button 
              onClick={() => { setShowLedgerForm(false); setShowPaymentForm(false); setShowAssignForm(false); setShowRuleForm(true); }}
              className="saas-btn-volt flex items-center shrink-0"
            >
              <Plus className="h-4 w-4 mr-1.5 stroke-[3px]" /> Nuova Tariffa
            </button>
          </>
        }
      />

      <div className="flex flex-wrap gap-1 p-1 bg-[#0F1726]/60 rounded-xl w-fit border border-border">
        <button 
          onClick={() => setActiveTab('FINES')}
          className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === 'FINES' ? 'bg-[#0F1726] border border-[#00F59B]/40 text-[#00F59B] shadow-[0_0_12px_rgba(0,245,155,0.15)]' : 'text-text-tertiary hover:text-text-primary'}`}
        >
          Multe Assegnate
        </button>
        <button 
          onClick={() => setActiveTab('PAYMENTS')}
          className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === 'PAYMENTS' ? 'bg-[#0F1726] border border-[#00F59B]/40 text-[#00F59B] shadow-[0_0_12px_rgba(0,245,155,0.15)]' : 'text-text-tertiary hover:text-text-primary'}`}
        >
          Pagamenti
        </button>
        <button 
          onClick={() => setActiveTab('RULES')}
          className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === 'RULES' ? 'bg-[#0F1726] border border-[#00F59B]/40 text-[#00F59B] shadow-[0_0_12px_rgba(0,245,155,0.15)]' : 'text-text-tertiary hover:text-text-primary'}`}
        >
          Tariffario Base
        </button>
        <button 
          onClick={() => setActiveTab('LEDGER')}
          className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === 'LEDGER' ? 'bg-[#0F1726] border border-[#00F59B]/40 text-[#00F59B] shadow-[0_0_12px_rgba(0,245,155,0.15)]' : 'text-text-tertiary hover:text-text-primary'}`}
        >
          Cassa Generale
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main List */}
        <div className="lg:col-span-2">
           
           {activeTab === 'RULES' && (
             <div className="space-y-6">
               <div className="saas-card p-5">
                 <h2 className="text-sm font-semibold text-text-primary  flex items-center mb-4">
                    <WalletIcon className="h-4 w-4 mr-2 text-brand-blue dark:text-brand-blue-bright" /> Impostazioni Pagamenti
                 </h2>
                 <form onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); updatePaypalLink.mutate(formData.get('paypalLink') as string); }} className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-text-tertiary dark:text-text-tertiary uppercase tracking-wider mb-2">Link PayPal (Es. paypal.me/team)</label>
                      <input type="url" name="paypalLink" defaultValue={teamData?.paypalLink || ''} placeholder="https://paypal.me/..." className="saas-input" />
                    </div>
                    <button type="submit" disabled={updatePaypalLink.isPending} className="saas-btn-primary">
                      {updatePaypalLink.isPending ? 'Salvataggio...' : 'Salva Link'}
                    </button>
                 </form>
               </div>

               <div className="saas-card overflow-hidden">
                 <div className="p-4 border-b border-border dark:border-[#262626] bg-surface dark:bg-[#0a0a0a] flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-text-primary  flex items-center">
                       <FileText className="h-4 w-4 mr-2 text-brand-blue dark:text-brand-blue-bright" /> Tariffario Multe
                    </h2>
                 </div>
               
               {rulesLoading ? (
                  <div className="p-8 text-center text-text-tertiary">Caricamento...</div>
                ) : rules && rules.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-[#262626]">
                    {rules.map((rule: any) => (
                      <div key={rule.id} className="p-4 flex justify-between items-center hover:bg-surface dark:hover:bg-gray-900/30 transition-colors group">
                        <div className="flex items-center space-x-3">
                           <div className="h-8 w-8 bg-bg-primary  border border-border  rounded flex items-center justify-center">
                              <Euro className="h-4 w-4 text-text-tertiary dark:text-text-tertiary" />
                           </div>
                           <span className="text-sm font-medium text-text-primary  block">{rule.reason}</span>
                        </div>
                        <span className="text-sm font-bold text-text-primary  bg-surface-hover  px-2.5 py-1 rounded-md border border-border ">
                          € {(rule.defaultAmountCents / 100).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <InfoIcon className="h-6 w-6 text-text-tertiary dark:text-text-tertiary mb-3" />
                    <h3 className="text-sm font-bold text-text-primary  mb-1">Nessuna regola configurata</h3>
                  </div>
                )}
             </div>
            </div>
           )}

           {activeTab === 'FINES' && (
             <div className="saas-card overflow-hidden border-accent-100 dark:border-accent-900/30">
               <div className="p-4 border-b border-border dark:border-[#262626] bg-accent-50/50 ccent-950/10 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-text-primary  flex items-center">
                     <Euro className="h-4 w-4 mr-2 text-accent-600 dark:text-accent-500" /> Multe Assegnate
                  </h2>
               </div>
               
               {finesLoading ? (
                  <div className="p-8 text-center text-text-tertiary">Caricamento...</div>
                ) : fines && fines.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-[#262626]">
                    {fines.map((fine: any) => (
                      <div key={fine.id} className="p-4 flex justify-between items-center hover:bg-surface dark:hover:bg-gray-900/30 transition-colors">
                        <div>
                           <span className="text-sm font-bold text-text-primary ">{fine.teamMember.user.name}</span>
                           <p className="text-xs text-text-tertiary mt-0.5">{fine.reasonSnapshot} - {new Date(fine.issuedAt).toLocaleDateString('it-IT')}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-accent-600 dark:text-accent-500 mb-1">
                            € {(fine.amountCents / 100).toFixed(2)}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${fine.status === 'UNPAID' ? 'bg-red-100 text-red-700 dark:bg-danger/100/20 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'}`}>
                            {fine.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold text-text-primary ">Nessuna multa assegnata</span>
                  </div>
                )}
             </div>
           )}

           {activeTab === 'PAYMENTS' && (
             <div className="saas-card overflow-hidden">
               <div className="p-4 border-b border-border dark:border-[#262626] bg-success/10/50 dark:bg-emerald-950/10 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-text-primary  flex items-center">
                     <WalletIcon className="h-4 w-4 mr-2 text-success " /> Pagamenti Effettuati
                  </h2>
               </div>
               
               {paymentsLoading ? (
                  <div className="p-8 text-center text-text-tertiary">Caricamento...</div>
                ) : payments && payments.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-[#262626]">
                    {payments.map((payment: any) => (
                      <div key={payment.id} className="p-4 flex justify-between items-center hover:bg-surface dark:hover:bg-gray-900/30 transition-colors">
                        <div>
                           <span className="text-sm font-bold text-text-primary ">{payment.teamMember.user.name}</span>
                           <p className="text-xs text-text-tertiary mt-0.5">{payment.method} - {new Date(payment.declaredAt).toLocaleDateString('it-IT')}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-bold text-text-primary ">
                            € {(payment.amountCents / 100).toFixed(2)}
                          </span>
                          {payment.status === 'PENDING' ? (
                             <button 
                               onClick={() => confirmPayment.mutate(payment.id)}
                               disabled={confirmPayment.isPending}
                               className="text-xs font-semibold text-success hover:text-emerald-700  dark:hover:text-emerald-400 bg-success/10 hover:bg-emerald-100 dark:bg-success/100/10 dark:hover:bg-success/100/20 px-2 py-1 rounded transition-colors"
                             >
                               Approva
                             </button>
                          ) : (
                             <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold text-text-primary ">Nessun pagamento registrato</span>
                  </div>
                )}
             </div>
           )}

           {activeTab === 'LEDGER' && (
             <div className="saas-card overflow-hidden border-blue-100 dark:border-blue-900/30">
               <div className="p-4 border-b border-border dark:border-[#262626] bg-blue-50/50 dark:bg-blue-950/10 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-text-primary  flex items-center">
                     <Landmark className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-500" /> Libro Mastro
                  </h2>
                  <div className="text-xs font-medium text-text-tertiary dark:text-text-tertiary">
                    Traccia spese ed entrate del club
                  </div>
               </div>
               
               {ledgerLoading ? (
                  <div className="p-8 text-center text-text-tertiary">Caricamento...</div>
                ) : ledger && ledger.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-[#262626]">
                    {ledger.map((tx: any) => (
                      <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-surface dark:hover:bg-gray-900/30 transition-colors">
                        <div>
                           <span className="text-sm font-bold text-text-primary ">{tx.description}</span>
                           <p className="text-xs text-text-tertiary mt-0.5">{new Date(tx.date).toLocaleDateString('it-IT')}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-sm font-bold mb-1 ${tx.type === 'INCOME' ? 'text-success ' : 'text-text-primary '}`}>
                            {tx.type === 'INCOME' ? '+' : '-'} € {(tx.amountCents / 100).toFixed(2)}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-700 dark:bg-success/100/20 dark:text-emerald-400' : 'bg-gray-200 text-text-primary dark:bg-gray-700/50 '}`}>
                            {tx.type === 'INCOME' ? 'ENTRATA' : 'USCITA'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold text-text-primary ">Nessuna transazione registrata</span>
                  </div>
                )}
             </div>
           )}
        </div>

        {/* Form Panel (Tariffa) */}
        {showRuleForm && (
           <div className="lg:col-span-1">
             <div className="saas-card p-5 sticky top-24 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border dark:border-[#262626]">
                   <h3 className="text-sm font-bold text-text-primary ">Nuova Tariffa</h3>
                   <button onClick={() => setShowRuleForm(false)} className="text-text-tertiary dark:text-text-tertiary hover:text-text-primary dark:hover:text-gray-200"><X className="h-4 w-4" /></button>
                </div>
                
                <form onSubmit={handleRuleSubmit((d) => createRule.mutate(d))} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary dark:text-text-tertiary uppercase tracking-wider mb-2">Motivazione</label>
                    <input {...registerRule('reason')} placeholder="Es. Ritardo" className="saas-input" />
                    {ruleErrors.reason && <p className="text-red-500 dark:text-accent-500 text-xs mt-1">{ruleErrors.reason.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary dark:text-text-tertiary uppercase tracking-wider mb-2">Importo (€)</label>
                    <input type="number" step="0.50" {...registerRule('defaultAmountEuros', { valueAsNumber: true })} className="saas-input" />
                    {ruleErrors.defaultAmountEuros && <p className="text-red-500 text-xs mt-1">{ruleErrors.defaultAmountEuros.message}</p>}
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={createRule.isPending} className="saas-btn-primary w-full">
                      Salva Tariffa
                    </button>
                  </div>
                </form>
             </div>
           </div>
        )}

        {/* Form Panel (Assegna Multa) */}
        {showAssignForm && (
           <div className="lg:col-span-1">
             <div className="saas-card p-5 sticky top-24 animate-in fade-in slide-in-from-right-4 border-accent-200 dark:border-accent-900/30">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border dark:border-[#262626]">
                   <h3 className="text-sm font-bold text-text-primary  flex items-center">
                     <Euro className="h-4 w-4 mr-2 text-accent-500" /> Assegna Multa
                   </h3>
                   <button onClick={() => setShowAssignForm(false)} className="text-text-tertiary dark:text-text-tertiary hover:text-text-primary dark:hover:text-gray-200"><X className="h-4 w-4" /></button>
                </div>
                
                <form onSubmit={handleAssignSubmit((d) => assignFine.mutate(d))} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary dark:text-text-tertiary uppercase tracking-wider mb-2">Giocatore</label>
                    <select {...registerAssign('teamMemberId')} className="saas-input">
                       <option value="">Seleziona...</option>
                       {members?.map((m: any) => (
                         <option key={m.id} value={m.id}>{m.user.name}</option>
                       ))}
                    </select>
                    {assignErrors.teamMemberId && <p className="text-red-500 text-xs mt-1">{assignErrors.teamMemberId.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary dark:text-text-tertiary uppercase tracking-wider mb-2">Tariffa</label>
                    <select {...registerAssign('fineRuleId')} className="saas-input">
                       <option value="">Seleziona motivazione...</option>
                       {rules?.map((r: any) => (
                         <option key={r.id} value={r.id}>{r.reason} - €{(r.defaultAmountCents / 100).toFixed(2)}</option>
                       ))}
                    </select>
                    {assignErrors.fineRuleId && <p className="text-red-500 text-xs mt-1">{assignErrors.fineRuleId.message}</p>}
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={assignFine.isPending} className="saas-btn-primary w-full bg-accent-600 hover:bg-accent-500 shadow-[0_0_15px_rgba(234,88,12,0.2)]">
                      Assegna
                    </button>
                  </div>
                </form>
             </div>
           </div>
        )}

        {/* Form Panel (Pagamento) */}
        {showPaymentForm && (
           <div className="lg:col-span-1">
             <div className="saas-card p-5 sticky top-24 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border dark:border-[#262626]">
                   <h3 className="text-sm font-bold text-text-primary ">Dichiara Pagamento</h3>
                   <button onClick={() => setShowPaymentForm(false)} className="text-text-tertiary dark:text-text-tertiary hover:text-text-primary dark:hover:text-gray-200"><X className="h-4 w-4" /></button>
                </div>
                
                <form onSubmit={handlePaymentSubmit((d) => declarePayment.mutate({ amountCents: Math.round(d.amountEuros * 100), method: d.method }))} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary dark:text-text-tertiary uppercase tracking-wider mb-2">Importo Versato (€)</label>
                    <input type="number" step="0.50" {...registerPayment('amountEuros', { valueAsNumber: true })} className="saas-input" />
                    {paymentErrors.amountEuros && <p className="text-red-500 dark:text-accent-500 text-xs mt-1">{paymentErrors.amountEuros.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary dark:text-text-tertiary uppercase tracking-wider mb-2">Metodo</label>
                    <select {...registerPayment('method')} className="saas-input">
                       <option value="CASH">Contanti (Cash)</option>
                       <option value="TRANSFER">Bonifico</option>
                    </select>
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={declarePayment.isPending} className="saas-btn-primary w-full bg-emerald-600 hover:bg-success/100 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      Dichiara Versamento
                    </button>
                  </div>
                </form>

                  <div className="mt-4 pt-4 border-t border-border/50 dark:border-white/10">
                    <p className="text-[10px] text-text-tertiary mb-2 text-center uppercase tracking-wider font-semibold">Oppure paga subito tramite PayPal</p>
                    {teamData?.paypalLink ? (
                      <a href={teamData.paypalLink} target="_blank" rel="noopener noreferrer" className="saas-btn-secondary w-full flex items-center justify-center font-bold text-[#003087] dark:text-[#0079C1] hover:text-[#001C64] dark:hover:text-text-primary border-[#003087]/20 dark:border-[#0079C1]/20">
                        Paga con PayPal
                      </a>
                    ) : (
                      <button type="button" onClick={() => alert('Il Tesoriere non ha ancora collegato il link PayPal della squadra. Chiedigli di configurarlo nelle impostazioni!\n\nNel frattempo, puoi registrare il versamento selezionando Contanti o Bonifico.')} className="saas-btn-secondary w-full flex items-center justify-center font-bold text-text-tertiary border-border/50 bg-surface-hover hover:bg-surface-hover/80 cursor-pointer">
                        Non disponibile (Clicca per info)
                      </button>
                    )}
                  </div>
             </div>
           </div>
        )}

        {/* Form Panel (Ledger) */}
        {showLedgerForm && (
           <div className="lg:col-span-1">
             <div className="saas-card p-5 sticky top-24 animate-in fade-in slide-in-from-right-4 border-blue-200 dark:border-blue-900/30">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border dark:border-[#262626]">
                   <h3 className="text-sm font-bold text-text-primary  flex items-center"><Landmark className="h-4 w-4 mr-2 text-blue-500"/> Registra Movimento</h3>
                   <button onClick={() => setShowLedgerForm(false)} className="text-text-tertiary dark:text-text-tertiary hover:text-text-primary dark:hover:text-gray-200"><X className="h-4 w-4" /></button>
                </div>
                
                <form onSubmit={handleLedgerSubmit((d) => createLedgerTx.mutate(d))} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary dark:text-text-tertiary uppercase tracking-wider mb-2">Tipo Movimento</label>
                    <div className="grid grid-cols-2 gap-2">
                       <label className="cursor-pointer">
                          <input type="radio" value="EXPENSE" {...registerLedger('type')} className="peer sr-only" />
                          <div className="text-center text-sm py-2 px-3 border border-border dark:border-[#262626] rounded-md peer-checked:bg-gray-900 peer-checked:text-text-primary dark:peer-checked:bg-surface-hover dark:peer-checked:text-text-primary font-medium transition-colors">Spesa</div>
                       </label>
                       <label className="cursor-pointer">
                          <input type="radio" value="INCOME" {...registerLedger('type')} className="peer sr-only" />
                          <div className="text-center text-sm py-2 px-3 border border-border dark:border-[#262626] rounded-md peer-checked:bg-emerald-600 peer-checked:text-text-primary peer-checked:border-emerald-600 font-medium transition-colors">Entrata</div>
                       </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary dark:text-text-tertiary uppercase tracking-wider mb-2">Descrizione</label>
                    <input {...registerLedger('description')} placeholder="Es. Cena di squadra / Birre" className="saas-input" />
                    {ledgerErrors.description && <p className="text-red-500 dark:text-accent-500 text-xs mt-1">{ledgerErrors.description.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary dark:text-text-tertiary uppercase tracking-wider mb-2">Importo (€)</label>
                    <input type="number" step="0.50" {...registerLedger('amountEuros', { valueAsNumber: true })} className="saas-input" />
                    {ledgerErrors.amountEuros && <p className="text-red-500 dark:text-accent-500 text-xs mt-1">{ledgerErrors.amountEuros.message}</p>}
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={createLedgerTx.isPending} className="saas-btn-primary w-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                      Salva Movimento
                    </button>
                  </div>
                </form>
             </div>
           </div>
        )}

      </div>
    </div>
  );
}
