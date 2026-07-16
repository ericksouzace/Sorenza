import { useState } from 'react';
import { icons } from './Icon';

interface MissionComposerProps {
  onStart: (objective: string) => void;
}

export function MissionComposer({ onStart }: MissionComposerProps) {
  const [objective, setObjective] = useState(
    'Finalize a página de produto da Pijama de Rica, valide mobile e corrija qualquer regressão antes de concluir.',
  );
  const [autonomy, setAutonomy] = useState<'supervised' | 'autonomous'>('supervised');

  return (
    <section className="mission-composer" aria-labelledby="mission-heading">
      <div className="composer-heading">
        <span className="spark">
          <icons.sparkles size={16} />
        </span>
        <p>Nova missão</p>
      </div>
      <label id="mission-heading" htmlFor="mission-objective" className="sr-only">
        Objetivo da missão
      </label>
      <textarea
        id="mission-objective"
        value={objective}
        onChange={(event) => {
          setObjective(event.target.value);
        }}
        rows={3}
      />
      <div className="composer-footer">
        <div className="composer-options">
          <button className="chip">
            <icons.boxes size={14} />3 Skills ativas
          </button>
          <div className="segmented" aria-label="Nível de autonomia">
            <button
              className={autonomy === 'supervised' ? 'selected' : ''}
              onClick={() => {
                setAutonomy('supervised');
              }}
              aria-pressed={autonomy === 'supervised'}
            >
              Supervisionada
            </button>
            <button
              className={autonomy === 'autonomous' ? 'selected' : ''}
              onClick={() => {
                setAutonomy('autonomous');
              }}
              aria-pressed={autonomy === 'autonomous'}
            >
              Autônoma
            </button>
          </div>
        </div>
        <button
          className="primary-button"
          onClick={() => {
            onStart(objective);
          }}
          disabled={objective.trim().length < 12}
        >
          <icons.play size={15} fill="currentColor" />
          Iniciar missão
        </button>
      </div>
    </section>
  );
}
