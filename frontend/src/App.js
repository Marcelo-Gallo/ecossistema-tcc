import React, { useState } from 'react';
import MatchmakingDashboard from './components/MatchmakingDashboard';
import PainelCadastro from './components/PainelCadastro';

function App() {
  const [abaAtiva, setAbaAtiva] = useState('cadastro');

  return (
    <div className="App" style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Navbar simples */}
      <nav style={styles.navbar}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>Sistema Fundo Patrimonial Municipal</h1>
        <div>
          <button style={abaAtiva === 'cadastro' ? styles.btnAtivo : styles.btnNav} onClick={() => setAbaAtiva('cadastro')}>
            1. Alimentar Dados
          </button>
          <button style={abaAtiva === 'dashboard' ? styles.btnAtivo : styles.btnNav} onClick={() => setAbaAtiva('dashboard')}>
            2. Motor de Inovação
          </button>
        </div>
      </nav>

      {/* Renderização Condicional */}
      <main style={{ padding: '20px' }}>
        {abaAtiva === 'cadastro' && <PainelCadastro />}
        {abaAtiva === 'dashboard' && <MatchmakingDashboard />}
      </main>
    </div>
  );
}

const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#333', color: 'white', padding: '15px 30px' },
  btnNav: { backgroundColor: 'transparent', color: 'white', border: 'none', cursor: 'pointer', padding: '10px 15px', fontSize: '16px', opacity: 0.7 },
  btnAtivo: { backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '10px 15px', fontSize: '16px', fontWeight: 'bold' }
};

export default App;