import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface TypeEffectiveness {
  [type: string]: number;
}

@Component({
  selector: 'app-type-chart',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './type-chart.component.html',
  styleUrls: ['./type-chart.component.scss']
})
export class TypeChartComponent implements OnChanges {
  @Input() pokemonName?: string;
  types: string[] = [];
  effectiveness: TypeEffectiveness = {};
  loading = false;
  error = '';
  spriteUrl?: string;
  allTypes: string[] = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
    'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];
  showAll = false;
  showChart = false;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pokemonName'] && this.pokemonName) {
      this.fetchTypeData();
    }
  }

  fetchTypeData() {
    this.loading = true;
    this.error = '';
    this.types = [];
    this.effectiveness = {};
    this.spriteUrl = undefined;
    if (!this.pokemonName) {
      this.loading = false;
      return;
    }
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${this.pokemonName.toLowerCase()}`)
      .subscribe({
        next: (data) => {
          this.types = data.types.map((t: any) => t.type.name);
          this.spriteUrl = data.sprites?.front_default || undefined;
          this.calculateEffectiveness();
        },
        error: () => {
          this.error = 'Could not fetch Pokémon type.';
          this.loading = false;
        }
      });
  }

  calculateEffectiveness() {
    const typeRequests = this.types.map(type =>
      this.http.get<any>(`https://pokeapi.co/api/v2/type/${type}`)
    );
    Promise.all(typeRequests.map(req => req.toPromise())).then((typeDatas: any[]) => {
      this.allTypes.forEach(type => this.effectiveness[type] = 1);
      for (const typeData of typeDatas) {
        for (const rel of typeData.damage_relations.double_damage_from) {
          this.effectiveness[rel.name] *= 2;
        }
        for (const rel of typeData.damage_relations.half_damage_from) {
          this.effectiveness[rel.name] *= 0.5;
        }
        for (const rel of typeData.damage_relations.no_damage_from) {
          this.effectiveness[rel.name] *= 0;
        }
      }
      this.loading = false;
    }).catch(() => {
      this.error = 'Could not fetch type effectiveness.';
      this.loading = false;
    });
  }

  get displayedTypes(): string[] {
    if (this.showAll) return this.allTypes;
    return this.allTypes.filter(type => this.effectiveness[type] !== 1);
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  onMouseEnter() {
    this.showChart = true;
  }

  onMouseLeave() {
    this.showChart = false;
  }
}
