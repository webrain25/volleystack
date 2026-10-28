import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CopyIcon, CheckCircle2, Users, UserPlus, Edit2, Check, X, Shield, Plus } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { PageHeader } from '../components/PageHeader';
import { motion } from 'framer-motion';

export default function Team() {
  const queryClient = useQueryClient();
  const { user, setAuth, token } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('PLAYER');
  
  const [teamName, setTeamName] = useState('');
  const [creatorRole, setCreatorRole] = useState('COACH');
  const [joinCode, setJoinCode] = useState('');

  const membership = user?.memberships?.[0];
  const teamId = membership?.teamId;
  const isOwner = membership?.roles?.some(r => r.role === 'ADMIN');

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team', teamId, 'members'],
    queryFn: () => api.get(`/teams/${teamId}/members`).then(res => res.data),
    enabled: !!teamId,
  });

  const createTeam = useMutation({
    mutationFn: (data: { name: string, role: string }) => api.post('/teams', data),
    onSuccess: async () => {
      const userRes = await api.get('/auth/me');
      setAuth(token!, userRes.data);
    }
  });

  const joinTeam = useMutation({
    mutationFn: (code: string) => api.post('/teams/join', { joinCode: code }),
    onSuccess: async () => {
      const userRes = await api.get('/auth/me');
      setAuth(token!, userRes.data);
    }
  });

  const updateJoinCode = useMutation({
    mutationFn: (code: string) => api.patch(`/teams/${teamId}/join-code`, { joinCode: code }),
    onSuccess: async () => {
      const userRes = await api.get('/auth/me');
      setAuth(token!, userRes.data);
      setIsEditingCode(false);
      setCodeError('');
    },
    onError: (err: any) => {
      setCodeError(err.response?.data?.error || 'Errore');
    }
  });

  const addGhostMember = useMutation({
    mutationFn: (data: { name: string, role: string }) => api.post(`/teams/${teamId}/ghost-members`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', teamId, 'members'] });
      setShowAddMember(false);
      setNewMemberName('');
    }
  });

  const transferOwnership = useMutation({
    mutationFn: (targetMemberId: string) => api.post(`/teams/${teamId}/transfer-ownership`, { targetMemberId }),
    onSuccess: async () => {
      const userRes = await api.get('/auth/me');
      setAuth(token!, userRes.data);
      queryClient.invalidateQueries({ queryKey: ['team', teamId, 'members'] });
      alert('Proprietà trasferita con successo!');
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Errore nel trasferimento');
    }
  });

  const copyToClipboard = () => {
    const teamJoinCode = (membership?.team as any)?.joinCode;
    if (teamJoinCode) {
      navigator.clipboard.writeText(teamJoinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!teamId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <div className="h-20 w-20 bg-surface border border-border rounded-[18px] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
            <svg className="w-10 h-10 text-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-3">Benvenuto in VolleyStack</h1>
          <p className="text-text-secondary mb-12 text-center max-w-md">Crea una nuova squadra come amministratore, oppure unisciti a una esistente tramite un codice di invito.</p>
          
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="saas-card p-8 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 bg-[#00F59B]/10 border border-[#00F59B]/25 rounded-[12px] flex items-center justify-center mb-5 shadow-[0_0_12px_rgba(0,245,155,0.15)]">
                   <Users className="h-5 w-5 text-[#00F59B]" />
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">Crea nuova squadra</h2>
                <p className="text-sm text-text-secondary mb-8">Ideale per allenatori e dirigenti. Sarai il proprietario.</p>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Nome della squadra" 
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="saas-input"
                />
                <select 
                  value={creatorRole} 
                  onChange={(e) => setCreatorRole(e.target.value)}
                  className="saas-input"
                >
                  <option value="COACH">Allenatore</option>
                  <option value="PLAYER">Giocatore</option>
                  <option value="ASSISTANT_COACH">Vice Allenatore</option>
                  <option value="TREASURER">Dirigente / Tesoriere</option>
                </select>
                <button 
                  onClick={() => createTeam.mutate({ name: teamName, role: creatorRole })}
                  disabled={!teamName || createTeam.isPending}
                  className="saas-btn-primary w-full py-3 mt-2"
                >
                  {createTeam.isPending ? 'Creazione...' : 'Crea Squadra'}
                </button>
              </div>
            </div>
            
            <div className="saas-card p-8 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 bg-surface-hover border border-border rounded-[12px] flex items-center justify-center mb-5">
                   <UserPlus className="h-5 w-5 text-text-tertiary" />
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">Unisciti a una squadra</h2>
                <p className="text-sm text-text-secondary mb-8">Inserisci il codice fornito dal tuo allenatore.</p>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="ES: DEMO12" 
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="saas-input uppercase"
                />
                <button 
                  onClick={() => joinTeam.mutate(joinCode)}
                  disabled={!joinCode || joinTeam.isPending}
                  className="saas-btn-secondary w-full py-3"
                >
                  {joinTeam.isPending ? 'Verifica in corso...' : 'Entra in Squadra'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 md:space-y-8 relative">
      
      <PageHeader 
        title={membership.team?.name || 'La tua Squadra'}
        description="Gestione roster e membri della squadra."
        icon={Users}
        actions={
          <div className="saas-card px-5 py-3 flex flex-col justify-center bg-surface-hover min-w-[220px]">
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">Codice Invito</p>
          {isEditingCode ? (
            <div className="flex items-center gap-2 mt-1">
              <input 
                type="text" 
                value={newCode} 
                onChange={e => setNewCode(e.target.value.toUpperCase())} 
                className="saas-input text-sm py-1.5 px-3 w-32 uppercase font-mono bg-bg-primary" 
                maxLength={12}
              />
              <button 
                onClick={() => updateJoinCode.mutate(newCode)} 
                disabled={updateJoinCode.isPending}
                className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
              >
                <Check className="h-4 w-4" />
              </button>
              <button 
                onClick={() => { setIsEditingCode(false); setCodeError(''); }}
                className="p-2 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 mt-1">
              <p className="text-xl font-black text-[#00F59B] font-mono tracking-widest drop-shadow-[0_0_8px_rgba(0,245,155,0.3)]">{(membership.team as any)?.joinCode}</p>
              <div className="flex space-x-1 ml-auto">
                {isOwner && (
                  <button 
                    onClick={() => { setNewCode((membership.team as any)?.joinCode || ''); setIsEditingCode(true); }}
                    className="p-2 rounded-lg hover:bg-surface border border-transparent hover:border-border text-text-tertiary hover:text-text-primary transition-colors"
                    title="Modifica codice"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
                <button 
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg hover:bg-surface border border-transparent hover:border-border text-text-tertiary hover:text-[#00F59B] transition-colors"
                  title="Copia codice"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 text-[#00F59B]" /> : <CopyIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
          {codeError && <p className="text-xs text-danger mt-2 max-w-[150px] leading-tight">{codeError}</p>}
        </div>
        }
      />

      <motion.div variants={itemVariants} className="saas-card overflow-hidden">
        <div className="p-4 md:p-5 border-b border-border bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-text-primary">Roster Giocatori</h2>
            <span className="px-2 py-0.5 rounded-full bg-surface-hover border border-border text-xs font-semibold text-text-secondary">{teamMembers?.length || 0}</span>
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
             <input type="text" placeholder="Cerca giocatore..." className="saas-input py-2 px-3 text-sm w-full md:w-56" />
             {isOwner && (
               <button 
                 onClick={() => setShowAddMember(!showAddMember)}
                 className="saas-btn-secondary py-2 flex items-center flex-shrink-0"
               >
                 <Plus className="h-4 w-4 md:mr-2" />
                 <span className="hidden md:inline">Aggiungi</span>
               </button>
             )}
          </div>
        </div>
        
        {showAddMember && isOwner && (
          <div className="p-5 bg-surface-hover border-b border-border flex flex-col md:flex-row items-end gap-4">
            <div className="w-full md:flex-1">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">Nome</label>
              <input type="text" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} className="saas-input py-2" placeholder="Es: Mario Rossi" />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">Ruolo</label>
              <select value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)} className="saas-input py-2">
                <option value="PLAYER">Giocatore</option>
                <option value="COACH">Allenatore</option>
                <option value="ASSISTANT_COACH">Vice Allenatore</option>
                <option value="TREASURER">Tesoriere</option>
              </select>
            </div>
            <button 
              onClick={() => addGhostMember.mutate({ name: newMemberName, role: newMemberRole })}
              disabled={!newMemberName || addGhostMember.isPending}
              className="saas-btn-volt py-2 w-full md:w-auto px-6"
            >
              Aggiungi
            </button>
          </div>
        )}
        
        {isLoading ? (
          <div className="p-12 flex flex-col justify-center items-center text-text-tertiary">
             <div className="h-6 w-6 rounded-full border-2 border-[#00F59B] border-t-transparent animate-spin mb-4"></div>
             <span className="text-sm">Caricamento squadra...</span>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {teamMembers?.map((member: any) => (
              <div key={member.id} className="p-4 md:p-5 flex items-center justify-between hover:bg-surface-hover/50 transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-bg-primary border border-border flex items-center justify-center text-text-secondary font-bold shadow-inner">
                    {member.user.name?.[0]?.toUpperCase() || member.user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-semibold text-text-primary">{member.user.name || 'Utente Senza Nome'}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4">
                  {member.roles.map((r: any) => (
                    <span key={r.id} className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-[8px] flex items-center ${
                      r.role === 'ADMIN' ? 'bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30' : 
                      r.role === 'TREASURER' ? 'bg-accent-500/10 text-accent-500 border border-accent-500/20' :
                      'bg-surface text-text-secondary border border-border'
                    }`}>
                      {r.role === 'ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                      {r.role}
                    </span>
                  ))}
                  {isOwner && member.userId !== user?.id && !member.user.email.startsWith('ghost_') && (
                    <button 
                      onClick={() => {
                        if (confirm(`Sei sicuro di voler cedere la proprietà a ${member.user.name}? Perderai tutti i privilegi di Owner.`)) {
                          transferOwnership.mutate(member.id);
                        }
                      }}
                      title="Cedi Proprietà"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-warning hover:text-text-primary ml-2 rounded-lg hover:bg-warning/20 border border-transparent hover:border-warning/30"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
