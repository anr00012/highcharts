import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterContentInit,AfterViewInit, OnDestroy{
  constructor(){
    console.log('constructor ejecutado')
  }
  ngOnInit(): void {
    console.log('ngOnInit  ejecutado')
  }
  ngAfterContentInit(): void {
    throw new Error('ngAfterContentInit ejecutado');
  }
  ngAfterViewInit(): void {
    throw new Error('ngAfterViewInit ejecutado');
  }
  ngOnDestroy(): void {
    throw new Error('ngOnDestroy ejecutado');
  }
    
    
}
