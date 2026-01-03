import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Profile from "../views/Profile.vue";
import Discussion from "../views/Discussion.vue";
import Admin from "../views/Admin.vue";
import ResetPassword from "../views/ResetPassword.vue";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/home", name: "Home", component: Home },
  { path: "/profile", name: "Profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/discussion/:id", name: "Discussion", component: Discussion },
  { path: "/admin", name: "Admin", component: Admin, meta: { requiresAuth: true, requiresModerator: true } },
  { path: "/reset-password", name: "ResetPassword", component: ResetPassword },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  // Vérifier si l'utilisateur est connecté
  if (to.meta.requiresAuth && !user) {
    return next("/login");
  }

  // Vérifier le rôle de modérateur
  if (to.meta.requiresModerator && user) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role || "user";

        // Autoriser moderator et admin
        if (userRole === "moderator" || userRole === "admin") {
          return next();
        }
      }

      // Si pas de rôle approprié, rediriger vers home
      return next("/home");
    } catch (error) {
      console.error("Erreur lors de la vérification du rôle:", error);
      return next("/home");
    }
  }

  next();
});

export default router;