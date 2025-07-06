import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import FormField from '@/components/molecules/FormField'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile', icon: 'User' },
    { id: 'workspace', name: 'Workspace', icon: 'Settings' },
    { id: 'notifications', name: 'Notifications', icon: 'Bell' },
    { id: 'branding', name: 'Branding', icon: 'Palette' },
    { id: 'billing', name: 'Billing', icon: 'CreditCard' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Full Name"
                  defaultValue="Alex Johnson"
                />
                <FormField
                  label="Email Address"
                  defaultValue="alex@coachflow.com"
                />
                <FormField
                  label="Phone Number"
                  defaultValue="+1 (555) 123-4567"
                />
                <FormField
                  label="Time Zone"
                  defaultValue="Pacific Time (PT)"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xl">AJ</span>
                </div>
                <div>
                  <Button variant="secondary" size="sm">
                    <ApperIcon name="Upload" size={16} className="mr-2" />
                    Upload New Photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        )

      case 'workspace':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Workspace Settings</h3>
              <div className="space-y-4">
                <FormField
                  label="Workspace Name"
                  defaultValue="Alex's Coaching Hub"
                />
                <FormField
                  label="Default Client Dashboard Theme"
                  as="select"
                  defaultValue="light"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </FormField>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="auto-assign"
                    defaultChecked
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="auto-assign" className="text-sm text-gray-700">
                    Auto-assign global resources to new clients
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
              <div className="space-y-4">
                <Button variant="secondary">
                  <ApperIcon name="Key" size={16} className="mr-2" />
                  Change Password
                </Button>
                <Button variant="secondary">
                  <ApperIcon name="Shield" size={16} className="mr-2" />
                  Enable Two-Factor Authentication
                </Button>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { id: 'new-deliverable', label: 'New deliverable submitted', defaultChecked: true },
                  { id: 'client-login', label: 'Client login activity', defaultChecked: false },
                  { id: 'comment-added', label: 'Comments added to deliverables', defaultChecked: true },
                  { id: 'resource-viewed', label: 'Resources viewed by clients', defaultChecked: false },
                  { id: 'weekly-summary', label: 'Weekly activity summary', defaultChecked: true }
                ].map(notification => (
                  <div key={notification.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={notification.id}
                      defaultChecked={notification.defaultChecked}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={notification.id} className="text-sm text-gray-700">
                      {notification.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
              <div className="space-y-4">
                {[
                  { id: 'push-deliverable', label: 'New deliverable submitted', defaultChecked: true },
                  { id: 'push-comment', label: 'New comments', defaultChecked: true },
                  { id: 'push-urgent', label: 'Urgent notifications only', defaultChecked: false }
                ].map(notification => (
                  <div key={notification.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={notification.id}
                      defaultChecked={notification.defaultChecked}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={notification.id} className="text-sm text-gray-700">
                      {notification.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'branding':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Colors</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary border border-gray-300"></div>
                    <input
                      type="text"
                      defaultValue="#4F46E5"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-secondary border border-gray-300"></div>
                    <input
                      type="text"
                      defaultValue="#7C3AED"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Logo</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" size={24} className="text-white" />
                </div>
                <div>
                  <Button variant="secondary" size="sm">
                    <ApperIcon name="Upload" size={16} className="mr-2" />
                    Upload New Logo
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    SVG, PNG or JPG. Max size 1MB.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h3>
              <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Professional Plan</h4>
                    <p className="text-sm text-gray-600">Up to 50 clients • Unlimited resources</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">$49</p>
                    <p className="text-sm text-gray-500">/month</p>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <ApperIcon name="CreditCard" size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/26</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Update
                  </Button>
                </div>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
              <Card className="overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {[
                    { date: '2024-01-01', amount: '$49.00', status: 'Paid' },
                    { date: '2023-12-01', amount: '$49.00', status: 'Paid' },
                    { date: '2023-11-01', amount: '$49.00', status: 'Paid' }
                  ].map((invoice, index) => (
                    <div key={index} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.date}</p>
                        <p className="text-sm text-gray-500">Professional Plan</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-900">{invoice.amount}</span>
                        <span className="text-sm text-green-600">{invoice.status}</span>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Download" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and workspace preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-2">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ApperIcon name={tab.icon} size={16} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings