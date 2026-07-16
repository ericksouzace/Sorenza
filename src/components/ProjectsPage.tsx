import { useEffect, useState } from 'react';
import { icons } from './Icon';
import { listCodespaces, type CodespaceSummary } from '../lib/tauri';

export function ProjectsPage() {
  const [codespaces, setCodespaces] = useState<CodespaceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void listCodespaces()
      .then((items) => {
        setCodespaces(items);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="page library-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Projetos</p>
          <h1>Seus ambientes de criação</h1>
          <p>Conecte projetos locais ou Codespaces sem misturar estados de execução.</p>
        </div>
        <button className="secondary-button">Adicionar projeto</button>
      </div>
      <div className="project-grid">
        {loading ? (
          <div className="skeleton-card" />
        ) : (
          codespaces.map((space) => (
            <article className="project-card" key={space.name}>
              <div className="project-card__head">
                <div className="project-symbol large">PR</div>
                <span className="connection-pill">
                  <span className="status-dot" />
                  {space.state}
                </span>
              </div>
              <h2>Pijama de Rica</h2>
              <p>{space.repository}</p>
              <div className="project-meta">
                <span>
                  <icons.boxes size={14} />
                  Codespaces
                </span>
                <span>Última missão há 12 min</span>
              </div>
              <button className="ghost-button">Abrir projeto</button>
            </article>
          ))
        )}
        <article className="project-card add-project">
          <div className="add-plus">+</div>
          <h2>Novo projeto</h2>
          <p>Comece do zero ou conecte um projeto existente.</p>
        </article>
      </div>
    </main>
  );
}
