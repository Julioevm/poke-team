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
  focusedSlot: number = 0;

  onPokemonSelected(selected: string[]) {
    // Set the selected pokemon to the focused slot and move focus to next empty slot
    if (selected && selected.length > 0) {
      const newTeam = [...this.team];
      newTeam[this.focusedSlot] = selected[selected.length - 1];
      this.team = newTeam;
      // Move focus to next empty slot
      let next = this.team.findIndex((p, i) => !p && i > this.focusedSlot);
      if (next === -1) {
        next = this.team.findIndex((p) => !p);
      }
      this.focusedSlot = next !== -1 ? next : this.focusedSlot;
    }
  }

  onSlotClick(index: number) {
    this.focusedSlot = index;
  }
}
