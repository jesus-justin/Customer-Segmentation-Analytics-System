# Landing Page Design System

## Color Palette

### Primary Colors
- **Primary Blue**: `#2563eb` - Main brand color
- **Primary Light**: `#60a5fa` - Lighter variant for hover states
- **Primary Dark**: `#1e40af` - Darker variant for emphasis

### Secondary Colors
- **Success Green**: `#22c55e` - Success states and confirmations
- **Warning Orange**: `#f59e0b` - Warnings and important notices
- **Danger Red**: `#ef4444` - Errors and destructive actions

### Neutral Colors
- **Dark Background**: `#0f172a` - Footer and dark sections
- **Light Background**: `#f8fafc` - Main background
- **Card Background**: `#ffffff` - Cards and elevated surfaces
- **Border**: `#e2e8f0` - Borders and dividers
- **Text Dark**: `#1e293b` - Primary text
- **Text Light**: `#64748b` - Secondary text

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Font Sizes
- **Heading 1**: `3.5rem` (56px)
- **Heading 2**: `2.5rem` (40px)
- **Heading 3**: `1.4rem` (22.4px)
- **Body Large**: `1.2rem` (19.2px)
- **Body**: `1rem` (16px)
- **Small**: `0.9rem` (14.4px)

### Font Weights
- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semi-bold**: 600
- **Bold**: 700
- **Extra-bold**: 800

## Spacing System

### Base Unit: 8px

- **xs**: `0.5rem` (8px)
- **sm**: `1rem` (16px)
- **md**: `1.5rem` (24px)
- **lg**: `2rem` (32px)
- **xl**: `3rem` (48px)
- **2xl**: `4rem` (64px)
- **3xl**: `5rem` (80px)

## Border Radius

- **Small**: `10px` - Small elements
- **Medium**: `15px` - Cards
- **Large**: `20px` - Sections
- **Round**: `50%` - Circles
- **Pill**: `50px` - Buttons

## Shadows

### Elevation Levels
```css
/* Level 1 - Subtle */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

/* Level 2 - Card */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Level 3 - Elevated */
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

/* Level 4 - Floating */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
```

## Gradients

### Primary Gradients
```css
/* Blue-Purple */
linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* Pink-Red */
linear-gradient(135deg, #f093fb 0%, #f5576c 100%)

/* Cyan-Blue */
linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)

/* Brand Primary */
linear-gradient(135deg, #2563eb 0%, #1e40af 100%)
```

## Animation Timing

### Duration
- **Fast**: 0.3s - Small UI changes
- **Normal**: 0.6s - Standard transitions
- **Slow**: 1s - Complex animations

### Easing Functions
```css
/* Standard */
cubic-bezier(0.4, 0, 0.2, 1)

/* Ease Out */
cubic-bezier(0, 0, 0.2, 1)

/* Ease In */
cubic-bezier(0.4, 0, 1, 1)

/* Bounce */
cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

## Breakpoints

- **Mobile**: `< 480px`
- **Tablet**: `480px - 767px`
- **Desktop**: `768px - 1023px`
- **Large Desktop**: `≥ 1024px`

## Component Standards

### Buttons

#### Primary Button
- Background: Primary gradient
- Color: White
- Padding: `1rem 2rem`
- Border radius: `50px`
- Shadow: `0 10px 30px rgba(37, 99, 235, 0.3)`

#### Secondary Button
- Background: White
- Color: Primary
- Border: `2px solid primary`
- Padding: `1rem 2rem`
- Border radius: `50px`

### Cards

#### Standard Card
- Background: White
- Padding: `2rem`
- Border radius: `20px`
- Border: `2px solid #e2e8f0`
- Shadow: Level 2

#### Hover State
- Transform: `translateY(-10px)`
- Shadow: Level 3

### Icons

#### Sizes
- **Small**: `1rem` (16px)
- **Medium**: `1.5rem` (24px)
- **Large**: `2rem` (32px)
- **XL**: `3rem` (48px)

## Accessibility

### Color Contrast Ratios
- **Normal Text**: Minimum 4.5:1
- **Large Text**: Minimum 3:1
- **UI Components**: Minimum 3:1

### Focus States
- Outline: `2px solid primary`
- Offset: `2px`

### Touch Targets
- Minimum size: `44px × 44px`

## Usage Guidelines

### Do's
✅ Use consistent spacing from the spacing system
✅ Follow the color palette for brand consistency
✅ Apply shadows for depth and hierarchy
✅ Use animation timing for smooth transitions
✅ Maintain accessibility standards

### Don'ts
❌ Don't use arbitrary spacing values
❌ Don't mix random colors outside the palette
❌ Don't use excessive animations
❌ Don't ignore accessibility requirements
❌ Don't break responsive breakpoints

## File References

- **CSS Variables**: `static/css/style.css` (root section)
- **Landing Styles**: `static/css/landing.css`
- **Animations**: `static/css/animations.css`
- **Enhancements**: `static/css/enhancements.css`
