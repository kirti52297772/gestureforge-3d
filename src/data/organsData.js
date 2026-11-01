// ============================================================================
// MULTI-ORGAN MEDICAL SYSTEM DATA
// Supporting Heart, Brain, Lungs, Kidney, and Eye for Complete Medical Training
// ============================================================================

export const ORGANS = [
  {
    id: 'heart',
    name: 'Heart (Cardiovascular System)',
    latinName: 'Cor humanum',
    icon: '❤️',
    system: 'Cardiovascular',
    description: 'Muscular organ pumping oxygenated and deoxygenated blood through the systemic and pulmonary circulatory circuits.',
    cameraDistance: 130,
    bpm: 72,
    hasGLTF: true,
    dissectible: true,
    partsCount: 8,
    keyDiseases: ['Myocardial Infarction', 'Aortic Dissection', 'Heart Failure', 'Atrial Fibrillation']
  },
  {
    id: 'brain',
    name: 'Brain (Central Nervous System)',
    latinName: 'Encephalon',
    icon: '🧠',
    system: 'Neurology',
    description: 'Control center of the human nervous system consisting of cerebrum, cerebellum, and brainstem.',
    cameraDistance: 12,
    bpm: 0,
    hasGLTF: false,
    dissectible: true,
    partsCount: 6,
    keyDiseases: ['Ischemic Stroke', 'Glioblastoma', 'Parkinsonism', 'Epidural Hematoma'],
    parts: [
      {
        id: 'frontal-lobe',
        name: 'Frontal Lobe',
        latinName: 'Lobus frontalis',
        category: 'Cerebrum',
        badge: 'Executive & Motor Function',
        wikipediaTitle: 'Frontal_lobe',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Frontal_lobe',
        pubmedQuery: 'frontal+lobe+executive+dysfunction',
        medlineUrl: 'https://medlineplus.gov/brainmalformations.html',
        radiopaediaUrl: 'https://radiopaedia.org/articles/frontal-lobe',
        shortDescription: 'Seat of executive cognition, voluntary motor planning (motor cortex), personality, and motor speech (Broca area).',
        detailedAnatomy: 'Comprises the anterior portion of the cerebral hemisphere bounded posteriorly by the central sulcus of Rolando and inferiorly by the lateral sulcus of Sylvius. Houses the primary motor cortex (precentral gyrus, Brodmann area 4) and Broca area (pars opercularis and triangularis in the dominant hemisphere).',
        caseStudy: {
          title: 'Broca Expressive Aphasia following Left MCA Superior Division Stroke',
          patient: '68-year-old right-handed female with atrial fibrillation found unresponsive with sudden speech arrest.',
          presentation: 'Severe non-fluent, halting speech with intact auditory comprehension; patient understands questions but struggles to verbalize sentences ("tan-tan", telegraphic speech). Associated with right facial droop and right arm weakness.',
          diagnosticFindings: ['Brain MRI DWI: Acute cortical restricted diffusion in the left inferior frontal gyrus (Broca area).', 'CT Angiogram: Occlusion of the superior division of the left middle cerebral artery.'],
          pathophysiology: 'Embolic occlusion of the left MCA superior division leading to ischemic injury of Brodmann areas 44 and 45 responsible for articulation and speech motor planning.',
          management: ['Emergent endovascular thrombectomy within window.', 'Speech-language pathology rehabilitation.', 'Secondary stroke prevention with direct oral anticoagulation.'],
          quiz: {
            question: 'Which Brodmann areas anatomically correspond to Broca speech area in the dominant frontal lobe?',
            options: ['Brodmann areas 44 and 45', 'Brodmann area 22 (Wernicke)', 'Brodmann area 4 (Primary motor)', 'Brodmann area 17 (Primary visual)'],
            correctIndex: 0,
            explanation: 'Broca area is located in the pars triangularis (Brodmann area 45) and pars opercularis (Brodmann area 44) of the dominant inferior frontal gyrus.'
          }
        }
      },
      {
        id: 'temporal-lobe',
        name: 'Temporal Lobe & Hippocampus',
        latinName: 'Lobus temporalis et Hippocampus',
        category: 'Cerebrum',
        badge: 'Auditory & Memory Processing',
        wikipediaTitle: 'Temporal_lobe',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Temporal_lobe',
        pubmedQuery: 'temporal+lobe+epilepsy+hippocampal+sclerosis',
        medlineUrl: 'https://medlineplus.gov/epilepsy.html',
        radiopaediaUrl: 'https://radiopaedia.org/articles/temporal-lobe',
        shortDescription: 'Processes sensory input into derived meanings for visual memory, language comprehension (Wernicke area), and emotion.',
        detailedAnatomy: 'Located beneath the lateral fissure. Features the superior temporal gyrus (containing Wernicke area Brodmann 22 and Heschl transverse gyri for auditory cortex) and the medial temporal structures including hippocampus and amygdala.',
        caseStudy: {
          title: 'Mesial Temporal Lobe Epilepsy (MTLE) with Hippocampal Sclerosis',
          patient: '27-year-old male with history of prolonged febrile seizures in infancy presenting with stereotyped episodes.',
          presentation: 'Rising epigastric aura ("butterflies in stomach") followed by déjà vu, olfactory hallucinations (burnt rubber smell), behavioral arrest, and oral lip-smacking automatisms lasting 90 seconds, followed by postictal confusion.',
          diagnosticFindings: ['High-resolution 3T Epilepsy Protocol MRI: Atrophy and hyperintense T2/FLAIR signal in the right hippocampus.', 'Video-EEG Monitoring: Right anterior temporal sharp and slow-wave discharges during ictus.'],
          pathophysiology: 'Loss of pyramidal neurons in CA1 and CA4 subfields of the hippocampus with dense reactive astrogliosis creating an epileptogenic focus.',
          management: ['Antiseizure medications: Lamotrigine or Levetiracetam.', 'Surgical Anterior Temporal Lobectomy with Amygdalohippocampectomy if pharmacoresistant, achieving >70% seizure freedom.'],
          quiz: {
            question: 'What is the characteristic histological finding in Mesial Temporal Sclerosis causing temporal lobe epilepsy?',
            options: ['Loss of CA1 and CA4 pyramidal neurons with reactive gliosis', 'Lewy bodies in substantia nigra', 'Neurofibrillary tangles in motor cortex', 'Demyelinating plaques in white matter'],
            correctIndex: 0,
            explanation: 'Hippocampal sclerosis is characterized by marked neuronal loss and dense fibrillary gliosis predominantly affecting the Sommer sector (CA1) and end-blade (CA4) subfields of Ammon horn.'
          }
        }
      },
      {
        id: 'cerebellum',
        name: 'Cerebellum (Little Brain)',
        latinName: 'Cerebellum',
        category: 'Infratentorial',
        badge: 'Motor Coordination & Balance',
        wikipediaTitle: 'Cerebellum',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Cerebellum',
        pubmedQuery: 'cerebellar+ataxia+stroke+syndrome',
        medlineUrl: 'https://medlineplus.gov/movementdisorders.html',
        radiopaediaUrl: 'https://radiopaedia.org/articles/cerebellum',
        shortDescription: 'Coordinates timing and precision of voluntary motor movements, maintaining balance and posture.',
        detailedAnatomy: 'Located in the posterior cranial fossa inferior to the tentorium cerebelli. Composed of two lateral hemispheres joined by the midline vermis. Rich in Purkinje cells that receive climbing and mossy fibers.',
        caseStudy: {
          title: 'Acute Cerebellar Infarction (PICA Territory Stroke)',
          patient: '63-year-old male presenting with abrupt onset severe vertigo, intractable vomiting, and inability to stand.',
          presentation: 'Ipsilateral limb dysmetria on finger-to-nose testing, dysdiadochokinesia (impaired rapid alternating movements), intention tremor, and coarse horizontal nystagmus beating toward the lesion.',
          diagnosticFindings: ['Brain MRI: Acute infarction in the left cerebellar hemisphere in the posterior inferior cerebellar artery (PICA) distribution.', 'Absence of hemiplegia.'],
          pathophysiology: 'Ischemia of the cerebellar cortex and deep nuclei leads to disruption of cerebrocerebellar feedback loops, producing ipsilateral ataxia.',
          management: ['Close ICU monitoring for posterior fossa edema and obstructive hydrocephalus.', 'Emergent suboccipital decompressive craniectomy if brainstem compression or fourth ventricle effacement occurs.'],
          quiz: {
            question: 'Unilateral cerebellar lesions produce neurological deficits on which side of the body?',
            options: ['Ipsilateral side (same side as lesion)', 'Contralateral side', 'Bilateral equally', 'Upper extremities only'],
            correctIndex: 0,
            explanation: 'Cerebellar output pathways double-decussate (decussation of the superior cerebellar peduncles and subsequent corticospinal decussation in the medulla), meaning cerebellar lesions characteristically manifest as IPSILATERAL motor ataxia.'
          }
        }
      },
      {
        id: 'brainstem',
        name: 'Brainstem (Midbrain, Pons, Medulla)',
        latinName: 'Truncus encephali',
        category: 'Vital Core',
        badge: 'Cardiorespiratory & Cranial Nerves',
        wikipediaTitle: 'Brainstem',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Brainstem',
        pubmedQuery: 'lateral+medullary+syndrome+wallenberg',
        medlineUrl: 'https://medlineplus.gov/stroke.html',
        radiopaediaUrl: 'https://radiopaedia.org/articles/brainstem',
        shortDescription: 'Connects the cerebrum and spinal cord; houses vital cardiac, respiratory, and vasomotor centers and cranial nerve nuclei III through XII.',
        detailedAnatomy: 'Consists of the midbrain (mesencephalon), pons (metencephalon), and medulla oblongata (myelencephalon). Contains the ascending reticular activating system (ARAS) essential for consciousness.',
        caseStudy: {
          title: 'Wallenberg Lateral Medullary Syndrome',
          patient: '55-year-old male with vertebral artery dissection after chiropractic neck manipulation presenting with sudden vertigo, hoarseness, and dysphagia.',
          presentation: 'Ipsilateral Horner syndrome (ptosis, miosis, anhidrosis), loss of pain/temperature on the ipsilateral face and contralateral body (crossed sensory loss), and intractable hiccups.',
          diagnosticFindings: ['MRI Brain: Wedge-shaped hyperintensity in the lateral aspect of the rostral medulla.', 'MRA: Dissection and occlusion of the vertebral artery.'],
          pathophysiology: 'Infarction of the dorsolateral medulla affecting the nucleus ambiguus (IX, X), spinal trigeminal nucleus (V), spinothalamic tract, and descending sympathetic fibers.',
          management: ['Anticoagulation or antiplatelet therapy for vertebral dissection.', 'Strict NPO status and dysphagia assessment to prevent aspiration pneumonia.', 'Supportive care.'],
          quiz: {
            question: 'What classic pattern of sensory loss defines Wallenberg lateral medullary syndrome?',
            options: ['Loss of pain and temperature on ipsilateral face and contralateral body', 'Bilateral total sensory loss', 'Loss of proprioception and vibration bilaterally', 'Contralateral facial sensory loss only'],
            correctIndex: 0,
            explanation: 'Involvement of the ipsilateral spinal trigeminal tract/nucleus causes loss of pain and temperature on the IPSILATERAL face, while damage to the crossed spinothalamic tract causes loss of pain and temperature on the CONTRALATERAL body (crossed sensory deficit).'
          }
        }
      }
    ]
  },
  {
    id: 'lungs',
    name: 'Lungs & Respiratory System',
    latinName: 'Pulmones',
    icon: '🫁',
    system: 'Pulmonology',
    description: 'Essential paired organs of respiration facilitating alveolar oxygen uptake and carbon dioxide elimination.',
    cameraDistance: 14,
    bpm: 16,
    hasGLTF: false,
    dissectible: true,
    partsCount: 5,
    keyDiseases: ['COPD', 'Pneumothorax', 'Pneumonia', 'Pulmonary Embolism'],
    parts: [
      {
        id: 'trachea-bronchi',
        name: 'Trachea & Main Bronchi',
        latinName: 'Trachea et Bronchi principales',
        category: 'Airways',
        badge: 'Conducting Zone',
        wikipediaTitle: 'Trachea',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Trachea',
        pubmedQuery: 'tracheal+stenosis+bronchoscopy',
        medlineUrl: 'https://medlineplus.gov/tracheaandlungs.html',
        radiopaediaUrl: 'https://radiopaedia.org/articles/trachea',
        shortDescription: 'Fibrocartilaginous tube reinforced by 16-20 C-shaped hyaline cartilage rings bifurcating at the carina.',
        detailedAnatomy: 'Measures ~10-12 cm in length and 2 cm in diameter. Originates at the lower border of the cricoid cartilage (C6) and terminates at the carina (T4/T5), bifurcating into the wider, shorter, more vertical right main bronchus and the more horizontal left main bronchus.',
        caseStudy: {
          title: 'Foreign Body Aspiration into the Right Main Bronchus',
          patient: '3-year-old child presenting with acute choking episode while eating peanuts, followed by persistent wheezing and cough.',
          presentation: 'Unilateral decreased breath sounds and localized expiratory wheeze over the right lower hemithorax.',
          diagnosticFindings: ['Inspiratory/Expiratory Chest X-ray: Hyperlucency and air trapping in the right lung with mediastinal shift away from the right side on expiration.', 'Rigid Bronchoscopy: Organic foreign body (peanut fragment) lodged in the right intermediate bronchus.'],
          pathophysiology: 'The right mainstem bronchus is wider, shorter (~2.5 cm vs 5 cm), and runs more vertically than the left, making it the preferential pathway for aspirated foreign bodies.',
          management: ['Urgent rigid bronchoscopy under general anesthesia for foreign body extraction.', 'Post-procedure nebulized bronchodilators and observation.'],
          quiz: {
            question: 'Why do aspirated foreign bodies lodge predominantly in the right main bronchus rather than the left?',
            options: ['The right bronchus is wider, shorter, and more vertically aligned with the trachea', 'The right lung has higher negative pressure', 'The left bronchus has more cartilage rings', 'The right bronchus lacks cilia'],
            correctIndex: 0,
            explanation: 'The right main bronchus branches off the tracheal carina at a steeper, more vertical angle (~25 degrees vs 45 degrees for the left) and has a wider diameter, making it the direct linear path of entry for aspirated material.'
          }
        }
      },
      {
        id: 'right-lung',
        name: 'Right Lung (Superior, Middle, Inferior Lobes)',
        latinName: 'Pulmo dexter',
        category: 'Parenchyma',
        badge: '3 Lobes (Upper, Middle, Lower)',
        wikipediaTitle: 'Lung',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Lung',
        pubmedQuery: 'right+middle+lobe+syndrome+atelectasis',
        medlineUrl: 'https://medlineplus.gov/lungdiseases.html',
        radiopaediaUrl: 'https://radiopaedia.org/articles/right-lung',
        shortDescription: 'Larger and heavier than the left lung, divided into three lobes by oblique and horizontal fissures.',
        detailedAnatomy: 'Volume is ~10-20% greater than left lung. Contains horizontal fissure separating superior and middle lobes, and oblique fissure separating middle and inferior lobes. Has 10 bronchopulmonary segments.',
        caseStudy: {
          title: 'Right Middle Lobe (RML) Consolidation secondary to Lobar Pneumonia',
          patient: '42-year-old male with acute fever to 39.4°C, productive cough with rust-colored sputum, and right-sided pleuritic chest pain.',
          presentation: 'Bronchial breath sounds, dullness to percussion, and increased tactile fremitus over the right anterior chest between ribs 4 and 6.',
          diagnosticFindings: ['Chest Radiograph (PA & Lateral): Triangular wedge of dense opacity obscuring the right heart border (positive silhouette sign).', 'Sputum Gram Stain: Gram-positive lancet-shaped diplococci (Streptococcus pneumoniae).'],
          pathophysiology: 'Alveolar exudative inflammation with neutrophilic infiltration and red blood cell extravasation producing hepatization of the right middle lobe parenchyma.',
          management: ['Oral Amoxicillin/Clavulanate or Ceftriaxone + Azithromycin for community-acquired pneumonia.', 'Supplemental oxygen and pulmonary toilet.'],
          quiz: {
            question: 'On a posteroanterior (PA) chest X-ray, loss of the right cardiac silhouette (Silhouette Sign) indicates consolidation in which lung lobe?',
            options: ['Right Middle Lobe', 'Right Upper Lobe', 'Right Lower Lobe (Superior segment)', 'Left Lower Lobe'],
            correctIndex: 0,
            explanation: 'The right middle lobe lies anatomically contiguous to the right heart border; therefore, an alveolar infiltrate in the right middle lobe obliterates the radiopaque border between the lung and right atrium (classic positive silhouette sign).'
          }
        }
      },
      {
        id: 'left-lung',
        name: 'Left Lung & Cardiac Notch',
        latinName: 'Pulmo sinister et Lingula',
        category: 'Parenchyma',
        badge: '2 Lobes with Lingula',
        wikipediaTitle: 'Lung',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Lung',
        pubmedQuery: 'tension+pneumothorax+decompression',
        medlineUrl: 'https://medlineplus.gov/collapsedlung.html',
        radiopaediaUrl: 'https://radiopaedia.org/articles/left-lung',
        shortDescription: 'Divided into superior and inferior lobes by a single oblique fissure; features the cardiac notch and lingula.',
        detailedAnatomy: 'Accommodates the asymmetrical apex of the heart through a deep medial indent known as the cardiac impression and anterior cardiac notch. The lingula represents the embryological homologue of the right middle lobe.',
        caseStudy: {
          title: 'Tension Pneumothorax with Obstructive Shock',
          patient: '19-year-old tall, slender male experiencing sudden severe unilateral pleuritic chest pain and rapidly worsening breathlessness while sitting at rest.',
          presentation: 'Severe respiratory distress, absent breath sounds over the left hemithorax, hyperresonance to percussion, tracheal deviation to the right, and distended neck veins.',
          diagnosticFindings: ['Clinical Emergency Diagnosis (no X-ray delay): Hypotension BP 76/40 mmHg with signs of obstructive shock and contralateral tracheal shift.'],
          pathophysiology: 'Rupture of a subpleural apical apical bleb creating a one-way valve mechanism where air enters the pleural space during inspiration but cannot exit, creating positive intrathoracic pressure that compresses the vena cava and collapses cardiac preload.',
          management: ['Immediate emergent needle decompression using a 14-gauge catheter in the 2nd intercostal space midclavicular line or 4th/5th intercostal space anterior axillary line.', 'Subsequent tube thoracostomy (chest tube) with underwater seal.'],
          quiz: {
            question: 'What is the primary hemodynamic mechanism causing cardiovascular collapse in tension pneumothorax?',
            options: ['Increased intrathoracic pressure collapses the vena cava, eliminating venous return and cardiac output', 'Direct laceration of the pulmonary artery', 'Acute pulmonary edema', 'Myocardial infarction'],
            correctIndex: 0,
            explanation: 'High positive pressure inside the affected pleural cavity compresses the thin-walled superior and inferior vena cavae and pushes the mediastinum to the opposite side, halting venous return to the right atrium and causing catastrophic obstructive shock.'
          }
        }
      }
    ]
  },
  {
    id: 'kidney',
    name: 'Kidney (Renal System)',
    latinName: 'Ren humanum',
    icon: '🫘',
    system: 'Nephrology',
    description: 'Bean-shaped retroperitoneal organ vital for blood filtration, electrolyte homeostasis, and erythropoietin secretion.',
    cameraDistance: 13,
    bpm: 0,
    hasGLTF: false,
    dissectible: true,
    partsCount: 5,
    keyDiseases: ['Acute Kidney Injury', 'Renal Cell Carcinoma', 'Nephrolithiasis', 'Glomerulonephritis'],
    parts: [
      {
        id: 'renal-cortex',
        name: 'Renal Cortex & Glomeruli',
        latinName: 'Cortex renalis',
        category: 'Filtration',
        badge: 'Functional Glomerular Unit',
        wikipediaTitle: 'Renal_cortex',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Renal_cortex',
        pubmedQuery: 'glomerulonephritis+proteinuria+biopsy',
        medlineUrl: 'https://medlineplus.gov/kidneydiseases.html',
        radiopaediaUrl: 'https://radiopaedia.org/articles/kidney',
        shortDescription: 'Outer zone containing approximately one million nephrons with Bowman capsules and convoluted tubules.',
        detailedAnatomy: 'Extends from the fibrous renal capsule to the bases of the renal pyramids and between them as renal columns of Bertin. Receives >80% of total renal blood flow to maintain ultrafiltration across the glomerular basement membrane.',
        caseStudy: {
          title: 'Rapidly Progressive Glomerulonephritis (Anti-GBM / Goodpasture Disease)',
          patient: '29-year-old male presenting with gross hematuria (cola-colored urine), hemoptysis (coughing blood), and oliguria.',
          presentation: 'Severe hypertension, bilateral basal crackles on lung auscultation, peripheral pitting edema.',
          diagnosticFindings: ['Serum Creatinine elevated from 0.9 to 5.4 mg/dL over 4 days.', 'Urinalysis: Dismorphic red blood cells and RBC casts.', 'Renal Biopsy: Cellular crescent formation in >70% of glomeruli with linear IgG deposition along the glomerular basement membrane.'],
          pathophysiology: 'Autoantibodies directed against the non-collagenous domain of the alpha-3 chain of type IV collagen in the glomerular and alveolar basement membranes.',
          management: ['Emergency Plasmapheresis to remove circulating anti-GBM antibodies.', 'High-dose pulse IV Methylprednisolone followed by oral prednisone.', 'Cyclophosphamide immunosuppression.'],
          quiz: {
            question: 'What microscopic hallmark on renal biopsy defines rapidly progressive glomerulonephritis (RPGN)?',
            options: ['Epithelial crescents in Bowman space', 'Kimmelstiel-Wilson nodules', 'Spikes and domes on basement membrane', 'Oncocyte sheets'],
            correctIndex: 0,
            explanation: 'Glomerular crescents—formed by the proliferation of parietal epithelial cells and infiltrating monocytes in Bowman space—are the diagnostic pathognomonic hallmark of rapidly progressive crescentic glomerulonephritis.'
          }
        }
      },
      {
        id: 'renal-medulla',
        name: 'Renal Medulla & Pyramids',
        latinName: 'Medulla renalis et Pyramides renales',
        category: 'Concentration',
        badge: 'Countercurrent Osmotic Gradient',
        wikipediaTitle: 'Renal_medulla',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Renal_medulla',
        pubmedQuery: 'renal+papillary+necrosis+causes',
        medlineUrl: 'https://medlineplus.gov/kidneydiseases.html',
        radiopaediaUrl: 'https://radiopaedia.org/articles/renal-medulla',
        shortDescription: 'Inner tissue containing 8-18 cone-shaped renal pyramids responsible for urine concentration via the Loops of Henle.',
        detailedAnatomy: 'Features loops of Henle, collecting ducts, and straight blood vessels (vasa recta). Establishes a hypertonic medullary osmotic gradient (up to 1200 mOsm/kg) that drives water reabsorption regulated by antidiuretic hormone (ADH/Vasopressin).',
        caseStudy: {
          title: 'Acute Renal Papillary Necrosis in Sickle Cell Trait',
          patient: '34-year-old female with sickle cell trait presenting with sudden flank pain, fever, and sloughed tissue fragments in urine.',
          presentation: 'Gross hematuria, costovertebral angle tenderness resembling acute ureteral colic.',
          diagnosticFindings: ['CT Urogram: "Ring-shadow" sign representing sloughed necrotic papilla surrounded by contrast in the renal calyx.', 'Urinary sediment showing sloughed necrotic papillae.'],
          pathophysiology: 'Hypertonic and hypoxic environment of the renal medulla promotes hemoglobin S sickling in the vasa recta, causing microvascular occlusion and ischemic necrosis of the medullary papillae.',
          management: ['Aggressive IV hydration and pain control.', 'Antibiotic therapy if secondary obstructive pyelonephritis develops.', 'Avoidance of nephrotoxic drugs, specifically NSAIDs.'],
          quiz: {
            question: 'Which of the following conditions is most classically associated with acute renal papillary necrosis?',
            options: ['Analgesic nephropathy (chronic NSAID abuse) and Sickle cell disease', 'Primary hyperaldosteronism', 'Renal artery stenosis', 'Minimal change disease'],
            correctIndex: 0,
            explanation: 'The classic causes of renal papillary necrosis are easily remembered by the mnemonic POSTCARDS: Pyelonephritis, Obstruction, Sickle cell disease, Tuberculosis, Cirrhosis, Analgesics (NSAIDs), Renal vein thrombosis, Diabetes mellitus, and Systemic vasculitis.'
          }
        }
      }
    ]
  },
  {
    id: 'eye',
    name: 'Human Eye (Ophthalmic Anatomy)',
    latinName: 'Organum visus / Oculus',
    icon: '👁️',
    system: 'Ophthalmology',
    description: 'Specialized sensory organ collecting and focusing electromagnetic photons onto the photoreceptive neural retina.',
    cameraDistance: 11,
    bpm: 0,
    hasGLTF: false,
    dissectible: true,
    partsCount: 5,
    keyDiseases: ['Acute Angle-Closure Glaucoma', 'Retinal Detachment', 'Cataract', 'Age-Related Macular Degeneration'],
    parts: [
      {
        id: 'cornea-lens',
        name: 'Cornea, Iris & Crystalline Lens',
        latinName: 'Cornea, Iris et Lens crystallina',
        category: 'Refractive Media',
        badge: 'Optical Focusing Apparatus',
        wikipediaTitle: 'Cornea',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Cornea',
        pubmedQuery: 'acute+angle+closure+glaucoma+management',
        medlineUrl: 'https://medlineplus.gov/corneadisorders.html',
        radiopaediaUrl: 'https://radiopaedia.org/articles/globe',
        shortDescription: 'The transparent anterior optical window of the globe providing approximately two-thirds of the eye total refractive power (~43 diopters).',
        detailedAnatomy: 'Consists of 5 histological layers: Epithelium, Bowman layer, Stroma (90% of corneal thickness), Descemet membrane, and Endothelium. The crystalline lens sits behind the iris suspended by zonular fibers attached to the ciliary body.',
        caseStudy: {
          title: 'Acute Primary Angle-Closure Glaucoma (Ophthalmic Emergency)',
          patient: '59-year-old hyperopic female entering a darkened movie theater who suddenly develops severe right eye pain, blurry vision, and rainbow halos around lights accompanied by nausea and headache.',
          presentation: 'Right eye injection (ciliary flush), mid-dilated fixed pupil, "steamy" edematous cornea, and rock-hard globe on palpation.',
          diagnosticFindings: ['Tonometry: Intraocular Pressure (IOP) 58 mmHg in right eye (normal 10-21 mmHg).', 'Gonioscopy: Complete 360-degree iridocorneal angle closure.'],
          pathophysiology: 'Mid-dilation of the pupil in dim light causes pupillary block, preventing aqueous humor from passing through the pupil into the anterior chamber, pushing the peripheral iris forward against the trabecular meshwork.',
          management: ['Emergency IOP reduction: IV Acetazolamide 500 mg, topical beta-blocker (Timolol), alpha-2 agonist (Apraclonidine), and topical Pilocarpine 2% to induce miosis.', 'Definitive therapy: Bilateral Laser Peripheral Iridotomy (LPI) to create an alternate bypass for aqueous humor.'],
          quiz: {
            question: 'Why must both the affected eye AND the contralateral fellow eye undergo laser peripheral iridotomy in acute angle-closure glaucoma?',
            options: ['The fellow eye shares the same shallow anterior chamber anatomical predisposition and has up to 50% risk of an acute attack within 5 years', 'To prevent sympathetic ophthalmia', 'To balance intraocular pressure', 'To improve binocular depth perception'],
            correctIndex: 0,
            explanation: 'The anatomical configuration of a narrow iridocorneal angle and shallow anterior chamber is almost always bilateral; without prophylactic iridotomy, the contralateral eye has an extremely high risk of suffering an acute angle-closure crisis.'
          }
        }
      },
      {
        id: 'retina-macula',
        name: 'Retina, Macula & Optic Nerve',
        latinName: 'Retina, Macula lutea et Nervus opticus',
        category: 'Neural Sensing',
        badge: 'Photoreception & Visual Pathway',
        wikipediaTitle: 'Retina',
        wikipediaUrl: 'https://en.wikipedia.org/wiki/Retina',
        pubmedQuery: 'rhegmatogenous+retinal+detachment+surgery',
        medlineUrl: 'https://medlineplus.gov/retinaldisorders.html',
        radiopaediaUrl: 'https://radiopaedia.org/articles/retina',
        shortDescription: 'Sensory tunic containing rod and cone photoreceptors that convert light into nerve impulses conducted along the optic nerve (CN II).',
        detailedAnatomy: 'Composed of 10 histological layers. The macula lutea contains the fovea centralis (densest packing of cones for high-acuity central vision). The optic disc is the exit point for ganglion cell axons forming the optic nerve.',
        caseStudy: {
          title: 'Rhegmatogenous Retinal Detachment (RRD)',
          patient: '52-year-old highly myopic male who experienced sudden photopsias (flashing lights) and hundreds of dark floaters ("cobwebs"), followed by a dark curtain descending across his visual field.',
          presentation: 'Relative afferent pupillary defect (RAPD) in affected eye, visual acuity reduced to counting fingers.',
          diagnosticFindings: ['Dilated Fundus Examination: Elevated, corrugated, mobile grayish-white retinal sheet with a horseshoe-shaped retinal tear at 11 o clock.'],
          pathophysiology: 'Posterior vitreous detachment causes dynamic traction on the peripheral retina, creating a full-thickness break that allows fluid vitreous to enter the subretinal space, peeling the neurosensory retina from the underlying retinal pigment epithelium.',
          management: ['Emergent surgical repair: Pars plana vitrectomy (PPV) with gas endotamponade or scleral buckle procedure.', 'Strict post-operative positioning.'],
          quiz: {
            question: 'What is the most common cause of full-thickness retinal breaks leading to rhegmatogenous retinal detachment?',
            options: ['Dynamic traction during Posterior Vitreous Detachment (PVD)', 'Direct mechanical trauma to cornea', 'Optic neuritis', 'Cataract maturation'],
            correctIndex: 0,
            explanation: 'As the vitreous gel liquefies and shrinks with age (syneresis), it separates from the internal limiting membrane of the retina (PVD); at sites of strong vitreoretinal adhesion, traction can tear the neurosensory retina, precipitating detachment.'
          }
        }
      }
    ]
  }
];

export function getOrganById(id) {
  return ORGANS.find(o => o.id === id) || ORGANS[0];
}
