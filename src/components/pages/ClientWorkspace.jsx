import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { clientService } from "@/services/api/clientService";
import { pageService } from "@/services/api/pageService";

const ClientWorkspace = () => {
  const { clientId } = useParams()
  const [client, setClient] = useState(null)
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreatePage, setShowCreatePage] = useState(false)

  useEffect(() => {
    loadWorkspaceData()
  }, [clientId])

  const loadWorkspaceData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [clientData, pagesData] = await Promise.all([
        clientService.getById(parseInt(clientId)),
        pageService.getByClientId(parseInt(clientId))
      ])

      setClient(clientData)
      setPages(pagesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createPage = async (title) => {
    try {
      const newPage = await pageService.create({
        client_id: parseInt(clientId),
        title,
        is_visible: true,
        sort_order: pages.length
      })
      setPages([...pages, newPage])
      setShowCreatePage(false)
    } catch (error) {
      console.error('Failed to create page:', error)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadWorkspaceData} />
  if (!client) return <Error message="Client not found" />

  return (
    <div className="p-6">
    <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <div
                className="h-12 w-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                    {client.name.split(" ").map(n => n[0]).join("")}
                </span>
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{client.name}'s Workspace</h1>
                <p className="text-gray-600">Customize your client's experience</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="secondary" as={Link} to={`/client/${clientId}/dashboard`}>
                <ApperIcon name="LayoutDashboard" size={16} className="mr-2" />Client Dashboard
                          </Button>
            <Button onClick={() => setShowCreatePage(true)}>
                <ApperIcon name="Plus" size={16} className="mr-2" />Add Page
                          </Button>
        </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page, index) => <motion.div
            key={page.Id}
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            transition={{
                delay: index * 0.1
            }}>
            <Card className="p-6 hover:shadow-card transition-all duration-200 group">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                            <ApperIcon name="FileText" size={20} className="text-primary" />
                        </div>
                        <div>
                            <h3
                                className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                {page.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {page.is_visible ? "Visible" : "Hidden"}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm">
                        <ApperIcon name="MoreHorizontal" size={16} />
                    </Button>
                </div>
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ApperIcon name="Layers" size={14} />
                        <span>{page.block_count || 0}blocks</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ApperIcon name="Clock" size={14} />
                        <span>Updated 2 days ago</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        as={Link}
                        to={`/client/${clientId}/page/${page.Id}/edit`}
                        className="flex-1">
                        <ApperIcon name="Edit" size={16} className="mr-2" />Edit
                                        </Button>
                    <Button variant="secondary" size="sm">
                        <ApperIcon name="Eye" size={16} />
                    </Button>
                </div>
            </Card>
        </motion.div>)}
        {pages.length === 0 && <div className="col-span-full">
            <Card className="p-12 text-center">
                <div className="mb-4">
                    <ApperIcon name="FileText" size={48} className="text-gray-400 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pages yet
                                  </h3>
                <p className="text-gray-600 mb-4">Start building your client's workspace by creating their first page.
                                  </p>
                <Button onClick={() => setShowCreatePage(true)}>
                    <ApperIcon name="Plus" size={16} className="mr-2" />Create First Page
                                  </Button>
            </Card>
        </div>}
    </div>
    {showCreatePage && <motion.div
        initial={{
            opacity: 0
        }}
        animate={{
            opacity: 1
        }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
            initial={{
                scale: 0.95,
                opacity: 0
            }}
            animate={{
                scale: 1,
                opacity: 1
            }}
            className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create New Page</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCreatePage(false)}>
                    <ApperIcon name="X" size={16} />
                </Button>
            </div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    const title = e.target.title.value;

                    if (title)
                        createPage(title);
                }}
                className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Page Title
                                        </label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter page title..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required />
                </div>
                <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">Create Page
                                        </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowCreatePage(false)}>Cancel
                                        </Button>
                </div>
            </form>
        </motion.div>
    </motion.div>}
</div>
  )
}

export default ClientWorkspace