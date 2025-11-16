const USER_KEY = "habit-user";

document.addEventListener("DOMContentLoaded", () => {

  // Login Handler
  const form = document.getElementById("loginForm");
  if(form){
    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      const user = document.getElementById("username").value;
      const pass = document.getElementById("password").value;
      if(user && pass){
        localStorage.setItem(USER_KEY, user);
        window.location.href = "dashboard.html";
      }
    });
  }

  // Logout Handler
  const logout = document.getElementById("logoutBtn");
  if(logout){
    logout.addEventListener("click", ()=>{
      localStorage.removeItem(USER_KEY);
      window.location.href = "index.html";
    });
  }

  // Page Protection
  const currentUser = localStorage.getItem(USER_KEY);
  const allowed = ["index.html","/"];

  if(!currentUser && !allowed.includes(location.pathname.split("/").pop())){
    window.location.href = "index.html";
  }
});
