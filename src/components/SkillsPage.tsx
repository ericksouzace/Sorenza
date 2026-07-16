import { useState } from 'react';
import { skills as initialSkills } from '../data/mock';

export function SkillsPage() {
  const [skills, setSkills] = useState(initialSkills);
  return (
    <main className="page library-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Skills</p>
          <h1>Capacidades versionadas</h1>
          <p>
            Skills adicionam conhecimento e gates. Nunca ganham autoridade sobre a política de
            segurança.
          </p>
        </div>
        <button className="secondary-button">Importar Skill</button>
      </div>
      <div className="skills-list">
        {skills.map((skill) => (
          <article className="skill-row" key={skill.id}>
            <div className="skill-icon">{skill.name.slice(0, 1)}</div>
            <div className="skill-main">
              <div className="skill-title">
                <h2>{skill.name}</h2>
                <span>v{skill.version}</span>
              </div>
              <p>{skill.description}</p>
              <div className="skill-tags">
                {skill.qualityGates.slice(0, 3).map((gate) => (
                  <span key={gate}>{gate}</span>
                ))}
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={skill.enabled}
                onChange={() => {
                  setSkills((current) =>
                    current.map((item) =>
                      item.id === skill.id ? { ...item, enabled: !item.enabled } : item,
                    ),
                  );
                }}
              />
              <span />
            </label>
          </article>
        ))}
      </div>
    </main>
  );
}
