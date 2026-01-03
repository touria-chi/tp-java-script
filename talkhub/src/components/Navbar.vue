<template>
  <b-navbar toggleable="lg" type="dark" class="modern-navbar">
    <div class="container d-flex align-items-center">
      <!-- Logo avec icône -->
      <b-navbar-brand to="/" class="d-flex align-items-center brand-wrapper">
        <span class="brand-text">TalkHub</span>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" class="custom-toggler"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ms-auto align-items-center nav-items">
          <b-nav-item to="/" active-class="active-link" class="nav-link-custom">
            Accueil
          </b-nav-item>

          <!-- Lien Admin (visible seulement pour moderator/admin) -->
          <b-nav-item 
            v-if="user && (userRole === 'moderator' || userRole === 'admin')" 
            to="/admin" 
            active-class="active-link" 
            class="nav-link-custom btn-admin"
          >
            Administration
          </b-nav-item>

          <!-- Non connecté -->
          <template v-if="!user">
            <b-nav-item to="/login" active-class="active-link" class="nav-link-custom">
              Connexion
            </b-nav-item>
            <b-nav-item to="/register" active-class="active-link" class="nav-link-custom btn-register">
              Inscription
            </b-nav-item>
          </template>

          <!-- Connecté -->
          <b-nav-item-dropdown v-else right class="ms-3 user-dropdown">
            <template #button-content>
              <div class="user-avatar">
              </div>
            </template>

            <b-dropdown-item to="/profile" class="dropdown-item-custom">
              Mon Profil
            </b-dropdown-item>
            <b-dropdown-divider class="my-1"></b-dropdown-divider>
            <b-dropdown-item @click="logout" class="dropdown-item-custom logout-item">
              Se déconnecter
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuth } from '../composables/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const { user, logout: authLogout } = useAuth();
const userRole = ref(null);

// Charger le rôle de l'utilisateur
async function loadUserRole() {
  if (!user.value) {
    userRole.value = null;
    return;
  }

  try {
    const userDocRef = doc(db, "users", user.value.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      userRole.value = userDoc.data().role || "user";
    } else {
      userRole.value = "user";
    }
  } catch (error) {
    console.error("Erreur lors du chargement du rôle:", error);
    userRole.value = "user";
  }
}


// Fonction de déconnexion avec redirection
async function logout() {
  try {
    await authLogout();
    router.push('/');
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
}

// Charger le rôle au montage et quand l'utilisateur change
onMounted(() => {
  loadUserRole();
});

// Recharger le rôle quand l'utilisateur change
watch(user, () => {
  loadUserRole();
});
</script>

<style scoped>
.modern-navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  padding: 1rem 0;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: visible;
  z-index: 1040;
}

.modern-navbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  pointer-events: none;
}

.modern-navbar .container {
  max-width: 1100px;
  position: relative;
  z-index: 1;
}

/* Brand styling */
.brand-wrapper {
  transition: transform 0.3s ease;
}

.brand-wrapper:hover {
  transform: scale(1.05);
}

.brand-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.brand-text {
  color: white;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 0.5px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

/* Custom toggler */
.custom-toggler {
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
}

.custom-toggler:focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.2);
}

/* Navigation items */
.nav-items {
  gap: 0.5rem;
}

.nav-link-custom {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 600;
  padding: 0.6rem 1.2rem !important;
  border-radius: 25px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-link-custom:hover {
  color: white !important;
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px);
}

.active-link {
  color: white !important;
  background: rgba(255, 255, 255, 0.25) !important;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Register button special style */
.btn-register {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%) !important;
  color: white !important;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
  margin-left: 0.5rem;
}

.btn-register:hover {
  background: linear-gradient(135deg, #0f8275 0%, #2dd368 100%) !important;
  box-shadow: 0 6px 16px rgba(17, 153, 142, 0.4);
  transform: translateY(-3px) !important;
}

/* Admin button special style */
.btn-admin {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
  color: white !important;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
  margin-left: 0.5rem;
}

.btn-admin:hover {
  background: linear-gradient(135deg, #e082ea 0%, #e4465b 100%) !important;
  box-shadow: 0 6px 16px rgba(240, 147, 251, 0.4);
  transform: translateY(-3px) !important;
}

/* User dropdown wrapper */
.user-dropdown {
  position: relative;
  z-index: 1050;
}

:deep(.user-dropdown .dropdown-menu) {
  z-index: 1060 !important;
}

/* User avatar */
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.avatar-icon {
  font-size: 1.3rem;
}

.user-dropdown:hover .user-avatar {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* Dropdown styling */
:deep(.dropdown-menu) {
  border: none;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  padding: 0.75rem 0;
  min-width: 200px;
  margin-top: 0.75rem !important;
  background: white;
  overflow: hidden;
}

:deep(.dropdown-menu)::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 20px;
  width: 12px;
  height: 12px;
  background: white;
  transform: rotate(45deg);
  box-shadow: -2px -2px 4px rgba(0, 0, 0, 0.05);
}

.dropdown-item-custom {
  padding: 0.7rem 1.5rem !important;
  font-weight: 600;
  color: #4a5568 !important;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.dropdown-item-custom:hover {
  background: linear-gradient(90deg, #f0f4ff 0%, #e8f0fe 100%) !important;
  padding-left: 1.75rem !important;
}

.dropdown-icon {
  font-size: 1.2rem;
}

.icon-success {
  filter: grayscale(0);
}

.logout-item {
  color: #e53e3e !important;
}

.logout-item:hover {
  background: linear-gradient(90deg, #fff5f5 0%, #fed7d7 100%) !important;
}

.logout-item .dropdown-icon {
  color: #e53e3e;
}

:deep(.dropdown-divider) {
  margin: 0.5rem 0;
  opacity: 0.3;
}

/* Responsive */
@media (max-width: 992px) {
  .nav-items {
    margin-top: 1rem;
    gap: 0.75rem;
  }
  
  .nav-link-custom {
    width: 100%;
    justify-content: center;
  }
  
  .btn-register {
    margin-left: 0;
  }

  .btn-admin {
    margin-left: 0;
  }
  
  .user-dropdown {
    width: 100%;
    margin-left: 0 !important;
  }
  
  :deep(.dropdown-menu) {
    width: 100%;
    border-radius: 12px;
  }
}

/* Animation on load */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-navbar {
  animation: slideDown 0.4s ease;
}
</style>