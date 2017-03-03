function renderChoroplethMap(eduData, geoData) {

  // set up required dimensions
  const width = 1000;
  const height = 700;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const legendRectHeight = 20;
  const legendRectWidth = 50;
  const legendX = 550;
  const legendTextX = legendX + legendRectWidth / 2;

  // set up legend colour ranges
  const legendArr = [
    { rateLower: 0, rateHigher: 20, colour: '#9EB5FF' },
    { rateLower: 20, rateHigher: 40, colour: '#7689F2' },
    { rateLower: 40, rateHigher: 60, colour: '#4F5EE5' },
    { rateLower: 60, rateHigher: 80, colour: '#2732D8' },
    { rateLower: 80, rateHigher: 100, colour: '#0007CC' }
  ];

  // function that returns colour after inputting number
  function countyColour(num) {
    let colour;

    legendArr.forEach((obj) => {
      if (num >= obj.rateLower && num < obj.rateHigher) {
        colour = obj.colour;
      }
    });

    return colour;
  }

  // set up tooltip div
  const tooltip = d3.select('body').append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('opacity', 0)

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
    .attr('data-education', function(d) {
      
      // iterate through eduData, return appropriate data-education value and set location attr
      let bachelorsOrHigher;

      eduData.forEach((county) => {
        if (d.id === county.fips) {
          d3.select(this).attr('location', `${county.area_name}, ${county.state}`)
          bachelorsOrHigher = county.bachelorsOrHigher;
        }
      });

      return bachelorsOrHigher ? bachelorsOrHigher : -1;
    })
    .style('fill', function(d) {
      const bachelorsOrHigher = d3.select(this).attr('data-education')

      return countyColour(bachelorsOrHigher);
    })
    .attr('d', d3.geoPath())
    .on('mouseover', function(d) {
      const mouse = d3.mouse(this);
      const location = d3.select(this).attr('location');
      const bachelorsOrHigher = d3.select(this).attr('data-education');
      // show tooltip when user hovers over bar and dynamically allocate attributes
      tooltip
        .style('left', `${mouse[0] + 165}px`)
        .style('top', `${mouse[1] - 70}px`)
        .attr('data-education', bachelorsOrHigher)
        .html(
          `<span class="tooltip-title">Location: </span>${location}<br>
          <span class="tooltip-title">Population with Bachelor's or Higher: </span>${bachelorsOrHigher}%`
        )
        .transition()
        .duration(200)
        .style('opacity', .9)
    })
    .on('mouseout', (d) => {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0)
    })

  // set up legend
  const legend = svg.selectAll('rect')
    .data(legendArr)
    .enter()
    .append('g')
    .attr('id', 'legend')
    .append('rect')
    .attr('x', (d, i) => legendRectWidth * i + legendX)
    .attr('y', height - margin.bottom - margin.top)
    .attr('width', legendRectWidth)
    .attr('height', legendRectHeight)
    .style('fill', (d) => countyColour(d.rateLower))
    .attr('stroke', 'black')
    .attr('stroke-width', 0.3)

  // add legend labels
  const legendText = svg.selectAll('text')
  .data(legendArr)
    .enter()
    .append('text')
    .text((d) => `${d.rateLower}-${d.rateHigher}%`)
    .attr('x', (d, i) => legendRectWidth * i + legendTextX)
    .attr('y', height - margin.bottom - margin.top + legendRectHeight + legendRectHeight / 2)
    .style('text-anchor', 'middle')
    .style('font-size', '10px')
}

const eduUrl = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
const countyUrl = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';

$.getJSON(eduUrl, (eduData) => {
    $.getJSON(countyUrl, (countyData) => renderChoroplethMap(eduData, countyData));
});
