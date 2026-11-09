import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  WalletIcon, 
  Plus, 
  Euro, 
  X, 
  CheckCircle2, 
  FileText, 
  Banknote, 
  Landmark, 
  Sparkles, 
  Pencil, 
  Trash2, 
  Flame,
  AlertCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { PageHeader } from '../components/PageHeader';

// 11 Multe Predisposte Consigliate (Stile Paynalty per Volley)
export const VOLLEY_PRESET_FINES = [
  { id: 'p1', reason: 'Ritardo Allenamento', amountEuros: 1.00, tag: 'Orario', desc: "Presentarsi oltre l'orario stabilito" },
  { id: 'p2', reason: 'Ritardo Ritrovo Gara (1h 15m prima)', amountEuros: 2.00, tag: 'Gara', desc: "Mancato rispetto convocazione partita" },
  { id: 'p3', reason: 'Cartellino Giallo / Rosso', amountEuros: 3.00, tag: 'Disciplina', desc: 'Sanzione disciplinare arbitrale' },
  { id: 'p4', reason: 'Battuta Sotto la Rete', amountEuros: 1.00, tag: 'Tecnica', desc: 'Servizio finito direttamente nella rete' },
  { id: 'p5', reason: 'Rigore Sbagliato (Slash non chiuso)', amountEuros: 1.50, tag: 'Tecnica', desc: 'Errore su slash o palla facile sprecata' },
  { id: 'p6', reason: 'Uso del Telefono in Palestra', amountEuros: 2.00, tag: 'Spogliatoio', desc: 'Smartphone usato durante la seduta' },
  { id: 'p7', reason: 'Indumento o Materiale Dimenticato', amountEuros: 1.50, tag: 'Materiale', desc: 'Dimenticanza maglia, ginocchiere o divisa' },
  { id: 'p8', reason: 'Documento Gara Assente', amountEuros: 5.00, tag: 'Gara', desc: 'Mancanza documento per referto' },
  { id: 'p9', reason: 'Cibo Non Autorizzato in Palestra', amountEuros: 2.00, tag: 'Spogliatoio', desc: 'Cibo non sportivo durante le attività' },
  { id: 'p10', reason: 'Fumo in Palestra / Impianto', amountEuros: 5.00, tag: 'Condotta', desc: 'Divieto assoluto di fumo ore squadra' },
  { id: 'p11', reason: 'Mancato Saldo Multe Entro 7gg', amountEuros: 2.00, tag: 'Cassa', desc: 'Mora per superamento dei 7 giorni' },
];

const ruleSchema = z.object({
  reason: z.string().min(1, 'La motivazione è obbligatoria'),
  defaultAmountEuros: z.number().min(0.50, 'L\'importo minimo è 0.50€')
});

const paymentSchema = z.object({
  amountEuros: z.number().min(0.50, 'Importo minimo 0.50€'),
  method: z.enum(['CASH', 'TRANSFER'])
});

const ledgerSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amountEuros: z.number().min(0.50, 'Inserisci un importo valido'),
  description: z.string().min(1, 'La descrizione è obbligatoria')
});

export default function Treasury() {
  const { user } = useAuthStore();
  const teamId = user?.memberships?.[0]?.teamId;
  const queryClient = useQueryClient();

  const userRoles = user?.memberships?.[0]?.roles?.map((r: any) => r.role) || [];
  const canManage = userRoles.some((r: string) => ['OWNER', 'ADMIN', 'COACH', 'ASSISTANT_COACH', 'CAPTAIN', 'TREASURER'].includes(r));
  
  const [activeTab, setActiveTab] = useState<'RULES' | 'FINES' | 'PAYMENTS' | 'LEDGER'>('FINES');
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showLedgerForm, setShowLedgerForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);

  // Assign Fine State (Customizable Reason, Amount & Match Double Multiplier)
  const [assignMemberId, setAssignMemberId] = useState('');
  const [assignRuleId, setAssignRuleId] = useState('');
  const [assignReason, setAssignReason] = useState('');
  const [_baseAmountEuros, setBaseAmountEuros] = useState(1.00);
  const [assignAmountEuros, setAssignAmountEuros] = useState(1.00);
  const [isMatchDouble, setIsMatchDouble] = useState(false);
  const [assignError, setAssignError] = useState('');

  // Edit Fine Modal State
  const [editingFine, setEditingFine] = useState<any | null>(null);
  const [editReason, setEditReason] = useState('');
  const [editAmountEuros, setEditAmountEuros] = useState(1.00);
  const [editStatus, setEditStatus] = useState<'UNPAID' | 'PAID'>('UNPAID');

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

  const { register: registerPayment, handleSubmit: handlePaymentSubmit, formState: { errors: paymentErrors }, reset: resetPayment } = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amountEuros: 1, method: 'CASH' }
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

  const seedPresetRules = useMutation({
    mutationFn: () => api.post(`/teams/${teamId}/fine-rules/seed-presets`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fine-rules', teamId] });
      alert('Regolamento con le 11 multe consigliate caricato con successo!');
    }
  });

  const assignFine = useMutation({
    mutationFn: (data: { teamMemberId: string; fineRuleId?: string; reason: string; amountCents: number; isMatchDouble?: boolean }) => 
      api.post(`/teams/${teamId}/fines`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fines', teamId] });
      setShowAssignForm(false);
      setAssignMemberId('');
      setAssignRuleId('');
      setAssignReason('');
      setBaseAmountEuros(1.00);
      setAssignAmountEuros(1.00);
      setIsMatchDouble(false);
      setAssignError('');
      setActiveTab('FINES');
    },
    onError: (err: any) => {
      setAssignError(err.response?.data?.error || 'Errore durante l\'assegnazione della multa');
    }
  });

  const updateFine = useMutation({
    mutationFn: (data: { reasonSnapshot: string; amountCents: number; status: 'UNPAID' | 'PAID' }) => 
      api.patch(`/teams/${teamId}/fines/${editingFine.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fines', teamId] });
      setEditingFine(null);
    }
  });

  const deleteFine = useMutation({
    mutationFn: (fineId: string) => api.delete(`/teams/${teamId}/fines/${fineId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fines', teamId] });
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

  // Preset Selection Handler
  const handleSelectPreset = (preset: typeof VOLLEY_PRESET_FINES[0]) => {
    setAssignReason(preset.reason);
    setBaseAmountEuros(preset.amountEuros);
    setAssignAmountEuros(isMatchDouble ? Number((preset.amountEuros * 2).toFixed(2)) : preset.amountEuros);
    setAssignRuleId('');
    setAssignError('');
  };

  // Rule Selection Handler
  const handleSelectRule = (ruleId: string) => {
    setAssignRuleId(ruleId);
    if (!ruleId) return;
    const found = rules?.find((r: any) => r.id === ruleId);
    if (found) {
      const euro = found.defaultAmountCents / 100;
      setAssignReason(found.reason);
      setBaseAmountEuros(euro);
      setAssignAmountEuros(isMatchDouble ? Number((euro * 2).toFixed(2)) : euro);
    }
    setAssignError('');
  };

  // Match Double Multiplier Toggle
  const handleToggleMatchDouble = () => {
    const next = !isMatchDouble;
    setIsMatchDouble(next);
    if (next) {
      setAssignAmountEuros((prev) => Number((prev * 2).toFixed(2)));
    } else {
      setAssignAmountEuros((prev) => Number(Math.max(0.5, prev / 2).toFixed(2)));
    }
  };

  const handleAssignFineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignMemberId) {
      setAssignError('Seleziona il giocatore da sanzionare.');
      return;
    }
    if (!assignReason.trim()) {
      setAssignError('Inserisci una motivazione (es. Ritardo 5 min).');
      return;
    }
    if (assignAmountEuros < 0.5) {
      setAssignError('L\'importo minimo della multa è 0.50€.');
      return;
    }
    setAssignError('');
    assignFine.mutate({
      teamMemberId: assignMemberId,
      fineRuleId: assignRuleId || undefined,
      reason: assignReason.trim(),
      amountCents: Math.round(assignAmountEuros * 100),
      isMatchDouble
    });
  };

  const openEditFine = (fine: any) => {
    setEditingFine(fine);
    setEditReason(fine.reasonSnapshot);
    setEditAmountEuros(fine.amountCents / 100);
    setEditStatus(fine.status);
  };

  const handleUpdateFineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editReason.trim()) return;
    updateFine.mutate({
      reasonSnapshot: editReason.trim(),
      amountCents: Math.round(editAmountEuros * 100),
      status: editStatus
    });
  };

  if (!teamId) return <div className="p-8 text-center text-text-tertiary">Nessuna squadra associata</div>;

  return (
    <div className="space-y-6 relative">
      <PageHeader 
        title="Tesoreria & Multe"
        description="Gestisci il regolamento multe, i pagamenti e la cassa dello spogliatoio."
        icon={WalletIcon}
        actions={
          <>
            <button 
              onClick={() => { setShowPaymentForm(false); setShowRuleForm(false); setShowLedgerForm(true); setShowAssignForm(false); }}
              className="saas-btn-secondary flex items-center shrink-0 text-xs sm:text-sm py-2 px-3 sm:px-4"
            >
              <Landmark className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" /> Nuova Transazione
            </button>
            <button 
              onClick={() => { setShowLedgerForm(false); setShowRuleForm(false); setShowPaymentForm(true); setShowAssignForm(false); }}
              className="saas-btn-secondary flex items-center hover:border-[#2A7EA2]/40 hover:text-[#38BDF8] shrink-0 text-xs sm:text-sm py-2 px-3 sm:px-4"
            >
              <Banknote className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" /> Paga Multe
            </button>
            {canManage && (
              <button 
                onClick={() => { setShowLedgerForm(false); setShowRuleForm(false); setShowPaymentForm(false); setShowAssignForm(true); }}
                className="saas-btn-secondary flex items-center hover:border-amber-500/40 hover:text-amber-400 shrink-0 text-xs sm:text-sm py-2 px-3 sm:px-4 border-amber-500/25 bg-amber-500/10 text-amber-400"
              >
                <Euro className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-amber-400" /> Assegna Multa
              </button>
            )}
            {canManage && (
              <button 
                onClick={() => { setShowLedgerForm(false); setShowPaymentForm(false); setShowAssignForm(false); setShowRuleForm(true); }}
                className="saas-btn-volt flex items-center shrink-0 text-xs sm:text-sm py-2 px-3 sm:px-4"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 stroke-[3px]" /> Nuova Tariffa
              </button>
            )}
          </>
        }
      />

      {/* Tabs di Navigazione Tesoreria */}
      <div className="flex flex-nowrap sm:flex-wrap gap-1 p-1 bg-[#0F1726]/60 rounded-xl w-full sm:w-fit overflow-x-auto max-w-full border border-border scrollbar-none">
        <button 
          onClick={() => setActiveTab('FINES')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'FINES' ? 'bg-[#0A4059]/30 border border-[#2A7EA2]/50 text-[#38BDF8] shadow-[0_2px_12px_rgba(10,64,89,0.3)]' : 'text-text-tertiary hover:text-text-primary'}`}
        >
          Multe Assegnate
        </button>
        <button 
          onClick={() => setActiveTab('RULES')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'RULES' ? 'bg-[#0A4059]/30 border border-[#2A7EA2]/50 text-[#38BDF8] shadow-[0_2px_12px_rgba(10,64,89,0.3)]' : 'text-text-tertiary hover:text-text-primary'}`}
        >
          Regolamento Multe
        </button>
        <button 
          onClick={() => setActiveTab('PAYMENTS')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'PAYMENTS' ? 'bg-[#0A4059]/30 border border-[#2A7EA2]/50 text-[#38BDF8] shadow-[0_2px_12px_rgba(10,64,89,0.3)]' : 'text-text-tertiary hover:text-text-primary'}`}
        >
          Pagamenti
        </button>
        <button 
          onClick={() => setActiveTab('LEDGER')}
          className={`px-3 sm:px-4 py-2 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'LEDGER' ? 'bg-[#0A4059]/30 border border-[#2A7EA2]/50 text-[#38BDF8] shadow-[0_2px_12px_rgba(10,64,89,0.3)]' : 'text-text-tertiary hover:text-text-primary'}`}
        >
          Libro Mastro Cassa
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Panel Content */}
        <div className={showRuleForm || showPaymentForm || showLedgerForm || showAssignForm ? "lg:col-span-2 space-y-6" : "lg:col-span-3 space-y-6"}>
           
           {/* Tab: Regolamento Multe */}
           {activeTab === 'RULES' && (
             <div className="space-y-6">
               <div className="saas-card p-5">
                 <h2 className="text-sm font-semibold text-text-primary flex items-center mb-4">
                    <WalletIcon className="h-4 w-4 mr-2 text-[#38BDF8]" /> Impostazioni Pagamenti Cassa
                 </h2>
                 <form onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); updatePaypalLink.mutate(formData.get('paypalLink') as string); }} className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Link PayPal (Es. paypal.me/team)</label>
                      <input type="url" name="paypalLink" defaultValue={teamData?.paypalLink || ''} placeholder="https://paypal.me/..." className="saas-input" />
                    </div>
                    <button type="submit" disabled={updatePaypalLink.isPending} className="saas-btn-primary">
                      {updatePaypalLink.isPending ? 'Salvataggio...' : 'Salva Link'}
                    </button>
                 </form>
               </div>

               <div className="saas-card overflow-hidden">
                 <div className="p-4 border-b border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#38BDF8]" /> Tariffario Ufficiale
                      </h2>
                      <p className="text-xs text-text-tertiary mt-0.5">Regole e tariffe base applicate alla squadra.</p>
                    </div>

                    {canManage && (
                      <button
                        onClick={() => seedPresetRules.mutate()}
                        disabled={seedPresetRules.isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
                        title="Carica le 11 multe predisposte di pallavolo"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{seedPresetRules.isPending ? 'Caricamento...' : 'Carica 11 Multe Consigliate'}</span>
                      </button>
                    )}
                 </div>
               
                 {rulesLoading ? (
                    <div className="p-8 text-center text-text-tertiary">Caricamento tariffe...</div>
                  ) : rules && rules.length > 0 ? (
                    <div className="divide-y divide-border/50">
                      {rules.map((rule: any) => (
                        <div key={rule.id} className="p-4 flex justify-between items-center hover:bg-surface-hover/40 transition-colors group">
                          <div className="flex items-center space-x-3 min-w-0 pr-3">
                             <div className="h-8 w-8 bg-bg-primary border border-border rounded-lg flex items-center justify-center shrink-0">
                                <Euro className="h-4 w-4 text-text-tertiary" />
                             </div>
                             <div className="truncate">
                               <span className="text-sm font-bold text-text-primary block truncate">{rule.reason}</span>
                             </div>
                          </div>
                          <span className="text-sm font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 shrink-0">
                            € {(rule.defaultAmountCents / 100).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center p-6">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <h3 className="text-sm font-bold text-text-primary mb-1">Nessuna regola configurata</h3>
                      <p className="text-xs text-text-tertiary max-w-sm mb-4">
                        Inizializza subito il tariffario con le 11 multe consigliate per il volley (ritardi, cartellini, battute sotto rete, smartphone).
                      </p>
                      {canManage && (
                        <button
                          onClick={() => seedPresetRules.mutate()}
                          disabled={seedPresetRules.isPending}
                          className="saas-btn-primary flex items-center gap-2 px-5 py-2.5 text-xs font-bold"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Carica 11 Multe Consigliate</span>
                        </button>
                      )}
                    </div>
                  )}
               </div>
             </div>
           )}

           {/* Tab: Multe Assegnate */}
           {activeTab === 'FINES' && (
             <div className="saas-card overflow-hidden border-border shadow-md">
               <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                       <Euro className="h-4 w-4 text-amber-400" /> Registro Sanzioni Spogliatoio
                    </h2>
                    <p className="text-xs text-text-tertiary mt-0.5">Elenco multe attive e saldate della stagione.</p>
                  </div>
                  {canManage && (
                    <button
                      onClick={() => { setShowLedgerForm(false); setShowRuleForm(false); setShowPaymentForm(false); setShowAssignForm(true); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#070B12] text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Assegna Multa</span>
                    </button>
                  )}
               </div>
               
               {finesLoading ? (
                  <div className="p-8 text-center text-text-tertiary">Caricamento multe...</div>
                ) : fines && fines.length > 0 ? (
                  <div className="divide-y divide-border/40">
                    {fines.map((fine: any) => (
                      <div key={fine.id} className="p-3.5 sm:p-4 flex justify-between items-center hover:bg-surface-hover/40 transition-colors group">
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-text-primary truncate">
                              {fine.teamMember?.user?.name || fine.teamMember?.user?.email || 'Compagno'}
                            </span>
                            {fine.reasonSnapshot?.includes('[Gara ×2]') && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                                In Partita ×2
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-tertiary mt-0.5 truncate">
                            {fine.reasonSnapshot} · {new Date(fine.issuedAt).toLocaleDateString('it-IT')}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-mono font-black text-amber-400 mb-0.5">
                              € {(fine.amountCents / 100).toFixed(2)}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                              fine.status === 'UNPAID' 
                                ? 'bg-danger/15 text-danger border border-danger/25' 
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                            }`}>
                              {fine.status === 'UNPAID' ? 'Da Saldare' : 'Saldato'}
                            </span>
                          </div>

                          {/* Quick Actions (Edit / Delete) for Staff */}
                          {canManage && (
                            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                              <button
                                onClick={() => openEditFine(fine)}
                                className="p-1.5 rounded-lg hover:bg-surface-hover text-text-tertiary hover:text-[#38BDF8] transition-colors cursor-pointer"
                                title="Modifica motivazione o importo"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Confermi di voler eliminare la multa di ${fine.teamMember?.user?.name || 'questo atleta'}?`)) {
                                    deleteFine.mutate(fine.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg hover:bg-danger/15 text-text-tertiary hover:text-danger transition-colors cursor-pointer"
                                title="Elimina multa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center p-6">
                    <Euro className="w-10 h-10 text-text-tertiary mb-3 opacity-40" />
                    <span className="text-sm font-bold text-text-primary">Nessuna multa registrata</span>
                    <p className="text-xs text-text-tertiary mt-1 max-w-sm">
                      Lo spogliatoio è in perfetta regola! Assegna una multa per ritardi, falli o dimenticanze usando il pulsante in alto.
                    </p>
                  </div>
                )}
             </div>
           )}

           {/* Tab: Pagamenti */}
           {activeTab === 'PAYMENTS' && (
             <div className="saas-card overflow-hidden">
               <div className="p-4 border-b border-border bg-emerald-950/10 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-text-primary flex items-center">
                     <WalletIcon className="h-4 w-4 mr-2 text-emerald-400" /> Pagamenti Effettuati
                  </h2>
               </div>
               
               {paymentsLoading ? (
                  <div className="p-8 text-center text-text-tertiary">Caricamento pagamenti...</div>
                ) : payments && payments.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {payments.map((payment: any) => (
                      <div key={payment.id} className="p-4 flex justify-between items-center hover:bg-surface-hover/40 transition-colors">
                        <div>
                           <span className="text-sm font-bold text-text-primary">{payment.teamMember?.user?.name || payment.teamMember?.user?.email || 'Compagno'}</span>
                           <p className="text-xs text-text-tertiary mt-0.5">{payment.method} - {new Date(payment.declaredAt).toLocaleDateString('it-IT')}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-bold text-text-primary">
                            € {(payment.amountCents / 100).toFixed(2)}
                          </span>
                          {payment.status === 'PENDING' ? (
                             <button 
                               onClick={() => confirmPayment.mutate(payment.id)}
                               disabled={confirmPayment.isPending}
                               className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded transition-colors"
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
                    <span className="text-sm font-bold text-text-primary">Nessun pagamento registrato</span>
                  </div>
                )}
             </div>
           )}

           {/* Tab: Libro Mastro */}
           {activeTab === 'LEDGER' && (
             <div className="saas-card overflow-hidden border-[#2A7EA2]/20">
               <div className="p-4 border-b border-border bg-[#38BDF8]/5 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-text-primary flex items-center">
                     <Landmark className="h-4 w-4 mr-2 text-[#38BDF8]" /> Libro Mastro Cassa
                  </h2>
                  <div className="text-xs font-medium text-text-tertiary">
                    Traccia spese ed entrate del club
                  </div>
               </div>
               
               {ledgerLoading ? (
                  <div className="p-8 text-center text-text-tertiary">Caricamento movimenti...</div>
                ) : ledger && ledger.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {ledger.map((tx: any) => (
                      <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-surface-hover/40 transition-colors">
                        <div>
                           <span className="text-sm font-bold text-text-primary">{tx.description}</span>
                           <p className="text-xs text-text-tertiary mt-0.5">{new Date(tx.date).toLocaleDateString('it-IT')}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-sm font-bold mb-1 ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-text-primary'}`}>
                            {tx.type === 'INCOME' ? '+' : '-'} € {(tx.amountCents / 100).toFixed(2)}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${tx.type === 'INCOME' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-surface-hover text-text-secondary border border-border'}`}>
                            {tx.type === 'INCOME' ? 'ENTRATA' : 'USCITA'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold text-text-primary">Nessuna transazione registrata</span>
                  </div>
                )}
             </div>
           )}
        </div>

        {/* Form Panel: Assegna Multa (Paynalty Inspired: Presets, Custom Edits & Match 2x) */}
        {showAssignForm && (
           <div className="lg:col-span-1">
             <div className="saas-card p-5 sticky top-24 animate-in fade-in slide-in-from-right-4 border-amber-500/30 shadow-xl bg-[#0F1726]">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                   <div>
                     <h3 className="text-sm font-black text-text-primary flex items-center gap-1.5">
                       <Euro className="h-4 w-4 text-amber-400" /> Assegna Multa Spogliatoio
                     </h3>
                     <p className="text-[11px] text-text-tertiary mt-0.5">Scegli una predefinita o personalizza motivo e importo.</p>
                   </div>
                   <button onClick={() => setShowAssignForm(false)} className="text-text-tertiary hover:text-text-primary p-1 rounded-lg hover:bg-surface-hover transition-colors">
                     <X className="h-4 w-4" />
                   </button>
                </div>
                
                <form onSubmit={handleAssignFineSubmit} className="space-y-4">
                  {/* 1. Selezione Giocatore */}
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                      Giocatore <span className="text-danger">*</span>
                    </label>
                    <select 
                      value={assignMemberId}
                      onChange={(e) => { setAssignMemberId(e.target.value); setAssignError(''); }}
                      className="saas-input text-xs sm:text-sm"
                      required
                    >
                       <option value="">-- Seleziona atleta --</option>
                       {members?.map((m: any) => (
                         <option key={m.id} value={m.id}>
                           {m.shirtNumber ? `#${m.shirtNumber} - ` : ''}{m.user?.name || m.user?.email || 'Membro'}
                         </option>
                       ))}
                    </select>
                  </div>

                  {/* 2. Selezione Rapida da Multe Predisposte (Stile Paynalty) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black text-text-tertiary uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Multe Consigliate (1-Click)</span>
                      </label>
                      <span className="text-[10px] text-text-tertiary">Clicca per applicare</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-[#070B12]/80 rounded-xl border border-white/5 scrollbar-thin">
                      {VOLLEY_PRESET_FINES.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPreset(preset)}
                          className="px-2 py-1 text-[11px] rounded-lg bg-surface hover:bg-[#162238] border border-border hover:border-amber-500/40 text-text-primary text-left transition-all active:scale-95 flex items-center gap-1.5"
                          title={preset.desc}
                        >
                          <span className="font-semibold truncate max-w-[150px]">{preset.reason}</span>
                          <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-amber-500/15 text-amber-400 font-bold">
                            € {preset.amountEuros.toFixed(2)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Oppure scegli dal tariffario registrato */}
                  {rules && rules.length > 0 && (
                    <div>
                      <label className="block text-[11px] font-bold text-text-tertiary uppercase tracking-wider mb-1">
                        Oppure Tariffario Salvato
                      </label>
                      <select 
                        value={assignRuleId} 
                        onChange={(e) => handleSelectRule(e.target.value)} 
                        className="saas-input text-xs"
                      >
                         <option value="">-- Seleziona dal regolamento --</option>
                         {rules.map((r: any) => (
                           <option key={r.id} value={r.id}>{r.reason} (€ {(r.defaultAmountCents / 100).toFixed(2)})</option>
                         ))}
                      </select>
                    </div>
                  )}

                  {/* 3. Motivazione Sanzione (Totalmente Modificabile: es. Ritardo 5 min) */}
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                      Motivazione Multa (Modificabile) <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text"
                      value={assignReason}
                      onChange={(e) => { setAssignReason(e.target.value); setAssignError(''); }}
                      placeholder="Es. Ritardo 5 min, Cartellino, ecc."
                      className="saas-input text-xs sm:text-sm"
                      required
                    />
                    <p className="text-[10px] text-text-tertiary mt-1">
                      Puoi modificare il testo a piacimento (es: specificare i minuti di ritardo).
                    </p>
                  </div>

                  {/* 4. Importo Multa */}
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                      Importo Sanzione (€) <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                      <input 
                        type="number"
                        step="0.50"
                        min="0.50"
                        value={assignAmountEuros}
                        onChange={(e) => setAssignAmountEuros(Number(e.target.value))}
                        className="saas-input pl-9 font-mono text-sm font-bold"
                        required
                      />
                    </div>
                  </div>

                  {/* 5. Spunta: In Partita Vale Doppio (2x) */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Flame className={`w-4 h-4 transition-colors ${isMatchDouble ? 'text-amber-400 animate-pulse' : 'text-text-tertiary'}`} />
                        <div>
                          <p className="text-xs font-bold text-text-primary">In Partita Vale Doppio (2x)</p>
                          <p className="text-[10px] text-text-tertiary">Raddoppia l'importo e contrassegna l'infrazione in gara</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox"
                        checked={isMatchDouble}
                        onChange={handleToggleMatchDouble}
                        className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
                      />
                    </label>
                  </div>

                  {/* Errore */}
                  {assignError && (
                    <div className="p-3 bg-danger/10 text-danger border border-danger/20 text-xs rounded-xl flex items-center font-medium animate-in fade-in">
                      <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                      <span>{assignError}</span>
                    </div>
                  )}

                  {/* Live Summary Preview */}
                  {assignReason && (
                    <div className="p-2.5 rounded-xl bg-[#070B12] border border-white/5 flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <span className="text-text-tertiary">Riepilogo: </span>
                        <span className="font-bold text-[#F8FAFC]">{assignReason}</span>
                        {isMatchDouble && <span className="ml-1 text-amber-400 font-bold">[Gara ×2]</span>}
                      </div>
                      <span className="font-mono font-black text-amber-400 shrink-0">
                        € {assignAmountEuros.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={assignFine.isPending} 
                      className="saas-btn-primary w-full bg-amber-500 hover:bg-amber-400 text-[#070B12] font-black shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
                    >
                      {assignFine.isPending ? 'Assegnazione...' : 'Conferma ed Assegna Multa'}
                    </button>
                  </div>
                </form>
             </div>
           </div>
        )}

        {/* Form Panel: Nuova Tariffa Regolamento */}
        {showRuleForm && (
           <div className="lg:col-span-1">
             <div className="saas-card p-5 sticky top-24 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                   <h3 className="text-sm font-bold text-text-primary">Nuova Tariffa Regolamento</h3>
                   <button onClick={() => setShowRuleForm(false)} className="text-text-tertiary hover:text-text-primary"><X className="h-4 w-4" /></button>
                </div>
                
                <form onSubmit={handleRuleSubmit((d) => createRule.mutate(d))} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Motivazione</label>
                    <input {...registerRule('reason')} placeholder="Es. Ritardo Allenamento" className="saas-input" />
                    {ruleErrors.reason && <p className="text-red-500 text-xs mt-1">{ruleErrors.reason.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Importo Base (€)</label>
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

        {/* Form Panel: Pagamento */}
        {showPaymentForm && (
           <div className="lg:col-span-1">
             <div className="saas-card p-5 sticky top-24 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                   <h3 className="text-sm font-bold text-text-primary">Dichiara Pagamento</h3>
                   <button onClick={() => setShowPaymentForm(false)} className="text-text-tertiary hover:text-text-primary"><X className="h-4 w-4" /></button>
                </div>
                
                <form onSubmit={handlePaymentSubmit((d) => declarePayment.mutate({ amountCents: Math.round(d.amountEuros * 100), method: d.method }))} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Importo Versato (€)</label>
                    <input type="number" step="0.50" {...registerPayment('amountEuros', { valueAsNumber: true })} className="saas-input" />
                    {paymentErrors.amountEuros && <p className="text-red-500 text-xs mt-1">{paymentErrors.amountEuros.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Metodo</label>
                    <select {...registerPayment('method')} className="saas-input">
                       <option value="CASH">Contanti (Cash)</option>
                       <option value="TRANSFER">Bonifico</option>
                    </select>
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={declarePayment.isPending} className="saas-btn-primary w-full bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      Dichiara Versamento
                    </button>
                  </div>
                </form>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-[10px] text-text-tertiary mb-2 text-center uppercase tracking-wider font-semibold">Oppure paga subito tramite PayPal</p>
                  {teamData?.paypalLink ? (
                    <a href={teamData.paypalLink} target="_blank" rel="noopener noreferrer" className="saas-btn-secondary w-full flex items-center justify-center font-bold text-[#003087] dark:text-[#0079C1] hover:text-[#001C64] border-[#003087]/20">
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

        {/* Form Panel: Libro Mastro Movimento */}
        {showLedgerForm && (
           <div className="lg:col-span-1">
             <div className="saas-card p-5 sticky top-24 animate-in fade-in slide-in-from-right-4 border-[#2A7EA2]/25">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                   <h3 className="text-sm font-bold text-text-primary flex items-center"><Landmark className="h-4 w-4 mr-2 text-[#38BDF8]"/> Registra Movimento</h3>
                   <button onClick={() => setShowLedgerForm(false)} className="text-text-tertiary hover:text-text-primary"><X className="h-4 w-4" /></button>
                </div>
                
                <form onSubmit={handleLedgerSubmit((d) => createLedgerTx.mutate(d))} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Tipo Movimento</label>
                    <div className="grid grid-cols-2 gap-2">
                       <label className="cursor-pointer">
                          <input type="radio" value="EXPENSE" {...registerLedger('type')} className="peer sr-only" />
                          <div className="text-center text-sm py-2 px-3 border border-border rounded-md peer-checked:bg-gray-900 peer-checked:text-text-primary dark:peer-checked:bg-surface-hover font-medium transition-colors">Spesa</div>
                       </label>
                       <label className="cursor-pointer">
                          <input type="radio" value="INCOME" {...registerLedger('type')} className="peer sr-only" />
                          <div className="text-center text-sm py-2 px-3 border border-border rounded-md peer-checked:bg-emerald-600 peer-checked:text-text-primary peer-checked:border-emerald-600 font-medium transition-colors">Entrata</div>
                       </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Descrizione</label>
                    <input {...registerLedger('description')} placeholder="Es. Cena di squadra / Birre" className="saas-input" />
                    {ledgerErrors.description && <p className="text-red-500 text-xs mt-1">{ledgerErrors.description.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Importo (€)</label>
                    <input type="number" step="0.50" {...registerLedger('amountEuros', { valueAsNumber: true })} className="saas-input" />
                    {ledgerErrors.amountEuros && <p className="text-red-500 text-xs mt-1">{ledgerErrors.amountEuros.message}</p>}
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={createLedgerTx.isPending} className="saas-btn-primary w-full bg-white hover:bg-slate-100 text-[#04060A] font-extrabold shadow-[0_4px_20px_rgba(255,255,255,0.22)]">
                      Salva Movimento
                    </button>
                  </div>
                </form>
             </div>
           </div>
        )}

      </div>

      {/* Edit Fine Modal */}
      {editingFine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="saas-card w-full max-w-md p-5 sm:p-6 shadow-2xl relative animate-in slide-in-from-bottom-4 my-auto">
            <button 
              onClick={() => setEditingFine(null)} 
              className="absolute top-4 right-4 text-text-tertiary hover:text-text-secondary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-black mb-1 text-text-primary flex items-center gap-2">
              <Pencil className="h-4 w-4 text-[#38BDF8]" /> Modifica Multa
            </h2>
            <p className="text-xs text-text-tertiary mb-4">
              Atleta: <strong className="text-text-primary">{editingFine.teamMember?.user?.name || editingFine.teamMember?.user?.email || 'Compagno'}</strong>
            </p>

            <form onSubmit={handleUpdateFineSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                  Motivazione
                </label>
                <input 
                  type="text" 
                  value={editReason} 
                  onChange={(e) => setEditReason(e.target.value)} 
                  className="saas-input text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                  Importo (€)
                </label>
                <input 
                  type="number" 
                  step="0.50" 
                  min="0.50"
                  value={editAmountEuros} 
                  onChange={(e) => setEditAmountEuros(Number(e.target.value))} 
                  className="saas-input font-mono text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                  Stato Pagamento
                </label>
                <select 
                  value={editStatus} 
                  onChange={(e) => setEditStatus(e.target.value as any)} 
                  className="saas-input text-xs"
                >
                  <option value="UNPAID">Da Saldare (Non pagato)</option>
                  <option value="PAID">Saldato</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFine(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:bg-surface transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={updateFine.isPending}
                  className="saas-btn-primary px-5 py-2 text-xs font-black"
                >
                  {updateFine.isPending ? 'Salvataggio...' : 'Salva Modifiche'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
