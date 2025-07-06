import Badge from '@/components/atoms/Badge'

const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    submitted: { variant: 'info', label: 'Submitted' },
    reviewed: { variant: 'warning', label: 'Reviewed' },
    needs_changes: { variant: 'danger', label: 'Needs Changes' },
    approved: { variant: 'success', label: 'Approved' },
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'default', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <Badge variant={config.variant} {...props}>
      {config.label}
    </Badge>
  )
}

export default StatusBadge