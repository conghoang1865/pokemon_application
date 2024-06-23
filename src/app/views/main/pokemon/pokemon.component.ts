import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Meta, PokemonItem, TypeData } from '../../../models/pokemon.model';
import { Store } from '../../../services/base.service';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Observable, filter, find, map, of, switchMap, take, tap } from 'rxjs';
import { SpinnerComponent } from '../../custom/spinner/spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { LabelComponent } from '../../custom/label/label.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [
    MatFormFieldModule,
    NgIf,
    AsyncPipe,
    NgFor,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    SpinnerComponent,
    MatProgressBarModule,
    NgClass,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    LabelComponent,
    DatePipe,
    MatIcon,
    MatButton,
    MatTable
  ],
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.scss'
})

export class PokemonComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  sortState = {
    active: 'number',
    direction: 'asc'
  }
  current_page: number = 1
  current_page_size: number = 10
  list_type: any
  typeText: string | null

  // filter
  pokemonDetail$: Observable<PokemonItem | undefined>
  pokemonImage: string
  ListSelectTypes$: Observable<TypeData[]>
  selectedValue: number | undefined

  private filterSubject = new BehaviorSubject<FilterParams>({
    page: this.current_page,
    pageSize: this.current_page_size,
    sortState: this.sortState
  });

  constructor(public store: Store, private modal: NgbModal, private sanitizer: DomSanitizer) {
  }

  columns = [
    {
      columnDef: 'Number',
      header: 'Number',
      cell: (element: PokemonItem) => `${element.number}`,
      className: ''
    },
    {
      columnDef: 'Id',
      header: 'Id',
      cell: (element: PokemonItem) => `${element.id}`,
      className: ''
    },
    {
      columnDef: 'Name',
      header: 'Name',
      cell: (element: PokemonItem) => `${element.name}`,
      className: ''
    },
    {
      columnDef: 'Speed',
      header: 'Speed',
      cell: (element: PokemonItem) => `${element.speed}`,
      className: ''
    },
    {
      columnDef: 'Total',
      header: 'Total',
      cell: (element: PokemonItem) => `${element.total}`,
      className: ''
    },
    {
      columnDef: 'HP',
      header: 'HP',
      cell: (element: PokemonItem) => `${element.hp}`,
      className: 'text-success'
    },
    {
      columnDef: 'Attack',
      header: 'Attack',
      cell: (element: PokemonItem) => `${element.attack}`,
      className: 'text-danger'
    },
    {
      columnDef: 'Defense',
      header: 'Defense',
      cell: (element: PokemonItem) => `${element.defense}`,
      className: 'text-primary'
    },
    {
      columnDef: 'Sp_atk',
      header: 'Sp_atk',
      cell: (element: PokemonItem) => `${element.sp_atk}`,
      className: 'text-danger font-weight-bold'
    },
    {
      columnDef: 'Sp_def',
      header: 'Sp_def',
      cell: (element: PokemonItem) => `${element.sp_def}`,
      className: 'font-weight-italic text-primary'
    },
  ];

  dataSource: Observable<PokemonItem[]>
  displayedColumns = this.columns.map(c => c.columnDef);

  ngOnInit() {
    this.ListSelectTypes$ = this.store.getListTypeData()

    this.dataSource = this.filterSubject.asObservable().pipe(
      tap(() => this.store._isLoading$.next(true)),
      switchMap(({ page, pageSize, sortState, type }) =>
        this.store.getListPokemon(page, pageSize, sortState.direction, sortState.active, type)
      ),
      tap(() => this.store._isLoading$.next(false))
    );

    this.applyFilterPokemonType();

    this.list_type = localStorage.getItem('types')
    if (this.list_type) {
      this.list_type = JSON.parse(this.list_type)
    }
  }


  sortChange(sort: Sort) {
    this.sortState = {
      active: sort.active.toLowerCase(),
      direction: sort.direction.toLowerCase()
    };
    const currentFilter = this.filterSubject.value;
    this.filterSubject.next({
      ...currentFilter,
      page: this.current_page,
      sortState: this.sortState
    });
  }

  getPokemonDetail(data: string, content: any) {
    this.pokemonDetail$ = this.store.getPokemonDetail(data)
    this.pokemonImage = this.store.getPokemonSprite(data)
    this.modal.open(content, {
      size: 'sm'
    })
  }


  returnPokemonTypeText(type: number) {
    let x = this.list_type.find((el: any) => el.id === type)
    return type = x.name
  }

  applyFilterPokemonType(id?: number) {
    const currentFilter = this.filterSubject.value;
    this.filterSubject.next({
      ...currentFilter,
      page: 1,
      type: id
    })

    if (id) {
      let x = this.list_type.find((el: any) => el.id === id)
      this.typeText = x.name
    }
  }

  onPageChange(event: PageEvent) {
    const currentFilter = this.filterSubject.value;
    this.current_page = event.pageIndex + 1;
    this.filterSubject.next({ ...currentFilter, page: this.current_page });
  }

  deleteFilterPokemonType() {
    this.selectedValue = undefined
    this.typeText = null
    this.sortState = { active: 'number', direction: 'asc' }
    this.filterSubject.next({
      page: 1,
      pageSize: this.current_page_size,
      sortState: this.sortState,
      type: undefined
    });
  }

  ngOnDestroy(): void {
  }
}

export interface FilterParams {
  page: number;
  pageSize: number;
  sortState: { active: string; direction: string };
  type?: number;
}