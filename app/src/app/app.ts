import { Component, signal } from '@angular/core';
import { Loading } from "./components/loading/loading";
import { Navbar } from "./components/navbar/navbar";
import { RouterOutlet } from "@angular/router";
import { Footer } from "./components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [Loading, Navbar, RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('app');
}
