function buildPlot(vggData) {
    console.log(vggData)
    var trace1 = {
        x: vggData.map(data => data.Year),
        y: vggData.map(data => data.Global_Sales),
        mode: "lines",
        type: "line",
        line: {
            color: "rgb(255, 0, 0)",
            size: 8
        },
        name: "Global Sales Per Year",
    }

    var data = [trace1];

    var layout = {
        title: "Global Video Game Sales Per Year",
        xaxis: {title: "Year"},
        yaxis: {title: "Sales (Millions)"}
    };

    Plotly.newPlot(document.getElementById('line'), data, layout)

};

function filterTable() {
    const menuText = d3.select('#select-genre option:checked').text()
    console.log(menuText)
    // Loop through all of the filters and keep any data that
    // matches the filter values
    //Object.entries(filters).forEach(([key, value]) => {
    let filteredData = vggData  
    filteredData = vggData[0].data.filter(row => row.Genre === menuText);
    console.log(filteredData)
    
    // Finally, rebuild the table using the filtered Data
    buildPlot(filteredData);
};

const menu = d3.select('#select-genre');
menu.on('change', filterTable)

let salesData = vggData[0].data

buildPlot(salesData);