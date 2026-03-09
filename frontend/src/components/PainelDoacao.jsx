import React, { useState } from 'react';
import { Heart, Loader, CheckCircle, ShieldCheck } from 'lucide-react';

const PainelDoacao = () => {
  const [doadorId, setDoadorId] = useState(1);
  const [valor, setValor] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const processarAporte = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);

    try {
      const resposta = await fetch('http://localhost:8000/api/doacoes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doador_id: parseInt(doadorId),
          valor: parseFloat(valor)
        })
      });

      const dados = await resposta.json();
      setResultado(dados);
    } catch (error) {
      console.error("Erro ao processar doação:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Apoie a Inovação Municipal</h2>
        <p style={styles.subtitle}>O seu aporte no Fundo Patrimonial será transformado em Score de Inovação e Impacto Social auditável.</p>
      </header>

      <div style={styles.content}>
        <div style={styles.cardForm}>
          <h3 style={styles.cardTitle}>Simulador de Aporte</h3>
          <form onSubmit={processarAporte} style={styles.form}>
            
            <label style={styles.label}>Doador Registado</label>
            <select style={styles.input} value={doadorId} onChange={(e) => setDoadorId(e.target.value)}>
              <option value={1}>TechCorp Inovações (CNPJ)</option>
              <option value={2}>Maria Souza (CPF)</option>
            </select>

            <label style={styles.label}>Valor do Aporte (R$)</label>
            <input 
              type="number" 
              style={styles.input} 
              value={valor} 
              onChange={(e) => setValor(e.target.value)} 
              min="10" 
              step="10"
              required
            />

            <button type="submit" style={styles.btnSubmit} disabled={loading}>
              {loading ? (
                <><Loader size={18} className="spin" style={{marginRight: '8px'}}/> Processando Gateway Bancário...</>
              ) : (
                <><Heart size={18} style={{marginRight: '8px'}}/> Confirmar Aporte</>
              )}
            </button>
            <p style={styles.notaGarantia}><ShieldCheck size={14} style={{marginRight: '4px', verticalAlign: 'middle'}}/> Transação protegida por Blockchain e auditada pelo sistema.</p>
          </form>
        </div>

        {resultado && (
          <div style={styles.cardSucesso}>
            <CheckCircle size={48} color="#388e3c" style={{ marginBottom: '15px' }} />
            <h3 style={{color: '#388e3c', margin: '0 0 10px 0'}}>Transação Concluída</h3>
            <p style={{margin: '0 0 5px 0', color: '#555'}}>{resultado.mensagem}</p>
            
            <div style={styles.recibo}>
              <p><strong>Código (TXN):</strong> {resultado.codigo_transacao}</p>
              <p><strong>Score de Contrapartida Gerado:</strong> <span style={styles.scoreBadge}>{resultado.novo_score} PTS</span></p>
            </div>
            <p style={{fontSize: '13px', color: '#888', marginTop: '15px', textAlign: 'center'}}>
              Este Score de Inovação poderá ser consumido junto da Prefeitura Municipal.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'Inter, Arial, sans-serif' },
  header: { marginBottom: '30px' },
  title: { margin: 0, fontSize: '24px', color: '#1a1a1a' },
  subtitle: { margin: '5px 0 0 0', color: '#666', fontSize: '15px' },
  content: { display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' },
  cardForm: { flex: '1 1 400px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eaeaea' },
  cardTitle: { margin: '0 0 20px 0', fontSize: '18px', color: '#333' },
  form: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '14px', color: '#555', marginBottom: '8px', fontWeight: '500' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '20px', fontSize: '15px' },
  btnSubmit: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1976d2', color: '#fff', padding: '14px', borderRadius: '6px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' },
  notaGarantia: { fontSize: '12px', color: '#888', textAlign: 'center', marginTop: '10px' },
  cardSucesso: { flex: '1 1 350px', backgroundColor: '#e8f5e9', padding: '30px', borderRadius: '12px', border: '1px solid #c8e6c9', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  recibo: { backgroundColor: '#fff', padding: '15px', borderRadius: '8px', width: '100%', marginTop: '15px', border: '1px dashed #a5d6a7' },
  scoreBadge: { backgroundColor: '#ff9800', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }
};

export default PainelDoacao;