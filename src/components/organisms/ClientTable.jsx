import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import StatusBadge from '@/components/molecules/StatusBadge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { clientService } from '@/services/api/clientService'
import { formatDistanceToNow } from 'date-fns'

const ClientTable = ({ onCreateClient }) => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clientService.getAll()
      setClients(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading variant="table" />
  if (error) return <Error message={error} onRetry={loadClients} />
  if (clients.length === 0) {
    return (
      <Empty
        icon="Users"
        title="No clients yet"
        description="Start by inviting your first client to create their personalized workspace."
        actionLabel="Invite Client"
        onAction={onCreateClient}
      />
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deliverables
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client, index) => (
              <motion.tr
                key={client.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-medium text-sm">
{client.Name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {client.Name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {client.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={client.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {client.last_login 
                    ? formatDistanceToNow(new Date(client.last_login), { addSuffix: true })
                    : 'Never'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-900">
                      {client.open_deliverables || 0} open
                    </span>
                    <span className="text-sm text-gray-500">
                      {client.total_deliverables || 0} total
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      as={Link}
                      to={`/client/${client.Id}`}
                    >
                      <ApperIcon name="ExternalLink" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      as={Link}
                      to={`/client/${client.Id}/workspace`}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default ClientTable