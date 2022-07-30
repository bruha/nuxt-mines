import { Ref, ref } from 'vue';

export interface Coords {
  col: number;
  row: number;
}

export interface Cell {
  isOpened: Ref<boolean>;
  hasBomb: Ref<boolean>;
  hasFlag: Ref<boolean>;
  bombsNear: Ref<number | null>;
  coords: Coords;
}

export type Field = Cell[];

export class Game {
  private static instance: Game;
  private constructor() {}
  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }
  private field: Field = reactive([]);
  private cols: number;
  private rows: number;
  private isFailed: Ref<boolean> = ref(false);

  public getField(): Field {
    return this.field;
  }
  public getFailedStatus(): Ref<boolean> {
    return this.isFailed;
  }
  public init(cols: number, rows: number, bombs: number): Game {
    this.cols = cols;
    this.rows = rows;
    this.field = Array.from({ length: cols * rows }, (_el, i) => ({
      isOpened: ref(false),
      hasBomb: ref(false),
      hasFlag: ref(false),
      bombsNear: ref(0),
      coords: {
        col: i % cols,
        row: Math.floor(i / cols),
      },
    }));
    return this.placeBombs(bombs);
  }
  public openCell(coords: Coords, options = { isForced: false }): void {
    const cell = this.getCell(coords);
    if (!cell) return;
    cell.isOpened.value = true;
    if (cell.hasBomb.value) {
      this.isFailed.value = true;
      return;
    }
    let nearest: Cell[];
    if (cell.bombsNear.value === 0 || options.isForced) {
      nearest = this.getNearestCells(coords);
      if (options.isForced) {
        nearest
          .filter((cell) => !cell.isOpened.value && !cell.hasFlag.value)
          .forEach((cell) => {
            this.openCell(cell.coords);
          });
      } else {
        nearest
          .filter((cell) => !cell.isOpened.value)
          .forEach((cell) => {
            if (!cell.hasBomb.value) this.openCell(cell.coords);
          });
      }
    }
  }
  public flagCell(coords: Coords): void {
    const cell = this.getCell(coords);
    if (cell && !cell.isOpened.value) {
      cell.hasFlag.value = !cell.hasFlag.value;
    }
  }

  private placeBombs(bombs: number): Game {
    let cellsWithoutBomb: number = this.field.length;
    for (let i = 0; i < bombs; i++) {
      const newBombIndex: number = Math.floor(Math.random() * cellsWithoutBomb);
      this.placeBombByIndex(newBombIndex);
      cellsWithoutBomb--;
    }
    return this.calculateNumbers();
  }
  private placeBombByIndex(index: number): Game {
    while (this.field[index].hasBomb.value && index < this.field.length - 1)
      index++;
    this.field[index].hasBomb.value = true;
    this.field[index].bombsNear.value = null;
    return this;
  }
  private getNearestCells({ col, row }: Coords): Cell[] {
    return [
      this.getCell({ col: col - 1, row: row - 1 }),
      this.getCell({ col, row: row - 1 }),
      this.getCell({ col: col + 1, row: row - 1 }),
      this.getCell({ col: col - 1, row }),
      this.getCell({ col: col + 1, row }),
      this.getCell({ col: col - 1, row: row + 1 }),
      this.getCell({ col, row: row + 1 }),
      this.getCell({ col: col + 1, row: row + 1 }),
    ].filter((cell) => cell != null);
  }
  private calculateNumbers(): Game {
    this.field.forEach((cell: Cell, i: number) => {
      if (!cell.hasBomb.value) {
        cell.bombsNear.value = this.getNearestCells(cell.coords).reduce(
          (sum, cell) => {
            if (cell.hasBomb.value) sum++;
            return sum;
          },
          0
        );
      }
    });
    return this;
  }
  private getCell(coords: Coords): Cell | null {
    if (
      coords.col < 0 ||
      coords.col >= this.cols ||
      coords.row < 0 ||
      coords.row >= this.rows
    ) {
      return null;
    } else {
      return this.field[coords.row * this.rows + coords.col];
    }
  }
}
