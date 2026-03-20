import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email address...');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No verification token found in the URL.');
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/verify-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Your email has been successfully verified! You can now sign in.');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed. The link may be invalid or expired.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('A network error occurred while verifying your email.');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-0 text-center">
                <CardHeader className="pt-10">
                    <div className="flex justify-center mb-6">
                        {status === 'loading' && <Loader2 className="h-16 w-16 text-green-600 animate-spin" />}
                        {status === 'success' && <CheckCircle2 className="h-16 w-16 text-green-600" />}
                        {status === 'error' && <XCircle className="h-16 w-16 text-red-500" />}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {status === 'loading' && 'Verifying Email'}
                        {status === 'success' && 'Email Verified!'}
                        {status === 'error' && 'Verification Failed'}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        {message}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-10 pt-4">
                    {status === 'success' ? (
                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => navigate('/signin')}>
                            Proceed to Sign In
                        </Button>
                    ) : status === 'error' ? (
                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" onClick={() => navigate('/signup')}>
                                Back to Sign Up
                            </Button>
                        </div>
                    ) : null}
                    
                    <div className="mt-8 text-sm text-gray-500">
                        <Link to="/" className="hover:text-green-600 flex items-center justify-center gap-1">
                            Return to Homepage
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VerifyEmail;
