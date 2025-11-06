// components/OrgNode.js
import React, { useRef, useEffect } from "react";
import { useDrag, useDrop, useDragLayer } from "react-dnd";
import { useSelectedEmployee } from '../contexts/SelectedEmployeeContext';
import './OrgNodeCss.css';

const ITEM_TYPE = "EMPLOYEE";

function OrgNodeInner({ employee, onDrop, directMentees, mobileMovingEmployee, onMobileMoveStart, onMobileMoveTo }) {
  const { selectedEmployeeId, setSelectedEmployeeId } = useSelectedEmployee();
  const cardRef = useRef(null);
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Detect if we're on mobile
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { id: employee.id, name: employee.name, managerId: employee.managerId },
    canDrag: () => !isMobile, // Disable drag on mobile
    collect: (m) => ({ 
      isDragging: m.isDragging(),
    }),
  });

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: ITEM_TYPE,
    canDrop: (item) => {
      // Can't drop on self or direct mentees
      return item.id !== employee.id && !directMentees.includes(item.id);
    },
    drop: (item) => {
      if (item.id !== employee.id) {
        onDrop(item, employee);
      }  
    },
    collect: (m) => ({ 
      isOver: m.isOver(),
      canDrop: m.canDrop(),
    }),
  });
  
  // Check if this employee can accept the mobile moving employee
  const canAcceptMobileMove = mobileMovingEmployee && 
    mobileMovingEmployee.id !== employee.id &&
    !directMentees.includes(mobileMovingEmployee.id);
  
  const isBeingMoved = mobileMovingEmployee && mobileMovingEmployee.id === employee.id;

  // Use useDragLayer to detect if ANY card is being dragged globally
  const { isAnyCardDragging } = useDragLayer((monitor) => ({
    isAnyCardDragging: monitor.isDragging(),
  }));

  // Compose refs: both drag and drop on the same node element
  const setRefs = (el) => {
    dragRef(el);
    dropRef(el);
    cardRef.current = el;
  };

  // Handle card click to select/deselect employee OR complete mobile move
  const handleCardClick = (e) => {
    e.stopPropagation();
    
    if (isMobile && canAcceptMobileMove) {
      onMobileMoveTo(employee);
      return;
    }
    
    if (selectedEmployeeId === employee.id) {
      setSelectedEmployeeId(null); // Toggle off if already selected
    } else {
      setSelectedEmployeeId(employee.id);
    }
  };
  
  // Handle move button click on mobile
  const handleMoveClick = (e) => {
    e.stopPropagation();
    if (isMobile && !mobileMovingEmployee) {
      onMobileMoveStart(employee);
    }
  };

  const isHighlighted = selectedEmployeeId === employee.id;

  // Scroll into view when this card becomes highlighted
  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [isHighlighted]);
  const cardClasses = [
    'employee-card',
    'flex-center',
    'p-2',
    'bg-white',
    'border',
    'rounded',
    'shadow-sm',
    'text-center',
    isDragging && 'dragged-class',
    canDrop && 'highlight-card-class',
    isOver && canDrop && 'dropping-card-class',
    isAnyCardDragging && !isDragging && !canDrop && 'disable-card-class',
    isBeingMoved && 'mobile-being-moved',
    canAcceptMobileMove && 'mobile-can-drop',
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses} 
      data-employee-id={employee.id}
    >
      <div ref={setRefs} onClick={handleCardClick}  className={`employee-card-content ${isHighlighted ? 'highlighted' : ''}`}>
        <div className="employee-image" title={employee.name}>
          <img 
            src={employee.profilePic || 'https://via.placeholder.com/150'} 
            alt={employee.name} 
            className="employee-image-img"
            loading="lazy"
          />
        </div>
        <div className="employee-info">
          <div 
            className="employee-name font-semibold primary-text-color" 
            title={employee.name}
          >
            {employee.name}
          </div>
          <div 
            className="employee-email" 
            title={employee.email}
          >
            {employee.email}
          </div>
          <div 
            className="employee-designation text-xs text-gray-500" 
            title={employee.designation}
          >
            {employee.designation}
          </div>
        </div>
        {/* Show Move button on mobile when card is selected and not in move mode */}
        {isMobile && isHighlighted && !mobileMovingEmployee && (
          <button 
            className="mobile-move-btn"
            onClick={handleMoveClick}
          >
            Move
          </button>
        )}
      </div>
    </div>
  );
}

// Memoize so nodes only re-render if their props change
export default React.memo(OrgNodeInner, (prev, next) => 
  prev.employee === next.employee && 
  prev.onDrop === next.onDrop && 
  prev.directMentees === next.directMentees &&
  prev.mobileMovingEmployee === next.mobileMovingEmployee
);
