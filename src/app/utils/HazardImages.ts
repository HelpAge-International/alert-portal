export class HazardImages {
  public static ending: string = "_blue.svg";
  public static info: string = "/assets/images/hazards/marker/";

  private getMapOfSVG() {
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
  private getMapOfCSS() {
    let map = new Map<number, string>();
    map.set(0, "Icon--cold-wave");
    map.set(1, "Icon--conflict");
    map.set(2, "Icon--cyclone");
    map.set(3, "Icon--drought");
    map.set(4, "Icon--earthquake");
    map.set(5, "Icon--epidemic");
    map.set(6, "Icon--fire");
    map.set(7, "Icon--flash-flood");
    map.set(8, "Icon--flood");
    map.set(9, "Icon--heatwave");
    map.set(10, "Icon--heavy-rain");
    map.set(11, "Icon--humanitarian-access");
    map.set(12, "Icon--insect-infestation");
    map.set(13, "Icon--landslide-mudslide");
    map.set(14, "Icon--locust-infestation");
    map.set(15, "Icon--landslide-mudslide");
    map.set(16, "Icon--population-displacement");
    map.set(17, "Icon--population-return");
    map.set(18, "Icon--snow-avalanche");
    map.set(19, "Icon--snowfall");
    map.set(20, "Icon--storm");
    map.set(21, "Icon--storm-surge");
    map.set(22, "Icon--technological-disaster");
    map.set(23, "Icon--tornado");
    map.set(24, "Icon--tsunami");
    map.set(25, "Icon--violent-wind");
    map.set(26, "Icon--volcano");
    return map;
  }

  public static init() {
    return new HazardImages();
  }

  public get(int: number) {
    return HazardImages.info + this.getMapOfSVG().get(int) + HazardImages.ending;
  }

  public getHazard(key: number) {
    return "/assets/images/hazards/" + this.getMapOfCSS().get(key)  + ".svg";
  }

  public getCSS(int: number) {
    return this.getMapOfCSS().get(int);
  }
}
