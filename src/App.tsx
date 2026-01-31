import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Join from '@/pages/Join.tsx';
import Login from '@/pages/Login.tsx';
import { AlertProvider } from '@/contexts/AlertContext';
import { PublicRoute } from '@/routes/PublicRoute.tsx';
import { ProtectedRoute } from '@/routes/ProtectedRoute.tsx';
import PostList from '@/pages/post/PostList.tsx';
import Home from '@/pages/Home.tsx';
import PostCreate from '@/pages/post/PostCreate.tsx';

function App() {
  return (
    <AlertProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/post/list" element={<PostList />} />
            <Route path="/post/create" element={<PostCreate />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AlertProvider>
  );
}

export default App;
