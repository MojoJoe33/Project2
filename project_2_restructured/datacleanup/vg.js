// @TODO: YOUR CODE HERE!
let width = parseInt(d3.select("#scatter").style("width"));
let height = width - width / 5; 
let margin = 15;
let labelArea = 100;
let tPadBot = 35;
let tPadLeft = 35;
let circRadius;


// create svg
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

  // creating circles for graph
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

//gets the csv data imported
d3.csv("videogames_df.csv").then(function (data) {

  visualize(data);
});


function visualize(theData) {

    let curX = "Name";
    let curY = "Global_Sales";
    let xMin;
    let xMax;
    let yMin;
    let yMax;
  
    let toolTip = d3
      .tip()
      .attr("class", "d3-tip")
      .offset([45, -60])
      .html(function (d) {
        let theX;
        let theState = "<div>" + d.state + "</div>";
        let theY = "<div>" + curY + ": " + d[curY] + "%</div>";
  
        if (curX === "Name") {
          theX = "<div>" + curX + ": " + d[curX] + "%</div>";
        }
        else {
          theX = "<div>" +
            curX +
            ": " +
            parseFloat(d[curX]).toLocaleString("en") +
            "</div>";
        }
        return theState + theY + theX;
      });
    svg.call(toolTip);
  // min and max functions
    function xMinMax() {
      xMin = d3.min(theData, function (d) {
        return parseFloat(d[curX]) * 0.95;
      });
      xMax = d3.max(theData, function (d) {
        return parseFloat(d[curX]) * 1.05;
      });
    }
    function yMinMax() {
      yMin = d3.min(theData, function (d) {
        return parseFloat(d[curY]) * 0.95;
      });
      yMax = d3.max(theData, function (d) {
        return parseFloat(d[curY]) * 1.05;
      });
    }
    xMinMax();
    yMinMax();

    // x and y Scales
    let xScale = d3
      .scaleLinear()
      .domain([xMin, xMax])
      .range([margin + labelArea, width - margin]);
    let yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([height - margin - labelArea, margin]);
    
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    //creating circles on graphs
    let theCircles = svg.selectAll("g theCircles").data(theData).enter();
    theCircles
      .append("circle")
      .attr("cx", function (d) {
        return xScale(d[curX]);
      })
      .attr("cy", function (d) {
        return yScale(d[curY]);
      })
      .attr("r", circRadius)
      .attr("class", function (d) {
        return "stateCircle " + d.abbr;
      })

      // allows hover over to show up 
      .on("mouseover", function (d) {
        toolTip.show(d, this);
        d3.select(this).style("stroke", "#323232");
      })
      .on("mouseout", function (d) {
        toolTip.hide(d);
        d3.select(this).style("stroke", "#e3e3e3");
      });
  
    theCircles
      .append("text")
      .text(function (d) {
        return d.abbr;
      })
      .attr("dx", function (d) {
        return xScale(d[curX]);
      })
      .attr("dy", function (d) {
        return yScale(d[curY]) + circRadius / 2;
      })
      .attr("font-size", circRadius)
      .attr("class", "stateText")

      //allows hover over
      .on("mouseover", function (d) {
        toolTip.show(d);
        d3.select("." + d.abbr).style("stroke", "#323232");
      })
      .on("mouseout", function (d) {
        toolTip.hide(d);
        d3.select("." + d.abbr).style("stroke", "#e3e3e3");
      });

    // creates the ticks
    function tickCount() {
      if (width <= 500) {
        xAxis.ticks(5);
        yAxis.ticks(5);
      }
      else {
        xAxis.ticks(10);
        yAxis.ticks(10);
      }
    }
    tickCount();
    
    svg
      .append("g")
      .call(xAxis)
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
    svg
      .append("g")
      .call(yAxis)
      .attr("class", "yAxis")
      .attr("transform", "translate(" + (margin + labelArea) + ", 0)");
    
    //resize based on window
    d3.select(window).on("resize", resize);
  
    d3.selectAll(".aText").on("click", function () {
      let self = d3.select(this);
      
      if (self.classed("inactive")) {
        let axis = self.attr("data-axis");
        let name = self.attr("data-name");
  
        if (axis === "x") {
          curX = name;
          xMinMax();
          xScale.domain([xMin, xMax]);
          svg.select(".xAxis").transition().duration(300).call(xAxis);
          d3.selectAll("circle").each(function () {
            d3
              .select(this)
              .transition()
              .attr("cx", function (d) {
                return xScale(d[curX]);
              })
              .duration(300);
          });
          d3.selectAll(".stateText").each(function () {
            d3
              .select(this)
              .transition()
              .attr("dx", function (d) {
                return xScale(d[curX]);
              })
              .duration(300);
          });
          labelChange(axis, self);
        }
        else {
          curY = name;
          yMinMax();
          yScale.domain([yMin, yMax]);
          svg.select(".yAxis").transition().duration(300).call(yAxis);
          d3.selectAll("circle").each(function () {
            d3
              .select(this)
              .transition()
              .attr("cy", function (d) {
                return yScale(d[curY]);
              })
              .duration(300);
          });
          d3.selectAll(".stateText").each(function () {
            d3
              .select(this)
              .transition()
              .attr("dy", function (d) {
                return yScale(d[curY]) + circRadius / 3;
              })
              .duration(300);
          });
          labelChange(axis, self);
        }
      }
    });
    d3.select(window).on("resize", resize);
  
    function resize() {
  
      width = parseInt(d3.select("#scatter").style("width"));
      height = width - width / 4;
      leftTextY = (height + labelArea) / 2 - labelArea;
  
      svg.attr("width", width).attr("height", height);
      xScale.range([margin + labelArea, width - margin]);
      yScale.range([height - margin - labelArea, margin]);
  
      svg
        .select(".xAxis")
        .call(xAxis)
        .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  
      svg.select(".yAxis").call(yAxis);
  
      tickCount();
      xTextRefresh();
      yTextRefresh();
  
      crGet();
      d3
        .selectAll("circle")
        .attr("cy", function (d) {
          return yScale(d[curY]);
        })
        .attr("cx", function (d) {
          return xScale(d[curX]);
        })
        .attr("r", function () {
          return circRadius;
        });
      d3
        .selectAll(".stateText")
        .attr("dy", function (d) {
          return yScale(d[curY]) + circRadius / 3;
        })
        .attr("dx", function (d) {
          return xScale(d[curX]);
        })
        .attr("r", circRadius / 3);
    }
  }
  function labelChange(axis, clickedText) {
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);
    // Switch the text active.
    clickedText.classed("inactive", false).classed("active", true);
  } 
 
// creating labels
svg.append("g").attr("class", "xText");
let xText = d3.select(".xText");
svg.append("g").attr("class", "yText");
let yText = d3.select(".yText");
let leftTextX = margin + tPadLeft;
let leftTextY = (height + labelArea) / 2 - labelArea;

function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
    ((width - labelArea) / 2 + labelArea) +
    ", " +
    (height - margin - tPadBot) +
    ")"
  );
}
xTextRefresh();
function yTextRefresh() {
    yText.attr(
      "transform",
      "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
    );
}
yTextRefresh();

// create labels
xText
  .append("text")
  .attr("y", -27)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");  

xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");

xText
  .append("text")
  .attr("y", 27)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");

yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

