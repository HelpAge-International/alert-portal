export class HazardImages {
  public static red_ending: string = "_red.svg";
  public static yellow_ending: string = "_amber.svg";
  public static info: string = "/assets/images/hazards/marker/";

  public getMap() {
    let map = new Map<number, string>();
    map.set(0, "cold_wave");
    map.set(1, "conflict");
    map.set(2, "cyclone");
    map.set(3, "drought");
    map.set(4, "earthquake");
    map.set(5, "epidemic");
    map.set(6, "fire");
    map.set(7, "flash_flood");
    map.set(8, "flood");
    map.set(9, "heatwave");
    map.set(10, "heavy_rain");
    map.set(11, "humanitarian_access");
    map.set(12, "insect_infestation");
    map.set(13, "landslide_mudslide");
    map.set(14, "locust_infestation");
    map.set(15, "landslide_mudslide");
    map.set(16, "population_displacement");
    map.set(17, "population_return");
    map.set(18, "snow_avalanche");
    map.set(19, "snowfall");
    map.set(20, "storm");
    map.set(21, "storm_surge");
    map.set(22, "technological_disaster");
    map.set(23, "tornado");
    map.set(24, "tsunami");
    map.set(25, "violent_wind");
    map.set(26, "volcano");
    return map;
  }

  public static init() {
    return new HazardImages();
  }

  public get(int: number, isRed: boolean) {
    return HazardImages.info + this.getMap().get(int) + (isRed ? HazardImages.red_ending : HazardImages.yellow_ending);
  }
}
