let chart;
let maxsteps = 0;
const numbers = [];
const peaks = [];
const steps = [];
let first = true;
let globalTableIdx = 0;
let speed = 5;
let randomColor;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function changeSpeed(value) {
    speed = parseInt(value);
  }
function addDataset(x, delay = false) {
    randomColor = randColor();
    const ctx = document.getElementById("myChart").getContext("2d");
    let input;
    if (x) {
        input = x;
    }
    else {
        input = document.getElementById("input").value;
    }
    for (let i = 0; i < numbers.length; i++) {
        if (input == numbers[i]) {
            return;
        }
    }
    numbers.push(input);
    let current = input;
    let max = input;
    const newdata = [current];
    let step = 0;
    while (current !== 1) {
        if (current % 2 === 0) {
            current /= 2;
        } else {
            current = current * 3 + 1;
            if (current > max) {
                max = current;
            }
        }
        step++;
        newdata.push(current);
    }
    if (step > maxsteps) {
        maxsteps = step;
    }
    peaks.push(max);
    steps.push(step);
    const newDataset = {
        label: input,
        data: newdata,
        fill: false,
        borderColor: randomColor,
        tension: 0.1,
    }
    if (!chart) {
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: newdata.map((value, index) => index),
                datasets: [
                    {
                        label: input,
                        data: newdata,
                        fill: false,
                        borderColor: randomColor,
                        tension: 0.1,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Step",
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Value",
                        },
                    },
                },
                plugins: {
                    customCanvasBackgroundColor: {
                        color: 'lightGreen',
                    },
                    subtitle: {
                        display: true,
                        text: 'Collatz Conjecture'
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: "x",
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
                            },
                            mode: "x",
                        },
                    },
                },
            },
        });
    }
    else {
        chart.data.datasets.push(newDataset);
        chart.data.labels = newdata.map((value, index) => index);

        chart.update();
    }
    calculateCollatzTable();
    document.documentElement.style.setProperty('--main-color', randomColor);

    console.log(globalTableIdx);
}

async function animateDataset() {
    randomColor = randColor();
    input = document.getElementById("input").value;
    const contentDiv = document.getElementById("content");

    const newDataset = {
        label: input,
        data: [],
        fill: false,
        borderColor: randomColor,
        tension: 0.1,
    }
    chart.data.datasets.push(newDataset);

    numbers.push(input);
    let current = input;
    let max = input;
    const newdata = [current];
    let step = 0;
    while (current !== 1) {
        if (current % 2 === 0) {
            contentDiv.innerText = `${current} / 2 =>  ${current/ 2} `;
            current /= 2;

        } else {
            contentDiv.innerText= `3 * ${current} + 1 => ${current * 3 + 1}`;
            current = current * 3 + 1;

            if (current > max) {
                max = current;
            }
        }

        newdata.push(current);


        chart.data.datasets[chart.data.datasets.length - 1].data.push(newdata[step]);


        step++;
        if (chart.data.labels.length < step) {
            var labels = [];
            for (var j = 1; j <= chart.data.labels.length + 1; j++) {
                labels.push(j);
            }
            chart.data.labels = labels;
        }
        
        chart.update();
        //console.log(4100 - speed * 500);
        await sleep(4100 - speed * 500);
    }
    if (step > maxsteps) {
        maxsteps = step;
    }
    peaks.push(max);
    steps.push(step);

    calculateCollatzTable();
    document.documentElement.style.setProperty('--main-color', randomColor);
    console.log(globalTableIdx);
    contentDiv.innerText= "";
}
function addDataToChart(y, n) {
    // Generate an array of x values from 1 to n
    var xValues = Array.from({ length: n }, function (_, i) { return i + 1; });

    // Create a new dataset object with the y value and x values
    var newDataset = {
        label: 'New Data',
        data: xValues.map(function (x) { return { x: x, y: y }; }),
        borderColor: 'red',
        borderWidth: 1,
        fill: false
    };

    // Add the new dataset to the chart object's data array
    chart.data.datasets.push(newDataset);

    // Update the chart with a delay of 0.1 seconds
    setTimeout(function () {
        chart.update();
    }, 100);
}

function removeLast() {
    chart.data.datasets.pop();
    delRow(globalTableIdx);
    globalTableIdx--;
    numbers.splice(globalTableIdx, 1);
    peaks.splice(globalTableIdx, 1);
    steps.splice(globalTableIdx, 1);

    chart.update();
}

function removeFirst() {
    chart.data.datasets.shift();
    delRow(1);
    numbers.splice(0, 1);
    peaks.splice(0, 1);
    steps.splice(0, 1);
    globalTableIdx--;
    chart.update();
}

function clearTable() {
    for (globalTableIdx; globalTableIdx > 0; globalTableIdx--) {
        chart.data.datasets.pop();
        delRow(globalTableIdx);
        numbers.splice(globalTableIdx - 1, 1);
        peaks.splice(globalTableIdx - 1, 1);
        steps.splice(globalTableIdx - 1, 1);
    }
    chart.update();
}

function delRow(rowIdx) {
    document.getElementById('collatz-table').deleteRow(rowIdx);
}

function calculateCollatzTable(number) {
    // Check if name already exists in table
    var table = document.querySelector('#collatz-table tbody');
    var rows = table.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");
        if (cells.length > 0) {
            var existingName = cells[0].innerHTML;
            if (existingName == number) {
                return;
            }
        }
    }

    // Add new row to table
    var newRow = table.insertRow();
    newRow.style.color = randomColor;
    var numbercell = newRow.insertCell(0);
    var peakcell = newRow.insertCell(1);
    var stepcell = newRow.insertCell(2);
    numbercell.innerHTML = numbers[globalTableIdx];
    peakcell.innerHTML = peaks[globalTableIdx];
    stepcell.innerHTML = steps[globalTableIdx];
    globalTableIdx++;

}

function randColor() {
    // Define a list of colors to avoid
    const avoidColors = ["#000000", "#FFFFFF"];
  
    // Generate a random color
    let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  
    // Check if the color is too close to a color to avoid
    const threshold = 100;
    for (let i = 0; i < avoidColors.length; i++) {
      let distance = Math.abs(parseInt(color, 16) - parseInt(avoidColors[i], 16));
      if (distance < threshold) {
        return generateRandomColor(); // if the color is too close, generate a new one
      }
    }
  
    return color;
  }
  
