import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { User, Lock, Save, Camera, Phone, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../lib/cropImage';
import { PageHeader } from '../components/PageHeader';

export default function Profile() {
  const { user, setAuth, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  
  // Info Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState({ text: '', type: '' });

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  // Cropper State
  const [isCropping, setIsCropping] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCropImageSrc(event.target?.result as string);
      setIsCropping(true);
      // Reset crop state
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleConfirmCrop = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(cropImageSrc, croppedAreaPixels, 256);
      setAvatarUrl(croppedImage);
      setIsCropping(false);
      setCropImageSrc(null);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/profile');
      setName(data.name || '');
      setPhone(data.phone || '');
      setAvatarUrl(data.avatarUrl || '');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInfo(true);
    setInfoMessage({ text: '', type: '' });
    try {
      const { data } = await api.patch('/profile', { 
        name, 
        phone: phone || null, 
        avatarUrl: avatarUrl || null 
      });
      // Update local store user context
      if (token && user) {
        setAuth(token, { ...user, name: data.name, email: data.email });
      }
      setInfoMessage({ text: 'Profilo aggiornato con successo!', type: 'success' });
    } catch (err: any) {
      setInfoMessage({ text: err.response?.data?.error || 'Errore durante il salvataggio', type: 'error' });
    } finally {
      setIsSavingInfo(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
    setPasswordMessage({ text: '', type: '' });
    try {
      await api.post('/profile/change-password', { currentPassword, newPassword });
      setPasswordMessage({ text: 'Password aggiornata con successo!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordMessage({ text: err.response?.data?.error || 'Errore durante il cambio password', type: 'error' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <PageHeader 
        title="Impostazioni Profilo"
        description="Gestisci le tue informazioni personali e la sicurezza dell'account."
        icon={User}
      />

      <div className="flex space-x-1 bg-surface border border-border p-1 rounded-xl w-full max-w-sm">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'info' ? 'bg-bg-primary text-text-primary shadow-sm border border-border/50' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <User className="h-4 w-4 mr-2" /> Dati Personali
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'password' ? 'bg-bg-primary text-text-primary shadow-sm border border-border/50' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <Lock className="h-4 w-4 mr-2" /> Sicurezza
        </button>
      </div>

      {activeTab === 'info' && (
        <form onSubmit={handleSaveInfo} className="glass-panel p-6 border border-border rounded-2xl max-w-2xl space-y-6">
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-surface border-2 border-border overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-text-tertiary" />
                )}
              </div>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-[#38BDF8] p-2 rounded-full border-4 border-bg-primary text-[#070B12] cursor-pointer hover:bg-[#0284C7] shadow-[0_0_12px_rgba(56,189,248,0.4)] transition-all" 
                title="Carica un'immagine"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg, image/jpg, image/webp" 
                className="hidden" 
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-text-primary">{name || user?.name || 'Il tuo nome'}</h3>
              <p className="text-sm text-text-tertiary">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface border border-border text-text-primary pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50 focus:border-[#2A7EA2] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Numero di Telefono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-surface border border-border text-text-primary pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50 focus:border-[#2A7EA2] transition-all"
                  placeholder="+39 333 1234567"
                />
              </div>
            </div>
          </div>

          {infoMessage.text && (
            <div className={`p-3 text-sm rounded-xl border ${infoMessage.type === 'success' ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
              {infoMessage.text}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingInfo}
              className="flex items-center justify-center bg-white hover:bg-slate-100 text-[#04060A] px-6 py-2.5 rounded-xl text-sm font-extrabold shadow-[0_4px_20px_rgba(255,255,255,0.22)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.32)] transition-all active:scale-95 disabled:opacity-50"
            >
              {isSavingInfo ? 'Salvataggio...' : <><Save className="h-4 w-4 mr-2" /> Salva Modifiche</>}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handleSavePassword} className="glass-panel p-6 border border-border rounded-2xl max-w-2xl space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Password Attuale</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-surface border border-border text-text-primary pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50 focus:border-[#2A7EA2] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Nuova Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-surface border border-border text-text-primary pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50 focus:border-[#2A7EA2] transition-all"
                  minLength={6}
                  required
                />
              </div>
            </div>
          </div>

          {passwordMessage.text && (
            <div className={`p-3 text-sm rounded-xl border ${passwordMessage.type === 'success' ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
              {passwordMessage.text}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingPassword}
              className="flex items-center justify-center bg-white hover:bg-slate-100 text-[#04060A] px-6 py-2.5 rounded-xl text-sm font-extrabold shadow-[0_4px_20px_rgba(255,255,255,0.22)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.32)] transition-all active:scale-95 disabled:opacity-50"
            >
              {isSavingPassword ? 'Aggiornamento...' : <><Lock className="h-4 w-4 mr-2" /> Aggiorna Password</>}
            </button>
          </div>
        </form>
      )}

      {/* Cropper Modal */}
      {isCropping && cropImageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-bg-primary w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-border flex flex-col">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-bold">Ritaglia Immagine</h3>
              <button onClick={() => setIsCropping(false)} className="p-2 bg-surface rounded-full text-text-secondary hover:text-text-primary transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="relative w-full h-80 bg-black">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-6 bg-bg-primary">
              <div className="mb-6">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Zoom ({Math.round(zoom * 100)}%)</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-[#38BDF8]"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsCropping(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-text-secondary hover:bg-surface transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleConfirmCrop}
                  className="px-6 py-2.5 bg-white hover:bg-slate-100 text-[#04060A] rounded-xl text-sm font-extrabold shadow-[0_4px_20px_rgba(255,255,255,0.22)] transition-all"
                >
                  Conferma
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
