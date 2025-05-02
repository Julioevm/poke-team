import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TeamBuilderComponent } from './team-builder/team-builder.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TeamBuilderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'poke-team';
}
