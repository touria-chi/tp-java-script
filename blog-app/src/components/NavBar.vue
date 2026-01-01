<template>
  <nav class="navbar container">
    <div class="logo">MyBlog</div>
    <div class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/create">Add Post</router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: linear-gradient(90deg, #6eb337ff, #42a5f5); 
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  flex-wrap: wrap;
}

.logo {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.2);
}

.nav-links {
  display: flex;
  gap: 25px;
}

.nav-links a {
  color: white;
  font-weight: 600;
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;
}

.nav-links a::after {
  content: '';
  position: absolute;
  width: 0%;
  height: 2px;
  bottom: -3px;
  left: 0;
  background-color: #ffe600;
  transition: 0.3s;
}

.nav-links a:hover::after {
  width: 100%;
}

.nav-links a:hover {
  transform: scale(1.05);
}

@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    gap: 15px;
    padding: 15px 20px;
  }
  .nav-links {
    flex-direction: column;
    gap: 12px;
    width: 100%;
    text-align: center;
  }
}
</style>
