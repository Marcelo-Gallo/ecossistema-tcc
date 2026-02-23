import React, { useState, useEffect } from 'react';

const PainelCadastro = () => {
  const [atores, setAtores] = useState([]);
  const [expertises, setExpertises] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const [atorForm, setAtorForm] = useState({ nome: '', tipo_helice: 'GOVERNO' });
  const [demandaForm, setDemandaForm] = useState({ titulo: '', descricao: '', ator_id: '', area_cnpq: 'ENGENHARIAS' });
  const [expertiseForm, setExpertiseForm] = useState({ pesquisador_responsavel: '', area_conhecimento: '', area_cnpq: 'ENGENHARIAS', ator_id: '', link_lattes: '' });
  const [portfolioForm, setPortfolioForm] = useState({ expertise_id: '', tipo: 'ARTIGO_CIENTIFICO', titulo: '', ano_publicacao: 2025, link_acesso: '' });

  const areasCnpq = ['CIENCIAS_EXATAS_E_DA_TERRA', 'CIENCIAS_BIOLOGICAS', 'ENGENHARIAS', 'CIENCIAS_DA_SAUDE', 'CIENCIAS_AGRARIAS', 'CIENCIAS_SOCIAIS_APLICADAS', 'CIENCIAS_HUMANAS', 'LINGUISTICA_LETRAS_E_ARTES'];

  const carregarDados = async () => {
    try {
      const resAtores = await fetch('http://localhost:8000/api/atores/');
      setAtores(await resAtores.json());
      const resExpertises = await fetch('http://localhost:8000/api/expertises/');
      setExpertises(await resExpertises.json());
    } catch (error) { console.error("Erro ao carregar dados:", error); }
  };

  useEffect(() => { carregarDados(); }, []);

  const exibirMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 4000);
  };

  const submitGenerico = async (e, url, payload, resetState) => {
    e.preventDefault();
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        exibirMensagem('Registo efetuado com sucesso!', 'sucesso');
        resetState();
        carregarDados();
      } else throw new Error();
    } catch { exibirMensagem('Erro ao guardar os dados.', 'erro'); }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Gestão do Ecossistema (Tríplice Hélice)</h2>
        <p>Alimente a base de dados para o motor de matchmaking.</p>
      </header>

      {mensagem.texto && (
        <div style={{ ...styles.alerta, backgroundColor: mensagem.tipo === 'sucesso' ? '#e8f5e9' : '#ffebee', color: mensagem.tipo === 'sucesso' ? '#2e7d32' : '#c62828' }}>
          {mensagem.texto}
        </div>
      )}

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>1. Novo Ator</h3>
          <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/atores/', atorForm, () => setAtorForm({ nome: '', tipo_helice: 'GOVERNO' }))} style={styles.form}>
            <input required style={styles.input} placeholder="Nome (Ex: Município X)" value={atorForm.nome} onChange={e => setAtorForm({ ...atorForm, nome: e.target.value })} />
            <select style={styles.input} value={atorForm.tipo_helice} onChange={e => setAtorForm({ ...atorForm, tipo_helice: e.target.value })}>
              <option value="GOVERNO">Governo</option><option value="INDUSTRIA">Indústria</option><option value="UNIVERSIDADE">Universidade</option>
            </select>
            <button type="submit" style={styles.button}>Cadastrar Ator</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3>2. Nova Demanda</h3>
          <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/demandas/', { ...demandaForm, ator_id: parseInt(demandaForm.ator_id) }, () => setDemandaForm({ ...demandaForm, titulo: '', descricao: '' }))} style={styles.form}>
            <select required style={styles.input} value={demandaForm.ator_id} onChange={e => setDemandaForm({ ...demandaForm, ator_id: e.target.value })}>
              <option value="">Ator Solicitante...</option>
              {atores.filter(a => a.tipo_helice !== 'UNIVERSIDADE').map(a => <option key={a.id} value={a.id}>{a.nome} ({a.tipo_helice})</option>)}
            </select>
            <input required style={styles.input} placeholder="Título do Problema" value={demandaForm.titulo} onChange={e => setDemandaForm({ ...demandaForm, titulo: e.target.value })} />
            <textarea required style={{...styles.input, minHeight: '60px'}} placeholder="Descreva o problema..." value={demandaForm.descricao} onChange={e => setDemandaForm({ ...demandaForm, descricao: e.target.value })} />
            <select style={styles.input} value={demandaForm.area_cnpq} onChange={e => setDemandaForm({ ...demandaForm, area_cnpq: e.target.value })}>
              {areasCnpq.map(area => <option key={area} value={area}>{area}</option>)}
            </select>
            <button type="submit" style={styles.button}>Cadastrar Demanda</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3>3. Nova Expertise (Academia)</h3>
          <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/expertises/', { ...expertiseForm, ator_id: parseInt(expertiseForm.ator_id) }, () => setExpertiseForm({ ...expertiseForm, pesquisador_responsavel: '', area_conhecimento: '', link_lattes: '' }))} style={styles.form}>
            <select required style={styles.input} value={expertiseForm.ator_id} onChange={e => setExpertiseForm({ ...expertiseForm, ator_id: e.target.value })}>
              <option value="">Instituição...</option>
              {atores.filter(a => a.tipo_helice === 'UNIVERSIDADE').map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <input required style={styles.input} placeholder="Pesquisador Responsável" value={expertiseForm.pesquisador_responsavel} onChange={e => setExpertiseForm({ ...expertiseForm, pesquisador_responsavel: e.target.value })} />
            <input required style={styles.input} placeholder="Área de Conhecimento" value={expertiseForm.area_conhecimento} onChange={e => setExpertiseForm({ ...expertiseForm, area_conhecimento: e.target.value })} />
            <select style={styles.input} value={expertiseForm.area_cnpq} onChange={e => setExpertiseForm({ ...expertiseForm, area_cnpq: e.target.value })}>
              {areasCnpq.map(area => <option key={area} value={area}>{area}</option>)}
            </select>
            <button type="submit" style={styles.button}>Cadastrar Expertise</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3>4. Portfólio do Pesquisador</h3>
          <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/portfolios/', { ...portfolioForm, expertise_id: parseInt(portfolioForm.expertise_id), ano_publicacao: parseInt(portfolioForm.ano_publicacao) }, () => setPortfolioForm({ ...portfolioForm, titulo: '', link_acesso: '' }))} style={styles.form}>
            <select required style={styles.input} value={portfolioForm.expertise_id} onChange={e => setPortfolioForm({ ...portfolioForm, expertise_id: e.target.value })}>
              <option value="">Selecione o Pesquisador...</option>
              {expertises.map(e => <option key={e.id} value={e.id}>{e.pesquisador_responsavel} - ID: {e.id}</option>)}
            </select>
            <select style={styles.input} value={portfolioForm.tipo} onChange={e => setPortfolioForm({ ...portfolioForm, tipo: e.target.value })}>
              <option value="ARTIGO_CIENTIFICO">Artigo Científico</option><option value="PROJETO_EXTENSAO">Projeto de Extensão</option><option value="PATENTE">Patente</option>
            </select>
            <input required style={styles.input} placeholder="Título da Publicação/Projeto" value={portfolioForm.titulo} onChange={e => setPortfolioForm({ ...portfolioForm, titulo: e.target.value })} />
            <input required type="number" style={styles.input} placeholder="Ano" value={portfolioForm.ano_publicacao} onChange={e => setPortfolioForm({ ...portfolioForm, ano_publicacao: e.target.value })} />
            <button type="submit" style={styles.button}>Adicionar ao Portfólio</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' },
  alerta: { padding: '10px', borderRadius: '4px', marginBottom: '20px', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
  card: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' },
  button: { padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};

export default PainelCadastro;