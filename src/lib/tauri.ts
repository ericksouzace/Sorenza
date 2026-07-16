export interface CodespaceSummary {
  name: string;
  repository: string;
  state: string;
}

export async function listCodespaces(): Promise<CodespaceSummary[]> {
  if (!('__TAURI_INTERNALS__' in window)) {
    return [
      { name: 'pijama-de-rica-main', repository: 'erick/pijama-de-rica', state: 'Available' },
    ];
  }
  const { invoke } = await import('@tauri-apps/api/core');
  return invoke<CodespaceSummary[]>('list_codespaces');
}

export async function openCodespace(name: string): Promise<void> {
  if (!('__TAURI_INTERNALS__' in window)) return;
  const { invoke } = await import('@tauri-apps/api/core');
  await invoke('open_codespace_in_vscode', { name });
}
