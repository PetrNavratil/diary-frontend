import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  menuItems: any[] = [
    {
      name: 'My books',
      link: 'books'
    },
    {
      name: 'Improved search',
      link: 'search'
    },
    {
      name: 'Book detail',
      link: 'detail'
    },
    {
      name: 'Shelves',
      link: 'shelves'
    },
    {
      name: 'Statistics',
      link: 'statistics'
    },
    {
      name: 'Profile',
      link: 'profile'
    }
  ];

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  logout() {
    localStorage.clear();
    location.reload();
  }

}
