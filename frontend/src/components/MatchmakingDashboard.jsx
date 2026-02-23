import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { BrainCircuit, Search, Info, ShieldCheck, AlertCircle } from 'lucide-react';

const MatchmakingDashboard = () => {
  const [demandaId, setDemandaId] = useState('');
  const [demandasDisponiveis, setDemandasDisponiveis] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Busca as demandas automaticamente ao abrir a tela
  useEffect(() => {
    const carregarDemandas = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/demandas/');
        if (response.ok) {
          const data = await response.json();
          setDemandasDisponiveis(data);
        }
      } catch (error) {
        console.error("Erro ao carregar demandas:", error);
      }
    };
    carregarDemandas();
  }, []);

  const buscarMatches = async (e) => {
    e.preventDefault();
    if (!demandaId) return;

    setLoading(true);
    setErro(null);

    try {
      const response = await fetch(`http://localhost:8000/api/matchmaking/${demandaId}`);
      if (!response.ok) throw new Error('Não foi possível encontrar a demanda ou ocorreu um erro no servidor.');
      
      const data = await response.json();
      setResultados(data);
    } catch (err) {
      setErro(err.message);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const gerarDadosRadar = (match) => {
    return [
      { metrica: 'Aderência Temática (TF-IDF)', valor: match.detalhes.score_texto, fullMark: 100 },
      { metrica: 'Autoridade (Acervo)', valor: match.detalhes.score_autoridade, fullMark: 100 },
      { metrica: 'Alinhamento CNPq', valor: 100, fullMark: 100 },
      { metrica: 'Score Global', valor: match.score_total, fullMark: 100 },
      { metrica: 'Densidade de Projetos', valor: Math.min(match.detalhes.total_publicacoes * 25, 100), fullMark: 100 }
    ];
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <BrainCircuit size={32} color="#e11d48" />
          <div>
            <h2 style={styles.title}>Motor de Inteligência e Matchmaking</h2>
            <p style={styles.subtitle}>Auditoria algorítmica de aderência entre Demandas Municipais e Expertises Académicas (TF-IDF).</p>
          </div>
        </div>
      </header>

      <div style={styles.searchBox}>
        <form onSubmit={buscarMatches} style={styles.form}>
          <label style={styles.label}>Selecione a Demanda para análise:</label>
          <div style={styles.inputGroup}>
            <select
              value={demandaId}
              onChange={(e) => setDemandaId(e.target.value)}
              style={styles.input}
              required
            >
              <option value="">Selecione um problema mapeado na base...</option>
              {demandasDisponiveis.map(d => (
                <option key={d.id} value={d.id}>
                  {d.titulo} - Área: {d.area_cnpq.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <button type="submit" style={styles.buttonPrimary} disabled={loading || !demandaId}>
              <Search size={18} />
              {loading ? 'A Processar...' : 'Executar Algoritmo'}
            </button>
          </div>
        </form>
      </div>

      {erro && (
        <div style={styles.alertaErro}>
          <AlertCircle size={20} />
          <span>{erro}</span>
        </div>
      )}

      <div style={styles.resultadosContainer}>
        {resultados.length === 0 && !loading && !erro && (
           <div style={styles.emptyState}>
             <Info size={40} color="#cbd5e1" style={{ marginBottom: '15px' }}/>
             <p>Aguardando submissão. O algoritmo irá processar a linguagem natural da demanda e cruzar com os portfólios registados na base da universidade.</p>
           </div>
        )}

        {resultados.map((match, index) => (
          <div key={index} style={styles.cardMatch}>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={styles.nomePesquisador}>{match.pesquisador_responsavel}</h3>
                <p style={styles.area}>{match.area_conhecimento}</p>
              </div>
              <div style={styles.scoreBadge}>
                <span style={{ fontSize: '12px', opacity: 0.9 }}>Score de Match</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{match.score_total}%</span>
              </div>
            </div>

            <div style={styles.gridExplicabilidade}>
              <div style={styles.radarContainer}>
                <h4 style={styles.sectionTitle}>Mapeamento Multidimensional</h4>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={gerarDadosRadar(match)}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="metrica" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Aderência" dataKey="valor" stroke="#e11d48" fill="#e11d48" fillOpacity={0.4} />
                      <RechartsTooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={styles.auditoriaContainer}>
                <h4 style={styles.sectionTitle}><ShieldCheck size={18} style={{ marginRight: '8px' }}/> Justificação Algorítmica (Answerability)</h4>
                <div style={styles.justificativaBox}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>
                    O sistema recomenda este financiamento com base em duas métricas comprováveis:
                  </p>
                  <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                    <li style={{ marginBottom: '8px' }}>
                      <strong>Alinhamento Semântico ({match.detalhes.score_texto}%):</strong> O algoritmo de Processamento de Linguagem Natural encontrou alta intersecção vetorial entre o problema descrito pelo município e os resumos de publicações deste investigador.
                    </li>
                    <li>
                      <strong>Autoridade Científica ({match.detalhes.score_autoridade}%):</strong> O investigador possui <strong>{match.detalhes.total_publicacoes} registo(s)</strong> validados no seu portfólio na mesma grande área do CNPq exigida, mitigando o risco de execução do projeto.
                    </li>
                  </ul>
                </div>
                <div style={styles.acaoContainer}>
                   <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', margin: '0 0 10px 0' }}>
                     Este nível de transparência permite justificar a injeção de fundos patrimoniais e construir a confiança cívica.
                   </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Estilos
const styles = {
  container: { fontFamily: 'Inter, Arial, sans-serif' },
  header: { marginBottom: '25px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' },
  title: { margin: 0, fontSize: '24px', color: '#0f172a' },
  subtitle: { margin: '5px 0 0 0', color: '#64748b', fontSize: '15px' },
  searchBox: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { fontSize: '14px', fontWeight: '500', color: '#334155' },
  inputGroup: { display: 'flex', gap: '15px' },
  input: { flex: 1, padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', backgroundColor: '#fafafa', cursor: 'pointer' },
  buttonPrimary: { display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px', backgroundColor: '#e11d48', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background-color 0.2s' },
  alertaErro: { display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '20px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8fafc', borderRadius: '12px', color: '#64748b', border: '1px dashed #cbd5e1' },
  resultadosContainer: { display: 'flex', flexDirection: 'column', gap: '25px' },
  cardMatch: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  nomePesquisador: { margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: '700' },
  area: { margin: '5px 0 0 0', color: '#64748b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '500' },
  scoreBadge: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', backgroundColor: '#e11d48', color: 'white', padding: '8px 15px', borderRadius: '8px' },
  gridExplicabilidade: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', padding: '25px' },
  sectionTitle: { display: 'flex', alignItems: 'center', margin: '0 0 15px 0', fontSize: '15px', color: '#0f172a', fontWeight: '600', textTransform: 'uppercase' },
  radarContainer: { borderRight: '1px solid #f1f5f9', paddingRight: '20px' },
  auditoriaContainer: { display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' },
  justificativaBox: { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '15px', marginBottom: '20px' },
  acaoContainer: { marginTop: 'auto', paddingTop: '15px', borderTop: '1px dashed #e2e8f0' }
};

export default MatchmakingDashboard;