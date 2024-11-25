
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Data from './Data.jsx'

const router=  createBrowserRouter([
    {path: '/', element: <App/>},
    {path: '/data', element : <Data/>}
])


ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)
