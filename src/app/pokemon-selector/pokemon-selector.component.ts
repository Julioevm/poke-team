import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './pokemon-selector.component.html',
  styleUrls: ['./pokemon-selector.component.scss']
})
export class PokemonSelectorComponent implements OnInit {
  @Output() pokemonSelected = new EventEmitter<string[]>();
  pokemonList: string[] = [];
  loading = false;
  error = '';
  filter = '';
  dropdownOpen = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPokemonList();
  }

  fetchPokemonList() {
    this.loading = true;
    this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=1500').subscribe({
      next: (data) => {
        this.pokemonList = data.results.map((p: any) => this.capitalize(p.name));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load Pokémon list.';
        this.loading = false;
      }
    });
  }

  toggleSelect(name: string) {
    this.pokemonSelected.emit(this.pokemonList);
    this.filter = '';
    this.dropdownOpen = false;
  }

  capitalize(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  onInputFocus() {
    this.dropdownOpen = true;
  }

  onInputBlur() {
    setTimeout(() => this.dropdownOpen = false, 150); // Delay so click can register
  }
}
