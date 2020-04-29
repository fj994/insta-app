import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ValueTransformer } from '@angular/compiler/src/util';
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

          if (res.hashtags) {
            this.hashtags = [...res.hashtags];
            this.dropDownShow = true;
          } else if (res.users) {
            this.users = [...res.users];
            this.dropDownShow = true;
          }
        });
      } else {
        this.clearResults();
      }
    })
  }

  onDocumentClick() {
    if (this.dropDownShow) this.dropDownShow = false;
  }

  clearResults() {
    this.hashtags = [];
    this.users = [];
  }

  onUserClick(id, input) {
    this.resetInput(input);
    this.router.navigate(['/profile', id]);
  }

  onHashtagClick(hashtag, input) {
    this.resetInput(input);
    this.router.navigate(['/hashtag', hashtag]);
  }

  resetInput(input) {
    input.value = '';
    this.searchValueChange.next('');
  }
}
