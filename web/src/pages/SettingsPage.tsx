import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Save,
  Download,
  Upload,
  Trash2,
  Key,
  Users,
  Calendar
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    assignments: true,
    grades: true,
    attendance: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
  });

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="administrator" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-serif font-bold">Settings</h1>
              <p className="text-muted-foreground">Manage system settings and preferences</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      School Information
                    </CardTitle>
                    <CardDescription>Update school details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>School Name</Label>
                        <Input defaultValue="Addis Ababa Secondary School" />
                      </div>
                      <div>
                        <Label>School Code</Label>
                        <Input defaultValue="AASS-001" />
                      </div>
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Input defaultValue="Addis Ababa, Ethiopia" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Phone</Label>
                        <Input defaultValue="+251 11 123 4567" />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" defaultValue="info@school.edu" />
                      </div>
                    </div>
                    <div>
                      <Label>Website</Label>
                      <Input defaultValue="https://school.edu" />
                    </div>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Academic Settings
                    </CardTitle>
                    <CardDescription>Configure academic year and calendar settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Academic Year</Label>
                        <Input defaultValue="2024-2025" />
                      </div>
                      <div>
                        <Label>Semester</Label>
                        <Select defaultValue="first">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="first">First Semester</SelectItem>
                            <SelectItem value="second">Second Semester</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Calendar Type</Label>
                      <Select defaultValue="both">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gregorian">Gregorian</SelectItem>
                          <SelectItem value="ethiopian">Ethiopian</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>Configure how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, email: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, sms: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications</p>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, push: checked })
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Notification Types</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Assignment Updates</Label>
                          <p className="text-sm text-muted-foreground">Get notified about new assignments</p>
                        </div>
                        <Switch
                          checked={notifications.assignments}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, assignments: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Grade Updates</Label>
                          <p className="text-sm text-muted-foreground">Get notified when grades are posted</p>
                        </div>
                        <Switch
                          checked={notifications.grades}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, grades: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Attendance Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified about attendance issues</p>
                        </div>
                        <Switch
                          checked={notifications.attendance}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, attendance: checked })
                          }
                        />
                      </div>
                    </div>

                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>Manage security and authentication settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Switch
                          checked={security.twoFactor}
                          onCheckedChange={(checked) =>
                            setSecurity({ ...security, twoFactor: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div>
                        <Label>Session Timeout (minutes)</Label>
                        <Select
                          value={security.sessionTimeout}
                          onValueChange={(value) =>
                            setSecurity({ ...security, sessionTimeout: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Separator />
                      <div>
                        <Label>Password Expiry (days)</Label>
                        <Select
                          value={security.passwordExpiry}
                          onValueChange={(value) =>
                            setSecurity({ ...security, passwordExpiry: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="60">60 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Password Management</h3>
                      <div>
                        <Label>Current Password</Label>
                        <Input type="password" placeholder="Enter current password" />
                      </div>
                      <div>
                        <Label>New Password</Label>
                        <Input type="password" placeholder="Enter new password" />
                      </div>
                      <div>
                        <Label>Confirm New Password</Label>
                        <Input type="password" placeholder="Confirm new password" />
                      </div>
                      <Button>
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </div>

                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Security Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* System Settings */}
              <TabsContent value="system" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Data Management
                    </CardTitle>
                    <CardDescription>Backup, restore, and manage system data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <p className="font-medium">Create Backup</p>
                        <p className="text-sm text-muted-foreground">Backup all system data</p>
                      </div>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Backup Now
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <p className="font-medium">Restore Backup</p>
                        <p className="text-sm text-muted-foreground">Restore from a previous backup</p>
                      </div>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Restore
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20">
                      <div>
                        <p className="font-medium text-destructive">Clear All Data</p>
                        <p className="text-sm text-muted-foreground">Permanently delete all system data</p>
                      </div>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Configuration
                    </CardTitle>
                    <CardDescription>Configure email server settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>SMTP Server</Label>
                      <Input placeholder="smtp.example.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Port</Label>
                        <Input type="number" placeholder="587" />
                      </div>
                      <div>
                        <Label>Security</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tls">TLS</SelectItem>
                            <SelectItem value="ssl">SSL</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Email Address</Label>
                      <Input type="email" placeholder="noreply@school.edu" />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input type="password" placeholder="Email password" />
                    </div>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Email Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}





