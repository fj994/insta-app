import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DataStorageService } from 'src/app/core/services/data-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  host: {
    '(document:click)': 'onDocumentClick()'
  }
})
export class SearchComponent implements OnInit {
  searchValueChange = new Subject<any>();
  dropDownShow = false;
  users = [];
  hashtags = [];

  constructor(private dataStorage: DataStorageService,
              private router: Router) { }

  ngOnInit() {
    this.searchValueChange.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((value: string) => {
      value = value.trim();

      if (value && value != '#') {
        this.dataStorage.getSearchResults(value).subscribe(res => {
          this.clearResults();

          if (res.hashtags && res.hashtags.length) {            
            this.hashtags = [...res.hashtags];
            this.dropDownShow = true;
          } else if (res.users && res.users.length) {
            this.users = [...res.users];
            this.dropDownShow = true;
          } else {
            this.dropDownShow = false;
          }
        });
      } else {
        this.clearResults();
        this.dropDownShow = false;
      }
    })
  }

  onDocumentClick(): void {
    if (this.dropDownShow) this.dropDownShow = false;
  }

  clearResults(): void {
    this.hashtags = [];
    this.users = [];
  }

  onUserClick(id, input): void {
    this.resetInput(input);
    this.router.navigate(['/profile', id]);
  }

  onHashtagClick(hashtag, input): void {
    this.resetInput(input);
    this.router.navigate(['/hashtag', hashtag]);
  }

  resetInput(input): void {
    input.value = '';
    this.searchValueChange.next('');
  }
}
