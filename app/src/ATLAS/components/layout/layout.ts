import { Component } from '@angular/core';
import { Footer } from "../footer/footer";
import { RouterOutlet } from "@angular/router";
import { Navbar } from "../navbar/navbar";
import { Loading } from "../loading/loading";

@Component({
  selector: 'app-layout',
  imports: [Footer, RouterOutlet, Navbar, Loading],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
