import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Wallet, Target, BookOpen, Award, Shield, X } from 'lucide-react';

const PainelTransparencia = () => {
  const [kpis, setKpis] = useState({ corpus_total: 0, teto_rendimento: 0, orcamento_empenhado: 0, projetos_ativos: 0, demandas_mapeadas: 0 });
  const [dadosAreas, setDadosAreas] = useState([]);
  
  const [projetosAtivos, setProjetosAtivos] = useState([]);
  const [demandas, setDemandas] = useState([]);
  const [projetosConcluidos, setProjetosConcluidos] = useState([]);
  const [aportes, setAportes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalAtivo, setModalAtivo] = useState(null); 
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const carregarDadosGovernanca = async () => {
      try {
        const [resProjetos, resDemandas, resAcervo, resAportes, resKpis] = await Promise.all([
          fetch('http://localhost:8000/api/projetos/'),
          fetch('http://localhost:8000/api/demandas/'),
          fetch('http://localhost:8000/api/transparencia/projetos-concluidos'),
          fetch('http://localhost:8000/api/transparencia/aportes'),
          fetch('http://localhost:8000/api/transparencia/kpis') // A FONTE DA VERDADE
        ]);

        const dataProjetos = await resProjetos.json();
        const dataDemandas = await resDemandas.json();
        
        setDemandas(dataDemandas);
        setProjetosAtivos(dataProjetos.filter(p => p.status !== 'CONCLUIDO'));
        setProjetosConcluidos(await resAcervo.json());
        setAportes(await resAportes.json());
        setKpis(await resKpis.json()); // Backend entrega pronto!

        const contagemAreas = dataDemandas.reduce((acc, demanda) => {
          acc[demanda.area_cnpq] = (acc[demanda.area_cnpq] || 0) + 1;
          return acc;
        }, {});

        setDadosAreas(Object.keys(contagemAreas).map(area => ({
          name: area.replace(/_/g, ' '),
          quantidade: contagemAreas[area]
        })));

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosGovernanca();
  }, []);

  const abrirModalDetalhe = (tipo, item = null) => {
    setItemSelecionado(item);
    setModalAtivo(tipo);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando malha de governança...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Painel de Transparência Ativa</h2>
        <p style={styles.subtitle}>Auditoria pública do Corpus e acompanhamento das políticas de fomento sustentadas pelos rendimentos.</p>
      </header>

      {/* A HISTÓRIA DA GOVERNANÇA: Rendimento vs Empenho */}
      <div style={styles.gridKpi}>
        <div style={styles.cardKpi}>
          <div style={{...styles.iconContainer, backgroundColor: '#e8f5e9'}}><Shield size={24} color="#388e3c" /></div>
          <div>
            <p style={styles.kpiLabel}>Teto de Rendimento (0.8%)</p>
            <h3 style={{...styles.kpiValue, color: '#388e3c'}}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.teto_rendimento)}
            </h3>
          </div>
        </div>

        <div style={styles.cardKpi}>
          <div style={{...styles.iconContainer, backgroundColor: '#fff3e0'}}><Wallet size={24} color="#f57c00" /></div>
          <div>
            <p style={styles.kpiLabel}>Empenhado em Editais</p>
            <h3 style={{...styles.kpiValue, color: '#f57c00'}}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.orcamento_empenhado)}
            </h3>
          </div>
        </div>

        <div style={{...styles.cardKpi, cursor: 'pointer'}} onClick={() => abrirModalDetalhe('projetos')}>
          <div style={{...styles.iconContainer, backgroundColor: '#e3f2fd'}}><Target size={24} color="#1976d2" /></div>
          <div>
            <p style={styles.kpiLabel}>Projetos Ativos (Ver Lista)</p>
            <h3 style={{...styles.kpiValue, color: '#1976d2'}}>{kpis.projetos_ativos}</h3>
          </div>
        </div>
      </div>

      <div style={styles.gridGraficos}>
        {/* Tabela de Blindagem do Corpus */}
        <div style={{...styles.cardGrafico, gridColumn: '1 / -1'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
            <div>
              <h4 style={styles.graficoTitle}><Shield size={18} style={{marginRight: '8px', verticalAlign: 'middle', color: '#1976d2'}}/> Blindagem do Corpus (Últimos Aportes)</h4>
              <p style={{fontSize: '13px', color: '#666', margin: 0}}>O capital base que gera os rendimentos. Este montante nunca é consumido.</p>
            </div>
            <div style={{textAlign: 'right'}}>
              <p style={{fontSize: '12px', color: '#666', margin: 0, textTransform: 'uppercase', fontWeight: 'bold'}}>Corpus Total Auditado</p>
              <h3 style={{margin: 0, color: '#1976d2', fontSize: '20px'}}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.corpus_total)}</h3>
            </div>
          </div>
          
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Data do Aporte</th>
                <th style={styles.th}>Código TXN (Blockchain)</th>
                <th style={styles.th}>Origem</th>
                <th style={styles.th}>Valor Aportado</th>
              </tr>
            </thead>
            <tbody>
              {aportes.map((aporte, idx) => (
                <tr key={idx} style={styles.tr}>
                  <td style={styles.td}>{aporte.data_aporte}</td>
                  <td style={styles.td}><span style={styles.badgeTxn}>{aporte.codigo_transacao}</span></td>
                  <td style={styles.td}>{aporte.doador_nome}</td>
                  <td style={styles.td}><strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(aporte.valor)}</strong></td>
                </tr>
              ))}
              {aportes.length === 0 && <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px', color: '#888'}}>Nenhum aporte registrado.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Gráfico de Demandas */}
        <div style={styles.cardGrafico}>
          <h4 style={styles.graficoTitle}>Distribuição de Demandas (CNPq)</h4>
          {dadosAreas.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={dadosAreas} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="quantidade">
                    {dadosAreas.map((entry, index) => <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />)}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <p style={styles.emptyState}>Sem demandas mapeadas.</p>}
        </div>

        {/* Acervo Municipal */}
        <div style={styles.cardGrafico}>
          <h4 style={styles.graficoTitle}>Acervo Municipal (Impacto Gerado)</h4>
          <p style={{fontSize: '13px', color: '#666', marginBottom: '15px'}}>Soluções já devolvidas à sociedade. Clique para auditar.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {projetosConcluidos.map((proj) => (
              <div key={proj.id} style={styles.acervoCard} onClick={() => abrirModalDetalhe('acervo_detalhe', proj)}>
                <div style={styles.acervoIcon}><Award size={20} color="#388e3c" /></div>
                <div>
                  <h5 style={{margin: '0 0 5px 0', fontSize: '14px', color: '#333'}}>{proj.titulo}</h5>
                  <p style={{margin: 0, fontSize: '12px', color: '#388e3c', fontWeight: 'bold'}}>VER DETALHES E PRESTAÇÃO</p>
                </div>
              </div>
            ))}
            {projetosConcluidos.length === 0 && <p style={styles.emptyState}>Nenhum projeto finalizado ainda.</p>}
          </div>
        </div>
      </div>

      {/* MODAIS (Inalterado, apenas feche as tags) */}
      {modalAtivo && (
        <div style={styles.modalOverlay} onClick={() => setModalAtivo(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{margin: 0}}>
                {modalAtivo === 'demandas' && 'Demandas da Tríplice Hélice'}
                {modalAtivo === 'projetos' && 'Projetos de Inovação Ativos'}
                {modalAtivo === 'acervo_detalhe' && 'Auditoria de Impacto e Gastos'}
              </h3>
              <button style={styles.closeBtn} onClick={() => setModalAtivo(null)}><X size={20}/></button>
            </div>
            
            <div style={styles.modalBody}>
              {modalAtivo === 'demandas' && (
                <ul style={styles.list}>
                  {demandas.map(d => (
                    <li key={d.id} style={styles.listItem}>
                      <strong>{d.titulo}</strong><br/>
                      <span style={{fontSize: '13px', color: '#666'}}>{d.descricao}</span><br/>
                      <span style={styles.badgeArea}>{d.area_cnpq}</span>
                    </li>
                  ))}
                </ul>
              )}

              {modalAtivo === 'projetos' && (
                <ul style={styles.list}>
                  {projetosAtivos.map(p => (
                    <li key={p.id} style={styles.listItem}>
                      <strong>{p.titulo}</strong><br/>
                      <span style={{fontSize: '13px', color: '#666'}}>Status Público: <strong style={{color: '#f57c00'}}>{p.status}</strong></span>
                    </li>
                  ))}
                </ul>
              )}

              {modalAtivo === 'acervo_detalhe' && itemSelecionado && (
                <div>
                  <h4 style={{marginTop: 0, color: '#1976d2'}}>{itemSelecionado.titulo}</h4>
                  <p><strong>Demanda Originária (ID):</strong> #{itemSelecionado.demanda_id}</p>
                  <p><strong>Expertise Vinculada (ID):</strong> #{itemSelecionado.expertise_id}</p>
                  <p><strong>Status de Execução:</strong> <span style={{color: '#388e3c', fontWeight: 'bold'}}>CONCLUÍDO E HOMOLOGADO</span></p>
                  
                  <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#f5f7fa', borderRadius: '8px', marginBottom: '15px'}}>
                    <p style={{margin: '0 0 10px 0', fontWeight: 'bold'}}>Evidências Científicas Geradas:</p>
                    <button style={styles.btnLink} onClick={() => alert('Na versão de produção, isto abriria o Repositório Institucional.')}>
                      Acessar Artigo Científico / Patente
                    </button>
                  </div>

                  <div style={{padding: '15px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px'}}>
                    <p style={{margin: '0 0 10px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center'}}><Wallet size={16} style={{marginRight: '5px'}}/> Prestação de Contas</p>
                    <table style={{width: '100%', fontSize: '13px', borderCollapse: 'collapse'}}>
                      <thead>
                        <tr style={{borderBottom: '1px solid #eee', color: '#64748b', textAlign: 'left'}}>
                          <th style={{padding: '8px'}}>Rubrica</th>
                          <th style={{padding: '8px'}}>Valor Executado</th>
                          <th style={{padding: '8px'}}>Comprovante</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{borderBottom: '1px solid #eee'}}>
                          <td style={{padding: '8px'}}>Bolsa Pesquisador Responsável</td>
                          <td style={{padding: '8px', fontWeight: 'bold'}}>R$ 4.500,00</td>
                          <td style={{padding: '8px'}}><a href="#recibo" style={{color: '#1976d2'}}>Recibo.pdf</a></td>
                        </tr>
                        <tr style={{borderBottom: '1px solid #eee'}}>
                          <td style={{padding: '8px'}}>Equipamentos e Insumos</td>
                          <td style={{padding: '8px', fontWeight: 'bold'}}>R$ 12.350,00</td>
                          <td style={{padding: '8px'}}><a href="#nfe" style={{color: '#1976d2'}}>Nota_Fiscal.pdf</a></td>
                        </tr>
                        <tr>
                          <td style={{padding: '8px', color: '#64748b'}}>Taxa de Administração (Fundo)</td>
                          <td style={{padding: '8px', fontWeight: 'bold'}}>R$ 842,50</td>
                          <td style={{padding: '8px'}}><a href="#extrato" style={{color: '#1976d2'}}>Extrato.pdf</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { fontFamily: 'Inter, Arial, sans-serif' },
  header: { marginBottom: '30px' },
  title: { margin: 0, fontSize: '24px', color: '#1a1a1a' },
  subtitle: { margin: '5px 0 0 0', color: '#666', fontSize: '15px' },
  gridKpi: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' },
  cardKpi: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eaeaea', transition: 'transform 0.2s' },
  iconContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#f5f7fa', marginRight: '15px' },
  kpiLabel: { margin: 0, color: '#666', fontSize: '13px', textTransform: 'uppercase', fontWeight: '600' },
  kpiValue: { margin: '5px 0 0 0', color: '#1a1a1a', fontSize: '28px', fontWeight: 'bold' },
  gridGraficos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' },
  cardGrafico: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eaeaea' },
  graficoTitle: { margin: '0 0 10px 0', fontSize: '16px', color: '#333', fontWeight: '600' },
  emptyState: { textAlign: 'center', color: '#888', marginTop: '50px', fontStyle: 'italic' },
  
  acervoCard: { display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #eee', cursor: 'pointer', transition: 'background 0.2s' },
  acervoIcon: { backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '50%', marginRight: '15px', display: 'flex' },
  
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  th: { textAlign: 'left', padding: '12px', backgroundColor: '#f5f7fa', color: '#555', fontSize: '13px', borderBottom: '2px solid #eaeaea' },
  td: { padding: '12px', borderBottom: '1px solid #eaeaea', fontSize: '14px', color: '#333' },
  badgeTxn: { backgroundColor: '#e3f2fd', color: '#1976d2', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
  modalHeader: { padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#888' },
  modalBody: { padding: '20px', overflowY: 'auto' },
  
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { padding: '15px', borderBottom: '1px solid #eee', backgroundColor: '#fafafa', marginBottom: '10px', borderRadius: '8px' },
  badgeArea: { display: 'inline-block', marginTop: '8px', padding: '4px 8px', backgroundColor: '#e8eaf6', color: '#3f51b5', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  btnLink: { backgroundColor: '#1976d2', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }
};

export default PainelTransparencia;