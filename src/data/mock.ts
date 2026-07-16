import type { SkillManifest } from '../../packages/contracts/src/index';

export const navItems = [
  { id: 'home', label: 'Início' },
  { id: 'projects', label: 'Projetos' },
  { id: 'missions', label: 'Missões' },
  { id: 'team', label: 'Equipe' },
  { id: 'skills', label: 'Skills' },
  { id: 'evidence', label: 'Evidências' },
] as const;

export type NavId = (typeof navItems)[number]['id'];

export const agents = [
  { name: 'Atlas', role: 'Orquestração', state: 'Planejando a próxima etapa', tone: 'amber' },
  { name: 'Forge', role: 'Implementação', state: 'Refatorando o fluxo de produto', tone: 'ink' },
  {
    name: 'Sentinel',
    role: 'Segurança',
    state: 'Revisando permissões e regressões',
    tone: 'green',
  },
  {
    name: 'Prism',
    role: 'Experiência',
    state: 'Validando responsividade e hierarquia',
    tone: 'violet',
  },
] as const;

export const skills: SkillManifest[] = [
  {
    id: 'engineering-core',
    name: 'Engenharia Premium',
    version: '1.0.0',
    description:
      'Arquitetura, tipagem, qualidade, performance, testes e manutenção de longo prazo.',
    capabilities: ['architecture', 'testing', 'performance'],
    permissions: ['read:workspace', 'write:candidate'],
    qualityGates: ['typecheck', 'lint', 'test', 'build'],
    enabled: true,
  },
  {
    id: 'intergalactic-design',
    name: 'Designer Sênior Intergaláctico',
    version: '1.0.0',
    description: 'Direção de produto, UX, UI, acessibilidade, design system e crítica visual.',
    capabilities: ['ux', 'ui', 'a11y', 'visual-review'],
    permissions: ['read:workspace', 'browser:preview'],
    qualityGates: ['a11y', 'responsive', 'visual-review'],
    enabled: true,
  },
  {
    id: 'supreme-architect',
    name: 'Arquiteto Supremo de IA e Sistemas',
    version: '1.0.0',
    description: 'Auditoria sistêmica, automação, segurança, resiliência, IA e governança.',
    capabilities: ['architecture', 'security', 'automation', 'ai'],
    permissions: ['read:workspace', 'read:telemetry'],
    qualityGates: ['threat-model', 'evidence-gate'],
    enabled: true,
  },
  {
    id: 'pijama-brand',
    name: 'Pijama de Rica — Identidade',
    version: '0.4.0',
    description: 'Diretrizes visuais, tom de voz e padrões específicos da marca Pijama de Rica.',
    capabilities: ['brand', 'content', 'visual-review'],
    permissions: ['read:workspace'],
    qualityGates: ['brand-consistency'],
    enabled: false,
  },
];

export const timeline = [
  {
    time: '18:42',
    title: 'Contrato da missão congelado',
    detail: '7 critérios e 4 gates obrigatórios.',
  },
  {
    time: '18:43',
    title: 'Baseline concluído',
    detail: 'Typecheck, lint e build passaram antes da alteração.',
  },
  {
    time: '18:45',
    title: 'Candidate workspace preparado',
    detail: 'Projeto principal permanece intocado.',
  },
  {
    time: '18:47',
    title: 'Forge iniciou implementação',
    detail: '2 arquivos em edição, 1 arquivo novo.',
  },
] as const;
