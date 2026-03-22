import { LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar.tsx';
import { useAuthStore } from '@/stores/authStore.ts';
import { useAlert } from '@/hooks/useAlert.ts';
import { useNavigate } from 'react-router-dom';

const NavUser = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={'https://github.com/shadcn.png'} alt={user?.userId} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.userName}</span>
                <span className="text-muted-foreground truncate text-xs">{user?.userId}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                style={{ cursor: 'pointer' }}
                onClick={() => showAlert({ type: 'alert', description: '기능 개발 중입니다.' })}
              >
                <User />
                사용자 정보
              </DropdownMenuItem>
              <DropdownMenuItem
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  showAlert({
                    type: 'confirm',
                    description: '로그아웃 하시겠습니까?',
                    onConfirm: () => {
                      logout();
                      navigate('/login');
                    },
                  })
                }
              >
                <LogOut />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
