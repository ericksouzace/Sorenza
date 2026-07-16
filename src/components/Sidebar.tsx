import { icons } from './Icon';
import { navItems, type NavId } from '../data/mock';

interface SidebarProps {
  active: NavId;
  onNavigate: (id: NavId) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Navegação principal">
      <div className="brand-row">
        <div className="brand-mark" aria-hidden="true">
          <span>F</span>
        </div>
        <div className="brand-copy">
          <strong>Sorenza</strong>
          <span>Studio</span>
        </div>
      </div>

      <nav className="nav-list">
        <p className="nav-eyebrow">Workspace</p>
        {navItems.map((item) => {
          const Icon = icons[item.id];
          return (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? 'is-active' : ''}`}
              onClick={() => {
                onNavigate(item.id);
              }}
              aria-current={active === item.id ? 'page' : undefined}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="security-note">
          <div className="security-note__icon">
            <icons.evidence size={15} />
          </div>
          <div>
            <strong>Execução protegida</strong>
            <span>Projeto real só muda após evidência.</span>
          </div>
        </div>
        <button className="nav-item">
          <icons.settings size={17} />
          <span>Configurações</span>
        </button>
        <button className="profile-row" aria-label="Abrir perfil">
          <div className="avatar">E</div>
          <div>
            <strong>Erick</strong>
            <span>Workspace pessoal</span>
          </div>
          <icons.down size={15} />
        </button>
      </div>
    </aside>
  );
}
