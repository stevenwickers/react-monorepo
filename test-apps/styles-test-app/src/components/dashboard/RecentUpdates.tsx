import { Badge } from '@unifirst/ui'

interface Update {
  id: string
  title: string
  type: 'added' | 'updated' | 'removed'
  section: string
  date: string
}

const mockUpdates: Update[] = [
  {
    id: '1',
    title: 'Added new button variants',
    type: 'added',
    section: 'UI Components',
    date: 'Jan 8, 2026',
  },
  {
    id: '2',
    title: 'Updated primary green color value',
    type: 'updated',
    section: 'Color System',
    date: 'Jan 7, 2026',
  },
  {
    id: '3',
    title: 'Added typography scale documentation',
    type: 'added',
    section: 'Typography',
    date: 'Jan 6, 2026',
  },
  {
    id: '4',
    title: 'Removed deprecated logo variant',
    type: 'removed',
    section: 'Logo & Assets',
    date: 'Jan 5, 2026',
  },
  {
    id: '5',
    title: 'Updated governance approval workflow',
    type: 'updated',
    section: 'Governance',
    date: 'Jan 4, 2026',
  },
]

const typeVariants: Record<Update['type'], 'success' | 'primary' | 'error'> = {
  added: 'success',
  updated: 'primary',
  removed: 'error',
}

export default function RecentUpdates() {
  return (
    <div className="bg-white rounded-lg border border-unifirst-gray-light">
      <div className="px-6 py-4 border-b border-unifirst-gray-light">
        <h3 className="text-lg font-semibold text-unifirst-gray-dark">
          Recent Updates
        </h3>
      </div>
      <ul className="divide-y divide-unifirst-gray-light">
        {mockUpdates.map((update) => (
          <li
            key={update.id}
            className="px-6 py-4 hover:bg-unifirst-gray-lightest transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-unifirst-gray-dark">
                {update.title}
              </span>
              <Badge variant={typeVariants[update.type]}>{update.type}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-unifirst-gray-slate">
              <span>{update.section}</span>
              <span>•</span>
              <span>{update.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
