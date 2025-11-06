// components/OrgTree.js
import React, { useCallback } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import OrgNode from "./OrgNode";

// topManagers is an array of employees with managerId === null
function OrgTree({ byManager, directMenteesMap, topManagers, onDrop, mobileMovingEmployee, onMobileMoveStart, onMobileMoveTo }) {

  const renderSubtree = useCallback(
    (node) => {
      const children = byManager.get(node.id) ?? [];
      const directMentees = directMenteesMap.get(node.id) ?? [];
      
      return (
        <TreeNode 
          key={node.id} 
          label={
            <OrgNode 
              employee={node} 
              onDrop={onDrop} 
              directMentees={directMentees}
              mobileMovingEmployee={mobileMovingEmployee}
              onMobileMoveStart={onMobileMoveStart}
              onMobileMoveTo={onMobileMoveTo}
            />
          }
        >
          {children.map((c) => renderSubtree(c))}
        </TreeNode>
      );
    },
    [byManager, directMenteesMap, onDrop, mobileMovingEmployee, onMobileMoveStart, onMobileMoveTo]
  );

  return (
    <Tree label={<div style={{ padding: 8 }}>Organization</div>}>
      {topManagers.map((root) => renderSubtree(root))}
    </Tree>
  );
}

export default React.memo(OrgTree);
