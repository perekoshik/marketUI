import { createHashRouter, Navigate } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Item from './pages/Item'
import Profile from './pages/Profile'
import Seller from './pages/Seller'

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'item/:id', element: <Item /> },
      { path: 'profile', element: <Profile /> },
      { path: 'seller', element: <Seller /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ]
  }
])
