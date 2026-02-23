import React, { useState } from 'react';

const MatchmakingDashboard = () => {
  const [demandaId, setDemandaId] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const buscarMatches = async (e) => {
    e.preventDefault();
    if (!demandaId) return;

    setLoading(true);
    setErro(null);

    try {
      // Consome o endpoint criado no FastAPI
      const response = await fetch(`http://localhost:8000/api/matchmaking/${demandaId}`);
      if (!response.ok) {
        throw new Error('Não foi possível encontrar a demanda ou ocorreu um erro no servidor.');
      }
      const data = await response.json();
      setResultados(data);
    } catch (err) {
      setErro(err.message);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Portal da Governança - Motor de Inovação</h2>
        <p>Análise de aderência entre Demandas Municipais e Expertises Académicas.</p>
      </header>

      <form onSubmit={buscarMatches} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="demanda">ID da Demanda:</label>
          <input
            id="demanda"
            type="number"
            value={demandaId}
            onChange={(e) => setDemandaId(e.target.value)}
            placeholder="Ex: 1"
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'A processar...' : 'Analisar Aderência'}
          </button>
        </div>
      </form>

      {erro && <div style={styles.erro}>{erro}</div>}

      <div style={styles.resultadosContainer}>
        {resultados.length > 0 && <h3>Investigadores Recomendados ({resultados.length})</h3>}
        
        {resultados.length === 0 && !loading && !erro && (
           <p style={styles.placeholderText}>Insira o ID de uma demanda para visualizar o cruzamento de dados.</p>
        )}

        {resultados.map((match, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.cardHeader}>
              <h4 style={styles.nomePesquisador}>{match.pesquisador_responsavel}</h4>
              <span style={styles.badgeScore}>Score: {match.score_total}/100</span>
            </div>
            <p style={styles.area}>{match.area_conhecimento}</p>
            
            <div style={styles.detalhesMetricas}>
              {/* Barra de Similaridade Textual (TF-IDF) */}
              <div style={styles.metrica}>
                <span>Aderência do Texto (70%): {match.detalhes.score_texto}%</span>
                <div style={styles.barraFundo}>
                  <div style={{ ...styles.barraPreenchimento, width: `${match.detalhes.score_texto}%`, backgroundColor: '#4CAF50' }}></div>
                </div>
              </div>

              {/* Barra de Autoridade (Portfólio) */}
              <div style={styles.metrica}>
                <span>Autoridade do Portfólio (30%): {match.detalhes.score_autoridade}% ({match.detalhes.total_publicacoes} publicações)</span>
                <div style={styles.barraFundo}>
                  <div style={{ ...styles.barraPreenchimento, width: `${match.detalhes.score_autoridade}%`, backgroundColor: '#2196F3' }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' },
  form: { marginBottom: '30px' },
  inputGroup: { display: 'flex', gap: '10px', alignItems: 'center' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: '1' },
  button: { padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  erro: { padding: '15px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' },
  resultadosContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', backgroundColor: '#fafafa', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' },
  nomePesquisador: { margin: 0, fontSize: '18px', color: '#333' },
  badgeScore: { backgroundColor: '#ff9800', color: 'white', padding: '5px 10px', borderRadius: '12px', fontWeight: 'bold' },
  area: { color: '#666', fontStyle: 'italic', marginBottom: '15px' },
  detalhesMetricas: { display: 'flex', flexDirection: 'column', gap: '10px' },
  metrica: { fontSize: '14px', color: '#555' },
  barraFundo: { height: '10px', width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px', marginTop: '5px', overflow: 'hidden' },
  barraPreenchimento: { height: '100%', borderRadius: '5px', transition: 'width 0.5s ease-in-out' },
  placeholderText: { color: '#888', textAlign: 'center', marginTop: '40px' }
};

export default MatchmakingDashboard;