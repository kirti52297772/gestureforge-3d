# GestureForge Med 3D — Capstone Project Report
**A Real-Time Computer Vision and WebGL Platform for Touchless 3D Anatomical Dissection, Physiological Telemetry, and Clinical Education**

---

## 1. Executive Summary & Problem Statement

### 1.1 Clinical Motivation
In medical education and surgical theaters, conventional human anatomy learning relies on static 2D textbooks, plastic mannequins, or cadaveric specimens. Concurrently, in sterile surgical environments, clinicians are unable to interact with traditional input devices (mice, keyboards, touchscreens) without breaching the sterile microbial field.

### 1.2 System Innovation
**GestureForge Med 3D** provides a touchless, client-side, zero-latency 3D clinical workstation. Utilizing standard monocular webcams, the platform captures 21 spatial landmarks via Google MediaPipe Tasks Vision WebAssembly (WASM). It enables doctors and medical students to manipulate high-fidelity 3D human anatomical models (Heart, Brain, Lungs, Kidney, Eye), perform multi-plane surgical dissections, inspect physiological telemetry (Lead II ECG and synthesized heart sounds), and query live peer-reviewed medical literature via the Wikipedia REST API.

---

## 2. System Architecture & End-to-End Data Pipeline

```
  [ Webcam Video Stream ] (640x480 @ 60Hz)
            │
            ▼
  [ MediaPipe HandLandmarker ] (WASM + GPU Delegation)
            │──> 21 Normalized 3D Coordinates (x, y, z)
            ▼
  [ Gesture Recognition Engine ]
            │──> Euclidean Distance Check: d(Thumb, Index) < 0.055 -> PINCH
            │──> Extension Heuristics -> Open Palm / Fist / Two-Finger Zoom / Thumbs-Up
            ▼
  [ Coordinate Normalization & Inversion ]
            │──> x_NDC = (1 - x) * 2 - 1,  y_NDC = 1 - 2y
            ▼
  [ Three.js 3D Viewport ]
            │──> GPU Raycasting (Raycaster -> Mesh / 3D Hotspot Pin)
            │──> Surgical Vector Dissection: P(t) = P0 + t * V_explode
            │──> PBR Tissue Shaders + Double-Sided Rendering + X-Ray Mode
            ▼
  [ Telemetry & Knowledge Engine ]
            │──> Web Audio API: S1 (65->32Hz) & S2 (95->45Hz) Acoustic Synthesis
            │──> HTML5 Canvas: Lead II P-Q-R-S-T Real-Time Oscilloscope
            │──> Wikipedia REST API: Live Summary & Illustration Extraction
            └──> Clinical Case Studies & Student Self-Assessment Engine
```

---

## 3. Module-by-Module Code Implementation Breakdown

| File Path | Functional Role | Primary Exports / Methods |
| :--- | :--- | :--- |
| `src/gestures/handTracker.js` | MediaPipe WASM initialization, webcam streaming, frame detection | `createHandTracker()`, `detectFrame()`, `drawHand()` |
| `src/gestures/gestureRecognition.js` | Mathematical heuristics for gesture classification | `recognizeGesture()`, `isFingerExtended()` |
| `src/gestures/gestureControls.js` | Event dispatching, NDC coordinate conversion, pinch debouncing | `createGestureControls()`, `handleLandmarks()` |
| `src/scene/sceneManager.js` | Three.js scene setup, studio lighting, OrbitControls, camera lerp | `createSceneManager()`, `focusOn()`, `resetCamera()` |
| `src/scene/heartLoader.js` | NIH GLTF model suite loader, matrix normalization, 3D pins | `loadCardiacModelSuite()`, `setHeartXRayMode()` |
| `src/scene/organBuilder.js` | Procedural 3D models for Brain, Lungs, Kidney, and Eye | `createOrganModel()`, `buildBrainModel()` |
| `src/features/explodedView.js` | Dissection engine; separates sections along surgical vectors | `createExplodedView()`, `toggleExplodedView()` |
| `src/features/selection.js` | Normalized Device Coordinate (NDC) raycasting engine | `setupComponentSelection()`, `pickAtNdc()` |
| `src/features/componentInspector.js` | Clinical telemetry, coordinate readouts, emissive highlight shader | `createComponentInspector()`, `selectAnatomicalPart()` |
| `src/ui/ecgMonitor.js` | Real-time Lead II P-Q-R-S-T cardiac waveform generator | `createEcgMonitor()`, `getEcgVoltage()` |
| `src/audio/heartAudio.js` | Web Audio API S1/S2 acoustic synthesizer | `createHeartAudio()`, `playS1()`, `playS2()` |
| `src/ui/wikipediaModal.js` | Live Wikipedia REST API reader and research link generator | `createWikipediaModal()`, `openForPart()` |
| `src/ui/caseStudyPanel.js` | Renders patient vignettes, pathophysiology, and quiz cards | `createCaseStudyPanel()`, `render()` |
| `src/ui/anatomyPanel.js` | Searchable anatomical structure hierarchy with category pills | `createAnatomyPanel()`, `setParts()` |

---

## 4. Mathematical & Algorithmic Formulations

### 4.1 Euclidean Pinch Metric
Selection triggers when the spatial Euclidean distance between the thumb tip (Landmark 4) and index fingertip (Landmark 8) falls below threshold $\tau$:
$$d_{\text{pinch}} = \sqrt{(x_4 - x_8)^2 + (y_4 - y_8)^2} < 0.055$$
A temporal debounce condition ($t_{\text{current}} - t_{\text{last}} \ge 450\text{ ms}$) ensures stable selection.

### 4.2 Viewport Mirroring & Coordinate Transformation
The user's mirrored webcam frame coordinates $(x, y) \in [0, 1]$ are mapped to Three.js Normalized Device Coordinates (NDC) in $[-1, 1]$:
$$x_{\text{NDC}} = (1 - x_{\text{landmark}}) \times 2 - 1, \quad y_{\text{NDC}} = 1 - 2 \times y_{\text{landmark}}$$

### 4.3 GPU Raycasting Unprojection
The NDC 2D coordinate is unprojected into a 3D ray $\vec{R}(t) = \vec{O} + t\vec{D}$ using the inverse view-projection matrix:
$$\vec{R}_{\text{world}} = \mathbf{M}_{\text{invProjection}} \cdot \mathbf{M}_{\text{invView}} \cdot \begin{bmatrix} x_{\text{NDC}} \\ y_{\text{NDC}} \\ 1 \\ 1 \end{bmatrix}$$

### 4.4 Surgical Dissection Vector Interpolation
Dissectible sections interpolate along predefined anatomical displacement vectors:
$$\vec{P}_i(t) = \vec{P}_{0, i} + t \cdot \vec{V}_{\text{explode}, i} \quad (t \in [0, 1])$$
* **Section A (Aorta & Atria):** $\vec{V}_A = (0, 72, 25)$
* **Section B (Valvular Plane):** $\vec{V}_B = (-80, 0, 20)$
* **Section C (Ventricular Apex):** $\vec{V}_C = (35, -75, -20)$

### 4.5 Piecewise Trigonometric Lead II ECG Waveform
The cardiac voltage $V(\phi)$ across cycle phase $\phi \in [0, 1]$ is modeled as:
$$V(\phi) = 
\begin{cases}
  \sin\left(\frac{\phi - 0.12}{0.10} \pi\right) \cdot 0.22, & 0.12 \le \phi < 0.22 \quad \text{(P Wave)} \\
  -\sin\left(\frac{\phi - 0.28}{0.02} \pi\right) \cdot 0.18, & 0.28 \le \phi < 0.30 \quad \text{(Q Wave)} \\
  1.35 \cdot \left(1 - 2\left|\frac{\phi - 0.30}{0.05} - 0.5\right|\right), & 0.30 \le \phi < 0.35 \quad \text{(R Peak)} \\
  -\sin\left(\frac{\phi - 0.35}{0.03} \pi\right) \cdot 0.35, & 0.35 \le \phi < 0.38 \quad \text{(S Wave)} \\
  \sin\left(\frac{\phi - 0.48}{0.14} \pi\right) \cdot 0.38, & 0.48 \le \phi < 0.62 \quad \text{(T Wave)} \\
  \mathcal{N}(0, 0.01), & \text{otherwise (Isoelectric Baseline)}
\end{cases}$$

---

## 5. Viva Voce Defense: Evaluator Questions & Answers

### Q1: Why did you choose Three.js and MediaPipe Web over Python OpenCV?
> **Answer:** "A native web-based WebAssembly and WebGL architecture runs entirely on the client's GPU at 60 FPS without server communication or streaming latency. It eliminates Python environment dependencies and enables any hospital terminal or student laptop to run the platform inside a standard browser."

### Q2: How do you prevent hand jitter and false gesture triggers during surgical inspection?
> **Answer:** "The system implements a three-tier stabilization pipeline:
> 1. A 0.0025-unit deadzone filter eliminates micro-tremors during palm rotation.
> 2. A 450 ms debounce timestamp check prevents accidental multi-selection during pinches.
> 3. Mutually exclusive finger extension checks distinguish between fist rotation, open palm pausing, and two-finger zooming."

### Q3: How does the exploded view know where each part should move?
> **Answer:** "I analyzed the anatomical bounding boxes of the NIH ALM0006 segmented dataset. Each section is assigned an anatomical displacement vector in `heartLoader.js`. Linear interpolation (`lerp`) shifts each mesh from its home coordinates along that displacement vector according to the dissection slider factor."

### Q4: How is the heartbeat sound generated without audio files?
> **Answer:** "It uses the browser's Web Audio API oscillators and low-pass biquad filters. The S1 sound ('lub') ramps a sine wave down from 65 Hz to 32 Hz through an 85 Hz filter at the systolic R-peak. The S2 sound ('dub') ramps from 95 Hz to 45 Hz through a 110 Hz filter at the end of the T-wave."
