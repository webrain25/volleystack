import DocumentPage from '../components/DocumentPage';

export default function DataDeletion() {
  return (
    <DocumentPage title="Istruzioni per l'Eliminazione dei Dati Utente (Facebook / Meta)" lastUpdated="Novembre 2026">
      <h2>Istruzioni per la rimozione dei dati personali da VolleyStack</h2>
      <p>
        In conformità alle linee guida di Meta e del Regolamento GDPR, gli utenti che effettuano l'accesso a VolleyStack tramite Facebook possono richiedere in qualsiasi momento l'eliminazione completa di tutti i propri dati personali associati.
      </p>

      <h2>Come eliminare i tuoi dati tramite Facebook:</h2>
      <ol className="list-decimal pl-5 space-y-2">
        <li>Accedi al tuo account Facebook e vai su <strong>Impostazioni e Privacy ➔ Impostazioni</strong>.</li>
        <li>Nel menu a sinistra, seleziona <strong>App e siti web</strong>.</li>
        <li>Individua <strong>VolleyStack</strong> nell'elenco delle applicazioni attive.</li>
        <li>Clicca sul pulsante <strong>Rimuovi</strong> accanto a VolleyStack.</li>
        <li>Spunta la casella per eliminare le attività e i dati e conferma la rimozione.</li>
      </ol>

      <h2>Richiesta diretta di cancellazione immediata:</h2>
      <p>
        Se desideri che il nostro team cancelli manualmente e permanentemente il tuo profilo, le squadre e tutte le tue informazioni dai nostri server prima dell'eliminazione automatica, puoi inviare un'email a:
      </p>
      <p className="font-mono font-bold text-[#38BDF8] py-2">
        lucacupito.webrain25@gmail.com
      </p>
      <p>
        specificando come oggetto <em>&quot;Richiesta Eliminazione Dati VolleyStack&quot;</em> e indicando l'indirizzo email con cui ti sei registrato. I tuoi dati verranno rimossi entro 48 ore lavorative.
      </p>
    </DocumentPage>
  );
}

