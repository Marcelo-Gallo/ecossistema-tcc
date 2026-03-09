import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, ShieldAlert, Database } from 'lucide-react';

const PainelCadastro = () => {
  const [abaAtiva, setAbaAtiva] = useState('atores');
  const [atores, setAtores] = useState([]);
  const [expertises, setExpertises] = useState([]);
  const [demandas, setDemandas] = useState([]);
  const [editais, setEditais] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [kpisFinanceiros, setKpisFinanceiros] = useState({ teto_rendimento: 0, orcamento_empenhado: 0 });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  
  const [atorForm, setAtorForm] = useState({ nome: '', tipo_helice: 'GOVERNO' });
  const [demandaForm, setDemandaForm] = useState({ titulo: '', descricao: '', ator_id: '', area_cnpq: 'ENGENHARIAS' });
  const [expertiseForm, setExpertiseForm] = useState({ pesquisador_responsavel: '', area_conhecimento: '', area_cnpq: 'ENGENHARIAS', ator_id: '', link_lattes: '' });
  const [portfolioForm, setPortfolioForm] = useState({ expertise_id: '', tipo: 'ARTIGO_CIENTIFICO', titulo: '', ano_publicacao: new Date().getFullYear(), link_acesso: '' });
  const [editalForm, setEditalForm] = useState({ codigo_identificacao: '', orcamento_disponivel: '', data_abertura: '', data_fechamento: '' });
  const [projetoForm, setProjetoForm] = useState({ titulo: '', demanda_id: '', expertise_id: '', edital_id: '', status: 'EM_ANALISE' });

  const areasCnpq = ['CIENCIAS_EXATAS_E_DA_TERRA', 'CIENCIAS_BIOLOGICAS', 'ENGENHARIAS', 'CIENCIAS_DA_SAUDE', 'CIENCIAS_AGRARIAS', 'CIENCIAS_SOCIAIS_APLICADAS', 'CIENCIAS_HUMANAS', 'LINGUISTICA_LETRAS_E_ARTES'];

  const carregarDados = async () => {
    try {
      const [resAtores, resExpertises, resDemandas, resEditais, resProjetos, resKpis, resPort] = await Promise.all([
        fetch('http://localhost:8000/api/atores/'), fetch('http://localhost:8000/api/expertises/'),
        fetch('http://localhost:8000/api/demandas/'), fetch('http://localhost:8000/api/editais/'),
        fetch('http://localhost:8000/api/projetos/'), fetch('http://localhost:8000/api/transparencia/kpis'),
        fetch('http://localhost:8000/api/portfolios/')
      ]);
      setAtores(await resAtores.json()); setExpertises(await resExpertises.json());
      setDemandas(await resDemandas.json()); setEditais(await resEditais.json());
      setProjetos(await resProjetos.json()); setKpisFinanceiros(await resKpis.json());
      setPortfolios(await resPort.json());
    } catch (error) { console.error("Erro ao carregar dados:", error); }
  };

  useEffect(() => { carregarDados(); }, []);

  const exibirMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo }); setTimeout(() => setMensagem({ texto: '', tipo: '' }), 4000);
  };

  const submitGenerico = async (e, url, payload, resetState) => {
    e.preventDefault();
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { exibirMensagem('Cadastrado com sucesso!', 'sucesso'); resetState(); carregarDados(); } 
      else { const err = await res.json(); exibirMensagem(err.detail || 'Erro ao salvar.', 'erro'); }
    } catch { exibirMensagem('Erro de conexão.', 'erro'); }
  };

  // A TRAVA FISCAL DE RESPONSABILIDADE (Baseada na regra do backend)
  const saldoLivreParaEditais = kpisFinanceiros.teto_rendimento - kpisFinanceiros.orcamento_empenhado;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}><Database size={24} style={{marginRight: '10px', verticalAlign: 'middle', color: '#2563eb'}}/> Backoffice do Ecossistema</h2>
        <p style={styles.subtitle}>Gerencie a base de dados em tempo real. Veja os cadastros existentes e crie novos fluxos.</p>
      </header>

      {mensagem.texto && (
        <div style={{ ...styles.alerta, backgroundColor: mensagem.tipo === 'sucesso' ? '#ecfdf5' : '#fef2f2', color: mensagem.tipo === 'sucesso' ? '#065f46' : '#991b1b' }}>
          {mensagem.tipo === 'sucesso' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ marginLeft: '10px' }}>{mensagem.texto}</span>
        </div>
      )}

      {/* MENU DE ABAS DE NAVEGAÇÃO */}
      <div style={styles.tabsContainer}>
        {['atores', 'demandas', 'expertises', 'portfolios', 'editais', 'projetos', 'gestao'].map(tab => (
          <button key={tab} style={abaAtiva === tab ? styles.tabActive : styles.tab} onClick={() => setAbaAtiva(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.contentArea}>
        
        {/* ABA ATORES */}
        {abaAtiva === 'atores' && (
          <div style={styles.splitLayout}>
            <div style={styles.tableArea}>
              <h3 style={styles.sectionTitle}>Atores Mapeados ({atores.length})</h3>
              <table style={styles.table}>
                <thead><tr><th>Nome</th><th>Hélice</th></tr></thead>
                <tbody>{atores.map(a => <tr key={a.id}><td>{a.nome}</td><td><span style={styles.badge}>{a.tipo_helice}</span></td></tr>)}</tbody>
              </table>
            </div>
            <div style={styles.formArea}>
              <h3 style={styles.sectionTitle}>Novo Ator</h3>
              <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/atores/', atorForm, () => setAtorForm({ nome: '', tipo_helice: 'GOVERNO' }))} style={styles.form}>
                <input required style={styles.input} placeholder="Nome (Ex: Prefeitura de...)" value={atorForm.nome} onChange={e => setAtorForm({...atorForm, nome: e.target.value})} />
                <select style={styles.input} value={atorForm.tipo_helice} onChange={e => setAtorForm({...atorForm, tipo_helice: e.target.value})}>
                  <option value="GOVERNO">Governo</option><option value="INDUSTRIA">Indústria</option><option value="UNIVERSIDADE">Universidade</option>
                </select>
                <button type="submit" style={styles.buttonPrimary}>Cadastrar Ator</button>
              </form>
            </div>
          </div>
        )}

        {/* ABA DEMANDAS */}
        {abaAtiva === 'demandas' && (
          <div style={styles.splitLayout}>
            <div style={styles.tableArea}>
              <h3 style={styles.sectionTitle}>Demandas Ativas ({demandas.length})</h3>
              <table style={styles.table}>
                <thead><tr><th>Título</th><th>Área CNPq</th></tr></thead>
                <tbody>{demandas.map(d => <tr key={d.id}><td>{d.titulo}</td><td><span style={styles.badge}>{d.area_cnpq.replace(/_/g, ' ')}</span></td></tr>)}</tbody>
              </table>
            </div>
            <div style={styles.formArea}>
              <h3 style={styles.sectionTitle}>Nova Demanda</h3>
              <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/demandas/', { ...demandaForm, ator_id: parseInt(demandaForm.ator_id) }, () => setDemandaForm({ ...demandaForm, titulo: '', descricao: '' }))} style={styles.form}>
                <select required style={styles.input} value={demandaForm.ator_id} onChange={e => setDemandaForm({ ...demandaForm, ator_id: e.target.value })}>
                  <option value="">Ator Solicitante...</option>
                  {atores.filter(a => a.tipo_helice !== 'UNIVERSIDADE').map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
                <input required style={styles.input} placeholder="Título do Problema" value={demandaForm.titulo} onChange={e => setDemandaForm({...demandaForm, titulo: e.target.value})} />
                <textarea required style={{...styles.input, minHeight: '60px'}} placeholder="Descrição detalhada..." value={demandaForm.descricao} onChange={e => setDemandaForm({...demandaForm, descricao: e.target.value})} />
                <select style={styles.input} value={demandaForm.area_cnpq} onChange={e => setDemandaForm({ ...demandaForm, area_cnpq: e.target.value })}>
                  {areasCnpq.map(area => <option key={area} value={area}>{area.replace(/_/g, ' ')}</option>)}
                </select>
                <button type="submit" style={styles.buttonPrimary}>Cadastrar Demanda</button>
              </form>
            </div>
          </div>
        )}

        {/* ABA EXPERTISES */}
        {abaAtiva === 'expertises' && (
          <div style={styles.splitLayout}>
            <div style={styles.tableArea}>
              <h3 style={styles.sectionTitle}>Pesquisadores ({expertises.length})</h3>
              <table style={styles.table}>
                <thead><tr><th>Nome</th><th>Área Específica</th></tr></thead>
                <tbody>{expertises.map(ex => <tr key={ex.id}><td>{ex.pesquisador_responsavel}</td><td>{ex.area_conhecimento}</td></tr>)}</tbody>
              </table>
            </div>
            <div style={styles.formArea}>
              <h3 style={styles.sectionTitle}>Nova Expertise</h3>
              <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/expertises/', { ...expertiseForm, ator_id: parseInt(expertiseForm.ator_id) }, () => setExpertiseForm({ ...expertiseForm, pesquisador_responsavel: '', area_conhecimento: '' }))} style={styles.form}>
                <select required style={styles.input} value={expertiseForm.ator_id} onChange={e => setExpertiseForm({...expertiseForm, ator_id: e.target.value})}>
                  <option value="">Instituição...</option>
                  {atores.filter(a => a.tipo_helice === 'UNIVERSIDADE').map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
                <input required style={styles.input} placeholder="Pesquisador Responsável" value={expertiseForm.pesquisador_responsavel} onChange={e => setExpertiseForm({...expertiseForm, pesquisador_responsavel: e.target.value})} />
                <input required style={styles.input} placeholder="Especialidade (ex: Visão Computacional)" value={expertiseForm.area_conhecimento} onChange={e => setExpertiseForm({...expertiseForm, area_conhecimento: e.target.value})} />
                <select style={styles.input} value={expertiseForm.area_cnpq} onChange={e => setExpertiseForm({...expertiseForm, area_cnpq: e.target.value})}>
                  {areasCnpq.map(area => <option key={area} value={area}>{area.replace(/_/g, ' ')}</option>)}
                </select>
                <button type="submit" style={styles.buttonPrimary}>Cadastrar Expertise</button>
              </form>
            </div>
          </div>
        )}

        {/* ABA PORTFOLIOS */}
        {abaAtiva === 'portfolios' && (
          <div style={styles.splitLayout}>
            <div style={styles.tableArea}>
              <h3 style={styles.sectionTitle}>Acervo Científico ({portfolios.length})</h3>
              <table style={styles.table}>
                <thead><tr><th>Título</th><th>Tipo</th><th>Ano</th></tr></thead>
                <tbody>{portfolios.map(p => <tr key={p.id}><td>{p.titulo}</td><td>{p.tipo}</td><td>{p.ano_publicacao}</td></tr>)}</tbody>
              </table>
            </div>
            <div style={styles.formArea}>
              <h3 style={styles.sectionTitle}>Novo Portfólio (Autoridade)</h3>
              <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/portfolios/', { ...portfolioForm, expertise_id: parseInt(portfolioForm.expertise_id), ano_publicacao: parseInt(portfolioForm.ano_publicacao) }, () => setPortfolioForm({ ...portfolioForm, titulo: '' }))} style={styles.form}>
                <select required style={styles.input} value={portfolioForm.expertise_id} onChange={e => setPortfolioForm({...portfolioForm, expertise_id: e.target.value})}>
                  <option value="">Pesquisador...</option>
                  {expertises.map(e => <option key={e.id} value={e.id}>{e.pesquisador_responsavel}</option>)}
                </select>
                <select style={styles.input} value={portfolioForm.tipo} onChange={e => setPortfolioForm({...portfolioForm, tipo: e.target.value})}>
                  <option value="ARTIGO_CIENTIFICO">Artigo</option><option value="PROJETO_EXTENSAO">Projeto</option><option value="PATENTE">Patente</option>
                </select>
                <input required style={styles.input} placeholder="Título do Trabalho" value={portfolioForm.titulo} onChange={e => setPortfolioForm({...portfolioForm, titulo: e.target.value})} />
                <input required type="number" style={styles.input} placeholder="Ano" value={portfolioForm.ano_publicacao} onChange={e => setPortfolioForm({...portfolioForm, ano_publicacao: e.target.value})} />
                <button type="submit" style={styles.buttonPrimary}>Adicionar ao Portfólio</button>
              </form>
            </div>
          </div>
        )}

        {/* ABA EDITAIS (A TRAVA FISCAL) */}
        {abaAtiva === 'editais' && (
          <div style={styles.splitLayout}>
            <div style={styles.tableArea}>
              <h3 style={styles.sectionTitle}>Editais Empenhados ({editais.length})</h3>
              <table style={styles.table}>
                <thead><tr><th>Código</th><th>Orçamento</th></tr></thead>
                <tbody>{editais.map(ed => <tr key={ed.id}><td>{ed.codigo_identificacao}</td><td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ed.orcamento_disponivel)}</td></tr>)}</tbody>
              </table>
            </div>
            <div style={styles.formArea}>
              <h3 style={styles.sectionTitle}>Empenhar Verba</h3>
              
              <div style={{ backgroundColor: saldoLivreParaEditais > 0 ? '#f0fdf4' : '#fef2f2', padding: '10px', borderRadius: '8px', marginBottom: '15px', border: `1px solid ${saldoLivreParaEditais > 0 ? '#bbf7d0' : '#fecaca'}` }}>
                 <p style={{ margin: 0, fontSize: '13px', color: saldoLivreParaEditais > 0 ? '#166534' : '#991b1b', fontWeight: 'bold' }}><ShieldAlert size={16} style={{verticalAlign: 'middle', marginRight: '5px'}}/>Saldo Livre (Rendimentos): {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoLivreParaEditais)}</p>
                 {saldoLivreParaEditais <= 0 && <p style={{margin: '5px 0 0 0', fontSize: '11px', color: '#991b1b'}}>Trava Fiscal: Não é possível criar editais sem novos aportes.</p>}
              </div>

              <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/editais/', { ...editalForm, orcamento_disponivel: parseFloat(editalForm.orcamento_disponivel) }, () => setEditalForm({ codigo_identificacao: '', orcamento_disponivel: '', data_abertura: '', data_fechamento: '' }))} style={styles.form}>
                <input required style={styles.input} placeholder="Código (Ex: ED-002/2026)" value={editalForm.codigo_identificacao} onChange={e => setEditalForm({...editalForm, codigo_identificacao: e.target.value})} disabled={saldoLivreParaEditais <= 0}/>
                
                <input required type="number" step="0.01" max={saldoLivreParaEditais} style={styles.input} placeholder="Orçamento Disponível (R$)" value={editalForm.orcamento_disponivel} onChange={e => setEditalForm({...editalForm, orcamento_disponivel: e.target.value})} disabled={saldoLivreParaEditais <= 0}/>
                
                <div style={styles.row}>
                  <div style={{flex: 1}}><input required type="date" style={styles.input} value={editalForm.data_abertura} onChange={e => setEditalForm({...editalForm, data_abertura: e.target.value})} disabled={saldoLivreParaEditais <= 0}/></div>
                  <div style={{flex: 1}}><input required type="date" style={styles.input} value={editalForm.data_fechamento} onChange={e => setEditalForm({...editalForm, data_fechamento: e.target.value})} disabled={saldoLivreParaEditais <= 0}/></div>
                </div>
                <button type="submit" style={{...styles.buttonPrimary, backgroundColor: saldoLivreParaEditais > 0 ? '#0891b2' : '#ccc'}} disabled={saldoLivreParaEditais <= 0}>Publicar Edital</button>
              </form>
            </div>
          </div>
        )}

        {/* ABA PROJETOS */}
        {abaAtiva === 'projetos' && (
          <div style={styles.splitLayout}>
            <div style={styles.tableArea}>
              <h3 style={styles.sectionTitle}>Projetos Cadastrados ({projetos.length})</h3>
              <table style={styles.table}>
                <thead><tr><th>Título</th><th>Status</th></tr></thead>
                <tbody>{projetos.map(p => <tr key={p.id}><td>{p.titulo}</td><td><span style={styles.badge}>{p.status}</span></td></tr>)}</tbody>
              </table>
            </div>
            <div style={styles.formArea}>
              <h3 style={styles.sectionTitle}>Aprovar Projeto (Match)</h3>
              <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/projetos/', { ...projetoForm, demanda_id: parseInt(projetoForm.demanda_id), expertise_id: parseInt(projetoForm.expertise_id), edital_id: parseInt(projetoForm.edital_id) }, () => setProjetoForm({ ...projetoForm, titulo: '' }))} style={styles.form}>
                <input required style={styles.input} placeholder="Título do Projeto" value={projetoForm.titulo} onChange={e => setProjetoForm({...projetoForm, titulo: e.target.value})} />
                <select required style={styles.input} value={projetoForm.demanda_id} onChange={e => setProjetoForm({...projetoForm, demanda_id: e.target.value})}>
                  <option value="">Demanda Base...</option>
                  {demandas.map(d => <option key={d.id} value={d.id}>{d.titulo}</option>)}
                </select>
                <select required style={styles.input} value={projetoForm.expertise_id} onChange={e => setProjetoForm({...projetoForm, expertise_id: e.target.value})}>
                  <option value="">Pesquisador Executor...</option>
                  {expertises.map(e => <option key={e.id} value={e.id}>{e.pesquisador_responsavel}</option>)}
                </select>
                <select required style={styles.input} value={projetoForm.edital_id} onChange={e => setProjetoForm({...projetoForm, edital_id: e.target.value})}>
                  <option value="">Edital Vinculado...</option>
                  {editais.map(ed => <option key={ed.id} value={ed.id}>{ed.codigo_identificacao}</option>)}
                </select>
                <button type="submit" style={{...styles.buttonPrimary, backgroundColor: '#e11d48'}}>Aprovar Projeto</button>
              </form>
            </div>
          </div>
        )}

        {/* ABA GESTÃO AO VIVO */}
        {abaAtiva === 'gestao' && (
          <div style={{backgroundColor: '#fff', padding: '25px', borderRadius: '12px', border: '2px dashed #2563eb'}}>
            <h3 style={{...styles.sectionTitle, color: '#2563eb'}}><CheckCircle2 size={20} style={{marginRight: '8px', verticalAlign: 'middle'}}/> Simulação de Conclusão de Projeto</h3>
            <p style={{fontSize: '13px', color: '#666', marginBottom: '20px'}}>Altere o status de um projeto em andamento para "Concluído" e comprove a atualização na aba de Transparência.</p>
            <table style={styles.table}>
              <thead><tr style={{textAlign: 'left'}}><th>Projeto</th><th>Status</th><th>Ação</th></tr></thead>
              <tbody>
                {projetos.filter(p => p.status !== 'CONCLUIDO').map(proj => (
                  <tr key={proj.id}>
                    <td>{proj.titulo}</td>
                    <td><span style={{backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '4px', fontSize: '11px'}}>{proj.status}</span></td>
                    <td>
                      <button 
                        onClick={async () => {
                          await fetch(`http://localhost:8000/api/projetos/${proj.id}/status`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({status: 'CONCLUIDO'})});
                          carregarDados();
                          exibirMensagem(`Projeto "${proj.titulo}" homologado!`, 'sucesso');
                        }}
                        style={{padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'}}
                      >Homologar Conclusão</button>
                    </td>
                  </tr>
                ))}
                {projetos.filter(p => p.status !== 'CONCLUIDO').length === 0 && (
                  <tr><td colSpan="3" style={{textAlign: 'center', padding: '20px', color: '#888'}}>Nenhum projeto ativo para homologar.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'Inter, Arial, sans-serif' },
  header: { marginBottom: '20px' },
  title: { margin: 0, fontSize: '24px', color: '#1a1a1a' },
  subtitle: { margin: '5px 0 0 0', color: '#666', fontSize: '15px' },
  alerta: { display: 'flex', alignItems: 'center', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500', fontSize: '14px', border: '1px solid transparent' },
  
  tabsContainer: { display: 'flex', gap: '5px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', overflowX: 'auto' },
  tab: { padding: '10px 20px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#64748b', transition: 'color 0.2s' },
  tabActive: { padding: '10px 20px', backgroundColor: '#1976d2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#fff' },
  
  contentArea: { minHeight: '400px' },
  splitLayout: { display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' },
  
  tableArea: { flex: '2 1 500px', backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', overflowX: 'auto' },
  formArea: { flex: '1 1 300px', backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' },
  
  sectionTitle: { margin: '0 0 15px 0', fontSize: '16px', color: '#0f172a', fontWeight: '700' },
  
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  badge: { display: 'inline-block', padding: '4px 8px', backgroundColor: '#e2e8f0', color: '#334155', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box', fontSize: '13px', outline: 'none' },
  row: { display: 'flex', gap: '10px' },
  label: { display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' },
  buttonPrimary: { padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
};

export default PainelCadastro;