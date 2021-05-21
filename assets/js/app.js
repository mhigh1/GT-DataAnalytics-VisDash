// JSON data url (localhost)
const url = "../../data/samples.json";

// variable to hold studyData
let studyData = {};

d3.json(url).then(data => {
    // Store study data in variable    
    studyData = data;

    // Render dropdown menu options
    const dropdownMenu = d3.select("#selDataset");
    renderDropDownMenu(dropdownMenu, studyData["names"]);

    // Render Metadata table
    renderMetadataTable(dropdownMenu.property("value"));

    // Render bar chart
    renderBarChart(dropdownMenu.property("value"));
    
    // Render bubble chart
    renderBubbleChart(dropdownMenu.property("value"));
});

// Render Functions
// DropDown Menu content
const renderDropDownMenu = function(element, data) {
    element.selectAll("option")
        .data(data)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);
}

// Metadata Table
const renderMetadataTable = function(id) {
    const sample = studyData["metadata"].find(item => item.id === parseInt(id));

    const metadataDiv = d3.select("#sample-metadata");
    metadataDiv.html("");

    const labels = Object.keys(sample);
    const data = labels.map(d => {return {label:d, value:sample[d]}});

    const tbody = metadataDiv.append("table").append("tbody");
    let rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");
    
    rows.append("th")
        .text(d => d.label);
    
    rows.append("td")
        .text(d => d.value);
}

// Bar Chart
const renderBarChart = function(id){
    
    sampleData = studyData["samples"].find(item => item.id === id);
    
    otuTop10 = sampleData.otu_ids.slice(0, 10).reverse();
    values = sampleData.sample_values.slice(0, 10).reverse();
    labels = sampleData.otu_labels.slice(0, 10).reverse();

    const trace0 = {
        x: values,
        y: otuTop10.map(d => `OTU ${d}`),
        text: labels,
        marker: {color: "blue"},
        type: "bar",
        orientation: "h"
    }
    const data = [trace0];

    Plotly.newPlot("bar", data);
}

// Bubble Chart
const renderBubbleChart = function(id) {
    sampleData = studyData["samples"].find(item => item.id === id);

    const trace0 = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        mode: "markers",
        marker: {
            size: sampleData.sample_values,
            color: sampleData.otu_ids
        },
        text: sampleData.otu_labels
    };

    const layout = {
        xaxis: { title: "OTU ID"}
    };

    const data = [trace0];
    Plotly.newPlot("bubble", data, layout);
}

// Event Listeners
d3.select("#selDataset").on("change", function(){
    const id = this.value;
    renderMetadataTable(id);
    renderBarChart(id);
    renderBubbleChart(id);
});