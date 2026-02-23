import React, { useState } from 'react';
import { Database, Zap, PieChart } from 'lucide-react'; // Ícones modernos
import MatchmakingDashboard from './components/MatchmakingDashboard';
import PainelCadastro from './components/PainelCadastro';
import PainelTransparencia from './components/PainelTransparencia';

function App() {
  const [abaAtiva, setAbaAtiva] = useState('transparencia'); // Iniciando na transparência para o TCC

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}></div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '600' }}>Governança Digital | Fundo Patrimonial</h1>
        </div>
        
        <div style={styles.navButtons}>
          <button style={abaAtiva === 'transparencia' ? styles.btnAtivo : styles.btnNav} onClick={() => setAbaAtiva('transparencia')}>
            <PieChart size={18} style={{ marginRight: '8px' }} /> Transparência Ativa
          </button>
          <button style={abaAtiva === 'cadastro' ? styles.btnAtivo : styles.btnNav} onClick={() => setAbaAtiva('cadastro')}>
            <Database size={18} style={{ marginRight: '8px' }} /> Alimentar Dados
          </button>
          <button style={abaAtiva === 'dashboard' ? styles.btnAtivo : styles.btnNav} onClick={() => setAbaAtiva('dashboard')}>
            <Zap size={18} style={{ marginRight: '8px' }} /> Motor de Inovação
          </button>
        </div>
      </nav>

      {/* Área de Conteúdo */}
      <main style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {abaAtiva === 'transparencia' && <PainelTransparencia />}
        {abaAtiva === 'cadastro' && <PainelCadastro />}
        {abaAtiva === 'dashboard' && <MatchmakingDashboard />}
      </main>
    </div>
  );
}

const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', color: '#1a1a1a', padding: '15px 40px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '15px' },
  logoIcon: { width: '32px', height: '32px', backgroundColor: '#2196F3', borderRadius: '8px' },
  navButtons: { display: 'flex', gap: '10px' },
  btnNav: { display: 'flex', alignItems: 'center', backgroundColor: 'transparent', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '10px 16px', fontSize: '15px', transition: 'all 0.2s', fontWeight: '500' },
  btnAtivo: { display: 'flex', alignItems: 'center', backgroundColor: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '10px 16px', fontSize: '15px', fontWeight: '600', transition: 'all 0.2s' }
};

export default App;