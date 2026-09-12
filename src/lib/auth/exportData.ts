export function offerJsonDownload(filename: string, text: string): boolean {
  if (typeof document === 'undefined') return false;
  const anchor = document.createElement('a');
  if (!('download' in anchor)) return false;
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
  return true;
}

export async function deliverExport(filename: string, payload: unknown): Promise<'downloaded' | 'copied'> {
  const text = JSON.stringify(payload, null, 2);
  if (offerJsonDownload(filename, text)) return 'downloaded';
  const clipboard = globalThis.navigator?.clipboard;
  if (clipboard?.writeText) {
    await clipboard.writeText(text);
    return 'copied';
  }
  throw new Error('Could not export on this device.');
}
