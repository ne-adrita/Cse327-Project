import users from "./users.json";

export function loginUser(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, message: "Invalid credentials" };

  localStorage.setItem("loggedInUser", JSON.stringify(user));
  return { success: true, user };
}

export function getLoggedInUser() {
  const user = localStorage.getItem("loggedInUser");
  return user ? JSON.parse(user) : null;
}

export function logoutUser() {
  localStorage.removeItem("loggedInUser");
}
