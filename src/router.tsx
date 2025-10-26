import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Item from './pages/Item'
import Profile from './pages/Profile'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'item/:id', element: <Item /> },
      { path: 'profile', element: <Profile /> },
    ]
  }
])
