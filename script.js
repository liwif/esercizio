let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
let req = new XMLHttpRequest()
req.open('GET', url, true)

let data 
let values = []

let heightScale
let xScale
let xAxisScale
let yAxisScale

let width = 800
let height = 500
let padding = 40

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', width);
    svg.attr('height', height);
}

let generateScales = () => {
    heightScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
        return item[1];
    })])
                    .range([0, height - (2*padding)])
    xScale = d3.scaleLinear()
               .domain([0, values.length -1])
               .range([padding, width -padding])
    let datesArray = values.map((item) => {
        return new Date(item[0]);
    })
    xAxisScale = d3.scaleTime()
                   .domain([d3.min(datesArray), d3.max(datesArray)])
                   .range([padding, width - padding])
    yAxisScale = d3.scaleLinear()
                   .domain([0, d3.max(values, (item) => {
                    return item[1];
                   })])
                   .range([height-padding, padding])
}

let drawBars = () => {

    svg.selectAll('rect')
       .data(values)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('width', (width - (2 * padding)) / values.length)
       .attr('data-date', (item) => {
        return item[0]
       })
       .attr('data-gdp', (item) => {
        return item[1]
       })
       .attr('height', (item) => {
        return heightScale(item[1])
       })
       .attr('x', (item, index) => {
        return xScale(index)
       })
       .attr('y', (item) => {
        return (height - padding) - heightScale(item[1])
       }) 
       .on('mouseover', (event, item) => {
        d3.select('body')
          .append('div')
          .attr('id', 'tooltip')
          .attr('data-date', item[0])
          .text(item[0])
       })
       .on('mouseleave', () => {
        d3.select('body').select('#tooltip').remove()
       })
}



let generateAxis = () => {
    
    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)
    
    svg.append('g')
       .call(xAxis)
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0, ' + (height-padding) + ')')
    svg.append('g')
       .call(yAxis)
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + (padding) + ', 0)')
}

req.onload = () => {
    data = JSON.parse(req.responseText);
    values = data.data;
    console.log(values);
    drawCanvas();
    generateScales();
    drawBars();
    generateAxis();
}
req.send()
