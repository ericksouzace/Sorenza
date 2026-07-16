import { agents } from '../data/mock';

export function AgentStrip() {
  return (
    <section className="agent-section" aria-labelledby="agent-title">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Equipe em atividade</p>
          <h2 id="agent-title">Especialistas trabalhando em paralelo</h2>
        </div>
        <button className="text-button">Ver sala de operações</button>
      </div>
      <div className="agent-grid">
        {agents.map((agent) => (
          <article className="agent-card" key={agent.name}>
            <div className={`agent-orb ${agent.tone}`}>{agent.name.slice(0, 1)}</div>
            <div className="agent-info">
              <div>
                <strong>{agent.name}</strong>
                <span>{agent.role}</span>
              </div>
              <p>{agent.state}</p>
            </div>
            <span className="live-dot" aria-label="Ativo" />
          </article>
        ))}
      </div>
    </section>
  );
}
