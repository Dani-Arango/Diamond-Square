import { matrizType } from '../types/matriz.type';

export class DiamondSquare {
  private randomLimit: number;
  private matrizLenght: number;

  // Inicializa los parametros
  constructor(N: number) {
    this.matrizLenght = Math.pow(2, N) + 1;
    this.randomLimit = 1000;
  }

  // Asigna el nuevo tamaño de la matriz
  public setMatrizLenght(N: number) {
    this.matrizLenght = Math.pow(2, N) + 1;
  }

  // Obtiene le tamaño del arreglo de la matriz
  public get getMatrizLenght() {
    return this.matrizLenght;
  }

  // Funcion publica de la clase para obtener la matriz con el algoritmo
  public generateDiamondSquare() {
    let matriz = this.generateMatriz();
    matriz = this.startAlgorithm(matriz);

    return matriz;
  }

  // Genera un numero aleatorio con un limite establecido
  private randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Genera una matriz tridimensional y asigna un numero random a cada esquina de la matriz
  private generateMatriz(): matrizType {
    const size = this.matrizLenght;
    const matriz = new Array(size).fill([]).map((_) => new Array(size).fill(0));
    matriz[0][0] = this.randomNumber(1, this.randomLimit);
    matriz[0][size - 1] = this.randomNumber(1, this.randomLimit);
    matriz[size - 1][0] = this.randomNumber(1, this.randomLimit);
    matriz[size - 1][size - 1] = this.randomNumber(1, this.randomLimit);

    return matriz;
  }

  // Normaliza los valores de la matriz
  private normalizeMatrix(matrix: matrizType) {
    const maxValue = matrix.reduce((max, row) => {
      return row.reduce((max, value) => Math.max(value, max));
    }, -Infinity);

    return matrix.map((row) => {
      return row.map((val) => val / maxValue);
    });
  }

  // Ejecuta el algoritmo de diamond square para generar el terreno
  private startAlgorithm(matriz: matrizType): matrizType {
    let iterableCount = this.matrizLenght - 1;
    let randomFactor = this.randomLimit;

    for (let i = iterableCount; i > 1; i /= 2) {
      matriz = this.calculateDiamond(matriz, i, randomFactor);
      matriz = this.calculateSquare(matriz, i, randomFactor);

      randomFactor /= 2;
    }

    return this.normalizeMatrix(matriz);
  }

  // Obtiene la posicion del diamante y calcula su media sumada a un numero random
  private calculateDiamond(
    matriz: matrizType,
    currentSize: number,
    randomFactor: number
  ): matrizType {
    const halfSize = Math.floor(currentSize / 2);

    for (let y = 0; y < matriz.length - currentSize; y += currentSize) {
      for (let x = 0; x < matriz[y].length - currentSize; x += currentSize) {
        const topLeft = matriz[y][x];
        const topRight = matriz[y][x + currentSize];
        const bottomLeft = matriz[y + currentSize][x];
        const bottomRight = matriz[y + currentSize][x + currentSize];

        // Calculamos el valor del centro
        matriz[y + halfSize][x + halfSize] =
          (topLeft + topRight + bottomLeft + bottomRight) / 4 +
          this.randomNumber(-randomFactor, randomFactor);
      }
    }

    return matriz;
  }

  // Obtiene la posicion del cuadrado y calcula su media sumada a un numero random
  private calculateSquare(
    matriz: matrizType,
    currentSize: number,
    randomFactor: number
  ): matrizType {
    const half = currentSize / 2;

    for (let y = 0; y < matriz.length; y += half) {
      for (
        let x = (y + half) % currentSize;
        x < matriz.length;
        x += currentSize
      ) {
        const left = matriz[y]?.[x - half] ?? 0;
        const right = matriz[y]?.[x + half] ?? 0;
        const top = matriz[y - half]?.[x] ?? 0;
        const bottom = matriz[y + half]?.[x] ?? 0;

        const values = [top, left, right, bottom].filter((val) => val !== 0);
        const count = values.length;

        if (count > 2) {
          const average = values.reduce((sum, val) => sum + val, 0) / count;
          matriz[y][x] =
            average + this.randomNumber(-randomFactor, randomFactor);
        }
      }
    }

    return matriz;
  }
}
