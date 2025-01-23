import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  [x: string]: any;
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  getCurrentSearchTerm(): string {
    return this.searchTermSubject.value;
  }

  updateSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }
}
