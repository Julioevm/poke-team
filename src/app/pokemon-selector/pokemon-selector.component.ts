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
  filteredList: string[] = [];
  selected: string[] = [];
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
    this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=151').subscribe({
      next: (data) => {
        this.pokemonList = data.results.map((p: any) => this.capitalize(p.name));
        this.filteredList = this.pokemonList;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load Pokémon list.';
        this.loading = false;
      }
    });
  }

  toggleSelect(name: string) {
    if (this.selected.includes(name)) {
      this.selected = this.selected.filter(p => p !== name);
    } else if (this.selected.length < 6) {
      this.selected = [...this.selected, name];
    }
    this.pokemonSelected.emit(this.selected);
    this.filter = '';
    this.filterList();
    this.dropdownOpen = false;
  }

  isSelected(name: string): boolean {
    return this.selected.includes(name);
  }

  capitalize(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  filterList() {
    const filterLower = this.filter.toLowerCase();
    this.filteredList = this.pokemonList.filter(name =>
      name.toLowerCase().includes(filterLower) && !this.selected.includes(name)
    );
  }

  onInputFocus() {
    this.dropdownOpen = true;
    this.filterList();
  }

  onInputBlur() {
    setTimeout(() => this.dropdownOpen = false, 150); // Delay so click can register
  }
}
