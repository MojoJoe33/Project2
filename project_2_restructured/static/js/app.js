
// Assigning Chart Window
var svgWidth = 700;
var svgHeight = 700;
var margin = {
  top: 150,
  right: 150,
  bottom: 150,
  left: 150
};

//Setting Width and Height of Chart
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Declare Chart Object
var svg = d3.select("#chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//Create Chart Group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Assigning Defaults
var yData = "Global_Sales"

// Import Data
d3.csv("static/salesdata/year_sales.csv").then(data => {

  // Parse Data/Cast as Numbers
    data.forEach(function(data) {
      data.Year = +data.Year;
      data.Global_Sales = +data.Global_Sales;
      // data.NA_Sales = +data.NA_Sales;
      // data.EU_Sales = +data.EU_Sales;
      // data.JP_sales = +data.JP_sales;
      // data.Other_Sales = +data.Other_Sales
    });

    // Create Scale Functions
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[yData])])
      .range([height, 0]);
    var xLinearScale = d3.scaleLinear()
      .domain([1980, d3.max(data, d => d.Year)])
      .range([0, width])

    //Adding Axes Lines
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var drawLine = d3
      .line()
      .x(data => xLinearScale(data.Year))
      .y(data => yLinearScale(data[yData]));
 
    //Append Axes to the chart
    chartGroup.append("path")
      .attr("d", drawLine(data))
      .classed("line", true);

    chartGroup.append("g")
      .classed("axis", true)
      .call(leftAxis);

    chartGroup.append("g")
      .classed("axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis.tickFormat(d3.format("d")));


    //Adding Y Axis Labels
    // chartGroup
    //   .append("text")
    //   .attr("y", 0 - margin.left + 130)
    //   .attr("x", 0 - (height / 2))
    //   .attr("data-name", "NA_Sales")
    //   .attr("data-axis", "y")
    //   .attr("class", "aText active y")
    //   .attr("transform", "translate(" + 0 + "," + 0 + ")rotate(-90)")
    //   .text("North America Sales (Millions)");

    // chartGroup
    //   .append("text")
    //   .attr("y", 0 - margin.left + 110)
    //   .attr("data-name", "EU_Sales")
    //   .attr("data-axis", "y")
    //   .attr("class", "aText active y")
    //   .attr("transform", "translate(" + 0 + "," + 0 + ")rotate(-90)")
    //   .text("Europe Sales (Millions)");
  
    // chartGroup
    //   .append("text")
    //   .attr("y", 0 - margin.left + 90)
    //   .attr("data-name", "JP_Sales")
    //   .attr("data-axis", "y")
    //   .attr("class", "aText inactive y")
    //   .attr("transform", "translate(" + 0 + "," + 0 + ")rotate(-90)")
    //   .text("Japan Sales (Millions)");
    
    // chartGroup
    //   .append("text")
    //   .attr("y", 0 - margin.left + 70)
    //   .attr("data-name", "Other_Sales")
    //   .attr("data-axis", "y")
    //   .attr("class", "aText inactive y")
    //   .attr("transform", "translate(" + 0 + "," + 0 + ")rotate(-90)")
    //   .text("Other Sales (Millions)");

    chartGroup
    .append("text")
      .attr("y", 0 - margin.left + 100)
      .attr("x", 0 - (height / 2))
      .attr("data-name", "Global_Sales")
      .attr("data-axis", "y")
      .attr("class", "aText inactive y")
      .attr("transform", "translate(" + 0 + "," + 0 + ")rotate(-90)")
      .text("Global Sales (Millions)");

    //Adding X Axis Labels
    chartGroup
      .append("text")
      // .attr("transform", "rotate(-90)")
      .attr("y", 435 - margin.left + 175)
      .attr("x", width / 2 - 30)
      .attr("dx", "1em")
      .attr("class", "axisText")
      .text("Year");
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Year");

    //Create Default Circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.Year))
      .attr("cy", d => yLinearScale(d[yData]))
      .attr("r", "2")
      .attr("fill", "black")
      .attr("opacity", "1");

    chartGroup.selectAll("text")
      .on("click", function() {
        var yValue = d3.select(this).attr("data-name");

        if (yValue !== yData) {
          yData = yValue

          var yColumn = data.map(d => d[yData]);

          yLinearScale = d3.scaleLinear()
          .domain([0, d3.max(yColumn)])
          .range([height, 0]);

          bottomAxis = d3.axisBottom(xLinearScale);
          leftAxis = d3.axisLeft(yLinearScale);

          drawLine = d3
            .line()
            .x(data => xLinearScale(data.Year))
            .y(yLinearScale);

            //Append Axes to the chart
            chartGroup.append("path")
            .attr("d", drawLine(data))
            .classed("line", true);

            chartGroup.append("g")
              .classed("axis", true)
              .call(leftAxis);

            chartGroup.append("g")
              .classed("axis", true)
              .attr("transform", `translate(0, ${height})`)
              .call(bottomAxis.tickFormat(d3.format("d")));

            circlesGroup = chartGroup.selectAll("circle")
              .data(data)
              .enter()
              .append("circle")
              .attr("cx", d => xLinearScale(d.Year))
              .attr("cy", yLinearScale)
              .attr("r", "2")
              .attr("fill", "black")
              .attr("opacity", "1");
          }
        });
  
    //Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Year: ${d.Year}<br>Global_Sales: ${d.Global_Sales}`);
      });

    // Create tooltip in the chart

    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    });

    circlesGroup.on("mouseout", function(data, index) {
      toolTip.hide(data);
    })
  });