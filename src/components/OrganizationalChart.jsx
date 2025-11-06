import React, { useState, useMemo, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNotification } from "../contexts/NotificationContext";
import { buildEmployeeMaps } from "../utils/dataUtils";
import OrgTree from "./OrgTree";

function OrganizationalChart({ data, setData }) {
  const [isMoving, setIsMoving] = useState(false);
  const [mobileMovingEmployee, setMobileMovingEmployee] = useState(null);
  const { showSuccess, showError, showInfo } = useNotification();
    
  const { byManager, directMenteesMap } = useMemo(() => buildEmployeeMaps(data), [data]);

  // Unified move employee function
  const moveEmployee = useCallback(async (employeeId, newManagerId) => {
    setIsMoving(true);
    try {
      const response = await fetch(`/api/employees/${employeeId}/move`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerId: newManagerId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Server rejected move");
      }
      
      const updatedList = await response.json();
      setData(updatedList);
      return { success: true, data: updatedList };
    } catch (error) {
      console.error("Move failed:", error);
      return { success: false, error };
    } finally {
      setIsMoving(false);
    }
  }, [setData]);

  const handleDrop = useCallback(
    async (dragged, target) => {
      const draggedId = dragged.id;
      const targetId = target.id;
      
      // Prevent no-op
      if (draggedId === targetId) return;

      // Store data for rollback and undo
      const previousData = data;
      const previousManagerId = dragged.managerId;
      const previousManager = data.find(e => e.id === previousManagerId);
      
      const employeeName = dragged?.name || 'Employee';
      const managerName = target?.name || 'new manager';
      
      // Optimistic update: change managerId of dragged employee
      const optimisticData = data.map((e) =>
        e.id === draggedId ? { ...e, managerId: targetId } : e
      );
      setData(optimisticData);

      const result = await moveEmployee(draggedId, targetId);
      
      if (result.success) {
        // Show success notification with undo action
        showSuccess(
          `${employeeName} successfully moved to ${managerName}'s team`,
          8000, // Longer duration to give time to undo
          {
            label: 'Undo',
            handler: async () => {
              // Undo the move by restoring previous manager
              const undoResult = await moveEmployee(draggedId, previousManagerId);
              
              if (undoResult.success) {
                showInfo(
                  `Move undone: ${employeeName} restored to ${previousManager?.name || 'previous manager'}'s team`
                );
              } else {
                showError("Failed to undo move. Please try again.");
              }
            }
          }
        );
      } else {
        // Rollback on failure
        setData(previousData);
        showError(result.error?.message || "Failed to move employee. Changes have been reverted.");
      }
    },
    [data, setData, moveEmployee, showSuccess, showError, showInfo]
  );

  const handleMobileMoveStart = useCallback((employee) => {
    setMobileMovingEmployee(employee);
  }, []);

  const handleMobileMoveCancel = useCallback(() => {
    setMobileMovingEmployee(null);
  }, []);

  const handleMobileMoveTo = useCallback((targetEmployee) => {
    if (mobileMovingEmployee && targetEmployee) {
      handleDrop(mobileMovingEmployee, targetEmployee);
      setMobileMovingEmployee(null);
    }
  }, [mobileMovingEmployee, handleDrop]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        {/* Loading overlay during move operation */}
        {isMoving && (
          <div className="move-loading-overlay">
            <div className="move-loading-content">
              <div className="spinner small"></div>
              <span>Moving employee...</span>
            </div>
          </div>
        )}
        
        {/* Mobile move mode banner */}
        {mobileMovingEmployee && (
          <div className="mobile-move-banner">
            <div className="mobile-move-content">
              <span>Moving: <strong>{mobileMovingEmployee.name}</strong></span>
              <button 
                className="mobile-move-cancel"
                onClick={handleMobileMoveCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <OrgTree 
          byManager={byManager}
          directMenteesMap={directMenteesMap}
          topManagers={byManager.get(null) || []} 
          onDrop={handleDrop}
          mobileMovingEmployee={mobileMovingEmployee}
          onMobileMoveStart={handleMobileMoveStart}
          onMobileMoveTo={handleMobileMoveTo}
        />
      </div>
    </DndProvider>
  );
}

export default React.memo(OrganizationalChart);