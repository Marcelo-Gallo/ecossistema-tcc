import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Wallet, Target, Users, BookOpen, Award } from 'lucide-react';

const PainelTransparencia = () => {
  const [kpis, setKpis] = useState({ orcamentoTotal: 0, projetosAtivos: 0, totalDemandas: 0 });
  const [dadosAreas, setDadosAreas] = useState([]);
  const [projetosConcluidos, setProjetosConcluidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const CORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const carregarDadosGovernanca = async () => {
      try {
        const [resEditais, resProjetos, resDemandas, resAcervo] = await Promise.all([
          fetch('http://localhost:8000/api/editais/'),
          fetch('http://localhost:8000/api/projetos/'),
          fetch('http://localhost:8000/api/demandas/'),
          fetch('http://localhost:8000/api/transparencia/projetos-concluidos')
        ]);

        const editais = await resEditais.json();
        const projetos = await resProjetos.json();
        const demandas = await resDemandas.json();
        const acervo = await resAcervo.json();

        const orcamentoTotal = editais.reduce((acc, edital) => acc + parseFloat(edital.orcamento_disponivel), 0);
        
        setKpis({
          orcamentoTotal: orcamentoTotal,
          projetosAtivos: projetos.length,
          totalDemandas: demandas.length
        });

        setProjetosConcluidos(acervo);

        const contagemAreas = demandas.reduce((acc, demanda) => {
          acc[demanda.area_cnpq] = (acc[demanda.area_cnpq] || 0) + 1;
          return acc;
        }, {});

        const formatadoParaGrafico = Object.keys(contagemAreas).map(area => ({
          name: area.replace(/_/g, ' '),
          quantidade: contagemAreas[area]
        }));

        setDadosAreas(formatadoParaGrafico);

      } catch (error) {
        console.error("Erro ao carregar dados de transparência:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosGovernanca();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando métricas de governança...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Painel de Transparência Ativa</h2>
        <p style={styles.subtitle}>Acompanhe a destinação do Fundo Patrimonial e o impacto gerado na sociedade.</p>
      </header>

      <div style={styles.gridKpi}>
        <div style={styles.cardKpi}>
          <div style={styles.iconContainer}><Wallet size={24} color="#1976d2" /></div>
          <div>
            <p style={styles.kpiLabel}>Orçamento Liberado (Editais)</p>
            <h3 style={styles.kpiValue}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.orcamentoTotal)}
            </h3>
          </div>
        </div>

        <div style={styles.cardKpi}>
          <div style={styles.iconContainer}><Target size={24} color="#388e3c" /></div>
          <div>
            <p style={styles.kpiLabel}>Projetos Ativos</p>
            <h3 style={styles.kpiValue}>{kpis.projetosAtivos}</h3>
          </div>
        </div>

        <div style={styles.cardKpi}>
          <div style={styles.iconContainer}><BookOpen size={24} color="#f57c00" /></div>
          <div>
            <p style={styles.kpiLabel}>Demandas Mapeadas</p>
            <h3 style={styles.kpiValue}>{kpis.totalDemandas}</h3>
          </div>
        </div>
      </div>

      <div style={styles.gridGraficos}>
        <div style={styles.cardGrafico}>
          <h4 style={styles.graficoTitle}>Demandas por Área de Conhecimento (CNPq)</h4>
          {dadosAreas.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={dadosAreas} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="quantidade">
                    {dadosAreas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={styles.emptyState}>Nenhuma demanda mapeada ainda.</p>
          )}
        </div>

        {/* O Acervo Municipal vindo da Base de Dados */}
        <div style={styles.cardGrafico}>
          <h4 style={styles.graficoTitle}>Acervo Municipal (Impacto Social Gerado)</h4>
          <p style={{fontSize: '14px', color: '#666', marginBottom: '15px'}}>Soluções tecnológicas já implantadas com sucesso no município.</p>
          
          {projetosConcluidos.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {projetosConcluidos.map((proj) => (
                <div key={proj.id} style={styles.acervoCard}>
                  <div style={styles.acervoIcon}><Award size={20} color="#388e3c" /></div>
                  <div>
                    <h5 style={{margin: '0 0 5px 0', fontSize: '15px', color: '#333'}}>{proj.titulo}</h5>
                    <p style={{margin: 0, fontSize: '13px', color: '#888'}}>
                      Status: <strong style={{color: '#388e3c'}}>CONCLUÍDO</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.emptyState}>Nenhum projeto finalizado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'Inter, Arial, sans-serif' },
  header: { marginBottom: '30px' },
  title: { margin: 0, fontSize: '24px', color: '#1a1a1a' },
  subtitle: { margin: '5px 0 0 0', color: '#666', fontSize: '15px' },
  
  gridKpi: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' },
  cardKpi: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eaeaea' },
  iconContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#f5f7fa', marginRight: '15px' },
  kpiLabel: { margin: 0, color: '#666', fontSize: '13px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' },
  kpiValue: { margin: '5px 0 0 0', color: '#1a1a1a', fontSize: '28px', fontWeight: 'bold' },

  gridGraficos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' },
  cardGrafico: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eaeaea' },
  graficoTitle: { margin: '0 0 10px 0', fontSize: '16px', color: '#333', fontWeight: '600' },
  emptyState: { textAlign: 'center', color: '#888', marginTop: '50px', fontStyle: 'italic' },
  
  acervoCard: { display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #eee' },
  acervoIcon: { backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '50%', marginRight: '15px', display: 'flex' }
};

export default PainelTransparencia;