# Chemistry Lab Setup Flow - Complete Documentation

## Overview
The Chemistry Lab now features a **professional 4-step setup flow** that guides users through experiment selection, tool verification, question selection, and chemical selection before entering the mixing workspace.

---

## Setup Flow Stages

### **Stage 1: Experiment Selection** 🧫
**User Task:** Choose the type of chemistry experiment

**Available Experiments:**
- 🧫 **Simple titration** - Acid-base titration with standardized solution
- 🔄 **Back titration** - Indirect titration using excess reagent
- ⚡ **Redox titration** - Oxidation-reduction titrations
- 🔥 **Distillation** - Separation by boiling point

**Features:**
- Grid layout with 2 columns
- Emoji-based visual identification
- Hover effects with smooth transitions
- Blue gradient styling
- Interactive feedback

---

### **Stage 2: Required Tools Display** ✓
**User Task:** View required equipment and acknowledge availability

**Tools by Experiment:**

#### Simple Titration:
- Burette (50 mL)
- Pipette (25 mL)
- Conical flask (Erlenmeyer)
- Phenolphthalein indicator
- Standard NaOH solution
- White tile

#### Back Titration:
- Analytical balance
- Volumetric flask (250 mL)
- Pipette (25 mL)
- Excess HCl
- Indicator solution
- Burette

#### Redox Titration:
- Burette (50 mL)
- Pipette (25 mL)
- Conical flask
- KMnO₄ solution
- Reducing agent
- Stirrer

#### Distillation:
- Round-bottom flask (500 mL)
- Liebig condenser
- Heating mantle
- Receiving flask
- Thermometer (0-110°C)
- Adapter joints

**Features:**
- Tools displayed in bulleted list with checkmarks
- Dark background panel for contrast
- "I have these tools →" button to proceed
- Back button to previous stage
- Professional formatting

---

### **Stage 3: Question Selection** ❓
**User Task:** Choose an auto-generated experiment question

**Question Generation:**
- System generates random questions from a pool
- Questions are specific to selected experiment
- Each question relates to real-world chemistry problems

**Example Questions:**

**Simple Titration:**
- "Determine the concentration of an unknown monoprotic acid using NaOH titration (3 significant figures)."
- "Calculate molarity of HCl using titration with standardized NaOH solution."

**Back Titration:**
- "Find the amount of CaCO₃ in an impure sample using back titration with excess HCl."
- "Determine concentration of a weak base by back titration using standardized HCl."

**Redox Titration:**
- "Determine the oxidizing agent concentration using KMnO₄ titration (show balanced equation)."
- "Calculate iron(II) concentration by titration with standardized potassium dichromate."

**Distillation:**
- "Separate ethanol from a 50:50 ethanol-water mixture and calculate yield percentage."
- "Purify a volatile organic solvent using simple distillation and record boiling point."

**Features:**
- Radio button selection
- Scrollable question list (max height with overflow)
- Hover effects on options
- Questions styled with subtle background colors
- Continue button disabled until selection made

---

### **Stage 4: Chemical Selection & Volumes** 🧪
**User Task:** Select chemicals from database and specify volumes

**Chemical Selection Process:**
1. Browse available chemicals (20+ shown initially)
2. Check/uncheck to select
3. Enter volume in mL for each selected chemical
4. Validation ensures all selected chemicals have volumes > 0

**Features:**
- Checkbox for each chemical
- Shows chemical name and ID
- Volume input field (number type)
- Auto-disables volume input if chemical not selected
- Real-time validation
- Scrollable list with proper spacing
- Dark theme with green accents
- Max height of 300px with scroll

**Validation Rules:**
```javascript
const canEnterWorkspace = () => {
  if (!chosenQuestion) return false          // Question required
  if (setupChemicals.length === 0) return false  // At least 1 chemical
  return setupChemicals.every(c => 
    c.volume && !isNaN(Number(c.volume)) && Number(c.volume) > 0
  ) // All chemicals must have valid volumes > 0
}
```

**Button Options:**
- **Skip** - Bypass chemical selection (gray button)
- **Enter Mixing Workspace** - Proceed with selected chemicals (green button, enabled only if validation passes)

---

## UI Design System

### Color Palette:
- **Primary Green**: #00ff88 - Highlights, active states
- **Primary Blue**: #3498db - Backgrounds, secondary accent
- **Dark Background**: #0f1720 / #1a2a3a - Main modal
- **Accent**: #2b6cb0 (muted blue for disabled states)

### Styling Features:
- **Gradient backgrounds**: `linear-gradient(135deg, ...)`
- **Smooth transitions**: `transition: all 0.3s ease`
- **Glow effects**: `0 0 20px rgba(0,255,136,0.2)`
- **Borders**: 2px rgba borders with 0.2-0.4 opacity
- **Border radius**: 10-16px for modern look
- **Shadows**: Multiple layered shadows for depth

### Interactive States:
- **Hover**: Changes background color, adds glow, updates border color
- **Disabled**: Reduced opacity (0.3), not-allowed cursor
- **Checked**: Different background and border colors
- **Focus**: Clear visual feedback for accessibility

---

## Data Flow

```
User Selects Experiment
    ↓
System Loads Required Tools
    ↓
User Acknowledges Tools
    ↓
System Generates Questions
    ↓
User Selects Question
    ↓
User Selects Chemicals & Volumes
    ↓
System Validates
    ↓
User Enters Mixing Workspace
    ↓
MixingWorkspace Component Renders
```

---

## Integration with MixingWorkspace

### Data Passed to MixingWorkspace:
```javascript
selectedChemicals = setupChemicals.map(c => c.id)
// Example: ['H2O', 'HCl', 'NaOH']
```

### Function Calls:
```javascript
// Enter workspace
enterMixingWorkspace() {
  const ids = setupChemicals.map(c => c.id)
  setSelectedChemicals(ids)
  setSetupVisible(false)
  setShowMixingWorkspace(true)
}

// Skip setup
skipAndEnter() {
  const ids = setupChemicals.length ? 
    setupChemicals.map(c => c.id) : 
    selectedChemicals
  setSelectedChemicals(ids)
  setSetupVisible(false)
  setShowMixingWorkspace(true)
}

// Return from workspace
onBack={() => { setShowMixingWorkspace(false) }}
```

---

## Accessibility Features

✅ **ARIA Labels**:
- `role="dialog"` - Identifies as modal dialog
- `aria-modal="true"` - Indicates modal behavior
- `aria-label="Chemistry lab setup"` - Describes purpose

✅ **Semantic HTML**:
- Proper form elements (radio, checkbox, input)
- Label elements linked to inputs
- Button elements with clear text

✅ **Keyboard Navigation**:
- Tab through all interactive elements
- Enter key functionality
- Space key for checkboxes
- Escape to close (future enhancement)

✅ **Visual Feedback**:
- Clear hover states
- Focus indicators
- Disabled state styling
- Color + icons for redundancy

---

## State Management

### State Variables:
```javascript
// Setup flow
const [setupVisible, setSetupVisible] = useState(true)
const [setupStep, setSetupStep] = useState(1)
const [selectedExperiment, setSelectedExperiment] = useState(null)
const [generatedQuestions, setGeneratedQuestions] = useState([])
const [chosenQuestion, setChosenQuestion] = useState(null)
const [setupChemicals, setSetupChemicals] = useState([])
const [requiredTools, setRequiredTools] = useState([])

// Format: setupChemicals = [
//   { id: 'H2O', volume: '50' },
//   { id: 'HCl', volume: '25' }
// ]
```

---

## Future Enhancements

1. **Persistent Progress** - Save setup state to localStorage
2. **Experiment Descriptions** - More detailed info on each experiment
3. **Safety Warnings** - Hazard information for chemicals
4. **Preset Configurations** - Pre-built setups for quick start
5. **Tutorial Mode** - Guided walkthrough for first-time users
6. **Voice Assistance** - Audio guidance through setup flow
7. **Mobile Optimization** - Better layout for smaller screens
8. **Chemistry Calculations** - Pre-calculate expected results
9. **Historical Data** - Show past experiments and results
10. **Difficulty Levels** - Easy/Medium/Hard experiment variants

---

## Testing Checklist

- [ ] All 4 steps render correctly
- [ ] Back buttons work at each stage
- [ ] Questions are properly randomized
- [ ] Validation prevents entering without required fields
- [ ] Chemicals list displays all available options
- [ ] Volume inputs accept only numbers
- [ ] MixingWorkspace receives correct chemical array
- [ ] Return from workspace works correctly
- [ ] Skip button bypasses steps correctly
- [ ] UI is responsive on mobile/tablet
- [ ] Accessibility features work with screen readers
- [ ] Hover effects smooth and performant
- [ ] Colors meet contrast requirements

