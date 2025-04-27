import AccountDetailsPage from '../pages/AccountDetailsPage'
import AdminDashboard from '../pages/AdminDashboard'
import AllAccountsPage from '../pages/AllAccountsPage'
import CategoryPage from '../pages/CategoryPage'
import ChangePasswordPage from '../pages/ChangePasswordPage'
import HomePage from '../pages/HomePage'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import NapATMPage from '../pages/NapATMPage'
import OrderDetailsPage from '../pages/OrderDetailsPage'
import OrderHistoryPage from '../pages/OrderHistoryPage'
import ProfilePage from '../pages/ProfilePage'
import SignUpPage from '../pages/SignUpPage'

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: '/login',
        page: LoginPage,
        isShowHeader: true,
    },
    {
        path: '/register',
        page: SignUpPage,
        isShowHeader: true,
    },
    {
        path: '/profile',
        page: ProfilePage,
        isShowHeader: true,
    },
    {
        path: '/changepassword',
        page: ChangePasswordPage,
        isShowHeader: true,
    },
    {
        path: '/accountDetails/:id',
        page: AccountDetailsPage,
        isShowHeader: true,
    },
    {
        path: '/order-details/:id',
        page: OrderDetailsPage,
        isShowHeader: true
    },
    {
        path: '/order-history',
        page: OrderHistoryPage,
        isShowHeader: true
    },
    {
        path: '/banking',
        page: NapATMPage,
        isShowHeader: true
    },
    {
        path: '/admin',
        page: AdminDashboard,
        isShowHeader: true
    },
    {
        path: '/home',
        page: LandingPage,
        isShowHeader: true
    },
    {
        path: '/category/:id',
        page: CategoryPage,
        isShowHeader: true
    },
    {
        path: '/allAccounts',
        page: AllAccountsPage,
        isShowHeader: true
    },
  
]
