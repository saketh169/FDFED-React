import React, { useState, useEffect } from 'react';

// Theme colors matching NutriConnect design
const THEME = {
  primary: '#1E6F5C',      // Dark Green (primary)
  secondary: '#28B463',    // Medium Green (accent)
  light: '#E8F5E9',        // Light Green background
  lightBg: '#F0F9F7',      // Very light green
  success: '#27AE60',      // Success green
  danger: '#DC3545',       // Red for delete/remove
  warning: '#FFC107',      // Yellow for warning
  info: '#17A2B8',         // Blue for info
  dark: '#2C3E50',         // Dark gray
  lightGray: '#F8F9FA',    // Light gray background
  borderColor: '#E0E0E0',  // Border color
};

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('financial');
  const [settings, setSettings] = useState({
    // Financial Settings
    consultationCommission: 15, // percentage
    platformShare: 20, // percentage

    // Subscription Tiers
    subscriptionTiers: [
      { name: 'Basic', price: 29.99, features: ['Basic consultations', 'Meal planning'] },
      { name: 'Premium', price: 49.99, features: ['Unlimited consultations', 'Custom meal plans', 'Progress tracking'] },
      { name: 'Enterprise', price: 99.99, features: ['All premium features', 'Dedicated support', 'API access'] }
    ],

    // Account Deactivation Rules
    autoDeactivateInactive: true,
    inactiveDaysThreshold: 90,
    autoDeactivateUnverified: false,
    unverifiedDaysThreshold: 30,

    // Content Settings
    termsOfService: '',
    privacyPolicy: '',

    // Announcements
    systemAnnouncement: '',
    announcementEnabled: false,
    announcementType: 'info', // info, warning, success, error

    // Email Settings
    policyChangeEmail: {
      subject: 'Important Policy Update',
      message: 'Dear user,\n\nWe have updated our policies. Please review the changes.\n\nBest regards,\nNutriConnect Team',
      sendToUsers: true,
      sendToDietitians: true,
      sendToOrganizations: true,
      sendToCorporatePartners: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Load settings from API/localStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // In a real app, this would fetch from API
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
          setSettings(s => ({ ...s, ...JSON.parse(savedSettings) }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    setLoading(true);
    try {
      // In a real app, this would save to API
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      setSaveStatus('Settings saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parentField, childField, value) => {
    setSettings(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  const handleSubscriptionTierChange = (index, field, value) => {
    const updatedTiers = [...settings.subscriptionTiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setSettings(prev => ({
      ...prev,
      subscriptionTiers: updatedTiers
    }));
  };

  const sendPolicyChangeEmail = async () => {
    if (!settings.policyChangeEmail.subject || !settings.policyChangeEmail.message) {
      alert('Please fill in both subject and message for the policy change email.');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would call an API to send emails
      const recipients = [];
      if (settings.policyChangeEmail.sendToUsers) recipients.push('users');
      if (settings.policyChangeEmail.sendToDietitians) recipients.push('dietitians');
      if (settings.policyChangeEmail.sendToOrganizations) recipients.push('organizations');
      if (settings.policyChangeEmail.sendToCorporatePartners) recipients.push('corporate_partners');

      console.log('Sending policy change email to:', recipients);
      alert(`Policy change email sent to: ${recipients.join(', ')}`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'financial', label: 'Financial', icon: 'fas fa-dollar-sign' },
    { id: 'subscriptions', label: 'Subscriptions', icon: 'fas fa-crown' },
    { id: 'accounts', label: 'Account Rules', icon: 'fas fa-user-shield' },
    { id: 'content', label: 'Content', icon: 'fas fa-file-alt' },
    { id: 'announcements', label: 'Announcements', icon: 'fas fa-bullhorn' },
    { id: 'emails', label: 'Email Settings', icon: 'fas fa-envelope' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.lightBg }}>
      {/* Header */}
      <div className="bg-white border-b-4" style={{ borderBottomColor: THEME.primary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-3xl font-bold" style={{ color: THEME.primary }}>
              <i className="fas fa-cog mr-3" style={{ color: THEME.secondary }}></i>
              Admin Settings
            </h1>
            <p className="text-gray-600 mt-1">Configure platform settings and policies</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b-2" style={{ borderBottomColor: THEME.primary }}>
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={activeTab === tab.id ? {
                    backgroundColor: THEME.primary,
                    borderBottomColor: THEME.primary
                  } : {
                    borderBottomColor: 'transparent'
                  }}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg border-4 overflow-hidden" style={{ borderColor: THEME.primary }}>
          <div className="p-6">

            {/* Financial Settings */}
            {activeTab === 'financial' && (
              <div className="space-y-8">
                <div className="border-b-4 pb-4" style={{ borderBottomColor: THEME.secondary }}>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: THEME.primary }}>
                    <i className="fas fa-dollar-sign mr-3" style={{ color: THEME.secondary }}></i>
                    Commission Rates
                  </h2>
                  <p className="text-gray-600">Configure platform fees and revenue sharing</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border-2" style={{ borderColor: THEME.light, backgroundColor: THEME.light }}>
                    <label className="block text-sm font-medium mb-2" style={{ color: THEME.primary }}>
                      Consultation Commission (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.consultationCommission}
                      onChange={(e) => handleInputChange('consultationCommission', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border-2 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{ borderColor: THEME.secondary, focusRingColor: THEME.secondary }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Percentage taken from each consultation booking
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border-2" style={{ borderColor: THEME.light, backgroundColor: THEME.light }}>
                    <label className="block text-sm font-medium mb-2" style={{ color: THEME.primary }}>
                      Platform Share (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.platformShare}
                      onChange={(e) => handleInputChange('platformShare', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border-2 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{ borderColor: THEME.secondary, focusRingColor: THEME.secondary }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Platform's share of subscription revenue
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Tiers */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Subscription Pricing Tiers</h2>
                  <p className="text-gray-600">Manage subscription plans and pricing</p>
                </div>

                <div className="space-y-4">
                  {settings.subscriptionTiers.map((tier, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg border-2" style={{ borderColor: THEME.light, backgroundColor: THEME.light }}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: THEME.primary }}>
                            Plan Name
                          </label>
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => handleSubscriptionTierChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border-2 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200"
                            style={{ borderColor: THEME.secondary, focusRingColor: THEME.secondary }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: THEME.primary }}>
                            Monthly Price ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={tier.price}
                            onChange={(e) => handleSubscriptionTierChange(index, 'price', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border-2 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200"
                            style={{ borderColor: THEME.secondary, focusRingColor: THEME.secondary }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: THEME.primary }}>
                            Features (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={tier.features.join(', ')}
                            onChange={(e) => handleSubscriptionTierChange(index, 'features', e.target.value.split(', '))}
                            className="w-full px-3 py-2 border-2 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200"
                            style={{ borderColor: THEME.secondary, focusRingColor: THEME.secondary }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Rules */}
            {activeTab === 'accounts' && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Deactivation Rules</h2>
                  <p className="text-gray-600">Configure automatic account deactivation policies</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Auto-deactivate inactive accounts</h3>
                      <p className="text-sm text-gray-600">Automatically deactivate accounts with no activity</p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.autoDeactivateInactive}
                        onChange={(e) => handleInputChange('autoDeactivateInactive', e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </label>
                  </div>

                  {settings.autoDeactivateInactive && (
                    <div className="bg-white p-6 rounded-lg border-2 ml-4" style={{ borderColor: THEME.light, backgroundColor: THEME.light }}>
                      <label className="block text-sm font-medium mb-2" style={{ color: THEME.primary }}>
                        Inactive days threshold
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.inactiveDaysThreshold}
                        onChange={(e) => handleInputChange('inactiveDaysThreshold', parseInt(e.target.value))}
                        className="w-full max-w-xs px-3 py-2 border-2 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200"
                        style={{ borderColor: THEME.secondary, focusRingColor: THEME.secondary }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Auto-deactivate unverified accounts</h3>
                      <p className="text-sm text-gray-600">Automatically deactivate accounts that remain unverified</p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.autoDeactivateUnverified}
                        onChange={(e) => handleInputChange('autoDeactivateUnverified', e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </label>
                  </div>

                  {settings.autoDeactivateUnverified && (
                    <div className="bg-white p-6 rounded-lg border-2 ml-4" style={{ borderColor: THEME.light, backgroundColor: THEME.light }}>
                      <label className="block text-sm font-medium mb-2" style={{ color: THEME.primary }}>
                        Unverified days threshold
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.unverifiedDaysThreshold}
                        onChange={(e) => handleInputChange('unverifiedDaysThreshold', parseInt(e.target.value))}
                        className="w-full max-w-xs px-3 py-2 border-2 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200"
                        style={{ borderColor: THEME.secondary, focusRingColor: THEME.secondary }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Settings */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Content Management</h2>
                  <p className="text-gray-600">Manage platform terms, policies, and legal content</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border-2" style={{ borderColor: THEME.light, backgroundColor: THEME.light }}>
                    <label className="block text-sm font-medium mb-2" style={{ color: THEME.primary }}>
                      Terms of Service
                    </label>
                    <textarea
                      rows="8"
                      value={settings.termsOfService}
                      onChange={(e) => handleInputChange('termsOfService', e.target.value)}
                      placeholder="Enter terms of service content..."
                      className="w-full px-3 py-2 border-2 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{ borderColor: THEME.secondary, focusRingColor: THEME.secondary }}
                    />
                  </div>

                  <div className="bg-white p-6 rounded-lg border-2" style={{ borderColor: THEME.light, backgroundColor: THEME.light }}>
                    <label className="block text-sm font-medium mb-2" style={{ color: THEME.primary }}>
                      Privacy Policy
                    </label>
                    <textarea
                      rows="8"
                      value={settings.privacyPolicy}
                      onChange={(e) => handleInputChange('privacyPolicy', e.target.value)}
                      placeholder="Enter privacy policy content..."
                      className="w-full px-3 py-2 border-2 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{ borderColor: THEME.secondary, focusRingColor: THEME.secondary }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Announcements */}
            {activeTab === 'announcements' && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">System Announcements</h2>
                  <p className="text-gray-600">Create and manage system-wide announcements and banners</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.announcementEnabled}
                        onChange={(e) => handleInputChange('announcementEnabled', e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Enable system announcement</span>
                    </label>
                  </div>

                  {settings.announcementEnabled && (
                    <>
                      <div className="bg-white p-6 rounded-lg border-2" style={{ borderColor: THEME.light, backgroundColor: THEME.light }}>
                        <label className="block text-sm font-medium mb-2" style={{ color: THEME.primary }}>
                          Announcement Type
                        </label>
                        <select
                          value={settings.announcementType}
                          onChange={(e) => handleInputChange('announcementType', e.target.value)}
                          className="w-full max-w-xs px-3 py-2 border-2 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200"
                          style={{ borderColor: THEME.secondary, focusRingColor: THEME.secondary }}
                        >
                          <option value="info">Info (Blue)</option>
                          <option value="warning">Warning (Yellow)</option>
                          <option value="success">Success (Green)</option>
                          <option value="error">Error (Red)</option>
                        </select>
                      </div>

                      <div className="bg-white p-6 rounded-lg border-2" style={{ borderColor: THEME.light, backgroundColor: THEME.light }}>
                        <label className="block text-sm font-medium mb-2" style={{ color: THEME.primary }}>
                          Announcement Message
                        </label>
                        <textarea
                          rows="4"
                          value={settings.systemAnnouncement}
                          onChange={(e) => handleInputChange('systemAnnouncement', e.target.value)}
                          placeholder="Enter announcement message..."
                          className="w-full px-3 py-2 border-2 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200"
                          style={{ borderColor: THEME.secondary, focusRingColor: THEME.secondary }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'emails' && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Policy Change Notifications</h2>
                  <p className="text-gray-600">Send policy change emails to users based on their role</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border-2" style={{ borderColor: THEME.light, backgroundColor: THEME.light }}>
                    <label className="block text-sm font-medium mb-2" style={{ color: THEME.primary }}>
                      Email Subject
                    </label>
                    <input
                      type="text"
                      value={settings.policyChangeEmail.subject}
                      onChange={(e) => handleNestedChange('policyChangeEmail', 'subject', e.target.value)}
                      className="w-full px-3 py-2 border-2 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{ borderColor: THEME.secondary, focusRingColor: THEME.secondary }}
                      placeholder="Enter email subject..."
                    />
                  </div>

                  <div className="bg-white p-6 rounded-lg border-2" style={{ borderColor: THEME.light, backgroundColor: THEME.light }}>
                    <label className="block text-sm font-medium mb-2" style={{ color: THEME.primary }}>
                      Email Message
                    </label>
                    <textarea
                      rows="6"
                      value={settings.policyChangeEmail.message}
                      onChange={(e) => handleNestedChange('policyChangeEmail', 'message', e.target.value)}
                      className="w-full px-3 py-2 border-2 rounded-md focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{ borderColor: THEME.secondary, focusRingColor: THEME.secondary }}
                      placeholder="Enter email message..."
                    />
                  </div>

                  <div className="bg-white p-6 rounded-lg border-2" style={{ borderColor: THEME.light, backgroundColor: THEME.light }}>
                    <label className="block text-sm font-medium mb-4" style={{ color: THEME.primary }}>
                      Send to User Types
                    </label>
                    <div className="space-y-2">
                      {[
                        { key: 'sendToUsers', label: 'Regular Users' },
                        { key: 'sendToDietitians', label: 'Dietitians' },
                        { key: 'sendToOrganizations', label: 'Organizations' },
                        { key: 'sendToCorporatePartners', label: 'Corporate Partners' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.policyChangeEmail[key]}
                            onChange={(e) => handleNestedChange('policyChangeEmail', key, e.target.checked)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={sendPolicyChangeEmail}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane mr-2"></i>
                        Send Policy Change Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={saveSettings}
            disabled={loading}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Save Settings
              </>
            )}
          </button>
        </div>

        {/* Save Status */}
        {saveStatus && (
          <div className={`mt-4 p-4 rounded-md ${
            saveStatus.includes('successfully')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <i className={`fas ${
              saveStatus.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-circle'
            } mr-2`}></i>
            {saveStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;