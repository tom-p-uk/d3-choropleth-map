function renderChoroplethMap(eduData, geoData) {
  console.log(eduData);
  console.log(geoData);

  const width = 1000;
  const height = 800;
  const margin = { top: 40, right: 20, bottom: 80, left: 80 };

  // append svg to DOM
  const svg = d3.select('.svg-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // append counties to svg
  svg.append('g')
    .selectAll('path')
    .data(topojson.feature(geoData, geoData.objects.counties).features, eduData)
    .enter()
    .append('path')
    .attr('class', 'county')
    .style('fill', 'green')
    .attr('d', d3.geoPath())

  // append state lines to svg



}

const eduUrl = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
const countyUrl = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';

$.getJSON(eduUrl, (eduData) => {
    $.getJSON(countyUrl, (countyData) => renderChoroplethMap(eduData, countyData));
});
