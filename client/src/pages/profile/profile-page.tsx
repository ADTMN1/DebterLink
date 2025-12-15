import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SanitizedInput } from '@/components/ui/sanitized-input';
import { useSanitizedForm, sanitizationMaps } from '@/hooks/use-sanitized-form';
import { useAuthStore } from '@/store/useAuthStore';
import { User, Mail, Phone, MapPin, Key, Upload, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { profileSchema, passwordChangeSchema, avatarSchema, ProfileFormData, PasswordChangeFormData } from '@/lib/validations';
import type { sanitizationMaps } from '@/hooks/use-sanitized-form';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile form
  const profileForm = useSanitizedForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '+251911223344',
      address: 'Addis Ababa, Ethiopia'
    },
    sanitizationMap: sanitizationMaps.profile,
  });

  // Password form
  const passwordForm = useSanitizedForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    sanitizationMap: {
      currentPassword: 'text',
      newPassword: 'text',
      confirmPassword: 'text'
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = avatarSchema.safeParse({ file });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onProfileSubmit = profileForm.handleSanitizedSubmit(async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        updateUser({
          ...user,
          name: data.name,
          email: data.email,
          avatar: avatarPreview
        });
      }
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  });

  const onPasswordSubmit = passwordForm.handleSanitizedSubmit(async (data: PasswordChangeFormData) => {
    setPasswordLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password updated successfully!');
      passwordForm.reset();
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback className="text-2xl">{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{user?.name}</h3>
              <p className="text-muted-foreground capitalize">{user?.role}</p>
              <div className="mt-4 w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change Avatar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general">
                <TabsList className="mb-4">
                  <TabsTrigger value="general">General Info</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <Form {...profileForm}>
                    <form onSubmit={onProfileSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <SanitizedInput sanitizer="name" placeholder="Enter your full name" className="pl-9" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <SanitizedInput sanitizer="email" placeholder="Enter your email" className="pl-9" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <SanitizedInput sanitizer="phone" placeholder="+251911223344" className="pl-9" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <SanitizedInput sanitizer="address" placeholder="Enter your address" className="pl-9" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <Form {...passwordForm}>
                    <form onSubmit={onPasswordSubmit} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <SanitizedInput sanitizer="text" type="password" placeholder="Enter current password" className="pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <SanitizedInput sanitizer="text" type="password" placeholder="Enter new password" className="pl-9" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <SanitizedInput sanitizer="text" type="password" placeholder="Confirm new password" className="pl-9" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button type="submit" disabled={passwordLoading}>
                          {passwordLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            'Update Password'
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
