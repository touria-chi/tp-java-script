import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CreatePostView from '../views/CreatePostView.vue';
import PostDetailView from '../views/PostDetailView.vue';
import EditPostView from '../views/EditPostView.vue'
import TagPostsView from '../views/TagPostsView.vue'


const routes = [
{ path: '/', component: Home },
{ path: '/create', component: CreatePostView },
{ path: '/post/:id', component: PostDetailView, props: true },
{ path: '/tags/:tag', component: TagPostsView, props: true }, 
{ path: '/edit/:id', component: EditPostView }  
];


const router = createRouter({ history: createWebHistory(), routes });
export default router;