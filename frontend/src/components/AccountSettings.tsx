import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, UserX } from 'lucide-react';

const AccountSettings = () => {
    const { user, signOut } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form states
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mock API update
            setTimeout(() => {
                toast({
                    title: 'Profile Updated',
                    description: 'Your name has been updated locally.',
                });
                setLoading(false);
            }, 500);
        } catch (err: unknown) {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({
                title: 'Passwords mismatch',
                description: 'The new passwords do not match.',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);
        try {
            setTimeout(() => {
                toast({
                    title: 'Password Mock',
                    description: 'Custom password updating would happen here.',
                });
                setPassword('');
                setConfirmPassword('');
                setLoading(false);
            }, 500);
        } catch (err: unknown) {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: 'File too large',
                description: 'Please select an image smaller than 2MB.',
                variant: 'destructive',
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            setLoading(true);
            setTimeout(() => {
                toast({
                    title: 'Avatar Mocked',
                    description: 'Avatar update mock successful.',
                });
                setLoading(false);
            }, 500);
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you absolutely sure you want to delete your account? This action cannot be undone!')) {
            return;
        }
        setLoading(true);
        setTimeout(() => {
            toast({
                title: 'Account Deleted Mock',
                description: 'Your account has been deleted locally.',
            });
            setLoading(false);
            signOut();
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

            {/* Profile Picture & General Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                        <CardDescription>Upload a picture to personalize your account</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-6">
                            {user?.user_metadata?.avatar_url ? (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Upload className="h-10 w-10 text-gray-400" />
                            )}
                        </div>
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                            <div className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors inline-block">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Choose Image'}
                            </div>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={loading}
                            />
                        </Label>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                        <CardDescription>Update your display name</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Security Settings */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="max-w-xs mt-2 bg-gray-900 border hover:bg-gray-800 text-white">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-0 shadow-sm border-t-4 border-t-red-500">
                <CardHeader>
                    <CardTitle className="text-red-500">Danger Zone</CardTitle>
                    <CardDescription>Permanently delete your account and all associated data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        variant="destructive"
                        className="bg-red-500 hover:bg-red-600"
                    >
                        <UserX className="mr-2 h-4 w-4" />
                        Delete Account
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AccountSettings;
