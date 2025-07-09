import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PageBuilder from '@/components/organisms/PageBuilder';
import { portalService } from '@/services/api/portalService';
import { pageService } from '@/services/api/pageService';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const PortalBuilder = () => {
  const { portalId } = useParams();
  const navigate = useNavigate();
  const [portal, setPortal] = useState(null);
  const [portalPages, setPortalPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // By wrapping loadPortalData in useCallback, we ensure it's not recreated on every render.
  // It will only be recreated if its dependency, `portalId`, changes.
  const loadPortalData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const portalData = await portalService.getById(parseInt(portalId));
      setPortal(portalData);

      const pages = await pageService.getByPortalId(parseInt(portalId));
      setPortalPages(pages);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load portal data');
    } finally {
      setLoading(false);
    }
  }, [portalId]); // Dependency array is crucial here.

  useEffect(() => {
    loadPortalData();
  }, [loadPortalData]); // Now, this effect only runs when the memoized `loadPortalData` function changes.

  // --- Memoized Event Handlers ---
  // All functions passed to child components should be wrapped in useCallback
  // to prevent unnecessary re-renders and break potential effect loops.

  const handleCreatePage = useCallback(async (pageData) => {
    try {
      const newPage = await pageService.createForPortal(parseInt(portalId), pageData);
      setPortalPages(prev => [...prev, newPage]);
      toast.success('Page created successfully');
      return newPage;
    } catch (err) {
      toast.error('Failed to create page');
      throw err;
    }
  }, [portalId]);

  const handleUpdatePage = useCallback(async (pageId, updates) => {
    try {
      const updatedPage = await pageService.update(pageId, updates);
      setPortalPages(prev => prev.map(p => p.Id === pageId ? updatedPage : p));
      toast.success('Page updated successfully');
      return updatedPage;
    } catch (err) {
      toast.error('Failed to update page');
      throw err;
    }
  }, []); // Empty dependency array as it doesn't depend on props or state.

  const handleDeletePage = useCallback(async (pageId) => {
    try {
      await pageService.delete(pageId);
      setPortalPages(prev => prev.filter(p => p.Id !== pageId));
      toast.success('Page deleted successfully');
    } catch (err) {
      toast.error('Failed to delete page');
      throw err;
    }
  }, []);

  const handleReorderPages = useCallback(async (pageIds) => {
    try {
      await pageService.reorderPages(portalId, pageIds);
      toast.success('Page order updated');
      // Instead of a full reload, you could reorder the pages in local state for a faster UI update.
      await loadPortalData();
    } catch (err) {
      toast.error('Failed to reorder pages');
    }
  }, [portalId, loadPortalData]);

  const handleToggleVisibility = useCallback(async (pageId) => {
    try {
      await pageService.toggleVisibility(pageId);
      toast.success('Page visibility updated');
      // For a better user experience, you could update the page's visibility
      // directly in the `portalPages` state instead of a full reload.
      await loadPortalData();
    } catch (err) {
      toast.error('Failed to update page visibility');
    }
  }, [loadPortalData]);

  const handleDuplicatePage = useCallback(async (pageId) => {
    try {
      const duplicated = await pageService.duplicatePage(pageId);
      setPortalPages(prev => [...prev, duplicated]);
      toast.success('Page duplicated');
      return duplicated;
    } catch (err) {
      toast.error('Failed to duplicate page');
      throw err;
    }
  }, []);


  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPortalData} />;

  return (
    // Switched to a flex-column layout to make it more self-contained and avoid
    // potential layout issues with fixed positioning.
    <div className="h-full flex flex-col bg-gray-50">
      {/* Portal Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/portals')}
            className="mr-4"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Portals
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{portal?.title}</h1>
            <p className="text-sm text-gray-600">Portal Builder - Shared Template</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ApperIcon name="Eye" size={16} className="mr-2" />
            Preview
          </Button>
          <Button variant="outline" size="sm">
            <ApperIcon name="Users" size={16} className="mr-2" />
            Manage Members
          </Button>
        </div>
      </header>

      {/* Page Builder Content */}
      <main className="flex-1 overflow-y-auto">
        <PageBuilder
          mode="portal"
          portalId={parseInt(portalId)}
          pages={portalPages}
          onCreatePage={handleCreatePage}
          onUpdatePage={handleUpdatePage}
          onDeletePage={handleDeletePage}
          onReorderPages={handleReorderPages}
          onToggleVisibility={handleToggleVisibility}
          onDuplicatePage={handleDuplicatePage}
        />
      </main>
    </div>
  );
};

export default PortalBuilder;
