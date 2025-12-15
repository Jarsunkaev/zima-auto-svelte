# CustomDatePicker 30-Day Limit & Tooltip Implementation

## Quick Reference

**Required Props:**
- `startDate` - Start date in YYYY-MM-DD format
- `maxDaysTooltip` - Tooltip message to display

**Key Functions:**
- `exceedsMaxDays(date)` - Checks if date is >30 days from startDate
- `positionTooltip()` - Calculates tooltip position (mobile/desktop aware)
- `handleDateHover()` - Shows tooltip on hover (desktop)
- `handleDateClick()` - Toggles tooltip on tap (mobile)

**Behavior:**
- Tooltip only shows for dates that are **both** disabled AND exceed 30 days
- Desktop: Tooltip appears on hover, positioned to right/left of date button
- Mobile: Tooltip toggles on tap, centered above/below date button

## Overview
The CustomDatePicker component implements a 30-day limit check with tooltip functionality for dates that exceed the maximum allowed duration from a start date.

## Key Props

### Required Props for 30-Day Limit:
```javascript
export let startDate = '';        // Start date (YYYY-MM-DD) for calculating 30-day limit
export let maxDaysTooltip = '';   // Tooltip message to display when date exceeds 30 days
```

## Core Functionality

### 1. 30-Day Limit Check Function
**Location:** Lines 86-94

```javascript
function exceedsMaxDays(date) {
  if (!startDate || !maxDaysTooltip) return false;
  const dateStr = formatDate(date);
  const start = new Date(startDate + 'T00:00:00Z');
  const end = new Date(dateStr + 'T00:00:00Z');
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 30;
}
```

**How it works:**
- Returns `false` if `startDate` or `maxDaysTooltip` are not provided
- Calculates the difference in days between `startDate` and the given `date`
- Returns `true` if the difference exceeds 30 days
- Uses UTC timezone to avoid timezone issues

### 2. Tooltip Positioning
**Location:** Lines 96-130

**State variables:**
```javascript
let hoveredDate = null;              // Currently hovered date data
let tooltipPosition = { x: 0, y: 0 }; // Tooltip coordinates
let tooltipOnLeft = false;           // Whether tooltip is on left side
```

**Positioning logic:**
- **Desktop:** Tooltip appears to the right of the date button by default
- If tooltip would overflow right edge, it positions to the left
- **Mobile:** Tooltip is centered horizontally above/below the date button
- Uses `getBoundingClientRect()` to calculate positions relative to calendar container

### 3. Event Handlers

#### Hover Handler (Desktop)
**Location:** Lines 132-138
```javascript
function handleDateHover(event, dayData) {
  if (dayData.isDisabled && exceedsMaxDays(dayData.date)) {
    positionTooltip(event.currentTarget, dayData);
  } else {
    hoveredDate = null;
  }
}
```
- Only shows tooltip if date is **both** disabled AND exceeds 30 days
- Calls `positionTooltip` to calculate and set tooltip position

#### Mouse Leave Handler
**Location:** Lines 140-145
```javascript
function handleDateLeave() {
  if (typeof window !== 'undefined' && 'ontouchstart' in window === false) {
    hoveredDate = null;
  }
}
```
- Only hides tooltip on mouse leave for non-touch devices
- Prevents tooltip from disappearing on mobile when user taps

#### Click Handler (Mobile)
**Location:** Lines 147-161
```javascript
function handleDateClick(event, dayData) {
  if (dayData.isDisabled && exceedsMaxDays(dayData.date)) {
    event.preventDefault();
    event.stopPropagation();
    // Toggle tooltip on tap
    if (hoveredDate && hoveredDate.dateStr === dayData.dateStr) {
      hoveredDate = null;
    } else {
      positionTooltip(event.currentTarget, dayData);
    }
  } else if (!dayData.isDisabled) {
    selectDate(dayData.date);
  }
}
```
- On mobile, tapping a disabled date that exceeds 30 days toggles the tooltip
- Prevents date selection for disabled dates

### 4. Tooltip Rendering
**Location:** Lines 342-354

```svelte
{#if hoveredDate && maxDaysTooltip}
  {@const tooltipStyle = isMobile 
    ? `left: 50%; top: ${tooltipPosition.y}px; transform: translateX(-50%) translateY(-50%);` 
    : `left: ${tooltipPosition.x}px; top: ${tooltipPosition.y}px; transform: translateY(-50%);`}
  <div 
    class="date-tooltip"
    class:left-side={tooltipOnLeft}
    class:mobile={isMobile}
    style={tooltipStyle}
  >
    {maxDaysTooltip}
  </div>
{/if}
```

**Features:**
- Only renders when `hoveredDate` exists and `maxDaysTooltip` is provided
- Dynamic inline styles for positioning
- Different positioning for mobile vs desktop
- Conditional classes for styling variations

## Styling

### Tooltip Styles
**Location:** Lines 613-655

**Desktop:**
- Dark background (#333), white text
- 250px width
- Arrow pointer on left or right side
- Positioned next to the date button

**Mobile:**
- 90% width, max 280px, min 200px
- Centered horizontally
- Arrow pointer on top
- Larger padding for touch targets

### Disabled Date Styling
**Location:** Lines 577-598
- Dates that exceed 30 days are disabled (gray, strikethrough)
- Tooltip appears on hover/tap to explain why

## Usage Example

### From AirportParkingForm.svelte (Lines 361-374)

```svelte
<CustomDatePicker
  value={formData.endDate}
  minDate={formData.startDate || formatDate(today)}
  maxDate={maxEndDate}
  disabledDates={[]}
  label={content[currentLang].bookingForm.airportParking.endDate}
  {currentLang}
  errorMessage={exceedsMaxDays ? content[currentLang].bookingForm.airportParking.maxDaysExceeded : ''}
  startDate={formData.startDate}
  maxDaysTooltip={content[currentLang].bookingForm.airportParking.maxDaysExceeded}
  on:change={(e) => {
    formData.endDate = e.detail;
  }}
/>
```

### Translation Keys (from booking-content.js)

**Hungarian:**
```javascript
maxDaysExceeded: 'A 30 napnál hosszabb parkolás esetén kérjük, lépjen velünk kapcsolatba az árazásért'
```

**English:**
```javascript
maxDaysExceeded: 'For parking longer than 30 days, please contact us for pricing'
```

### Supporting Logic

**Calculate max end date (30 days from start):**
```javascript
$: maxEndDate = (() => {
  if (!formData.startDate) return formatDate(maxDate);
  const start = parseDate(formData.startDate);
  const maxEnd = new Date(start);
  maxEnd.setDate(maxEnd.getDate() + 30);
  const maxAllowed = maxEnd > maxDate ? maxDate : maxEnd;
  return formatDate(maxAllowed);
})();
```

**Check if selected date exceeds 30 days:**
```javascript
$: exceedsMaxDays = (() => {
  if (!formData.startDate || !formData.endDate) return false;
  const start = parseDate(formData.startDate);
  const end = parseDate(formData.endDate);
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 30;
})();
```

## Integration Points

1. **Date Disabling:** The date must be marked as disabled in `isDateDisabled()` function
2. **Calendar Days:** The `getCalendarDays()` function includes `isDisabled` flag for each day
3. **Event Binding:** Date buttons bind to `handleDateHover`, `handleDateLeave`, and `handleDateClick`

## Mobile Considerations

- Tooltip toggles on tap (not hover) for better mobile UX
- Tooltip is centered and positioned above/below the date button
- Touch detection prevents tooltip from disappearing immediately
- Larger touch targets and font sizes for mobile

## Key Implementation Notes

1. **Timezone Handling:** Uses UTC timezone (`T00:00:00Z`) to avoid timezone calculation issues
2. **Day Calculation:** Uses `Math.ceil()` to round up partial days
3. **Conditional Rendering:** Tooltip only shows for dates that are both disabled AND exceed 30 days
4. **Position Calculation:** Uses `getBoundingClientRect()` for accurate positioning relative to calendar
5. **Responsive Design:** Different positioning and styling for mobile vs desktop

## Dependencies

- `startDate` prop must be in YYYY-MM-DD format
- `maxDaysTooltip` prop should contain the tooltip message (bilingual support recommended)
- Component uses `formatDate()` helper function for date string conversion
- Relies on `isMobile` reactive variable for responsive behavior

