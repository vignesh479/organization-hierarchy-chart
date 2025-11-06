# Undo Move Feature

## Overview
Added an **Undo** button inside success notifications that allows users to quickly revert employee moves.

## What Was Implemented

### 1. Enhanced Notification System
**Modified Files:**
- `src/contexts/NotificationContext.jsx`
- `src/components/NotificationContainer.jsx`
- `src/components/NotificationContainer.css`

**Changes:**
- Added `action` parameter to notification functions
- Action object structure: `{ label: string, handler: function }`
- Action button displays inside notification content
- Clicking action button executes handler and closes notification

### 2. Undo Functionality in OrganizationalChart
**Modified File:**
- `src/components/OrganizationalChart.jsx`

**Changes:**
- Stores previous manager data before move
- Shows success notification with 8-second duration (longer to allow undo)
- Undo button makes API call to restore previous manager
- Shows info notification when undo succeeds
- Shows error notification if undo fails

## User Flow

### Normal Move:
1. User drags employee to new manager
2. Optimistic UI update happens immediately
3. API call is made
4. Success notification appears with "Undo" button
5. Notification auto-dismisses after 8 seconds

### Undo Move:
1. User clicks "Undo" button in notification
2. Loading state is shown
3. API call is made to restore previous manager
4. Data is updated with restored state
5. Info notification confirms the undo

## UI/UX Features

### Action Button Styles:
- Transparent background with colored border
- Matches notification type colors:
  - Success: Green (#4caf50)
  - Error: Red (#f44336)
  - Warning: Orange (#ff9800)
  - Info: Blue (#2196f3)
- Hover effect fills button with color
- Positioned below message text

### Notification Behavior:
- Success notifications with undo last 8 seconds (vs. default 5 seconds)
- Clicking undo closes notification automatically
- Undo shows loading overlay during API call
- Different message for undo success vs. undo failure

## API Calls

### Move Employee:
```javascript
PUT /api/employees/${employeeId}/move
Body: { managerId: newManagerId }
Returns: Updated employee list
```

### Undo Move:
```javascript
PUT /api/employees/${employeeId}/move
Body: { managerId: previousManagerId }
Returns: Restored employee list
```

## Code Examples

### Using the Action Parameter:
```javascript
showSuccess(
  'Employee moved successfully',
  8000, // duration
  {
    label: 'Undo',
    handler: () => {
      // Undo logic here
    }
  }
);
```

### Notification with Action:
```jsx
<div className="notification notification-success">
  <NotificationIcon type="success" />
  <div className="notification-content">
    <div className="notification-message">
      Alice Williams successfully moved to Bob Johnson's team
    </div>
    <button className="notification-action-btn">
      Undo
    </button>
  </div>
  <button className="notification-close-btn">×</button>
</div>
```

## Benefits

1. **Better UX**: Quick recovery from accidental moves
2. **Non-intrusive**: Undo option is contextual and temporary
3. **Flexible**: Action button system can be reused for other notifications
4. **Safe**: Undo makes proper API call to ensure data consistency
5. **Informative**: Clear feedback for both success and failure

## Future Enhancements

Possible improvements:
- Undo history/multiple undo levels
- Keyboard shortcut for undo (Ctrl+Z)
- Confirm dialog for critical moves
- Batch undo for multiple moves
- Undo stack with redo capability

## Testing Recommendations

1. Test successful move followed by undo
2. Test undo with network failure
3. Test notification auto-dismiss before undo
4. Test multiple rapid moves
5. Test undo on mobile devices
6. Test keyboard accessibility for undo button

---

**Status**: ✅ Implemented and Ready for Testing

