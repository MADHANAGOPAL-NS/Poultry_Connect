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
      {activeTab === 'predictor' && <HealthPredictor hideHistory />}
      {activeTab === 'history' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <PredictionHistory />
        </div>
      )}
      {activeTab === 'account' && <AccountSettings />}
    </DashboardLayout>
  );
};

export default Dashboard;
