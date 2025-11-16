const LS_KEY = "habit-data";
let habits = JSON.parse(localStorage.getItem(LS_KEY) || "[]");

const habitsRoot = document.getElementById("habits");
const statsRoot = document.getElementById("stats");

// Utilities
const todayISO = ()=> new Date().toISOString().slice(0,10);
const save = ()=> localStorage.setItem(LS_KEY, JSON.stringify(habits));

function streak(h){
  let s=0, d=0;
  while(true){
    let dt = new Date();
    dt.setDate(dt.getDate()-d);
    const iso = dt.toISOString().slice(0,10);
    if(h.completions.includes(iso)){ s++; d++; }
    else break;
  }
  return s;
}

// Rendering habits
function render(){
  stats();
  habitsRoot.innerHTML = "";
  if(!habits.length){
    habitsRoot.innerHTML = "<p>No habits yet.</p>";
    return;
  }

  habits.forEach(h=>{
    const card = document.createElement("div");
    card.className = "card";
    card.style.borderLeft = `8px solid ${h.color}`;

    card.innerHTML = `
      <h3>${h.title}</h3>
      <p>${h.completions.length} total • Streak: ${streak(h)}</p>
      <button class="btn primary" onclick="toggle('${h.id}')">
        ${h.completions.includes(todayISO()) ? "Done Today ✓" : "Mark Done"}
      </button>
      <button class="btn" onclick="removeHabit('${h.id}')">Delete</button>
    `;
    habitsRoot.appendChild(card);
  });
}

function stats(){
  statsRoot.innerHTML = `
    <div class="card"><strong>Total Habits:</strong> ${habits.length}</div>
    <div class="card"><strong>Completed Today:</strong> ${
      habits.filter(h=>h.completions.includes(todayISO())).length
    }</div>
  `;
}

function toggle(id){
  const h = habits.find(x=>x.id===id);
  const today = todayISO();
  const idx = h.completions.indexOf(today);
  if(idx === -1) h.completions.push(today);
  else h.completions.splice(idx,1);
  save(); render();
}

function removeHabit(id){
  if(!confirm("Delete habit?")) return;
  habits = habits.filter(x=>x.id!==id);
  save(); render();
}

document.getElementById("addForm")?.addEventListener("submit",(e)=>{
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const color = document.getElementById("color").value;
  const newHabit = {
    id: Date.now().toString(),
    title, color,
    completions:[]
  };
  habits.unshift(newHabit);
  save();
  render();
  document.getElementById("title").value="";
});

render();
