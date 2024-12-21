import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  UserCircle,
  LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/publications', label: 'Publications', Icon: BookOpen },
  { href: '/teaching', label: 'Teaching', Icon: GraduationCap },
  { href: '/profile', label: 'Profile', Icon: UserCircle },
];

export function MainNav() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
      <nav className="flex items-center space-x-6">
        {navItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            to={href}
            className={cn(
              'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
              location.pathname === href
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => logout()}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}