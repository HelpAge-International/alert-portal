export class Pair {

  public f: any;
  public s: any;

  constructor(first, second) {
    this.f = first;
    this.s = second;
  }

  public static create(first, second): Pair {
    return new Pair(first, second);
  }
}
