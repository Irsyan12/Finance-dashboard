import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import AddTransactionView from "../views/AddTransactionView.vue";
import EditCategoriesView from "../views/EditCategoriesView.vue";
import SummaryView from "../views/SummaryView.vue";

const routes = [
  { path: "/", component: DashboardView },
  { path: "/login", component: LoginView },
  { path: "/addtransaction", component: AddTransactionView },
  { path: "/editcategories", component: EditCategoriesView },
  { path: "/summary", component: SummaryView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
