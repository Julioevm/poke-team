import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-team-summary',
  standalone: true,
  templateUrl: './team-summary.component.html',
  styleUrls: ['./team-summary.component.scss']
})
export class TeamSummaryComponent {
  @Input() team: string[] = [];
  // TODO: Summarize the team's overall type strengths and weaknesses
}
