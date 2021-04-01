export const isLoggedIn = function () {
  if (localStorage.getItem("token")) return true;
  return false;
};
