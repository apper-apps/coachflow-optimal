import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import CoachDashboard from '@/components/pages/CoachDashboard'
import ClientDashboard from '@/components/pages/ClientDashboard'
import ResourceLibrary from '@/components/pages/ResourceLibrary'
import DeliverableManager from '@/components/pages/DeliverableManager'
import PageBuilder from '@/components/pages/PageBuilder'
import ClientWorkspace from '@/components/pages/ClientWorkspace'
import Templates from '@/components/pages/Templates'
import Settings from '@/components/pages/Settings'
import PortalList from '@/components/pages/PortalList'
import PortalBuilder from '@/components/pages/PortalBuilder'

function App() {
  return (
    <>
<Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CoachDashboard />} />
          <Route path="/clients" element={<CoachDashboard />} />
          <Route path="/portals" element={<PortalList />} />
          <Route path="/portals/:portalId/builder" element={<PortalBuilder />} />
          <Route path="/resources" element={<ResourceLibrary />} />
          <Route path="/deliverables" element={<DeliverableManager />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/client/:clientId" element={<ClientDashboard />} />
          <Route path="/client/:clientId/workspace" element={<ClientWorkspace />} />
          <Route path="/client/:clientId/page/:pageId/edit" element={<PageBuilder />} />
        </Route>
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />
    </>
  )
}

export default App