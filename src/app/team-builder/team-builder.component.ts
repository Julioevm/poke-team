import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonSelectorComponent } from '../pokemon-selector/pokemon-selector.component';
import { TypeChartComponent } from '../type-chart/type-chart.component';
import { TeamSummaryComponent } from '../team-summary/team-summary.component';

@Component({
  selector: 'app-team-builder',
  standalone: true,
  imports: [CommonModule, PokemonSelectorComponent, TypeChartComponent, TeamSummaryComponent],
  templateUrl: './team-builder.component.html',
  styleUrls: ['./team-builder.component.scss']
})
export class TeamBuilderComponent {
  team: string[] = Array(6).fill(undefined);

  onPokemonSelected(selected: string[]) {
    // Fill up to 6 slots with selected Pokémon names
    this.team = [...selected.slice(0, 6), ...Array(6 - selected.length).fill(undefined)];
  }
}
