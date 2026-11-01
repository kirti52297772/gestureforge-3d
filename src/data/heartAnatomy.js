// ============================================================================
// HEART ANATOMY DATA & CLINICAL CASE STUDIES
// Comprehensive Medical & Educational Dataset for Doctors & Medical Students
// ============================================================================

export const HEART_ANATOMY = [
  {
    id: 'left-ventricle',
    name: 'Left Ventricle',
    latinName: 'Ventriculus sinister cordis',
    category: 'Chambers',
    badge: 'Oxygenated / High Pressure',
    pressure: '120 / 8 mmHg (Systolic / Diastolic)',
    modelPart: 'c', // Belongs to part C in NIH dissected model
    pinPosition: { x: 12, y: -130, z: 25 },
    cameraFocus: {
      position: { x: 25, y: -120, z: 120 },
      target: { x: 12, y: -130, z: 25 }
    },
    wikipediaTitle: 'Left_ventricle',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Left_ventricle',
    pubmedQuery: 'left+ventricular+hypertrophy+OR+ejection+fraction',
    medlineUrl: 'https://medlineplus.gov/ency/anatomyvideos/000078.htm',
    radiopaediaUrl: 'https://radiopaedia.org/articles/left-ventricle',
    shortDescription: 'Thick muscular chamber responsible for pumping oxygen-rich blood into systemic circulation via the aorta.',
    detailedAnatomy: 
      'The left ventricle forms the cardiac apex and most of the inferolateral surface. Its myocardium is 3 to 4 times thicker than that of the right ventricle (~8-12 mm in diastole) to generate systemic arterial pressures exceeding 120 mmHg. It contains two prominent papillary muscles (anterolateral and posteromedial) that anchor chordae tendineae to the bicuspid (mitral) valve.',
    hemodynamics: {
      strokeVolume: '70 mL / beat',
      ejectionFraction: '55% - 70% (Normal LVEF)',
      cardiacOutput: '5.0 L / min at rest',
      endDiastolicVolume: '120 mL'
    },
    caseStudy: {
      title: 'Acute Anterolateral ST-Elevation Myocardial Infarction (STEMI)',
      patient: '61-year-old male with 25-pack-year smoking history, hypertension, and type 2 diabetes mellitus.',
      presentation: 'Sudden onset of severe, substernal crushing chest pain radiating to the left shoulder and jaw, associated with diaphoresis, nausea, and dyspnea lasting > 45 minutes.',
      vitals: 'BP 92/60 mmHg, HR 108 bpm, SpO2 93% on room air, RR 24/min.',
      diagnosticFindings: [
        '12-Lead ECG: >2mm ST-segment elevation in leads V1–V4 with reciprocal ST depressions in II, III, and aVF.',
        'Cardiac Biomarkers: High-sensitivity Troponin-I elevated at 4,820 ng/L (normal <14 ng/L).',
        'Bedside Echocardiogram: Left ventricular ejection fraction (LVEF) reduced to 35% with severe anterior wall and apical hypokinesis.'
      ],
      pathophysiology: 'Rupture of an atherosclerotic plaque in the proximal Left Anterior Descending (LAD) coronary artery causing acute thrombotic occlusion, transmural ischemia, and necrosis of the anterior left ventricular myocardium.',
      management: [
        'Immediate Primary Percutaneous Coronary Intervention (PCI) with drug-eluting stent placement within 90 minutes door-to-balloon time.',
        'Emergency Dual Antiplatelet Therapy (DAPT): Aspirin 325 mg + Ticagrelor 180 mg loading dose.',
        'Anticoagulation: Unfractionated heparin bolus.',
        'Long-term post-MI guideline directed medical therapy (GDMT): High-intensity Statin (Atorvastatin 80mg), Beta-blocker (Metoprolol succinate), ACE inhibitor, and SGLT2 inhibitor.'
      ],
      quiz: {
        question: 'Which anatomical structure within the left ventricle is at highest risk of rupture causing acute severe mitral regurgitation in an inferoposterior myocardial infarction?',
        options: [
          'Posteromedial papillary muscle (due to single blood supply from PDA)',
          'Anterolateral papillary muscle (dual blood supply)',
          'Moderator band',
          'Crista terminalis'
        ],
        correctIndex: 0,
        explanation: 'The posteromedial papillary muscle has a solitary arterial blood supply typically originating solely from the posterior descending artery (PDA), making it much more vulnerable to ischemic rupture compared to the anterolateral papillary muscle, which receives dual blood supply from both the LAD and LCx.'
      }
    }
  },
  {
    id: 'right-ventricle',
    name: 'Right Ventricle',
    latinName: 'Ventriculus dexter cordis',
    category: 'Chambers',
    badge: 'Deoxygenated / Low Resistance',
    pressure: '25 / 4 mmHg (Systolic / Diastolic)',
    modelPart: 'c',
    pinPosition: { x: -18, y: -135, z: 20 },
    cameraFocus: {
      position: { x: -45, y: -120, z: 120 },
      target: { x: -18, y: -135, z: 20 }
    },
    wikipediaTitle: 'Right_ventricle',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Right_ventricle',
    pubmedQuery: 'right+ventricular+failure+OR+pulmonary+hypertension',
    medlineUrl: 'https://medlineplus.gov/ency/anatomyvideos/000078.htm',
    radiopaediaUrl: 'https://radiopaedia.org/articles/right-ventricle',
    shortDescription: 'Crescent-shaped chamber that propels deoxygenated venous blood into the pulmonary circulation.',
    detailedAnatomy: 
      'The right ventricle forms the largest part of the sternocostal cardiac surface. Characterized by prominent trabeculae carneae and the moderator band (septomarginal trabecula), which carries the right branch of the atrioventricular bundle. Its wall is thinner (~3-5 mm) as it pumps against low-resistance pulmonary vascular bed.',
    hemodynamics: {
      strokeVolume: '70 mL / beat',
      pulmonaryResistance: '< 2 Wood units',
      meanPAP: '14 mmHg (Normal)'
    },
    caseStudy: {
      title: 'Acute Cor Pulmonale secondary to Massive Pulmonary Embolism',
      patient: '48-year-old female, day 5 post-total knee arthroplasty, presented with acute onset pleuritic chest pain and syncope.',
      presentation: 'Hypotension, tachycardia, jugular venous distension (JVD) with prominent A-waves, and parasternal heave on palpation.',
      vitals: 'BP 84/52 mmHg, HR 124 bpm, SpO2 86% on ambient air.',
      diagnosticFindings: [
        'Bedside Echo: McConnell sign (severe hypokinesis of RV free wall with normal RV apex contractility), RV dilation with D-shaped left ventricle.',
        'CT Pulmonary Angiography (CTPA): Saddle embolus occluding main pulmonary artery bifurcation.',
        'Biomarkers: Elevated troponin and NT-proBNP indicative of RV strain.'
      ],
      pathophysiology: 'Abrupt increase in pulmonary vascular afterload exceeds right ventricular systolic capacity, leading to acute RV dilatation, tricuspid regurgitation, interventricular septum shifting toward the LV, and cardiogenic shock.',
      management: [
        'Systemic thrombolysis with recombinant tissue plasminogen activator (rtPA / Alteplase 100 mg over 2 hours).',
        'Invasive catheter-directed thrombectomy if thrombolysis is contraindicated.',
        'Hemodynamic support with Norepinephrine to restore systemic perfusion and RV coronary perfusion.',
        'Therapeutic unfractionated heparin infusion.'
      ],
      quiz: {
        question: 'What distinctive echocardiographic feature is known as the "McConnell Sign" in acute RV strain?',
        options: [
          'Akinetic RV free wall with hyperdynamic apical contractility',
          'Paradoxical septal bounce with pericardial effusion',
          'Systolic anterior motion of the mitral valve',
          'Global RV and LV hypokinesia'
        ],
        correctIndex: 0,
        explanation: 'McConnell sign is highly specific for acute pulmonary embolism and describes distinct akinesia or hypokinesia of the right ventricular mid-free wall with preserved contractility of the right ventricular apex.'
      }
    }
  },
  {
    id: 'aorta',
    name: 'Ascending Aorta & Arch',
    latinName: 'Aorta ascendens et Arcus aortae',
    category: 'Great Vessels',
    badge: 'High Pressure Conduit',
    pressure: '120 / 80 mmHg',
    modelPart: 'a',
    pinPosition: { x: 5, y: -65, z: 8 },
    cameraFocus: {
      position: { x: 10, y: -40, z: 110 },
      target: { x: 5, y: -65, z: 8 }
    },
    wikipediaTitle: 'Aorta',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Aorta',
    pubmedQuery: 'aortic+dissection+type+A+management',
    medlineUrl: 'https://medlineplus.gov/aorticaneurysm.html',
    radiopaediaUrl: 'https://radiopaedia.org/articles/aorta',
    shortDescription: 'The primary systemic arterial trunk originating from the aortic orifice of the left ventricle.',
    detailedAnatomy: 
      'Measures ~2.5 to 3.5 cm in diameter. Gives rise to right and left coronary arteries from the aortic sinuses (Sinuses of Valsalva) right above the aortic valve cusps. The arch arches posterosuperiorly giving off the brachiocephalic trunk, left common carotid artery, and left subclavian artery.',
    hemodynamics: {
      peakVelocity: '1.0 - 1.7 m/s',
      windkesselEffect: 'Elastic recoil maintains diastolic coronary perfusion'
    },
    caseStudy: {
      title: 'Acute Stanford Type A Aortic Dissection',
      patient: '54-year-old male with poorly controlled essential hypertension (BP 198/110 baseline).',
      presentation: 'Sudden onset of agonizing, "tearing" retrosternal chest pain radiating between the shoulder blades into the mid-back. Diaphoretic with pulse deficit in right radial artery.',
      vitals: 'Right arm BP 185/95 mmHg, Left arm BP 142/82 mmHg (>20 mmHg inter-arm differential), HR 98 bpm.',
      diagnosticFindings: [
        'CT Angiography of Chest: Intimal flap originating 1.5 cm distal to aortic valve plane extending into the arch, with true and false lumen differentiation.',
        'Transthoracic Echo: Moderate aortic regurgitation with hemopericardium measuring 8 mm.'
      ],
      pathophysiology: 'Intimal tear exposes the aortic media to high shear stress, allowing blood to dissect along the medial layer creating a false lumen, with high impending risk of pericardial tamponade, stroke, or rupture.',
      management: [
        'Immediate surgical consultation: Emergent open replacement of the ascending aorta (Hemiarch / Bentall procedure).',
        'Medical anti-impulse therapy: IV Esmolol titrated to target HR < 60 bpm and SBP 100-120 mmHg before operative intervention.',
        'Strict blood pressure control avoiding pure vasodilators without prior beta-blockade to prevent reflex tachycardia and increased aortic shear stress (dP/dt).'
      ],
      quiz: {
        question: 'Why must intravenous beta-blockers be initiated before vasodilators (such as nitroprusside) in acute aortic dissection?',
        options: [
          'To decrease shear force (dP/dt) and prevent reflex tachycardia that worsens tear propagation',
          'To increase cardiac output',
          'To prevent coronary artery spasm',
          'To lower pulmonary wedge pressure'
        ],
        correctIndex: 0,
        explanation: 'Administering vasodilators alone triggers reflex sympathetic tachycardia and increases the velocity of left ventricular contraction (dP/dt), which intensifies the hydraulic shear stress across the intimal tear and propagates the dissection.'
      }
    }
  },
  {
    id: 'pulmonary-artery',
    name: 'Pulmonary Trunk & Arteries',
    latinName: 'Truncus pulmonalis',
    category: 'Great Vessels',
    badge: 'Deoxygenated Conduit',
    pressure: '25 / 10 mmHg (Mean 14 mmHg)',
    modelPart: 'a',
    pinPosition: { x: -14, y: -72, z: 18 },
    cameraFocus: {
      position: { x: -30, y: -50, z: 110 },
      target: { x: -14, y: -72, z: 18 }
    },
    wikipediaTitle: 'Pulmonary_artery',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Pulmonary_artery',
    pubmedQuery: 'pulmonary+arterial+hypertension+treatment',
    medlineUrl: 'https://medlineplus.gov/pulmonaryhypertension.html',
    radiopaediaUrl: 'https://radiopaedia.org/articles/pulmonary-trunk',
    shortDescription: 'Conveys deoxygenated blood from the right ventricle into the pulmonary vascular bed for gas exchange.',
    detailedAnatomy: 
      'Arises from the conus arteriosus of the right ventricle, anterior to the ascending aorta. Courses superiorly, posteriorly, and to the left for approximately 5 cm before dividing beneath the aortic arch into right and left pulmonary arteries.',
    hemodynamics: {
      resistance: '1/10th of systemic vascular resistance'
    },
    caseStudy: {
      title: 'Idiopathic Pulmonary Arterial Hypertension (IPAH)',
      patient: '32-year-old female presenting with progressive exertional dyspnea, fatigue, and near-syncope when climbing stairs.',
      presentation: 'Prominent P2 component of the second heart sound, right ventricular S3 gallop, and peripheral ankle edema.',
      vitals: 'BP 112/74 mmHg, HR 82 bpm, SpO2 95% at rest, desaturating to 86% on 6-minute walk test.',
      diagnosticFindings: [
        'Right Heart Catheterization (RHC): Mean pulmonary arterial pressure (mPAP) 48 mmHg (normal < 20 mmHg), PCWP 11 mmHg, PVR 7.2 Wood units.',
        'Vasoreactivity Testing: Negative for acute vasodilation response.'
      ],
      pathophysiology: 'Progressive plexogenic arteriopathy with smooth muscle proliferation, intimal fibrosis, and in situ thrombosis of precapillary pulmonary arterioles.',
      management: [
        'Combination targeted therapy: Endothelin receptor antagonist (Macitentan) + PDE-5 inhibitor (Tadalafil).',
        'For high-risk disease: Continuous parenteral prostacyclin analogue (Epoprostenol infusion).',
        'Avoidance of heavy isometric exertion, adherence to low-sodium diet, and routine influenza/pneumococcal vaccination.'
      ],
      quiz: {
        question: 'What is the diagnostic hemodynamic criterion for pulmonary hypertension by modern ESC/ERS clinical guidelines?',
        options: [
          'Mean pulmonary arterial pressure (mPAP) > 20 mmHg at rest',
          'Systolic pulmonary arterial pressure > 50 mmHg',
          'Pulmonary capillary wedge pressure > 18 mmHg',
          'Right atrial pressure > 15 mmHg'
        ],
        correctIndex: 0,
        explanation: 'According to current clinical guidelines, pulmonary hypertension is defined as a resting mean pulmonary arterial pressure (mPAP) greater than 20 mmHg measured by right heart catheterization.'
      }
    }
  },
  {
    id: 'left-atrium',
    name: 'Left Atrium & Pulmonary Veins',
    latinName: 'Atrium sinistrum cordis',
    category: 'Chambers',
    badge: 'Oxygenated Reservoir',
    pressure: '8 - 12 mmHg (Mean)',
    modelPart: 'a',
    pinPosition: { x: 18, y: -90, z: -15 },
    cameraFocus: {
      position: { x: 30, y: -70, z: -80 },
      target: { x: 18, y: -90, z: -15 }
    },
    wikipediaTitle: 'Left_atrium',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Left_atrium',
    pubmedQuery: 'left+atrial+appendage+thrombus+atrial+fibrillation',
    medlineUrl: 'https://medlineplus.gov/atrialfibrillation.html',
    radiopaediaUrl: 'https://radiopaedia.org/articles/left-atrium',
    shortDescription: 'Receives freshly oxygenated blood from the four pulmonary veins and delivers it to the left ventricle.',
    detailedAnatomy: 
      'Forms the posterior base of the heart. The four pulmonary veins (superior and inferior, right and left) enter its smooth posterior wall. The left atrial appendage (auricle) projects anteriorly, lined by pectinate muscles, and is the predominant site for thrombogenesis in atrial fibrillation.',
    hemodynamics: {
      volume: '40 - 65 mL (Normal LA Volume Index < 34 mL/m²)'
    },
    caseStudy: {
      title: 'Non-valvular Atrial Fibrillation with Cardioembolic Ischemic Stroke',
      patient: '73-year-old male presenting with acute right-sided hemiparesis and expressive aphasia.',
      presentation: 'Irregularly irregular peripheral pulse, absence of S4 heart sound, acute neurological deficit (NIHSS score 14).',
      vitals: 'BP 158/88 mmHg, HR 132 bpm (irregularly irregular), SpO2 97%.',
      diagnosticFindings: [
        '12-Lead ECG: Absence of distinct P waves with irregular, fibrillatory baseline waves and irregular R-R intervals.',
        'Transesophageal Echocardiogram (TEE): 1.4 cm mobile echogenic thrombus identified within the left atrial appendage (LAA).',
        'Head CT / MRI: Acute ischemic infarct in the left middle cerebral artery (MCA) territory.'
      ],
      pathophysiology: 'Loss of coordinated atrial contraction leads to blood stasis in the trabeculated left atrial appendage, promoting fibrin and platelet thrombus formation that embolizes into systemic cerebral circulation.',
      management: [
        'Acute Stroke Phase: IV thrombolysis (tenecteplase/alteplase) and mechanical endovascular thrombectomy within therapeutic window.',
        'Secondary Prevention: Direct Oral Anticoagulant (DOAC, e.g., Apixaban 5 mg BID or Rivaroxaban 20 mg daily) after hemorrhagic conversion exclusion.',
        'Ventricular rate control with beta-blockers (Metoprolol) or non-dihydropyridine calcium channel blockers (Diltiazem).',
        'Percutaneous Left Atrial Appendage Occlusion (Watchman device) for patients with absolute contraindication to long-term oral anticoagulation.'
      ],
      quiz: {
        question: 'What anatomical zone of the left atrium is responsible for over 90% of cardiogenic thrombi in non-valvular atrial fibrillation?',
        options: [
          'Left atrial appendage (auricle)',
          'Fossa ovalis limbus',
          'Pulmonary venous ostium',
          'Tendon of Todaro'
        ],
        correctIndex: 0,
        explanation: 'Due to its complex trabeculated pectinate structure and sluggish flow during atrial fibrillation, the Left Atrial Appendage accounts for more than 90% of cardiac thrombi in patients with non-valvular atrial fibrillation.'
      }
    }
  },
  {
    id: 'mitral-valve',
    name: 'Mitral (Bicuspid) Valve',
    latinName: 'Valva bicuspidalis / mitralis',
    category: 'Valves',
    badge: 'Atrioventricular One-Way Valve',
    pressure: 'Orifice Area: 4.0 - 6.0 cm²',
    modelPart: 'b',
    pinPosition: { x: 8, y: -105, z: 10 },
    cameraFocus: {
      position: { x: 20, y: -80, z: 90 },
      target: { x: 8, y: -105, z: 10 }
    },
    wikipediaTitle: 'Mitral_valve',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Mitral_valve',
    pubmedQuery: 'mitral+regurgitation+clip+OR+repair',
    medlineUrl: 'https://medlineplus.gov/mitralvalvedisorders.html',
    radiopaediaUrl: 'https://radiopaedia.org/articles/mitral-valve',
    shortDescription: 'Dual-flap valve separating the left atrium and left ventricle, preventing backflow during systole.',
    detailedAnatomy: 
      'Consists of two leaflets: an anterior (aortic) leaflet and posterior (mural) leaflet divided into three scallops (P1, P2, P3). Attached to the left ventricular papillary muscles via tough fibrous cords called chordae tendineae, ensuring competent coaptation under high ventricular systolic pressures.',
    hemodynamics: {
      normalVelocity: '< 1.2 m/s',
      meanGradient: '< 2 mmHg'
    },
    caseStudy: {
      title: 'Severe Chronic Degenerative Mitral Regurgitation (Flail P2 Scallop)',
      patient: '67-year-old female complaining of progressive exertional shortness of breath, orthopnea, and paroxysmal nocturnal dyspnea.',
      presentation: 'Holosystolic blowing murmur heard loudest at the cardiac apex radiating to the left axilla, displaced hyperdynamic apical impulse.',
      vitals: 'BP 128/72 mmHg, HR 78 bpm, SpO2 94% on room air.',
      diagnosticFindings: [
        'Transthoracic & 3D Transesophageal Echo: Rupture of chordae tendineae to the P2 segment of the posterior leaflet resulting in flail leaflet and severe eccentric regurgitant jet.',
        'Regurgitant Volume: 68 mL (Severe > 60 mL), Effective Regurgitant Orifice Area (EROA): 0.44 cm² (Severe >= 0.40 cm²).'
      ],
      pathophysiology: 'Myxomatous fibroelastic degeneration weakening chordae tendineae and leaflet tissue, resulting in loss of coaptation during systole and volume overload of both the left atrium and left ventricle.',
      management: [
        'Surgical Mitral Valve Repair: Quadrangular resection of P2 with annuloplasty ring placement (gold standard with >95% durability).',
        'Transcatheter Edge-to-Edge Repair (TEER with MitraClip) if the patient has prohibitive surgical risk.',
        'Diuretics (Furosemide) for pulmonary venous congestion management prior to definitive repair.'
      ],
      quiz: {
        question: 'Which scallop of the posterior mitral leaflet is most commonly involved in degenerative mitral valve prolapse and chordal rupture?',
        options: [
          'P2 (middle scallop)',
          'P1 (lateral scallop)',
          'P3 (medial scallop)',
          'A2 (anterior middle segment)'
        ],
        correctIndex: 0,
        explanation: 'The P2 (middle) scallop is subjected to the greatest hemodynamic shear stresses and is by far the most frequent site of myxomatous prolapse and chordal rupture requiring surgical resection or clipping.'
      }
    }
  },
  {
    id: 'coronary-arteries',
    name: 'Coronary Arteries & Sinuses',
    latinName: 'Arteriae coronariae (LAD, LCx, RCA)',
    category: 'Vascular Network',
    badge: 'Myocardial Perfusion',
    pressure: 'Perfusion predominantly occurs during Diastole',
    modelPart: 'b',
    pinPosition: { x: -4, y: -110, z: 32 },
    cameraFocus: {
      position: { x: -5, y: -90, z: 110 },
      target: { x: -4, y: -110, z: 32 }
    },
    wikipediaTitle: 'Coronary_circulation',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Coronary_circulation',
    pubmedQuery: 'fractional+flow+reserve+coronary+artery+disease',
    medlineUrl: 'https://medlineplus.gov/coronaryarterydisease.html',
    radiopaediaUrl: 'https://radiopaedia.org/articles/coronary-arteries',
    shortDescription: 'Supplies oxygenated blood directly to the myocardium, branching off the base of the ascending aorta.',
    detailedAnatomy: 
      'The Left Main Coronary Artery divides into the Left Anterior Descending (LAD) and Left Circumflex (LCx) arteries, supplying the anterolateral LV and septum. The Right Coronary Artery (RCA) runs in the right atrioventricular groove, supplying the RV, SA node (in 60%), and giving off the Posterior Descending Artery (PDA in 85% - right dominant). Unlike other organs, ~80% of coronary flow occurs during diastole when ventricular myocardium relaxes.',
    hemodynamics: {
      restingFlow: '250 mL / min (~5% of total cardiac output)',
      myocardialOxygenExtraction: '70% - 80% (Highest of any organ in the human body)'
    },
    caseStudy: {
      title: 'Stable Angina with Multivessel Coronary Artery Disease',
      patient: '64-year-old male with 10-year history of angina pectoris on climbing stairs or carrying groceries, relieved by rest or sublingual nitroglycerin within 3 minutes.',
      presentation: 'Canadian Cardiovascular Society (CCS) Class III angina, S4 gallop during episodes, normal resting ECG.',
      vitals: 'BP 136/84 mmHg, HR 74 bpm, BMI 31 kg/m².',
      diagnosticFindings: [
        'Coronary Angiography: 85% stenosis in mid-LAD, 80% stenosis in proximal LCx, and 90% stenosis in dominant distal RCA (Triple-vessel disease).',
        'SYNTAX Score: 34 (High complexity coronary anatomy).'
      ],
      pathophysiology: 'Flow-limiting fixed coronary atherosclerotic plaques impairing myocardial coronary flow reserve (CFR) during increased cardiac metabolic demand.',
      management: [
        'Coronary Artery Bypass Grafting (CABG): Left internal mammary artery (LIMA) to LAD, along with saphenous vein grafts to LCx and RCA.',
        'High-dose Statin, Aspirin, Beta-blocker, and ACE inhibitor.',
        'Cardiac rehabilitation and supervised lifestyle modification.'
      ],
      quiz: {
        question: 'Why does coronary blood flow to the left ventricular subendocardium occur almost exclusively during diastole?',
        options: [
          'High intramyocardial systolic tissue pressure compresses intramyocardial capillary vessels',
          'The aortic valve leaflets block coronary ostia during diastole',
          'Coronary perfusion pressure drops during ventricular relaxation',
          'Cardiac veins close during diastole'
        ],
        correctIndex: 0,
        explanation: 'During ventricular systole, the immense tension and intramyocardial pressure generated by the contracting left ventricular muscle compresses the intramyocardial vessels, effectively stopping flow; during diastole, the myocardium relaxes, allowing coronary perfusion driven by aortic diastolic pressure.'
      }
    }
  },
  {
    id: 'interventricular-septum',
    name: 'Interventricular Septum',
    latinName: 'Septum interventriculare cordis',
    category: 'Structural Septa',
    badge: 'Separating Barrier & Conduction',
    pressure: 'Pressure differential ~100 mmHg across wall',
    modelPart: 'c',
    pinPosition: { x: 2, y: -140, z: 12 },
    cameraFocus: {
      position: { x: 5, y: -125, z: 100 },
      target: { x: 2, y: -140, z: 12 }
    },
    wikipediaTitle: 'Interventricular_septum',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Interventricular_septum',
    pubmedQuery: 'hypertrophic+cardiomyopathy+septal+myectomy',
    medlineUrl: 'https://medlineplus.gov/ency/article/001099.htm',
    radiopaediaUrl: 'https://radiopaedia.org/articles/interventricular-septum',
    shortDescription: 'The muscular and membranous partition separating the left and right ventricles.',
    detailedAnatomy: 
      'Consists of a thick muscular part (inferiorly and anteriorly, forming >90% of the septum) and a thin membranous part (superiorly near the aortic and tricuspid valves). Conveys the Atrioventricular Bundle of His and right/left bundle branches of the cardiac electrical conduction network.',
    hemodynamics: {
      thickness: 'Normal diastolic thickness: 6 - 11 mm'
    },
    caseStudy: {
      title: 'Hypertrophic Obstructive Cardiomyopathy (HOCM)',
      patient: '22-year-old collegiate basketball player presenting with episodic exertional pre-syncope and chest tightness.',
      presentation: 'Harsh crescendo-decrescendo systolic murmur at the left lower sternal border that increases with Valsalva maneuver and standing, and decreases with squatting.',
      vitals: 'BP 118/76 mmHg, HR 68 bpm, Spike-and-dome carotid pulse contour.',
      diagnosticFindings: [
        'Echocardiogram: Asymmetric septal hypertrophy measuring 24 mm (Septum:Posterior wall ratio 1.8:1).',
        'Systolic Anterior Motion (SAM) of the anterior mitral valve leaflet causing dynamic left ventricular outflow tract (LVOT) gradient of 65 mmHg at rest.'
      ],
      pathophysiology: 'Autosomal dominant mutations in cardiac sarcomere proteins (MYH7, MYBPC3) causing marked myocyte disarray, interstitial fibrosis, and asymmetric septal hypertrophy resulting in dynamic subaortic obstruction.',
      management: [
        'First-line Pharmacotherapy: Non-vasodilating Beta-blockers (Metoprolol or Atenolol) or Verapamil to prolong diastolic filling and reduce contractility.',
        'Targeted Cardiac Myosin Inhibitor: Mavacamten.',
        'Surgical Septal Myectomy (Morrow procedure) or Alcohol Septal Ablation for refractory drug-resistant symptoms with gradient > 50 mmHg.',
        'Implantable Cardioverter-Defibrillator (ICD) evaluation for sudden cardiac death prevention.'
      ],
      quiz: {
        question: 'Why does the systolic murmur of Hypertrophic Obstructive Cardiomyopathy intensify during a Valsalva strain maneuver?',
        options: [
          'Decreased venous return reduces LV chamber volume, bringing the septum and mitral leaflet closer together and worsening LVOT obstruction',
          'Increased systemic vascular resistance increases afterload',
          'Bradycardia prolongs diastole',
          'Blood flow across the aortic valve increases'
        ],
        correctIndex: 0,
        explanation: 'The Valsalva strain phase reduces venous return and end-diastolic LV chamber volume. In a smaller LV chamber, the hypertrophied septum and anterior mitral leaflet are physically closer, exacerbating the Venturi effect, systolic anterior motion (SAM), and dynamic LVOT obstruction.'
      }
    }
  }
];

export function getPartById(id) {
  return HEART_ANATOMY.find(part => part.id === id);
}

export function getPartsByCategory(category) {
  if (!category || category === 'All') return HEART_ANATOMY;
  return HEART_ANATOMY.filter(part => part.category === category);
}

export const ANATOMY_CATEGORIES = [
  'All',
  'Chambers',
  'Great Vessels',
  'Valves',
  'Vascular Network',
  'Structural Septa'
];
