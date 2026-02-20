import { Component } from '@angular/core';
import { CardLodging } from "../../components/card-lodging/card-lodging";
import { SearchEngine } from "./../../components/search-engine/search-engine";


@Component({
  selector: 'app-dashboard',
  imports: [CardLodging, SearchEngine],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
 })
export class Dashboard {
}
