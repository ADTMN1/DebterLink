import { memo } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Moon, Sun, Globe, Bell, Menu, Search, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';

export const Navbar = memo(function Navbar() {
  const { theme, setTheme, language, setLanguage, toggleSidebar, calendarType, setCalendarType } = useUIStore();
  const { user, logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  const [location, setLocation] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationCount = 3; // Mock notification count

  const searchItems = [
    { type: 'page', label: 'Dashboard', href: '/dashboard' },
    { type: 'page', label: 'Attendance', href: '/dashboard/attendance' },
    { type: 'page', label: 'Assignments', href: '/dashboard/assignments' },
    { type: 'page', label: 'Grades', href: '/dashboard/grades' },
    { type: 'page', label: 'Gradebook', href: '/dashboard/gradebook' },
    { type: 'page', label: 'Calendar', href: '/dashboard/calendar' },
    { type: 'page', label: 'Timetable', href: '/dashboard/timetable' },
    { type: 'page', label: 'Resources', href: '/dashboard/resources' },
    { type: 'page', label: 'Behavior', href: '/dashboard/behavior' },
    { type: 'page', label: 'Messages', href: '/dashboard/messages' },
    { type: 'page', label: 'Profile', href: '/profile' },
    { type: 'page', label: 'Settings', href: '/settings' },
    { type: 'page', label: 'User Management', href: '/dashboard/users' },
    { type: 'action', label: 'Create Assignment', action: () => setLocation('/dashboard/assignments') },
    { type: 'action', label: 'Send Message', action: () => setLocation('/dashboard/messages') },
    { type: 'action', label: 'View Attendance', action: () => setLocation('/dashboard/attendance') },
    { type: 'action', label: 'Add Event', action: () => setLocation('/dashboard/calendar') },
  ];

  const filteredItems = searchItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Apply theme class
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    // Apply language
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // Global search keyboard shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Generate breadcrumbs from location
  const generateBreadcrumbs = () => {
    const paths = location.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: t('common.dashboard') || 'Dashboard', href: '/dashboard' },
    ];
    
    if (paths.length > 0 && paths[0] !== 'dashboard') {
      paths.forEach((path, index) => {
        const href = '/' + paths.slice(0, index + 1).join('/');
        const label = t(`menu.${path}`) || path.charAt(0).toUpperCase() + path.slice(1);
        breadcrumbs.push({ label, href });
      });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar} aria-label="Toggle menu">
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Breadcrumb Navigation */}
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="text-foreground font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href} className="hover:text-foreground">
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-2">
          {/* Global Search */}
          <Button
            variant="outline"
            className="hidden md:flex h-9 w-[200px] justify-between text-sm text-muted-foreground"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search...</span>
            </div>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Calendar Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Toggle calendar type">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCalendarType('gregorian')}>
                Gregorian
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCalendarType('ethiopian')}>
                Ethiopian
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Change language">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('am')}>
                አማርኛ (Amharic)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('or')}>
                Afaan Oromoo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Sun className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>

          {/* Notifications with Badge */}
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground">
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            )}
          </Button>

          

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-xs">{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                {t('common.profile')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                {t('common.settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-white bg-red-600 hover:bg-red-700 focus:bg-red-700 font-medium">
                {t('common.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Global Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={(open) => {
        setSearchOpen(open);
        if (!open) setSearchQuery('');
      }}>
        <CommandInput 
          placeholder={t('common.search') || 'Search...'} 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>{t('common.noResults') || 'No results found.'}</CommandEmpty>
          {filteredItems.filter(item => item.type === 'page').length > 0 && (
            <CommandGroup heading={t('common.pages') || 'Pages'}>
              {filteredItems
                .filter(item => item.type === 'page')
                .map((item) => (
                  <CommandItem
                    key={item.label}
                    onSelect={() => {
                      setLocation(item.href!);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          )}
          {filteredItems.filter(item => item.type === 'action').length > 0 && (
            <CommandGroup heading={t('common.actions') || 'Actions'}>
              {filteredItems
                .filter(item => item.type === 'action')
                .map((item) => (
                  <CommandItem
                    key={item.label}
                    onSelect={() => {
                      item.action?.();
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
});
