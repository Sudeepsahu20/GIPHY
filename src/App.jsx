import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Applayout from './layouts/App-layout'
import Search from './pages/Search'
import SingleGif from './pages/SingleGif'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import GifProvider from './context/context'
import Category from './pages/Category'


const router = createBrowserRouter([
  {
    element: <Applayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/:category',
        element: <Category />
      },
      {
        path: '/search/:query',
        element: <Search />
      },
      {
        path: '/:type/:slug',
        element: <SingleGif />
      },
      {
        path: '/favorites',
        element: <Favorites />
      }
    ]
  }
]);


function App() {
  

  return (
    <GifProvider>
<RouterProvider router={router}/>
</GifProvider>
  )
}

export default App
