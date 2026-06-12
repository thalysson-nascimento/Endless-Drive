const STORAGE_KEY = "game_ranking_v1";
const MAX_ENTRIES = 10;

export interface RankingEntry {
  tag:   string;   // 4 letras
  score: number;
  date:  string;   // ISO string
}

export class RankingSystem {
  private entries: RankingEntry[] = [];

  constructor() {
    this.load();
  }

  // ── LEITURA ─────────────────────────────────────────────────────────

  getEntries(): RankingEntry[] {
    return [...this.entries];
  }

  /** Retorna a posição (1-based) do score, ou null se não entrou no top 10 */
  getPositionFor(score: number): number | null {
    if (this.entries.length < MAX_ENTRIES) return this.entries.length + 1;
    const worst = this.entries[this.entries.length - 1].score;
    if (score <= worst) return null;
    return this.entries.findIndex(e => score > e.score) + 1;
  }

  qualifiesFor(score: number): boolean {
    return this.getPositionFor(score) !== null;
  }

  // ── ESCRITA ─────────────────────────────────────────────────────────

  /** Adiciona entrada, ordena e mantém top 10. Retorna posição final (1-based). */
  submit(tag: string, score: number): number {
    const entry: RankingEntry = {
      tag:   tag.toUpperCase().slice(0, 4).padEnd(4, "·"),
      score,
      date:  new Date().toLocaleDateString("pt-BR"),
    };

    this.entries.push(entry);
    this.entries.sort((a, b) => b.score - a.score);
    this.entries = this.entries.slice(0, MAX_ENTRIES);
    this.save();

    return this.entries.findIndex(e => e === entry) + 1;
  }

  // ── PERSISTÊNCIA ────────────────────────────────────────────────────

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.entries = JSON.parse(raw) as RankingEntry[];
    } catch {
      this.entries = [];
    }
  }
}
