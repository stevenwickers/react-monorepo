import { useState, useEffect, useMemo } from "react";
import productsData from "../data/products.json";
import publishedSnapshotsData from "../data/publishedSnapshots.json";
import SnapshotComparison from "./SnapshotComparison";
import {
  Snapshot,
  PublishedSnapshots,
  createSnapshot,
  updateSnapshotStatuses,
  getActiveSnapshot,
  getSnapshotStats,
  formatDate,
  formatDateForInput,
  exportSnapshotForADL,
  Product,
} from "../utils/publishingUtils";

function PublishingManager() {
  const [publishedSnapshots, setPublishedSnapshots] =
    useState<PublishedSnapshots>(publishedSnapshotsData as PublishedSnapshots);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(
    null,
  );
  const [comparisonSnapshot, setComparisonSnapshot] = useState<Snapshot | null>(
    null,
  );
  const [newSnapshotForm, setNewSnapshotForm] = useState({
    effectiveDate: formatDateForInput(new Date()),
    publishedBy: "system",
    notes: "",
  });

  // Update snapshot statuses on mount and periodically
  useEffect(() => {
    const updateStatuses = () => {
      setPublishedSnapshots((prev) => ({
        ...prev,
        snapshots: updateSnapshotStatuses(prev.snapshots),
      }));
    };

    updateStatuses();
    const interval = setInterval(updateStatuses, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const stats = useMemo(
    () => getSnapshotStats(publishedSnapshots.snapshots),
    [publishedSnapshots],
  );
  const activeSnapshot = useMemo(
    () => getActiveSnapshot(publishedSnapshots.snapshots),
    [publishedSnapshots],
  );

  // Handle create new snapshot
  const handleCreateSnapshot = () => {
    const effectiveDate = new Date(newSnapshotForm.effectiveDate);
    const newSnapshot = createSnapshot(
      productsData as Product[],
      effectiveDate,
      newSnapshotForm.publishedBy,
      newSnapshotForm.notes,
      publishedSnapshots.snapshots,
    );

    const updatedSnapshots = [...publishedSnapshots.snapshots, newSnapshot];
    const updatedWithStatuses = updateSnapshotStatuses(updatedSnapshots);

    setPublishedSnapshots({
      snapshots: updatedWithStatuses,
      currentActiveSnapshotId:
        getActiveSnapshot(updatedWithStatuses)?.id || null,
    });

    // Save to localStorage (in production, this would be an API call)
    localStorage.setItem(
      "publishedSnapshots",
      JSON.stringify({
        snapshots: updatedWithStatuses,
        currentActiveSnapshotId:
          getActiveSnapshot(updatedWithStatuses)?.id || null,
      }),
    );

    setShowCreateModal(false);
    setNewSnapshotForm({
      effectiveDate: formatDateForInput(new Date()),
      publishedBy: "system",
      notes: "",
    });
  };

  // Handle export to ADL
  const handleExportToADL = (snapshot: Snapshot) => {
    const json = exportSnapshotForADL(snapshot);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ADL_Export_${snapshot.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle archive snapshot
  const handleArchiveSnapshot = (snapshotId: string) => {
    const updatedSnapshots = publishedSnapshots.snapshots.map((s) =>
      s.id === snapshotId ? { ...s, status: "archived" as const } : s,
    );

    setPublishedSnapshots({
      snapshots: updatedSnapshots,
      currentActiveSnapshotId: getActiveSnapshot(updatedSnapshots)?.id || null,
    });

    localStorage.setItem(
      "publishedSnapshots",
      JSON.stringify({
        snapshots: updatedSnapshots,
        currentActiveSnapshotId:
          getActiveSnapshot(updatedSnapshots)?.id || null,
      }),
    );
  };

  // Handle compare with WIP
  const handleCompareWithWIP = (snapshot: Snapshot) => {
    setComparisonSnapshot(snapshot);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "archived":
        return "bg-gray-100 text-gray-600 border-gray-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-unifirst-dark">
                Publishing Manager
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Manage product catalog snapshots and publications
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto px-4 py-2 bg-unifirst-teal-600 text-white rounded-lg hover:bg-unifirst-teal-700 transition-colors font-medium text-sm sm:text-base"
            >
              + Create Publication
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">
              Total Snapshots
            </div>
            <div className="text-xl sm:text-2xl font-bold text-unifirst-dark">
              {stats.totalSnapshots}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">Active</div>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {stats.activeCount}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">
              Scheduled
            </div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {stats.scheduledCount}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">
              Archived
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-600">
              {stats.archivedCount}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 col-span-2 sm:col-span-1">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">
              Latest Version
            </div>
            <div className="text-xl sm:text-2xl font-bold text-unifirst-teal-600">
              {stats.latestVersion}
            </div>
          </div>
        </div>

        {/* Active Snapshot Banner */}
        {activeSnapshot && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <div className="text-xs sm:text-sm font-semibold text-green-900 mb-1">
                  Currently Active Snapshot
                </div>
                <div className="text-xs text-green-700">
                  Version {activeSnapshot.version} •{" "}
                  {activeSnapshot.productCount} products • Effective{" "}
                  {formatDate(activeSnapshot.effectiveDate)}
                </div>
              </div>
              <button
                onClick={() => handleExportToADL(activeSnapshot)}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Export to ADL
              </button>
            </div>
          </div>
        )}

        {/* Snapshots List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-base sm:text-lg font-semibold text-unifirst-dark">
              All Snapshots
            </h2>
          </div>

          {publishedSnapshots.snapshots.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No snapshots
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first publication.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-unifirst-teal-600 text-white rounded-lg hover:bg-unifirst-teal-700 transition-colors font-medium"
                >
                  Create First Publication
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {publishedSnapshots.snapshots
                .sort(
                  (a, b) =>
                    new Date(b.publishedDate).getTime() -
                    new Date(a.publishedDate).getTime(),
                )
                .map((snapshot) => (
                  <div
                    key={snapshot.id}
                    className="p-3 sm:p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-unifirst-dark">
                            Version {snapshot.version}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(snapshot.status)}`}
                          >
                            {snapshot.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1 text-xs sm:text-sm text-gray-600 mb-2">
                          <div>
                            <span className="font-medium">Effective Date:</span>{" "}
                            {formatDate(snapshot.effectiveDate)}
                          </div>
                          <div>
                            <span className="font-medium">Published:</span>{" "}
                            {formatDate(snapshot.publishedDate)}
                          </div>
                          <div>
                            <span className="font-medium">Products:</span>{" "}
                            {snapshot.productCount}
                          </div>
                          <div>
                            <span className="font-medium">Published By:</span>{" "}
                            {snapshot.publishedBy}
                          </div>
                        </div>
                        {snapshot.notes && (
                          <p className="text-xs sm:text-sm text-gray-500 italic mt-2">
                            "{snapshot.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedSnapshot(snapshot)}
                          className="flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleCompareWithWIP(snapshot)}
                          className="flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          Compare
                        </button>
                        <button
                          onClick={() => handleExportToADL(snapshot)}
                          className="flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm bg-unifirst-teal-600 text-white rounded hover:bg-unifirst-teal-700 transition-colors"
                        >
                          Export
                        </button>
                        {snapshot.status !== "archived" &&
                          snapshot.status !== "active" && (
                            <button
                              onClick={() => handleArchiveSnapshot(snapshot.id)}
                              className="flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                            >
                              Archive
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Snapshot Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold text-unifirst-dark mb-4">
              Create New Publication
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Effective Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newSnapshotForm.effectiveDate}
                  onChange={(e) =>
                    setNewSnapshotForm({
                      ...newSnapshotForm,
                      effectiveDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unifirst-teal-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Future dates will be scheduled. Past/current dates activate
                  immediately.
                </p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Published By
                </label>
                <input
                  type="text"
                  value={newSnapshotForm.publishedBy}
                  onChange={(e) =>
                    setNewSnapshotForm({
                      ...newSnapshotForm,
                      publishedBy: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unifirst-teal-500 text-sm"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newSnapshotForm.notes}
                  onChange={(e) =>
                    setNewSnapshotForm({
                      ...newSnapshotForm,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unifirst-teal-500 text-sm"
                  placeholder="Optional description of this publication"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-xs sm:text-sm text-blue-800">
                  This will create a snapshot of{" "}
                  <strong>{(productsData as Product[]).length} products</strong>{" "}
                  from the current WIP catalog.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSnapshot}
                className="flex-1 px-4 py-2 bg-unifirst-teal-600 text-white rounded-lg hover:bg-unifirst-teal-700 transition-colors font-medium text-sm sm:text-base order-1 sm:order-2"
              >
                Create Publication
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Snapshot Modal */}
      {selectedSnapshot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-unifirst-dark">
                  Snapshot Details
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Version {selectedSnapshot.version}
                </p>
              </div>
              <button
                onClick={() => setSelectedSnapshot(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <div className="text-xs sm:text-sm font-medium text-gray-700">
                    Status
                  </div>
                  <span
                    className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded border ${getStatusColor(selectedSnapshot.status)}`}
                  >
                    {selectedSnapshot.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-gray-700">
                    Product Count
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-unifirst-dark">
                    {selectedSnapshot.productCount}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-gray-700">
                    Effective Date
                  </div>
                  <div className="text-xs sm:text-sm text-gray-900">
                    {formatDate(selectedSnapshot.effectiveDate)}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-gray-700">
                    Published Date
                  </div>
                  <div className="text-xs sm:text-sm text-gray-900">
                    {formatDate(selectedSnapshot.publishedDate)}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-gray-700">
                    Published By
                  </div>
                  <div className="text-xs sm:text-sm text-gray-900">
                    {selectedSnapshot.publishedBy}
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-gray-700">
                    Snapshot ID
                  </div>
                  <div className="text-xs text-gray-600 font-mono break-all">
                    {selectedSnapshot.id}
                  </div>
                </div>
              </div>

              {selectedSnapshot.notes && (
                <div>
                  <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </div>
                  <div className="text-xs sm:text-sm text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
                    {selectedSnapshot.notes}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleCompareWithWIP(selectedSnapshot)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
                >
                  Compare with WIP
                </button>
                <button
                  onClick={() => {
                    handleExportToADL(selectedSnapshot);
                    setSelectedSnapshot(null);
                  }}
                  className="flex-1 px-4 py-2 bg-unifirst-teal-600 text-white rounded-lg hover:bg-unifirst-teal-700 transition-colors font-medium text-sm sm:text-base"
                >
                  Export to ADL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snapshot Comparison View */}
      {comparisonSnapshot && (
        <SnapshotComparison
          wipProducts={productsData as Product[]}
          publishedProducts={comparisonSnapshot.products}
          onClose={() => setComparisonSnapshot(null)}
        />
      )}
    </div>
  );
}

export default PublishingManager;
