import React, { useState, useEffect } from 'react';
import { Building2, Lightbulb, GraduationCap, FileText, Landmark, Rocket, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

const PainelCadastro = () => {
  const [atores, setAtores] = useState([]);
  const [expertises, setExpertises] = useState([]);
  const [demandas, setDemandas] = useState([]);
  const [editais, setEditais] = useState([]);
  const [projetosGerenciamento, setProjetosGerenciamento] = useState([]);
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
      const [resAtores, resExpertises, resDemandas, resEditais, resProjetos, resKpis] = await Promise.all([
        fetch('http://localhost:8000/api/atores/'),
        fetch('http://localhost:8000/api/expertises/'),
        fetch('http://localhost:8000/api/demandas/'),
        fetch('http://localhost:8000/api/editais/'),
        fetch('http://localhost:8000/api/projetos/'),
        fetch('http://localhost:8000/api/transparencia/kpis')
      ]);
      setAtores(await resAtores.json());
      setExpertises(await resExpertises.json());
      setDemandas(await resDemandas.json());
      setEditais(await resEditais.json());
      setProjetosGerenciamento(await resProjetos.json());
      setKpisFinanceiros(await resKpis.json());
    } catch (error) { console.error("Erro ao carregar dados:", error); }
  };

  useEffect(() => { carregarDados(); }, []);

  const exibirMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 5000);
  };

  const submitGenerico = async (e, url, payload, resetState) => {
    e.preventDefault();
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        exibirMensagem('Registo efetuado com sucesso!', 'sucesso');
        resetState();
        carregarDados(); 
      } else {
        const err = await res.json();
        exibirMensagem(err.detail || 'Erro ao guardar os dados.', 'erro');
      }
    } catch { exibirMensagem('Erro de conexão.', 'erro'); }
  };

  // CÁLCULO DA TRAVA FISCAL DE GOVERNANÇA
  const saldoLivreParaEditais = kpisFinanceiros.teto_rendimento - kpisFinanceiros.orcamento_empenhado;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Alimentação de Dados do Ecossistema</h2>
        <p style={styles.subtitle}>Cadastre os atores da Tríplice Hélice, fundos patrimoniais e consolide as inovações.</p>
      </header>

      {mensagem.texto && (
        <div style={{ ...styles.alerta, backgroundColor: mensagem.tipo === 'sucesso' ? '#ecfdf5' : '#fef2f2', color: mensagem.tipo === 'sucesso' ? '#065f46' : '#991b1b', border: `1px solid ${mensagem.tipo === 'sucesso' ? '#a7f3d0' : '#fecaca'}` }}>
          {mensagem.tipo === 'sucesso' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ marginLeft: '10px' }}>{mensagem.texto}</span>
        </div>
      )}

      <div style={styles.grid}>
        
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Building2 size={22} color="#2563eb" />
            <h3 style={styles.cardTitle}>1. Novo Ator</h3>
          </div>
          <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/atores/', atorForm, () => setAtorForm({ nome: '', tipo_helice: 'GOVERNO' }))} style={styles.form}>
            <input required style={styles.input} placeholder="Nome (Ex: Município X)" value={atorForm.nome} onChange={e => setAtorForm({ ...atorForm, nome: e.target.value })} />
            <select style={styles.input} value={atorForm.tipo_helice} onChange={e => setAtorForm({ ...atorForm, tipo_helice: e.target.value })}>
              <option value="GOVERNO">Governo</option><option value="INDUSTRIA">Indústria</option><option value="UNIVERSIDADE">Universidade</option>
            </select>
            <button type="submit" style={styles.buttonPrimary}>Cadastrar Ator</button>
          </form>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Lightbulb size={22} color="#d97706" />
            <h3 style={styles.cardTitle}>2. Nova Demanda</h3>
          </div>
          <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/demandas/', { ...demandaForm, ator_id: parseInt(demandaForm.ator_id) }, () => setDemandaForm({ ...demandaForm, titulo: '', descricao: '' }))} style={styles.form}>
            <select required style={styles.input} value={demandaForm.ator_id} onChange={e => setDemandaForm({ ...demandaForm, ator_id: e.target.value })}>
              <option value="">Selecione o Ator Solicitante...</option>
              {atores.filter(a => a.tipo_helice !== 'UNIVERSIDADE').map(a => <option key={a.id} value={a.id}>{a.nome} ({a.tipo_helice})</option>)}
            </select>
            <input required style={styles.input} placeholder="Título do Problema" value={demandaForm.titulo} onChange={e => setDemandaForm({ ...demandaForm, titulo: e.target.value })} />
            <textarea required style={{...styles.input, minHeight: '80px', resize: 'vertical'}} placeholder="Descreva o problema detalhadamente..." value={demandaForm.descricao} onChange={e => setDemandaForm({ ...demandaForm, descricao: e.target.value })} />
            <select style={styles.input} value={demandaForm.area_cnpq} onChange={e => setDemandaForm({ ...demandaForm, area_cnpq: e.target.value })}>
              {areasCnpq.map(area => <option key={area} value={area}>{area.replace(/_/g, ' ')}</option>)}
            </select>
            <button type="submit" style={styles.buttonPrimary}>Cadastrar Demanda</button>
          </form>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <GraduationCap size={22} color="#059669" />
            <h3 style={styles.cardTitle}>3. Nova Expertise (Academia)</h3>
          </div>
          <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/expertises/', { ...expertiseForm, ator_id: parseInt(expertiseForm.ator_id) }, () => setExpertiseForm({ ...expertiseForm, pesquisador_responsavel: '', area_conhecimento: '', link_lattes: '' }))} style={styles.form}>
            <select required style={styles.input} value={expertiseForm.ator_id} onChange={e => setExpertiseForm({ ...expertiseForm, ator_id: e.target.value })}>
              <option value="">Selecione a Instituição...</option>
              {atores.filter(a => a.tipo_helice === 'UNIVERSIDADE').map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <input required style={styles.input} placeholder="Pesquisador Responsável" value={expertiseForm.pesquisador_responsavel} onChange={e => setExpertiseForm({ ...expertiseForm, pesquisador_responsavel: e.target.value })} />
            <input required style={styles.input} placeholder="Área de Conhecimento Específica" value={expertiseForm.area_conhecimento} onChange={e => setExpertiseForm({ ...expertiseForm, area_conhecimento: e.target.value })} />
            <select style={styles.input} value={expertiseForm.area_cnpq} onChange={e => setExpertiseForm({ ...expertiseForm, area_cnpq: e.target.value })}>
              {areasCnpq.map(area => <option key={area} value={area}>{area.replace(/_/g, ' ')}</option>)}
            </select>
            <button type="submit" style={styles.buttonPrimary}>Cadastrar Expertise</button>
          </form>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FileText size={22} color="#4f46e5" />
            <h3 style={styles.cardTitle}>4. Portfólio (Autoridade)</h3>
          </div>
          <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/portfolios/', { ...portfolioForm, expertise_id: parseInt(portfolioForm.expertise_id), ano_publicacao: parseInt(portfolioForm.ano_publicacao) }, () => setPortfolioForm({ ...portfolioForm, titulo: '', link_acesso: '' }))} style={styles.form}>
            <select required style={styles.input} value={portfolioForm.expertise_id} onChange={e => setPortfolioForm({ ...portfolioForm, expertise_id: e.target.value })}>
              <option value="">Selecione o Pesquisador...</option>
              {expertises.map(e => <option key={e.id} value={e.id}>{e.pesquisador_responsavel}</option>)}
            </select>
            <select style={styles.input} value={portfolioForm.tipo} onChange={e => setPortfolioForm({ ...portfolioForm, tipo: e.target.value })}>
              <option value="ARTIGO_CIENTIFICO">Artigo Científico</option><option value="PROJETO_EXTENSAO">Projeto de Extensão</option><option value="PATENTE">Patente</option>
            </select>
            <input required style={styles.input} placeholder="Título da Publicação/Projeto" value={portfolioForm.titulo} onChange={e => setPortfolioForm({ ...portfolioForm, titulo: e.target.value })} />
            <input required type="number" style={styles.input} placeholder="Ano" value={portfolioForm.ano_publicacao} onChange={e => setPortfolioForm({ ...portfolioForm, ano_publicacao: e.target.value })} />
            <button type="submit" style={styles.buttonSecondary}>Adicionar ao Portfólio</button>
          </form>
        </div>

        {/* O CARD DE EDITAL COM A TRAVA ATIVADA */}
        <div style={{...styles.card, border: '2px solid #0891b2'}}>
          <div style={styles.cardHeader}>
            <Landmark size={22} color="#0891b2" />
            <h3 style={styles.cardTitle}>5. Empenhar Verba (Novo Edital)</h3>
          </div>
          
          <div style={{ backgroundColor: saldoLivreParaEditais > 0 ? '#f0fdf4' : '#fef2f2', padding: '10px', borderRadius: '8px', marginBottom: '15px', border: `1px solid ${saldoLivreParaEditais > 0 ? '#bbf7d0' : '#fecaca'}` }}>
             <p style={{ margin: 0, fontSize: '13px', color: saldoLivreParaEditais > 0 ? '#166534' : '#991b1b', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
               <ShieldAlert size={16} style={{marginRight: '5px'}}/>
               Saldo de Rendimentos Livres: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoLivreParaEditais)}
             </p>
             {saldoLivreParaEditais <= 0 && <p style={{margin: '5px 0 0 0', fontSize: '11px', color: '#991b1b'}}>Trava Fiscal Ativada: Impossível criar editais sem novos aportes.</p>}
          </div>

          <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/editais/', { ...editalForm, orcamento_disponivel: parseFloat(editalForm.orcamento_disponivel) }, () => setEditalForm({ codigo_identificacao: '', orcamento_disponivel: '', data_abertura: '', data_fechamento: '' }))} style={styles.form}>
            <input required style={styles.input} placeholder="Código do Edital (Ex: ED-001/2026)" value={editalForm.codigo_identificacao} onChange={e => setEditalForm({ ...editalForm, codigo_identificacao: e.target.value })} disabled={saldoLivreParaEditais <= 0}/>
            
            {/* A TRAVA FÍSICA NO HTML (max) */}
            <input required type="number" step="0.01" max={saldoLivreParaEditais} style={styles.input} placeholder="Orçamento Disponível (R$)" value={editalForm.orcamento_disponivel} onChange={e => setEditalForm({ ...editalForm, orcamento_disponivel: e.target.value })} disabled={saldoLivreParaEditais <= 0} title="Não pode ultrapassar o teto de rendimentos."/>
            
            <div style={styles.row}>
              <div style={{flex: 1}}><label style={styles.label}>Abertura</label><input required type="date" style={styles.input} value={editalForm.data_abertura} onChange={e => setEditalForm({ ...editalForm, data_abertura: e.target.value })} disabled={saldoLivreParaEditais <= 0}/></div>
              <div style={{flex: 1}}><label style={styles.label}>Fechamento</label><input required type="date" style={styles.input} value={editalForm.data_fechamento} onChange={e => setEditalForm({ ...editalForm, data_fechamento: e.target.value })} disabled={saldoLivreParaEditais <= 0}/></div>
            </div>
            
            <button type="submit" style={{...styles.buttonPrimary, backgroundColor: saldoLivreParaEditais > 0 ? '#0891b2' : '#ccc', cursor: saldoLivreParaEditais > 0 ? 'pointer' : 'not-allowed'}} disabled={saldoLivreParaEditais <= 0}>
              Publicar Edital (Validar Custo)
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Rocket size={22} color="#e11d48" />
            <h3 style={styles.cardTitle}>6. Projeto de Inovação</h3>
          </div>
          <form onSubmit={e => submitGenerico(e, 'http://localhost:8000/api/projetos/', { ...projetoForm, demanda_id: parseInt(projetoForm.demanda_id), expertise_id: parseInt(projetoForm.expertise_id), edital_id: parseInt(projetoForm.edital_id) }, () => setProjetoForm({ ...projetoForm, titulo: '' }))} style={styles.form}>
            <input required style={styles.input} placeholder="Título do Projeto Aprovado" value={projetoForm.titulo} onChange={e => setProjetoForm({ ...projetoForm, titulo: e.target.value })} />
            
            <select required style={styles.input} value={projetoForm.demanda_id} onChange={e => setProjetoForm({ ...projetoForm, demanda_id: e.target.value })}>
              <option value="">Selecione a Demanda Base...</option>
              {demandas.map(d => <option key={d.id} value={d.id}>{d.titulo}</option>)}
            </select>

            <select required style={styles.input} value={projetoForm.expertise_id} onChange={e => setProjetoForm({ ...projetoForm, expertise_id: e.target.value })}>
              <option value="">Selecione a Expertise Executora...</option>
              {expertises.map(e => <option key={e.id} value={e.id}>{e.pesquisador_responsavel}</option>)}
            </select>

            <select required style={styles.input} value={projetoForm.edital_id} onChange={e => setProjetoForm({ ...projetoForm, edital_id: e.target.value })}>
              <option value="">Vincular ao Edital (Financiamento)...</option>
              {editais.map(ed => <option key={ed.id} value={ed.id}>{ed.codigo_identificacao} - R$ {ed.orcamento_disponivel}</option>)}
            </select>

            <button type="submit" style={{...styles.buttonPrimary, backgroundColor: '#e11d48'}}>Aprovar Projeto</button>
          </form>
        </div>

        <div style={{...styles.card, gridColumn: '1 / -1', border: '2px dashed #2563eb'}}>
          <div style={styles.cardHeader}>
            <CheckCircle2 size={22} color="#2563eb" />
            <h3 style={styles.cardTitle}>7. Painel de Controle (PoC Ao Vivo)</h3>
          </div>
          <p style={{fontSize: '13px', color: '#666', marginBottom: '15px'}}>Simule a execução de um projeto para auditar a atualização em tempo real no Painel de Transparência.</p>
          
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{textAlign: 'left', borderBottom: '1px solid #eee', fontSize: '13px', color: '#666'}}>
                <th style={{padding: '10px 0'}}>Projeto</th>
                <th style={{padding: '10px 0'}}>Status Atual</th>
                <th style={{padding: '10px 0'}}>Ação Simulada</th>
              </tr>
            </thead>
            <tbody>
              {projetosGerenciamento.filter(p => p.status !== 'CONCLUIDO').map(proj => (
                <tr key={proj.id} style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: '10px 0', fontSize: '14px', fontWeight: '500'}}>{proj.titulo}</td>
                  <td style={{padding: '10px 0', fontSize: '12px'}}><span style={{backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '4px'}}>{proj.status}</span></td>
                  <td style={{padding: '10px 0'}}>
                    <button 
                      onClick={async () => {
                        await fetch(`http://localhost:8000/api/projetos/${proj.id}/status`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({status: 'CONCLUIDO'})});
                        carregarDados();
                        exibirMensagem(`Projeto "${proj.titulo}" homologado! Verifique a aba de Transparência.`, 'sucesso');
                      }}
                      style={{padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'}}
                    >
                      Homologar Conclusão
                    </button>
                  </td>
                </tr>
              ))}
              {projetosGerenciamento.filter(p => p.status !== 'CONCLUIDO').length === 0 && (
                <tr><td colSpan="3" style={{textAlign: 'center', padding: '20px', color: '#888'}}>Nenhum projeto ativo para homologar.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'Inter, Arial, sans-serif' },
  header: { marginBottom: '25px' },
  title: { margin: 0, fontSize: '24px', color: '#1a1a1a' },
  subtitle: { margin: '5px 0 0 0', color: '#666', fontSize: '15px' },
  alerta: { display: 'flex', alignItems: 'center', padding: '15px 20px', borderRadius: '8px', marginBottom: '25px', fontWeight: '500', fontSize: '15px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px' },
  cardTitle: { margin: 0, fontSize: '18px', color: '#1a1a1a', fontWeight: '600' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px 15px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', boxSizing: 'border-box', fontSize: '14px', backgroundColor: '#fafafa', outline: 'none', transition: 'border 0.2s' },
  row: { display: 'flex', gap: '15px' },
  label: { display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '5px', fontWeight: '500', textTransform: 'uppercase' },
  buttonPrimary: { padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'opacity 0.2s' },
  buttonSecondary: { padding: '12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'opacity 0.2s' }
};

export default PainelCadastro;