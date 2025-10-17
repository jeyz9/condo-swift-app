import { RouterProvider } from 'react-router'
import './index.css'
import router from './routers/index.jsx'

function App() {

  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App