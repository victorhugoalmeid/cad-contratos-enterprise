import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `<mat-toolbar color="primary"><span>Cadastro de Contratos (Enterprise Case)</span><span class="spacer"></span><a mat-button href="https://github.com" target="_blank">GitHub</a></mat-toolbar><router-outlet/>`,
  styles: [`.spacer{flex:1}`]
}) export class AppComponent {}
