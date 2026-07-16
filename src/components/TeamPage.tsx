import { agents } from '../data/mock';

export function TeamPage() {
  return (
    <main className="page library-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Equipe</p>
          <h1>Especialistas, não personagens</h1>
          <p>Cada agente tem uma responsabilidade mensurável e limites que não pode ultrapassar.</p>
        </div>
        <button className="secondary-button">Ver benchmark multiagente</button>
      </div>
      <div className="team-grid">
        {agents.map((agent, index) => (
          <article className="team-card" key={agent.name}>
            <div className={`agent-orb large ${agent.tone}`}>{agent.name[0]}</div>
            <div className="team-copy">
              <div className="team-title">
                <div>
                  <h2>{agent.name}</h2>
                  <p>{agent.role}</p>
                </div>
                <span className="status-badge">Ativo</span>
              </div>
              <p className="team-description">
                {
                  [
                    'Converte objetivos em contratos, decompõe missões e coordena dependências sem aprovar o próprio resultado.',
                    'Implementa alterações no workspace candidato e trabalha sob orçamento, política e evidências exigidas.',
                    'Audita segurança, permissões e riscos. Não pode liberar hard safety ceilings nem editar políticas.',
                    'Avalia UX, UI, acessibilidade e qualidade visual, separando crítica subjetiva de evidência objetiva.',
                  ][index]
                }
              </p>
              <div className="agent-stats">
                <span>
                  <strong>
                    {index === 0 ? '96%' : index === 1 ? '91%' : index === 2 ? '98%' : '94%'}
                  </strong>{' '}
                  precisão
                </span>
                <span>
                  <strong>{index + 3}</strong> gates
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
