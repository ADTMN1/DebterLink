import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { CheckCircle2, ArrowRight, School, Shield, Zap, Users, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Logo } from '@/components/ui/logo';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/store/useUIStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Globe } from 'lucide-react';

// Import assets
import heroImage from '@assets/generated_images/ethiopian_students_learning_with_tablets.png';
import dashboardImage from '@assets/generated_images/modern_dashboard_ui_mockup.png';
import teacherImage from '@assets/generated_images/teacher_taking_attendance_on_tablet.png';
import directorImage from '@assets/generated_images/ethiopian_school_director_portrait.png';
import teacherPortrait from '@assets/generated_images/ethiopian_female_teacher_portrait.png';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, setTheme, language, setLanguage } = useUIStore();

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

  const features = [
    {
      title: "For Directors",
      description: "Gain complete visibility into your school's performance with real-time analytics and automated reporting.",
      icon: School,
    },
    {
      title: "For Teachers",
      description: "Streamline attendance, grading, and lesson planning so you can focus on what matters—teaching.",
      icon: Users,
    },
    {
      title: "For Parents",
      description: "Stay connected with your child's progress through instant updates on grades, attendance, and behavior.",
      icon: Shield,
    },
    {
      title: "For Students",
      description: "Access learning materials, check schedules, and submit assignments from anywhere, anytime.",
      icon: Zap,
    },
  ];

  const testimonials = [
    {
      name: "Ato Solomon Tadesse",
      role: "School Director",
      image: directorImage,
      quote: "DebterLink has revolutionized how we manage our school. The transparency it provides to parents is unmatched.",
    },
    {
      name: "W/ro Tigist Haile",
      role: "Senior Teacher",
      image: teacherPortrait,
      quote: "Taking attendance and grading used to take hours. Now it takes minutes. I highly recommend it.",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Logo />
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Testimonials</a>
              <div className="flex items-center gap-4">
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
              </div>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-muted-foreground">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b p-4 space-y-4">
            <a href="#features" className="block text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#testimonials" className="block text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
            <div className="flex items-center justify-between pt-4">
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <span>{language.toUpperCase()}</span>
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
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                The Future of <span className="text-primary">Education</span> in Ethiopia
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                DebterLink connects schools, teachers, parents, and students in one unified platform. Experience the most advanced school management system designed for Ethiopian excellence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Watch Demo
                  </Button>
                </Link>
              </div>
              
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border bg-card">
                <OptimizedImage src={heroImage} alt="Students learning with tablets in Ethiopian classroom" className="w-full object-cover h-[500px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <p className="font-medium text-lg">Empowering the next generation</p>
                    <p className="text-sm opacity-80">Harar, Ethiopia</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Card */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border max-w-xs hidden md:block"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Attendance Recorded</p>
                    <p className="text-xs text-muted-foreground">Just now by T. Alemu</p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[92%]" />
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Daily Rate</span>
                  <span>92%</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-primary/5 blur-3xl rounded-full opacity-50 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-full bg-secondary/10 blur-3xl rounded-full opacity-50 -translate-x-1/2" />
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need in one view</h2>
            <p className="text-muted-foreground text-lg">
              Our dashboard brings all your critical metrics together. From attendance to financial reports, manage it all with ease.
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-card"
          >
            <OptimizedImage src={dashboardImage} alt="Modern dashboard interface showing school analytics" className="w-full" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Feature Section */}
      <section className="py-24 bg-muted/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl border bg-card rotate-2 hover:rotate-0 transition-transform duration-500">
                <OptimizedImage src={teacherImage} alt="Ethiopian teacher taking attendance on tablet" className="w-full h-[400px] object-cover" />
              </div>
            </motion.div>
            
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                For Teachers
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold">Digital Tools for Modern Educators</h2>
              <p className="text-lg text-muted-foreground">
                Say goodbye to paper attendance and manual grade calculations. DebterLink gives teachers powerful digital tools to manage their classrooms efficiently.
              </p>
              <ul className="space-y-3">
                {['Instant Attendance Taking', 'Automated Grade Calculations', 'Direct Parent Messaging', 'Digital Lesson Planning'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button variant="outline" size="lg">Explore Teacher Features</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Trusted by Ethiopian Schools</h2>
            <p className="text-muted-foreground mt-4">Hear from the educators transforming their schools with DebterLink.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-2xl border shadow-sm relative"
              >
                <div className="absolute -top-4 -right-4 text-6xl text-primary/10 font-serif">"</div>
                <p className="text-lg mb-6 italic text-muted-foreground relative z-10">
                  {item.quote}
                </p>
                <div className="flex items-center gap-4">
                  <OptimizedImage src={item.image} alt={`${item.name} - ${item.role}`} className="h-12 w-12 rounded-full object-cover border-2 border-primary/20" />
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">Ready to transform your school?</h2>
          <p className="text-primary-foreground/80 text-xl mb-10 max-w-2xl mx-auto">
            Join the growing network of digital schools in Ethiopia. Start your 30-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg w-full sm:w-auto">
                Get Started Now
              </Button>
            </Link>
            
          </div>
        </div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Logo />
              <p className="text-sm text-muted-foreground">
                Building the digital infrastructure for Ethiopia's education system.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary">Features</a></li>
                <li><a href="#features" className="hover:text-primary">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#testimonials" className="hover:text-primary">About Us</a></li>
                <li><a href="#testimonials" className="hover:text-primary">Careers</a></li>
                <li><a href="#testimonials" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#features" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DebterLink. All rights reserved. Made with in Ethiopia.
          </div>
        </div>
      </footer>
    </div>
  );
}
