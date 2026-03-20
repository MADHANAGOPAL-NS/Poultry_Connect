import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardContent from '@/components/DashboardContent';
import HealthPredictor from '@/components/HealthPredictor/index';
import PredictionHistory from '@/components/HealthPredictor/PredictionHistory';
import AccountSettings from '@/components/AccountSettings';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic auth check
    if (!user) {
      navigate('/signin');
      return;
    }
    setLoading(false);
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1890ff]" />
      </div>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardContent />}
      {activeTab === 'predictor' && <HealthPredictor />}
      {activeTab === 'history' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <PredictionHistory />
        </div>
      )}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Your Profile</h2>
          <p className="text-gray-500">Manage your profile details.</p>
        </div>
      )}
      {activeTab === 'results' && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Results</h2>
          <p className="text-gray-500">Detailed prediction results and analytics.</p>
        </div>
      )}
      {activeTab === 'alerts' && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Exceptions & Alerts</h2>
          <p className="text-gray-500">Critical alerts that require immediately attention.</p>
        </div>
      )}
      {activeTab === 'account' && <AccountSettings />}
    </DashboardLayout>
  );
};

export default Dashboard;
