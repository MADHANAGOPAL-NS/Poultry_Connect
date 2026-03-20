import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, UserX, Eye, EyeOff } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const AccountSettings = () => {
    const { user, signOut, updateUser } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form & Upload states
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [localAvatar, setLocalAvatar] = useState<string | null>(null);

    // Crop states
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const getCroppedImg = (imageSrc: string, pixelCrop: any): Promise<string> => {
        return new Promise((resolve) => {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;
                const ctx = canvas.getContext('2d');

                ctx?.drawImage(
                    image,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height
                );

                resolve(canvas.toDataURL('image/jpeg'));
            };
        });
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ full_name: fullName })
            });

            if (!res.ok) throw new Error('Failed to update profile');

            updateUser({
                ...user,
                user_metadata: { ...user?.user_metadata, full_name: fullName }
            });

            toast({
                title: 'Profile Updated',
                description: 'Your name has been updated successfully.',
            });
        } catch (err: unknown) {
            toast({
                title: 'Update failed',
                description: 'Could not update your profile.',
                variant: 'destructive',
            });
        } finally {
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
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password })
            });

            if (!res.ok) throw new Error('Failed to update password');

            toast({
                title: 'Password Updated',
                description: 'Your password has been securely changed.',
            });
            setPassword('');
            setConfirmPassword('');
        } catch (err: unknown) {
            toast({
                title: 'Update failed',
                description: 'Could not update your password.',
                variant: 'destructive',
            });
        } finally {
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
        reader.onloadend = () => {
            setImageToCrop(reader.result as string);
            setCropModalOpen(true);
        };
        reader.readAsDataURL(file);

        // Reset input so same file can trigger change again
        e.target.value = '';
    };

    const handleSaveCrop = async () => {
        if (!imageToCrop || !croppedAreaPixels) return;

        setLoading(true);
        const croppedImageBase64 = await getCroppedImg(imageToCrop, croppedAreaPixels);

        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ avatar_url: croppedImageBase64 })
            });

            if (!res.ok) throw new Error('Failed to update avatar');

            updateUser({
                ...user,
                user_metadata: { ...user?.user_metadata, avatar_url: croppedImageBase64 }
            });

            toast({
                title: 'Avatar Updated',
                description: 'Your newly cropped profile picture has been saved.',
            });
            setLocalAvatar(croppedImageBase64);
            setCropModalOpen(false);
            setImageToCrop(null);
        } catch (error) {
            toast({
                title: 'Update failed',
                description: 'Failed to update avatar. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you absolutely sure you want to delete your account? This action cannot be undone!')) {
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/delete`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to delete account');
            }

            toast({
                title: 'Account Deleted',
                description: 'Your account and all associated data have been permanently removed.',
            });

            await signOut({ silent: true }); // Clear state quietly to prevent overwriting the deleted alert
        } catch (error: any) {
            toast({
                title: 'Deletion Failed',
                description: error.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
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
                            {localAvatar || user?.user_metadata?.avatar_url ? (
                                <img
                                    src={localAvatar || user?.user_metadata?.avatar_url}
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
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                    required
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    minLength={6}
                                    required
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
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

            {/* Crop Dialog */}
            <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Crop Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="relative h-[300px] w-full bg-gray-900 overflow-hidden rounded-md border">
                        {imageToCrop && (
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                                onZoomChange={setZoom}
                            />
                        )}
                    </div>

                    <DialogFooter className="mt-4 flex sm:justify-between items-center w-full">
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-1/2 accent-green-600"
                        />
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setCropModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveCrop} className="bg-green-600 hover:bg-green-700" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Crop
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AccountSettings;
