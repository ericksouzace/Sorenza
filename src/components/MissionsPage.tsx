const rows = [
  ['Finalizar página de produto', 'Em andamento', 'Pijama de Rica', '18:42', '12 ações'],
  ['Corrigir checkout mobile', 'Concluída', 'Pijama de Rica', 'Ontem', '27 ações'],
  ['Auditoria de acessibilidade', 'Concluída', 'Pijama de Rica', '12 jul', '18 ações'],
  ['Refatorar catálogo', 'Bloqueada', 'Pijama de Rica', '10 jul', '9 ações'],
];

export function MissionsPage() {
  return (
    <main className="page library-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Missões</p>
          <h1>Histórico verificável</h1>
          <p>Cada missão preserva contrato, ações, decisões e evidências.</p>
        </div>
        <button className="secondary-button">Exportar relatório</button>
      </div>
      <div className="table-card" role="table" aria-label="Histórico de missões">
        <div className="table-row table-head" role="row">
          <span>Missão</span>
          <span>Status</span>
          <span>Projeto</span>
          <span>Início</span>
          <span>Uso</span>
        </div>
        {rows.map((row) => (
          <div className="table-row" role="row" key={row[0]}>
            {row.map((cell, index) => (
              <span
                key={cell}
                className={
                  index === 1 ? `status-text status-${cell.toLowerCase().replace(' ', '-')}` : ''
                }
              >
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
