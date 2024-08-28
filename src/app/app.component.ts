import { RouterOutlet } from '@angular/router';
import { matrizType } from './types/matriz.type';
import { TreeJsComponent } from './tree-js/tree-js.component';
import { DiamondSquare } from './diamond-square/diamond-square';
import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TreeJsComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private canvas?: HTMLCanvasElement;
  private context?: CanvasRenderingContext2D;
  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;

  private diamondSquare: DiamondSquare = new DiamondSquare(8);
  public canvasWidth: number = 600;
  public canvasHeight: number = 250;

  private pxWidth = this.canvasWidth / this.diamondSquare.getMatrizLenght;
  private pxHeight = this.canvasHeight / this.diamondSquare.getMatrizLenght;

  public matriz: matrizType = this.diamondSquare.generateDiamondSquare();

  public form: FormGroup = new FormGroup({
    N: new FormControl('8', [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
    ]),
  });

  // Ejecuta el algoritmo principal
  ngOnInit(): void {
    this.canvas = this.myCanvas.nativeElement;
    if (!this.canvas) return;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this.context = this.canvas!.getContext('2d')!;

    this.createGraphics(true);
  }

  // Crea un nuevo terreno
  public createGraphics(firstTime = false) {
    if (this.form.invalid) return alert('Formulario invalido');
    if (!firstTime) {
      this.updateVars();
    }
    this.drawCanvas();
  }

  // Actualiza las variables en base a los datos del formulario
  private updateVars() {
    if (this.form.invalid) return;
    this.diamondSquare = new DiamondSquare(this.form.get('N')?.value);
    this.pxWidth = this.canvasWidth / this.diamondSquare.getMatrizLenght;
    this.pxHeight = this.canvasHeight / this.diamondSquare.getMatrizLenght;
    this.matriz = this.diamondSquare.generateDiamondSquare();
  }

  public drawCanvas() {
    if (this.context) {
      this.context.clearRect(
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height
      );

      this.matriz.forEach((element, y) => {
        element.forEach((data, x) => {
          const hsl = this.getColor(data);
          this.context!.fillStyle = hsl;
          this.context!.fillRect(
            x * this.pxWidth,
            y * this.pxHeight,
            this.pxWidth,
            this.pxHeight
          );
        });
      });
    }
  }

  getColor(num: number) {
    let lightness = 50 + num * 30;

    let height = Math.round(num * 100);

    // Define los límites del degradado para hue
    let maxHue = 240;
    let minHue = 180;
    let saturation = 100;

    if (height >= 15 && height <= 30) {
      maxHue = 20;
      minHue = 20;
    } else if (height > 30) {
      maxHue = 115;
      minHue = 115;

      lightness = 10 + num * 20;

      if (height < 50) saturation = 60;
      else if (height < 80) {
        saturation = 40;
        lightness = 10 + num * 10;
      } else saturation = 40;
    }

    let hue = maxHue - maxHue * num * 2;

    hue = Math.max(minHue, Math.min(hue, maxHue));
    if (num > 1.2) {
      lightness = num < 1.4 ? 80 : 100;
      hue = 0;
      saturation = 0;
    }

    lightness = Math.max(0, Math.min(100, lightness));
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
}
