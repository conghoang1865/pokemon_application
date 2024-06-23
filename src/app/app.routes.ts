import { Routes } from '@angular/router';
import { HomeComponent } from './views/main/home/home.component';
import { PokemonComponent } from './views/main/pokemon/pokemon.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent

    },
    {
        path: "pokemon-list",
        component: PokemonComponent
    },
];
