# Chemistry Lab Setup Flow - Visual Summary

## 🎯 Complete Setup Journey

```
┌─────────────────────────────────────────────────────────────────┐
│  CHEMISTRY LAB - Entry Flow                                      │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ STEP 1: EXPERIMENT SELECTION           │
│ Step 1 of 4                             │
├────────────────────────────────────────┤
│                                        │
│  [🧫 Simple titration]                │
│  [🔄 Back titration]                  │
│  [⚡ Redox titration]                 │
│  [🔥 Distillation]                    │
│                                        │
└────────────────────────────────────────┘
           ↓ (user selects experiment)
┌────────────────────────────────────────┐
│ STEP 2: REQUIRED TOOLS                 │
│ Step 2 of 4 | Simple titration         │
├────────────────────────────────────────┤
│ Simple titration requires these tools: │
│                                        │
│ ✓ Burette (50 mL)                     │
│ ✓ Pipette (25 mL)                     │
│ ✓ Conical flask (Erlenmeyer)          │
│ ✓ Phenolphthalein indicator           │
│ ✓ Standard NaOH solution              │
│ ✓ White tile                          │
│                                        │
│ [← Back] [I have these tools →]       │
└────────────────────────────────────────┘
           ↓ (user confirms tools)
┌────────────────────────────────────────┐
│ STEP 3: QUESTION SELECTION             │
│ Step 3 of 4                             │
├────────────────────────────────────────┤
│ Select your experiment question:       │
│                                        │
│ ◎ Determine the concentration of an   │
│   unknown monoprotic acid using NaOH   │
│   titration (3 significant figures).   │
│                                        │
│ ○ Calculate molarity of HCl using     │
│   titration with standardized NaOH     │
│   solution.                            │
│                                        │
│ [← Back] [Continue to Chemicals →]    │
└────────────────────────────────────────┘
           ↓ (user selects question)
┌────────────────────────────────────────┐
│ STEP 4: CHEMICAL SELECTION & VOLUMES   │
│ Step 4 of 4                             │
├────────────────────────────────────────┤
│ Select chemicals and specify volumes:  │
│                                        │
│ ✓ H2O                        [50]mL   │
│ ☐ HCl                        [ ]mL    │
│ ✓ NaOH                       [25]mL   │
│ ☐ KMnO4                      [ ]mL    │
│ ☐ CaCO3                      [ ]mL    │
│ ☐ NH3                        [ ]mL    │
│                                        │
│ [← Back] [Skip] [Enter Workspace 🧬]  │
└────────────────────────────────────────┘
           ↓ (user confirms & enters)
┌────────────────────────────────────────┐
│     MIXING WORKSPACE LOADS             │
│        Selected Chemicals:             │
│        • H2O (50 mL)                  │
│        • NaOH (25 mL)                 │
└────────────────────────────────────────┘
```

---

## 🎨 UI Component Breakdown

### Modal Container
```
┌─────────────────────────────────────────────────────────┐
│ Fixed overlay with dark gradient background             │
│ Centered dialog box with green/blue styling             │
│ Border: 2px solid rgba(0,255,136,0.3)                 │
│ Glow effect: 0 20px 60px rgba(0,255,136,0.2)         │
└─────────────────────────────────────────────────────────┘
```

### Header Section
```
┌─────────────────────────────────────────────────────────┐
│ 🧪 Chemistry Lab Setup                                  │
│ Step 2 of 4 | Simple titration                         │
├─────────────────────────────────────────────────────────┤
│ Border bottom: 2px solid rgba(0,255,136,0.2)          │
└─────────────────────────────────────────────────────────┘
```

### Button Styles

**Primary Button (Active)**
- Background: `linear-gradient(135deg, #16a34a, #0f7a38)`
- Padding: `10px 20px`
- Border radius: 8px
- Color: white
- Font weight: bold
- Cursor: pointer

**Secondary Button (Disabled)**
- Background: `rgba(100,100,100,0.3)`
- Opacity: reduced
- Cursor: not-allowed

**Hover Effects**
- Background color transitions
- Glow added: `0 0 20px rgba(0,255,136,0.2)`
- Border color brightens
- Smooth 0.3s transition

---

## 📊 Data Structure

### Setup Chemicals Array
```javascript
setupChemicals = [
  {
    id: "H2O",
    volume: "50"
  },
  {
    id: "NaOH",
    volume: "25"
  },
  {
    id: "Phenolphthalein",
    volume: "2"
  }
]
```

### Passed to MixingWorkspace
```javascript
selectedChemicals = ["H2O", "NaOH", "Phenolphthalein"]
```

---

## ✨ Key Features

✅ **Professional Design**
- Gradient backgrounds
- Smooth animations
- Consistent color scheme
- Modern typography

✅ **User-Friendly**
- Clear step progression
- Visual feedback on all actions
- Intuitive navigation
- Helpful instructions at each stage

✅ **Validation**
- Questions required before proceeding
- Chemicals must have volumes
- Volumes must be > 0 and numeric
- Real-time feedback

✅ **Accessible**
- ARIA labels and roles
- Semantic HTML
- Keyboard navigable
- Color + icons for redundancy

✅ **Responsive**
- Modal scales to fit screen
- Max width: 900px
- Mobile-friendly padding
- Scrollable lists for long content

---

## 🔄 Navigation Flow

```
Start Setup (setupVisible = true, setupStep = 1)
│
├─→ STEP 1: Select Experiment
│   └─→ onClick → startExperiment(exp)
│       • setSelectedExperiment(exp)
│       • setRequiredTools(toolsForExperiment[exp])
│       • setSetupStep(2)
│
├─→ STEP 2: Acknowledge Tools
│   └─→ onClick → acknowledgeToolsAndContinue()
│       • setGeneratedQuestions(generateQuestionsFor(exp))
│       • setSetupStep(3)
│
├─→ STEP 3: Select Question
│   └─→ onChange → setChosenQuestion(q)
│   └─→ onClick → setSetupStep(4)
│
├─→ STEP 4: Select Chemicals
│   ├─→ onChange → toggleChemicalSelection(chemId)
│   ├─→ onChange → setChemicalVolume(chemId, value)
│   └─→ onClick → enterMixingWorkspace()
│       • Validates: canEnterWorkspace()
│       • setSelectedChemicals(ids)
│       • setSetupVisible(false)
│       • setShowMixingWorkspace(true)
│
└─→ MIXING WORKSPACE LOADED
    Receive selectedChemicals array
    Render MixingWorkspace component
    Allow user to mix and experiment
```

---

## 🚀 User Actions

| Step | Action | Result |
|------|--------|--------|
| 1 | Click experiment button | Move to step 2, load tools |
| 2 | Click "I have these tools" | Move to step 3, generate questions |
| 2 | Click back | Return to step 1, clear experiment |
| 3 | Select radio button | Enable continue button |
| 3 | Click continue | Move to step 4, load chemicals |
| 3 | Click back | Return to step 2 |
| 4 | Check chemical | Enable volume input |
| 4 | Uncheck chemical | Disable volume input, clear value |
| 4 | Enter volume | Validate number > 0 |
| 4 | Click enter workspace | Move to MixingWorkspace if valid |
| 4 | Click skip | Move to MixingWorkspace with selected |
| 4 | Click back | Return to step 3 |

---

## 🎓 Learning Progression

The setup flow guides users through scientific thinking:

1. **Experiment Selection** - What will we study?
2. **Tool Verification** - Do we have what we need?
3. **Problem Identification** - What question are we answering?
4. **Resource Preparation** - Which chemicals do we need?
5. **Execution** - Mix and observe in the workspace

This mirrors real laboratory workflow and builds scientific literacy.

