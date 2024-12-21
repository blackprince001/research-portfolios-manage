import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  UserCircle,
  LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/publications', label: 'Publications', icon: BookOpen },
  { href: '/teaching', label: 'Teaching', icon: GraduationCap },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export function MainNav() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
              location.pathname === item.href
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto"
        onClick={() => logout()}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </nav>
  );
}