"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColourSelector = (function () {
    function ColourSelector(cssName, colorCode) {
        this.colorCode = colorCode;
        this.cssName = cssName;
    }
    ColourSelector.list = function () {
        var cols = [];
        cols.push(new ColourSelector("Color__swatch pal__red", "#D0011B"));
        cols.push(new ColourSelector("Color__swatch pal__orange", "#F6A623"));
        cols.push(new ColourSelector("Color__swatch pal__yellow", "#F8E81C"));
        cols.push(new ColourSelector("Color__swatch pal__green", "#7ED321"));
        cols.push(new ColourSelector("Color__swatch pal__blue", "#4990E2"));
        cols.push(new ColourSelector("Color__swatch pal__turquoise", "#50E3C2"));
        cols.push(new ColourSelector("Color__swatch pal__light-red", "#EA5166"));
        cols.push(new ColourSelector("Color__swatch pal__dark-blue", "#64929B"));
        cols.push(new ColourSelector("Color__swatch pal__dark-green", "#417505"));
        cols.push(new ColourSelector("Color__swatch pal__purple", "#BD0FE1"));
        cols.push(new ColourSelector("Color__swatch pal__light-green", "#B8E986"));
        cols.push(new ColourSelector("Color__swatch pal__indigo", "#9012FE"));
        return cols;
    };
    return ColourSelector;
}());
exports.ColourSelector = ColourSelector;
