import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface TypeEffectiveness {
  [type: string]: number;
}

interface TeamTypeSummary {
  type: string;
  resistant: number;
  weak: number;
}

@Component({
  selector: 'app-team-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-summary.component.html',
  styleUrls: ['./team-summary.component.scss']
})
export class TeamSummaryComponent implements OnChanges {
  @Input() team: string[] = [];
  allTypes: string[] = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
    'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];
  summary: TeamTypeSummary[] = [];
  loading = false;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['team']) {
      this.summarizeTeam();
    }
  }

  async summarizeTeam() {
    this.loading = true;
    this.error = '';
    const team = this.team.filter(Boolean);
    const effectivenessList: TypeEffectiveness[] = [];
    try {
      for (const pokemon of team) {
        const pokeData: any = await this.http.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`).toPromise();
        const types = pokeData.types.map((t: any) => t.type.name);
        const eff = await this.calculateEffectiveness(types);
        effectivenessList.push(eff);
      }
      // For each attacking type, count resistances and weaknesses
      this.summary = this.allTypes.map((type) => {
        let resistant = 0;
        let weak = 0;
        for (const eff of effectivenessList) {
          if (eff[type] < 1) resistant++;
          else if (eff[type] > 1) weak++;
        }
        return { type, resistant, weak };
      });
    } catch (e) {
      this.error = 'Failed to fetch Pokémon data.';
    }
    this.loading = false;
  }

  async calculateEffectiveness(types: string[]): Promise<TypeEffectiveness> {
    const eff: TypeEffectiveness = {};
    this.allTypes.forEach(type => eff[type] = 1);
    const typeDatas: any[] = await Promise.all(
      types.map(type => this.http.get(`https://pokeapi.co/api/v2/type/${type}`).toPromise())
    );
    for (const typeData of typeDatas) {
      for (const rel of typeData.damage_relations.double_damage_from) {
        eff[rel.name] *= 2;
      }
      for (const rel of typeData.damage_relations.half_damage_from) {
        eff[rel.name] *= 0.5;
      }
      for (const rel of typeData.damage_relations.no_damage_from) {
        eff[rel.name] *= 0;
      }
    }
    return eff;
  }

  // --- HEATMAP COLOR HELPERS ---
  getResistColor(count: number): string {
    // Green heatmap: more resistance = deeper green
    if (count === 0) return '';
    const max = this.team.filter(Boolean).length;
    const intensity = Math.round(60 + (180 * count / (max || 1))); // 60 to 240 hue
    return `hsl(${intensity}, 80%, 70%)`;
  }
  getWeakColor(count: number): string {
    // Red heatmap: more weakness = deeper red
    if (count === 0) return '';
    const max = this.team.filter(Boolean).length;
    const intensity = Math.round(0 + (20 * count / (max || 1))); // 0 to 20 hue (red)
    return `hsl(${intensity}, 90%, 75%)`;
  }
}
