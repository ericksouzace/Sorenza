import { icons } from './Icon';

const evidence = [
  ['Typecheck', 'PASS', 'npm run typecheck', '0', '18:51:03'],
  ['Lint', 'PASS', 'npm run lint', '0', '18:51:18'],
  ['Testes', 'PASS', 'npm test', '0', '18:52:11'],
  ['Build', 'PASS', 'npm run build', '0', '18:52:44'],
  ['Mobile 390px', 'PENDENTE', 'Playwright', '—', '—'],
];

export function EvidencePage() {
  return (
    <main className="page library-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Evidências</p>
          <h1>Nada é “pronto” por opinião</h1>
          <p>O modelo submete um candidato. O Evidence Gate decide com provas independentes.</p>
        </div>
        <button className="secondary-button">Baixar Evidence Bundle</button>
      </div>
      <div className="evidence-summary">
        <div className="score-ring">
          <span>4/5</span>
          <small>gates</small>
        </div>
        <div>
          <h2>Conclusão ainda não autorizada</h2>
          <p>O fluxo mobile precisa de evidência antes da promoção para o projeto principal.</p>
        </div>
        <div className="evidence-state">
          <icons.evidence size={18} />
          INCONCLUSIVO
        </div>
      </div>
      <div className="table-card evidence-table">
        <div className="table-row evidence-head">
          <span>Gate</span>
          <span>Resultado</span>
          <span>Executor</span>
          <span>Exit</span>
          <span>Capturado</span>
        </div>
        {evidence.map((row) => (
          <div className="table-row" key={row[0]}>
            {row.map((cell, index) => (
              <span key={cell} className={index === 1 ? `evidence-${cell.toLowerCase()}` : ''}>
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
