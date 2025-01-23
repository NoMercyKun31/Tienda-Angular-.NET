import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {
  showWelcome = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.showWelcome = true;
    }, 300);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
