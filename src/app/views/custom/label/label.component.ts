import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'label',
  standalone: true,
  imports: [NgClass],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss'
})
export class LabelComponent {

  @Input() label: string = '';
  @Input() value: string | number | Date | null;

  @Input() classNameLabel: string
  @Input() classNameText: string
  
}
