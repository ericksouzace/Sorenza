import { icons } from './Icon';

export function Topbar() {
  return (
    <header className="topbar">
      <button className="project-switcher" aria-label="Trocar projeto">
        <div className="project-symbol">PR</div>
        <div className="project-copy">
          <strong>Pijama de Rica</strong>
          <span>GitHub Codespaces</span>
        </div>
        <icons.down size={15} />
      </button>
      <div className="topbar-actions">
        <div className="connection-pill">
          <span className="status-dot" />
          Codespace conectado
        </div>
        <button className="icon-button" aria-label="Buscar">
          <icons.search size={18} />
        </button>
      </div>
    </header>
  );
}
