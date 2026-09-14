const FALLBACK_HOW = 'Cook it hot. Season. Eat it tonight.';
const LONG_STEP = 220;

const HTML_BREAK = /<br\s*\/?>/gi;
const HTML_BLOCK_END = /<\/(p|div|li|h\d)>/gi;
const HTML_TAG = /<\/?[^>]+>/g;
const MARKDOWN_BOLD = /\*\*(.+?)\*\*/g;
const MARKDOWN_ITALIC = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g;
const STEP_HEADING = /^(?:(?:step\s+)?\d{1,2}|method|instructions|directions)\s*[:.)-]?\s*$/i;
const NUMBER_PREFIX = /^(?:step\s+)?\d{1,2}\s*[.):\-]\s+/i;
const BULLET_PREFIX = /^[*•\-–]+\s+/;
const LEADING_MARK = /^[*_]+/;

export function howSteps(input: string | string[] | null | undefined): string[] {
  const chunks = Array.isArray(input) ? input : input ? [input] : [];
  const pieces: string[] = [];
  for (const chunk of chunks) {
    pieces.push(...splitInstructionChunk(chunk));
  }
  const cleaned = pieces.map(cleanStep).filter(isDisplayableStep);
  const split = splitLongSteps(cleaned);
  return split.length ? split : [FALLBACK_HOW];
}

function splitInstructionChunk(chunk: string): string[] {
  const text = normalizeMarkup(chunk);
  if (!text) return [];
  const lines = text.split(/\n+/);
  const out: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || STEP_HEADING.test(trimmed)) continue;
    out.push(...splitNumberedList(trimmed));
  }
  return out;
}

function normalizeMarkup(chunk: string): string {
  return chunk
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(HTML_BREAK, '\n')
    .replace(HTML_BLOCK_END, '\n')
    .replace(HTML_TAG, ' ')
    .replace(MARKDOWN_BOLD, '$1')
    .replace(MARKDOWN_ITALIC, '$1')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function splitNumberedList(text: string): string[] {
  const matches = [...text.matchAll(/(?:^|\s)(?:step\s+)?(\d{1,2})\s*[.)]\s+/gi)];
  if (matches.length < 2) return [text];
  const nums = matches.map((match) => Number(match[1]));
  if (nums[0] !== 1) return [text];
  for (let i = 1; i < nums.length; i += 1) {
    if (nums[i] !== nums[i - 1] + 1) return [text];
  }
  return text
    .split(/(?=(?:^|\s)(?:step\s+)?\d{1,2}\s*[.)]\s+)/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

function cleanStep(step: string): string {
  let text = step.trim();
  text = text.replace(LEADING_MARK, '');
  text = text.replace(BULLET_PREFIX, '');
  text = text.replace(NUMBER_PREFIX, '');
  text = text.replace(/\s+/g, ' ').replace(/\s+([.,!?])/g, '$1').trim();
  if (text && /^[a-z]/.test(text)) {
    text = text[0].toUpperCase() + text.slice(1);
  }
  if (text && !/[.!?]$/.test(text)) {
    text += '.';
  }
  return text;
}

function isDisplayableStep(step: string): boolean {
  return step.length >= 8 && /[A-Za-z]/.test(step);
}

function splitLongSteps(steps: string[]): string[] {
  const out: string[] = [];
  for (const step of steps) {
    if (step.length < LONG_STEP) {
      out.push(step);
      continue;
    }
    const sentences = splitSentences(step);
    if (sentences.length >= 2) out.push(...sentences);
    else out.push(step);
  }
  return out;
}

function splitSentences(text: string): string[] {
  const parts = text
    .split(/(?<=[.!?])\s+(?=[A-Z"“])/)
    .map((part) => part.trim())
    .filter(Boolean);
  const merged: string[] = [];
  for (const sentence of parts) {
    if (merged.length && (sentence.length < 24 || /^Enjoy\b/i.test(sentence))) {
      merged[merged.length - 1] += ` ${sentence}`;
    } else {
      merged.push(sentence);
    }
  }
  return merged.filter(isDisplayableStep);
}
