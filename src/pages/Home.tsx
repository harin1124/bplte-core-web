import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">홈페이지</h1>
            <p className="text-gray-600 mt-2">
              안녕하세요, <strong>{user?.userId}</strong>님!
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            로그아웃
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">사용자 정보</h2>
          <div className="space-y-2">
            <p><strong>사용자 ID:</strong> {user?.userId}</p>
            <p><strong>권한:</strong> {user?.roles?.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
