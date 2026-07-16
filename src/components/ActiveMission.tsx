import { icons } from './Icon';
import { timeline } from '../data/mock';

export function ActiveMission() {
  const steps = [
    ['Contrato', 'done'],
    ['Baseline', 'done'],
    ['Implementação', 'active'],
    ['Evidências', 'pending'],
    ['Promoção', 'pending'],
  ] as const;

  return (
    <section className="active-mission" aria-labelledby="active-mission-title">
      <div className="active-mission__top">
        <div>
          <div className="mission-kicker">
            <span className="pulse-dot" />
            Missão em andamento
          </div>
          <h2 id="active-mission-title">Finalizar página de produto</h2>
          <p>Pijama de Rica · Candidate workspace isolado</p>
        </div>
        <div className="mission-metric">
          <strong>12</strong>
          <span>ações</span>
        </div>
      </div>
      <div className="mission-steps" aria-label="Progresso por etapas">
        {steps.map(([label, state], index) => (
          <div className={`mission-step ${state}`} key={label}>
            <div className="step-line">
              <span className="step-node">
                {state === 'done' ? <icons.check size={13} /> : index + 1}
              </span>
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="mission-body">
        <div className="current-action">
          <p className="eyebrow">Agora</p>
          <h3>Forge está refatorando o fluxo de produto</h3>
          <p>
            As alterações permanecem fora do projeto principal até o Evidence Gate aprovar todos os
            critérios.
          </p>
          <div className="changed-files">
            <span>product-page.tsx</span>
            <span>product.css</span>
            <span>+1</span>
          </div>
        </div>
        <div className="timeline-mini">
          {timeline.slice(-3).map((item) => (
            <div className="timeline-row" key={item.time + item.title}>
              <span>{item.time}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
