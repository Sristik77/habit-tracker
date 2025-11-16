// Simple localStorage-based habit tracker (no backend required)
const addForm = document.getElementById('addForm');
const habitsRoot = document.getElementById('habits');
const statsRoot = document.getElementById('stats');

const LS_KEY = 'habit-tracker-v1';

// load or initialize
let habits = JSON.parse(localStorage.getItem(LS_KEY) || '[]');

function save(){
  localStorage.setItem(LS_KEY, JSON.stringify(habits));
  render();
}

function isoToday(){
  return new Date().toISOString().slice(0,10);
}

function countThisWeek(habit){
  // count completions in last 7 days
  const today = new Date();
  const week = 7;
  let c=0;
  for(let d=0; d<week; d++){
    const dt = new Date(); dt.setDate(today.getDate()-d);
    const iso = dt.toISOString().slice(0,10);
    if(habit.completions.includes(iso)) c++;
  }
  return c;
}

function streak(habit){
  // count consecutive days from today backwards
  let s=0;
  let d=0;
  while(true){
    const dt = new Date(); dt.setDate(new Date().getDate()-d);
    const iso = dt.toISOString().slice(0,10);
    if(habit.completions.includes(iso)){ s++; d++; }
    else break;
  }
  return s;
}

function renderStats(){
  const total = habits.length;
  const doneToday = habits.filter(h=> h.completions.includes(isoToday())).length;
  statsRoot.innerHTML = `
    <div class="stat card">
      <h3>Total Habits</h3><p>${total}</p>
    </div>
    <div class="stat card">
      <h3>Done today</h3><p>${doneToday}</p>
    </div>
    <div class="stat card">
      <h3>Best streak (days)</h3><p>${habits.length ? Math.max(...habits.map(h=>streak(h))) : 0}</p>
    </div>
  `;
}

function render(){
  renderStats();
  habitsRoot.innerHTML = '';
  if(!habits.length){
    habitsRoot.innerHTML = '<div class="card">No habits yet — add one above.</div>';
    return;
  }
  habits.forEach(h=>{
    const card = document.createElement('div');
    card.className = 'card habit';
    card.style.borderLeftColor = h.color || '#4CAF50';

    const left = document.createElement('div'); left.className='left';
    const dot = document.createElement('div'); dot.className='dot'; dot.style.background = h.color || '#4CAF50';
    const title = document.createElement('div'); title.innerHTML = `<div class="title">${h.title}</div><div class="meta">${countThisWeek(h)} this week • ${h.completions.length} total</div>`;
    left.appendChild(dot); left.appendChild(title);

    const right = document.createElement('div'); right.className='controls';
    const toggle = document.createElement('button'); toggle.className='btn small';
    const todayDone = h.completions.includes(isoToday());
    toggle.textContent = todayDone ? 'Done today ✓' : 'Mark done';
    toggle.style.background = todayDone ? 'linear-gradient(90deg,#e6ffed,#d1f7e2)' : 'transparent';
    toggle.onclick = ()=>{
      const today = isoToday();
      const idx = h.completions.indexOf(today);
      if(idx === -1) h.completions.push(today);
      else h.completions.splice(idx,1);
      save();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn small';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = ()=>{
      if(!confirm('Delete this habit?')) return;
      habits = habits.filter(x => x.id !== h.id);
      save();
    };

    const info = document.createElement('div');
    info.className = 'meta';
    info.textContent = `Streak ${streak(h)} d`;

    right.appendChild(info);
    right.appendChild(toggle);
    right.appendChild(deleteBtn);

    card.appendChild(left);
    card.appendChild(right);

    habitsRoot.appendChild(card);
  });
}

// handle add
addForm.addEventListener('submit', e=>{
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const color = document.getElementById('color').value;
  if(!title) return;
  const newHabit = { id: Date.now().toString(), title, color, createdAt: new Date().toISOString(), completions: [] };
  habits.unshift(newHabit);
  document.getElementById('title').value = '';
  save();
});

// initial render
render();
