import { useState } from 'react';
import { AgentStrip } from './AgentStrip';
import { MissionComposer } from './MissionComposer';
import { ActiveMission } from './ActiveMission';

export function HomePage() {
  const [started, setStarted] = useState(true);
  const [lastObjective, setLastObjective] = useState<string | null>(null);

  return (
    <main className="page home-page">
      <section className="hero-copy">
        <p className="eyebrow">Mission control</p>
        <h1>O que vamos construir hoje?</h1>
        <p>
          Defina o resultado. O Sorenza planeja, trabalha em isolamento, valida e só promove
          mudanças comprovadas.
        </p>
      </section>
      <MissionComposer
        onStart={(objective) => {
          setLastObjective(objective);
          setStarted(true);
        }}
      />
      {lastObjective ? (
        <p className="inline-feedback" role="status">
          Missão preparada: {lastObjective}
        </p>
      ) : null}
      {started ? <ActiveMission /> : null}
      <AgentStrip />
    </main>
  );
}
