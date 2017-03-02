function renderChoroplethMap(eduData, geoData) {
  console.log(eduData);
  console.log(geoData);

  const width = 1000;
  const height = 800;
  const margin = { top: 40, right: 20, bottom: 80, left: 80 };

  function countyColour(num) {
    let colour;

    const keyArr = [
      { rateLower: 0, rateHigher: 19, colour: '#DEFFD6' },
      { rateLower: 20, rateHigher: 39, colour: '#B0E6A0' },
      { rateLower: 40, rateHigher: 59, colour: '#83CE6B' },
      { rateLower: 60, rateHigher: 79, colour: '#55B635' },
      { rateLower: 80, rateHigher: 100, colour: '#289E00' }
    ];

    keyArr.forEach((key) => {
      if (num >= key.rateLower && num <= key.rateHigher) {
        colour = key.colour;
      }
    });

    return colour;
  }

  console.log(countyColour(10))

  // append svg to DOM
  const svg = d3.select('.svg-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // append counties to svg
  svg.append('g')
    .selectAll('path')
    .data(topojson.feature(geoData, geoData.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('stroke', 'black')
    .attr('stroke-width', '0.1')
    .attr('data-fips', (d) => d.id)
    .attr('data-education', (d) => {
      let bachelorsOrHigher;

      eduData.forEach((county) => {
        if (d.id === county.fips) {
          bachelorsOrHigher = county.bachelorsOrHigher;
        }
      });

      return (!bachelorsOrHigher) ? 'No educational data available' : bachelorsOrHigher;
    })
    .style('fill', (d) => {
      let bachelorsOrHigher;

      eduData.forEach((county) => {
        if (d.id === county.fips) {
          bachelorsOrHigher = county.bachelorsOrHigher;
        }
      });

      return (!bachelorsOrHigher) ? '#FFFFFF' : countyColour(bachelorsOrHigher);
    })
    .attr('d', d3.geoPath())
    .on('mouseover', (d) => {
      // show tooltip when user hovers over bar and dynamically allocate attributes
      tooltip
        .style('left', 400)
        .style('top', 100)
        .html(
          ``
        )
        .transition()
        .duration(200)
        .style('opacity', .9)
    })
    .on("mouseout", (d) => {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0)
    })

  // append state lines to svg



}

const eduUrl = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
const countyUrl = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';

$.getJSON(eduUrl, (eduData) => {
    $.getJSON(countyUrl, (countyData) => renderChoroplethMap(eduData, countyData));
});
