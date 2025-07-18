import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FormField from "@/components/molecules/FormField";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { blockService } from "@/services/api/blockService";

const PageBuilder = ({
  pageId, 
  onSave, 
  mode = 'editor', 
  pages = [], 
  selectedPageId = null,
  setSelectedPageId = () => {},
  onReorderPages = () => {},
  onToggleVisibility = () => {},
  onDuplicatePage = () => {},
  onDeletePage = () => {},
  onCreatePage = () => {}
}) => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);
  const [showCreatePageModal, setShowCreatePageModal] = useState(false);
  const blockTypes = [
    { type: 'text', label: 'Text Block', icon: 'Type', draggable: true },
    { type: 'link', label: 'Link', icon: 'Link', draggable: true },
    { type: 'embed', label: 'Embed', icon: 'Monitor', draggable: true },
{ type: 'file', label: 'File', icon: 'File', draggable: true },
    { type: 'checklist', label: 'Checklist', icon: 'CheckSquare', draggable: true }
  ];

useEffect(() => {
    loadBlocks();
  }, [pageId]);

  const loadBlocks = async () => {
    if (!pageId) {
      setLoading(false);
      return;
    }
    
try {
      setLoading(true);
      setError(null);
      const data = await blockService.getByPageId(pageId);
      setBlocks(data || []);
} catch (err) {
      setError(err?.message || 'Failed to load blocks');
    } finally {
      setLoading(false);
    }
  };

const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    // Update sort_order for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
sort_order: index
    }));

    setBlocks(updatedItems);

    try {
await blockService.reorderBlocks(pageId, updatedItems);
      toast.success('Block order updated');
    } catch (error) {
      console.error('Failed to reorder blocks:', error);
      toast.error('Failed to update block order');
    }
  };

  const addBlock = async (type) => {
    const newBlock = {
      page_id: pageId,
      type,
content: getDefaultContent(type),
      sort_order: blocks.length
    };

    try {
      const created = await blockService.create(newBlock);
setBlocks(prev => [...prev, created]);
      setEditingBlock(created.Id);
      toast.success('Block added');
    } catch (error) {
      console.error('Failed to add block:', error);
      toast.error('Failed to add block');
    }
};

  const updateBlock = async (blockId, updates) => {
    try {
      const updated = await blockService.update(blockId, updates);
setBlocks(prev => prev.map(block =>
        block.Id === blockId ? updated : block
      ));
      toast.success('Block updated');
    } catch (error) {
      console.error('Failed to update block:', error);
toast.error('Failed to update block');
    }
  };

  const deleteBlock = async (blockId) => {
    try {
await blockService.delete(blockId);
      setBlocks(prev => prev.filter(block => block.Id !== blockId));
      toast.success('Block deleted');
    } catch (error) {
      console.error('Failed to delete block:', error);
      toast.error('Failed to delete block');
    }
};

  const getDefaultContent = (type) => {
    switch (type) {
      case 'text':
return { text: 'Enter your text here...' };
      case 'link':
        return { url: '', title: '', description: '' };
      case 'embed':
        return { url: '', title: '' };
      case 'file':
return { url: '', filename: '', description: '' };
      case 'checklist':
        return { items: [{ text: 'Sample item', completed: false }] };
      default:
        return {};
    }
  };

const renderBlock = (block) => {
    switch (block.type) {
      case 'text':
        return (
          <div className="prose prose-sm max-w-none">
            <p>{block.content?.text || 'No content'}</p>
</div>
        );
      case 'link':
        return (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <ApperIcon name="Link" size={16} className="text-blue-600" />
            <div>
              <a href={block.content?.url || '#'} className="text-blue-600 font-medium hover:underline">
                {block.content?.title || 'Untitled Link'}
            </a>
            {block.content?.description && (
              <p className="text-sm text-gray-600 mt-1">{block.content.description}</p>
            )}
</div>
          </div>
        );
      case 'embed':
        return (
          <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="Monitor" size={32} className="text-gray-400 mb-2" />
<p className="text-sm text-gray-600">{block.content?.title || 'Embedded Content'}</p>
            </div>
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <ApperIcon name="File" size={16} className="text-gray-600" />
<div>
              <p className="font-medium text-gray-900">{block.content?.filename || 'Untitled File'}</p>
              {block.content?.description && (
                <p className="text-sm text-gray-600">{block.content.description}</p>
              )}
            </div>
          </div>
        );
      case 'checklist':
        return (
          <div className="space-y-2">
            {block.content?.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item?.completed || false}
                  readOnly
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className={item?.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
                  {item?.text || 'Untitled item'}
                </span>
              </div>
            ))}
</div>
        );
      default:
        return <div className="text-gray-500">Unknown block type</div>;
    }
  };
  const renderBlockEditor = (block) => {
    switch (block.type) {
      case 'text':
return (
          <FormField
            label="Content"
            value={block.content?.text || ''}
            onChange={(e) => updateBlock(block.Id, {
              content: { ...block.content, text: e.target.value }
            })}
            as="textarea"
rows={4}
          />
        );
      case 'link':
        return (
          <div className="space-y-4">
            <FormField
              label="URL"
              value={block.content?.url || ''}
              onChange={(e) => updateBlock(block.Id, {
                content: { ...block.content, url: e.target.value }
              })}
            />
            <FormField
              label="Title"
              value={block.content?.title || ''}
              onChange={(e) => updateBlock(block.Id, {
                content: { ...block.content, title: e.target.value }
              })}
            />
            <FormField
              label="Description"
              value={block.content?.description || ''}
              onChange={(e) => updateBlock(block.Id, {
                content: { ...block.content, description: e.target.value }
              })}
/>
          </div>
        );
      case 'embed':
        return (
          <div className="space-y-4">
            <FormField
              label="URL"
              value={block.content?.url || ''}
              onChange={(e) => updateBlock(block.Id, {
                content: { ...block.content, url: e.target.value }
              })}
              placeholder="Enter embed URL..."
            />
            <FormField
              label="Title"
              value={block.content?.title || ''}
              onChange={(e) => updateBlock(block.Id, {
                content: { ...block.content, title: e.target.value }
              })}
              placeholder="Enter embed title..."
/>
          </div>
        );
      case 'file':
        return (
          <div className="space-y-4">
            <FormField
              label="File URL"
              value={block.content?.url || ''}
              onChange={(e) => updateBlock(block.Id, {
                content: { ...block.content, url: e.target.value }
              })}
              placeholder="Enter file URL..."
            />
            <FormField
              label="Filename"
              value={block.content?.filename || ''}
              onChange={(e) => updateBlock(block.Id, {
                content: { ...block.content, filename: e.target.value }
              })}
              placeholder="Enter filename..."
            />
            <FormField
              label="Description"
              value={block.content?.description || ''}
              onChange={(e) => updateBlock(block.Id, {
                content: { ...block.content, description: e.target.value }
              })}
              placeholder="Enter file description..."
/>
          </div>
        );
      case 'checklist':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Checklist Items</label>
              <Button
                size="sm"
                variant="ghost"
onClick={() => {
                  const currentItems = block.content?.items || [];
                  updateBlock(block.Id, {
                    content: {
                      ...block.content,
                      items: [...currentItems, { text: '', completed: false }]
                    }
                  });
                }}
              >
                <ApperIcon name="Plus" size={14} className="mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {(block.content?.items || []).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
type="checkbox"
                    onChange={(e) => {
                      const updatedItems = [...(block.content?.items || [])];
                      updatedItems[index] = { ...item, completed: e.target.checked };
                      updateBlock(block.Id, {
                        content: { ...block.content, items: updatedItems }
                      });
}}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <input
type="text"
                    onChange={(e) => {
                      const updatedItems = [...(block.content?.items || [])];
                      updatedItems[index] = { ...item, text: e.target.value };
                      updateBlock(block.Id, {
                        content: { ...block.content, items: updatedItems }
                      });
}}
                    placeholder="Enter item text..."
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button
size="sm"
                    onClick={() => {
                      const updatedItems = (block.content?.items || []).filter((_, i) => i !== index);
                      updateBlock(block.Id, {
                        content: { ...block.content, items: updatedItems }
                      });
                    }}
>
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
))}
            </div>
          </div>
        );
      default:
        return <div className="text-gray-500">Editor not implemented for this block type</div>;
    }
};

  if (loading) return <Loading variant="form" />;
  if (error) return <Error message={error} onRetry={loadBlocks} />;

  return (
    <div className="flex h-full">
{mode === 'portal' && (
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pages</h3>
              <Button 
                size="sm" 
                onClick={() => setShowCreatePageModal(true)}
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                New Page
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
<DragDropContext onDragEnd={(result) => {
              if (!result.destination) return;
              const pageIds = pages.map(p => p.Id);
              const [reorderedId] = pageIds.splice(result.source.index, 1);
              pageIds.splice(result.destination.index, 0, reorderedId);
              onReorderPages?.(pageIds);
            }}>
              <Droppable droppableId="pages">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    {pages.sort((a, b) => a.sort_order - b.sort_order).map((page, index) => (
                      <Draggable key={page.Id} draggableId={page.Id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`page-item ${snapshot.isDragging ? 'drag-ghost' : ''}`}
                          >
                            <Card 
                              className={`p-3 cursor-pointer transition-all ${
                                selectedPageId === page.Id ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-sm'
                              }`}
                              onClick={() => setSelectedPageId(page.Id)}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <ApperIcon name="GripVertical" size={14} />
                                </div>
                                <ApperIcon name={page.icon || 'FileText'} size={16} />
                                <span className="flex-1 text-sm font-medium">{page.title}</span>
                                <div className="flex items-center gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onToggleVisibility?.(page.Id)
                                    }}
                                  >
                                    <ApperIcon name={page.is_visible ? 'Eye' : 'EyeOff'} size={12} />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onDuplicatePage?.(page.Id)
                                    }}
                                  >
                                    <ApperIcon name="Copy" size={12} />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onDeletePage?.(page.Id)
                                    }}
                                  >
                                    <ApperIcon name="Trash2" size={12} />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
</div>
        </div>
      )}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
<div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {mode === 'portal' && selectedPageId
                  ? pages.find(p => p.Id === selectedPageId)?.title 
                  : 'Page Content'
                }
              </h3>
              <Button onClick={onSave} size="sm">
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Page
              </Button>
            </div>

            <DropZone 
              onDrop={async (blockType) => {
                if (mode === 'portal' && !selectedPageId) return;
                await addBlock(blockType);
              }}
              disabled={mode === 'portal' && !selectedPageId}
            >
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="blocks">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-4 min-h-[400px]"
                    >
                      {blocks.length === 0 && (
                        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
                          <div className="text-center">
                            <ApperIcon name="FileText" size={48} className="mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium">No blocks yet</p>
                            <p className="text-sm">Drag blocks from the sidebar or click to add them</p>
                          </div>
                        </div>
                      )}
                      {blocks.map((block, index) => (
                        <Draggable
                          key={block.Id}
                          draggableId={block.Id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`block-item ${snapshot.isDragging ? 'drag-ghost' : ''}`}
                              layout
                            >
                              <Card className="p-4 hover:shadow-card transition-all duration-200">
                                <div className="flex items-start justify-between mb-3">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="p-1 text-gray-400 hover:text-gray-600 cursor-move"
                                  >
                                    <ApperIcon name="GripVertical" size={16} />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingBlock(
                                        editingBlock === block.Id ? null : block.Id
                                      )}
                                    >
                                      <ApperIcon name="Edit" size={14} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => deleteBlock(block.Id)}
                                    >
                                      <ApperIcon name="Trash2" size={14} />
                                    </Button>
                                  </div>
                                </div>

                                {editingBlock === block.Id ? (
                                  <div className="space-y-4">
                                    {renderBlockEditor(block)}
                                  </div>
                                ) : (
                                  <div className="min-h-[60px]">
                                    {renderBlock(block)}
                                  </div>
                                )}
                              </Card>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </DropZone>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Block</h3>
            <div className="space-y-2">
              {blockTypes.map(blockType => (
                <DraggableBlockType
                  key={blockType.type}
                  blockType={blockType}
                  onClick={() => addBlock(blockType.type)}
                  disabled={mode === 'portal' && !selectedPageId}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {showCreatePageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Page</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreatePageModal(false)}>
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
<form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const title = formData.get('title');
                const icon = formData.get('icon');
                
                if (title && onCreatePage) {
                  await onCreatePage({
                    title,
                    slug: title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
                    icon: icon || 'FileText',
                    sort_order: pages.length + 1,
                    is_visible: true
                  });
                  setShowCreatePageModal(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter page title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  name="icon"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="FileText">Document</option>
                  <option value="Home">Home</option>
                  <option value="Target">Target</option>
                  <option value="BookOpen">Book</option>
                  <option value="Calendar">Calendar</option>
                  <option value="Settings">Settings</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Create Page</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreatePageModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
)}
    </div>
  );
};

// Drop zone component for drag-and-drop functionality
const DropZone = ({ children, onDrop, disabled }) => {
  const { getRootProps, getInputProps, isDragOver } = useDropzone({
    onDrop: (acceptedFiles, fileRejections, event) => {
// Handle drag from block palette
      const blockType = event.dataTransfer?.getData('application/block-type');
      if (blockType && !disabled) {
        onDrop(blockType);
      }
    },
    noClick: true,
    noKeyboard: true,
    disabled
  });

  return (
    <div
      {...getRootProps()}
      className={`relative ${isDragOver && !disabled ? 'drag-over' : ''}`}
    >
      <input {...getInputProps()} />
      {children}
      {isDragOver && !disabled && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <ApperIcon name="Plus" size={32} className="mx-auto mb-2 text-primary" />
            <p className="text-primary font-medium">Drop block here</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Draggable block type component
const DraggableBlockType = ({ blockType, onClick, disabled }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/block-type', blockType.type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start cursor-grab active:cursor-grabbing"
      onClick={onClick}
      disabled={disabled}
      draggable={!disabled}
      onDragStart={handleDragStart}
    >
      <ApperIcon name={blockType.icon} size={16} className="mr-3" />
      {blockType.label}
    </Button>
);
};

export default PageBuilder;