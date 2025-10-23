import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, User, LogOut, Languages, Settings } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { turkishStocks } from "@/data/turkishStocks";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useProfile } from "@/hooks/useProfile";
import { useAdmin } from "@/hooks/useAdmin";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userPlan, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { profile } = useProfile();
  const { isAdmin } = useAdmin();

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
  ];

  const filteredStocks = turkishStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleStockSelect = (symbol: string) => {
    setOpen(false);
    setSearchValue("");
    navigate(`/stock/${symbol}`);
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'market';
    if (path === '/pricing') return 'plans';
    if (path === '/settings') return 'settings';
    if (path === '/admin') return 'admin';
    return 'market';
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case 'market':
        navigate('/');
        break;
      case 'plans':
        navigate('/pricing');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'admin':
        navigate('/admin');
        break;
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-4">
          {/* Logo and Tabs on the left */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">{t("appName")}</span>
            </Link>

            {/* Navigation Tabs */}
            <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="hidden md:block">
              <TabsList>
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="plans">Plans</TabsTrigger>
                {user && <TabsTrigger value="settings">Settings</TabsTrigger>}
                {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1" />

          {/* Right side menu items */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("searchPlaceholder")}
                    className="pl-10 bg-secondary/50"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[400px]" align="end">
                <Command>
                  <CommandInput
                    placeholder={t("searchPlaceholder")}
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>{t("noStocksFound")}</CommandEmpty>
                    <CommandGroup heading={t("turkishStocks")}>
                      {filteredStocks.map((stock) => (
                        <CommandItem
                          key={stock.symbol}
                          onSelect={() => handleStockSelect(stock.symbol)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-semibold">{stock.symbol}</div>
                              <div className="text-sm text-muted-foreground">{stock.name}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{stock.price}</div>
                              <div
                                className={
                                  stock.change >= 0 ? "text-success text-sm" : "text-destructive text-sm"
                                }
                              >
                                {stock.change >= 0 ? "+" : ""}
                                {stock.change}%
                              </div>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Languages className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.label}
                    {language === lang.code && " ✓"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      {profile?.username && (
                        <span className="text-sm font-semibold">@{profile.username}</span>
                      )}
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                      <Badge variant="secondary" className="w-fit text-xs">
                        {userPlan?.toUpperCase() || 'FREE'} PLAN
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/pricing" className="cursor-pointer">
                      {t("upgradePlan")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="hero" size="sm">
                  {t("signIn")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
