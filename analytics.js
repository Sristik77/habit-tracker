const data = JSON.parse(localStorage.getItem("habit-data") || "[]");

document.getElementById("summary").innerHTML = `
  <h3>Total habits: ${data.length}</h3>
  <p>Completed today: ${
    data.filter(h=>h.completions.includes(new Date().toISOString().slice(0,10))).length
  }</p>
`;

const ctx = document.getElementById("chart").getContext("2d");

new Chart(ctx,{
  type:"bar",
  data:{
    labels:data.map(h=>h.title),
    datasets:[{
      label:"Total Completions",
      data:data.map(h=>h.completions.length),
      backgroundColor:"#4CAF50"
    }]
  }
});
