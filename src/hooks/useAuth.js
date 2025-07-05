export default function useAuth() {
  const context = JSON.parse(localStorage.getItem("authUser"));
  return { isAuthenticated: context ? true : false, user: { ...context, ...context?.user_info }, logout: () => localStorage.removeItem("authUser") };
}
