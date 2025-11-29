// Save user
function registerUser(username, email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
  
    // Check if email exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: "Email already exists!" };
    }
  
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));
  
    return { success: true };
  }
  
  // Login user
  function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);
  
    if (!user) return { success: false };
  
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    return { success: true, user };
  }
  
  // Check login status
  function requireLogin() {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      window.location.href = "/src/login.html";
    }
  }
  
  // Logout user
  function logoutUser() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/src/login.html";
  }