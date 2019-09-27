function buildPlot(vgpData){
    console.log(vgpData)

    var trace1 = {
        x: vgpData.map(data => data.Year),
        y: vgpData.map(data => data.Global_Sales),
        mode: "lines",
        type: "line",
        line: {
            color: "rgb(255, 0, 0)",
            size:8
        },
        name: "Global Sales Per Year",
    }

    var data = [trace1];

    var layout = {
        title: "Global Video Game Sales Per Year",
        xaxis: {title: "Year"},
        yaxis: {title: "Sales (Millions)"}
    };



    Plotly.newPlot(document.getElementById('line'),data,layout)

};

//buildPlot();

function filterTable() {
    const menuText = d3.select('#select-publisher option:checked').text()
    console.log(menuText)
    // Loop through all of the filters and keep any data that
    // matches the filter values
    //Object.entries(filters).forEach(([key, value]) => {
    let filteredData = vgpData  
    filteredData = vgpData[0].data.filter(row => row.Publisher === menuText);
    
    console.log(filteredData[0].Global_Sales)
    // Finally, rebuild the table using the filtered Data
    buildPlot(filteredData);
};

const menu = d3.select('#select-publisher');
menu.on('change', filterTable)

let salesData = vgpData[0].data
console.log(salesData)
buildPlot(salesData);