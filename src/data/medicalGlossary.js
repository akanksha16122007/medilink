
import {
  faDroplet,
  faHeartPulse,
  faSyringe,
  faLungs,
  faBone,
  faShieldVirus,
  faMagnifyingGlass,
  faWaveSquare,
  faPills,
  faGlassWater,
  faTemperatureHalf,
  faDna,
  faMicroscope,
  faShieldHeart,
  faBookMedical
} from "@fortawesome/free-solid-svg-icons";

const medicalGlossary = [
  {
    id: 1,
    name: "Anaemia",
    category: "Blood",
    icon: faDroplet,
    easy:
      "Anaemia is a condition in which your blood does not have enough healthy red blood cells or haemoglobin to carry oxygen around your body. This can make you feel tired, weak, or dizzy.",
    medium:
      "Red blood cells contain haemoglobin, a protein that carries oxygen from the lungs to the body's tissues. When haemoglobin levels are low, your muscles and organs may receive less oxygen than they need. Iron deficiency is one common cause, but vitamin deficiencies, blood loss, and certain illnesses can also cause anaemia.",
    hard:
      "Anaemia is identified using blood tests, commonly a complete blood count (CBC), which measures haemoglobin and other blood components. Further investigations may include ferritin, vitamin B12, folate, or tests for blood loss, depending on the suspected cause. Management depends on the underlying condition and may involve treating deficiencies, addressing blood loss, or managing chronic disease.",
    visualSteps: [
      {
        icon: faDroplet,
        title: "Healthy Blood",
        description:
          "Red blood cells contain haemoglobin, which binds oxygen and transports it from the lungs to body tissues."
      },
      {
        icon: faHeartPulse,
        title: "Reduced Oxygen Delivery",
        description:
          "When haemoglobin or healthy red blood cells are insufficient, less oxygen may reach the body's tissues."
      },
      {
        icon: faBookMedical,
        title: "Testing and Treatment",
        description:
          "Blood tests help identify the type and cause of anaemia so that appropriate treatment can be selected."
      }
    ]
  },
  {
    id: 2,
    name: "Blood Pressure",
    category: "Heart",
    icon: faHeartPulse,
    easy:
      "Blood pressure is the force with which blood pushes against the walls of your blood vessels as your heart pumps. It is written as two numbers, such as 120/80 mmHg.",
    medium:
      "The upper number, called systolic pressure, measures pressure when the heart contracts. The lower number, called diastolic pressure, measures pressure when the heart relaxes between beats. Blood pressure changes throughout the day with activity, stress, sleep, and other factors.",
    hard:
      "Blood pressure is assessed using a validated blood pressure monitor, with the person seated comfortably and the arm supported. Repeated measurements are often needed because one reading may not represent usual blood pressure. Persistently elevated blood pressure can increase cardiovascular and kidney risks, while interpretation depends on the reading, clinical context, and applicable guidelines.",
    visualSteps: [
      {
        icon: faHeartPulse,
        title: "Heart Pumps",
        description:
          "The heart contracts and pushes blood into the arteries, creating pressure against their walls."
      },
      {
        icon: faWaveSquare,
        title: "Two Measurements",
        description:
          "Systolic pressure is measured during a heartbeat, while diastolic pressure is measured between heartbeats."
      },
      {
        icon: faMicroscope,
        title: "Regular Monitoring",
        description:
          "Consistent measurements help healthcare professionals understand blood pressure patterns and assess possible risks."
      }
    ]
  },
  {
    id: 3,
    name: "Diabetes",
    category: "Metabolism",
    icon: faSyringe,
    easy:
      "Diabetes is a long-term condition in which the amount of glucose, or sugar, in the blood becomes too high. Glucose provides energy, but the body needs insulin to regulate how it is used.",
    medium:
      "Insulin is a hormone made by the pancreas. In type 1 diabetes, the body produces little or no insulin because insulin-producing cells are destroyed. In type 2 diabetes, the body does not use insulin effectively and may eventually produce too little. Both types require appropriate monitoring and care.",
    hard:
      "Diabetes is assessed using tests such as fasting plasma glucose and HbA1c, which reflects average blood glucose over approximately two to three months. Management may include nutrition changes, physical activity, glucose monitoring, and medication or insulin, depending on the type and individual needs. Long-term management helps reduce the risk of eye, kidney, nerve, heart, and blood vessel complications.",
    visualSteps: [
      {
        icon: faSyringe,
        title: "Glucose Enters Blood",
        description:
          "After digestion, carbohydrates are broken down into glucose, which enters the bloodstream."
      },
      {
        icon: faHeartPulse,
        title: "Insulin Regulates Sugar",
        description:
          "Insulin helps regulate blood glucose by supporting its use and storage in the body's tissues."
      },
      {
        icon: faBookMedical,
        title: "Monitoring and Care",
        description:
          "Blood glucose tests, HbA1c measurements, and an appropriate care plan help manage diabetes."
      }
    ]
  },
  {
    id: 4,
    name: "Hypertension",
    category: "Heart",
    icon: faHeartPulse,
    easy:
      "Hypertension is the medical term for blood pressure that remains higher than recommended. It is often called high blood pressure and may not cause noticeable symptoms.",
    medium:
      "When blood pressure remains elevated over time, the heart and blood vessels experience extra strain. Many people feel completely normal even when their pressure is high. Regular blood pressure checks are important because untreated hypertension can increase the risk of heart disease, stroke, and kidney problems.",
    hard:
      "Diagnosis generally relies on repeated properly performed blood pressure measurements, sometimes supplemented by home or ambulatory monitoring. Thresholds vary across clinical guidelines and individual circumstances. Management may include reducing excess salt intake, regular physical activity, limiting alcohol, and prescribed antihypertensive medication. Assessment also considers other cardiovascular risk factors and possible secondary causes.",
    visualSteps: [
      {
        icon: faHeartPulse,
        title: "Pressure Rises",
        description:
          "Blood continues to push against artery walls at an elevated pressure over time."
      },
      {
        icon: faShieldHeart,
        title: "Organs Face Extra Strain",
        description:
          "Persistent hypertension can damage blood vessels and increase strain on the heart, kidneys, and brain."
      },
      {
        icon: faBookMedical,
        title: "Control the Risk",
        description:
          "Regular monitoring, healthy habits, and prescribed treatment can help reduce long-term complications."
      }
    ]
  },
  {
    id: 5,
    name: "Asthma",
    category: "Respiratory",
    icon: faLungs,
    easy:
      "Asthma is a condition that affects the airways in your lungs. The airways can become swollen, narrow, and produce extra mucus, making it harder to breathe.",
    medium:
      "People with asthma may experience wheezing, coughing, chest tightness, and shortness of breath. Symptoms can vary and may worsen with exercise, respiratory infections, smoke, allergens, or cold air. Asthma symptoms often improve with appropriate inhaled medication, although the condition requires ongoing management.",
    hard:
      "Asthma assessment includes a clinical history and, where appropriate, lung function testing such as spirometry to evaluate airflow and its response to a bronchodilator. Treatment commonly includes inhaled corticosteroid-containing therapy, with the specific regimen based on symptom control, risk, and clinical guidance. A written action plan can help patients recognise worsening symptoms and respond appropriately.",
    visualSteps: [
      {
        icon: faLungs,
        title: "Air Enters the Lungs",
        description:
          "Air normally travels through branching airways before reaching the tiny air sacs where gas exchange occurs."
      },
      {
        icon: faShieldVirus,
        title: "Airways Become Inflamed",
        description:
          "Inflammation, muscle tightening, and extra mucus narrow the airways and restrict airflow."
      },
      {
        icon: faBookMedical,
        title: "Manage Symptoms",
        description:
          "Appropriate inhalers, trigger awareness, and an asthma action plan help manage symptoms and flare-ups."
      }
    ]
  },
  {
    id: 6,
    name: "Fracture",
    category: "Bones",
    icon: faBone,
    easy:
      "A fracture is a crack or break in a bone. It can happen after a fall, an accident, a direct injury, or sometimes when a bone is weakened by disease.",
    medium:
      "Fractures may be small cracks, complete breaks, or breaks in which bone fragments move out of alignment. Common signs include pain, swelling, bruising, and difficulty moving or using the injured area. Doctors may use X-rays and sometimes CT or MRI scans to assess the injury.",
    hard:
      "Fracture management depends on the bone involved, fracture pattern, displacement, soft-tissue injury, and overall patient health. Treatment may include immobilisation with a splint or cast, reduction to restore alignment, or surgery using fixation devices. Healing is monitored clinically and sometimes with follow-up imaging; rehabilitation helps restore strength and movement.",
    visualSteps: [
      {
        icon: faBone,
        title: "Bone Is Injured",
        description:
          "A force greater than the bone can tolerate, or a weakened bone, may result in a fracture."
      },
      {
        icon: faMagnifyingGlass,
        title: "Examination and Imaging",
        description:
          "A healthcare professional examines the injury and may request imaging to identify the fracture."
      },
      {
        icon: faBookMedical,
        title: "Healing and Recovery",
        description:
          "Immobilisation or surgery may help stabilise the bone while healing and rehabilitation take place."
      }
    ]
  },
  {
    id: 7,
    name: "Infection",
    category: "Immunity",
    icon: faShieldVirus,
    easy:
      "An infection happens when harmful microorganisms enter the body and multiply. These microorganisms can include bacteria, viruses, fungi, and parasites.",
    medium:
      "The immune system responds to invading microorganisms, and this response may cause symptoms such as fever, pain, swelling, cough, or tiredness. Symptoms depend on the organism and the part of the body affected. Some infections are mild, while others can become serious and need prompt medical care.",
    hard:
      "Infections are assessed through symptoms, physical examination, and selected investigations such as cultures, antigen tests, molecular tests, or blood tests. Treatment depends on the cause: antibiotics treat susceptible bacterial infections, whereas antiviral, antifungal, or antiparasitic medicines are used for selected other infections. Antibiotics do not treat viral infections, and treatment should follow appropriate clinical advice.",
    visualSteps: [
      {
        icon: faShieldVirus,
        title: "Microorganisms Enter",
        description:
          "Bacteria, viruses, fungi, or parasites may enter the body and begin multiplying."
      },
      {
        icon: faHeartPulse,
        title: "Immune Response",
        description:
          "The immune system recognises the threat and activates responses that help control the infection."
      },
      {
        icon: faBookMedical,
        title: "Identify the Cause",
        description:
          "Clinical assessment and appropriate tests help determine whether specific treatment is needed."
      }
    ]
  },
  {
    id: 8,
    name: "Inflammation",
    category: "Immunity",
    icon: faShieldHeart,
    easy:
      "Inflammation is the body's response to injury, irritation, or infection. It helps protect the body and begins the process of repair.",
    medium:
      "Inflammation may cause redness, warmth, swelling, pain, and sometimes reduced function in the affected area. Short-term inflammation can be useful during healing. However, persistent or excessive inflammation may damage tissues and can occur in conditions such as arthritis and certain autoimmune diseases.",
    hard:
      "Inflammation involves immune cells, signalling molecules, and changes in blood vessels that help coordinate defence and tissue repair. Assessment depends on the symptoms and suspected cause; tests such as C-reactive protein or erythrocyte sedimentation rate may support evaluation but cannot identify every cause on their own. Treatment focuses on the underlying condition rather than simply suppressing inflammation in every case.",
    visualSteps: [
      {
        icon: faShieldHeart,
        title: "The Body Detects Damage",
        description:
          "Injury, infection, or irritation activates immune signals in the affected tissue."
      },
      {
        icon: faHeartPulse,
        title: "Protective Response",
        description:
          "Blood flow and immune activity change to help contain the problem and begin repair."
      },
      {
        icon: faBookMedical,
        title: "Recovery or Ongoing Inflammation",
        description:
          "The response normally settles after healing, but persistent inflammation may require medical assessment."
      }
    ]
  },
  {
    id: 9,
    name: "MRI Scan",
    category: "Diagnosis",
    icon: faMagnifyingGlass,
    easy:
      "An MRI scan is a medical imaging test that uses a strong magnetic field and radio waves to create detailed pictures of structures inside your body. It does not use ionising radiation.",
    medium:
      "MRI scans can show soft tissues, including the brain, spinal cord, muscles, ligaments, and internal organs. During the scan, you lie on a table that moves into the scanner. The machine can make loud knocking sounds, and you may need to remain still to obtain clear images.",
    hard:
      "Magnetic resonance imaging produces images from signals generated by hydrogen nuclei in a magnetic field after radiofrequency excitation. Different sequences highlight different tissue characteristics. Depending on the clinical question, a contrast agent may be considered. Screening is essential for certain implants, metallic foreign bodies, and other safety concerns, and the resulting images are interpreted by a trained radiologist.",
    visualSteps: [
      {
        icon: faMagnifyingGlass,
        title: "Prepare for the Scan",
        description:
          "Staff check relevant medical history, implants, and other safety considerations before imaging."
      },
      {
        icon: faWaveSquare,
        title: "Create Detailed Images",
        description:
          "Magnetic fields and radio waves generate signals that the scanner uses to create images."
      },
      {
        icon: faBookMedical,
        title: "Interpret the Results",
        description:
          "A radiologist reviews the images and provides a report to help the treating clinician."
      }
    ]
  },
  {
    id: 10,
    name: "ECG",
    category: "Diagnosis",
    icon: faWaveSquare,
    easy:
      "An ECG, or electrocardiogram, records the electrical activity of your heart. It helps healthcare professionals check your heart rate and the timing of your heartbeat.",
    medium:
      "Small adhesive electrodes are placed on the skin of the chest and limbs to record electrical signals. The resulting tracing may show the heart's rhythm and patterns that suggest certain heart problems. A standard resting ECG is quick and painless, but a normal result does not rule out every heart condition.",
    hard:
      "A standard 12-lead ECG records electrical potential differences from multiple viewpoints. Clinicians assess rate, rhythm, conduction intervals, and waveform morphology, alongside symptoms and clinical history. Because some abnormalities are intermittent, additional tests such as ambulatory ECG monitoring or other cardiac investigations may be required.",
    visualSteps: [
      {
        icon: faHeartPulse,
        title: "Heart Produces Signals",
        description:
          "Electrical impulses coordinate the contractions that move blood through the heart."
      },
      {
        icon: faWaveSquare,
        title: "Electrodes Record Activity",
        description:
          "Electrodes detect electrical signals and display them as a tracing on the ECG machine."
      },
      {
        icon: faBookMedical,
        title: "Clinician Reviews the Tracing",
        description:
          "The tracing is interpreted alongside symptoms and other information to assess heart activity."
      }
    ]
  },
  {
    id: 11,
    name: "Vaccine",
    category: "Prevention",
    icon: faSyringe,
    easy:
      "A vaccine helps train your immune system to recognise a particular infection. It prepares your body to respond more effectively if you encounter the germ in the future.",
    medium:
      "Vaccines expose the immune system to an antigen or provide instructions for making one, without requiring the person to experience the disease itself. The immune system develops a response and may form memory cells. Different vaccines use different technologies, and some require multiple doses or booster doses.",
    hard:
      "Vaccination stimulates adaptive immune responses, including antigen-specific antibodies and memory B or T cells, depending on the vaccine. Protection varies by vaccine, disease, age, health status, and time since vaccination. Recommendations depend on national immunisation schedules and individual circumstances. Vaccines substantially reduce the risk of many infectious diseases but do not always prevent every infection.",
    visualSteps: [
      {
        icon: faSyringe,
        title: "Vaccine Is Given",
        description:
          "The vaccine introduces an antigen or instructions that help the immune system recognise a target."
      },
      {
        icon: faShieldVirus,
        title: "Immune System Learns",
        description:
          "Immune cells develop a targeted response and may form memory cells."
      },
      {
        icon: faShieldHeart,
        title: "Future Protection",
        description:
          "Immune memory can help the body respond faster when exposed to the infection later."
      }
    ]
  },
  {
    id: 12,
    name: "Antibiotics",
    category: "Medication",
    icon: faPills,
    easy:
      "Antibiotics are medicines used to treat certain bacterial infections. They work against bacteria, not viruses that cause illnesses such as the common cold.",
    medium:
      "Different antibiotics work in different ways. Some damage bacterial cell walls, while others interfere with the processes bacteria need to grow or reproduce. The correct medicine depends on the suspected bacteria, infection site, allergies, and other clinical factors. Unnecessary use can cause side effects and contribute to antibiotic resistance.",
    hard:
      "Antibiotic selection considers the likely pathogen, infection severity, local resistance patterns, patient-specific factors, and sometimes culture and susceptibility results. Antibiotic resistance occurs when bacteria develop the ability to survive medicines that previously controlled them. Appropriate prescribing, correct dosing, and following the clinician's instructions help support effective treatment and antimicrobial stewardship.",
    visualSteps: [
      {
        icon: faPills,
        title: "Medicine Targets Bacteria",
        description:
          "An appropriate antibiotic interferes with a bacterial process needed for survival or growth."
      },
      {
        icon: faMicroscope,
        title: "Treatment Depends on the Cause",
        description:
          "The type of infection and suspected bacteria help determine which antibiotic may be suitable."
      },
      {
        icon: faShieldVirus,
        title: "Prevent Resistance",
        description:
          "Using antibiotics only when needed helps reduce unnecessary exposure and the development of resistance."
      }
    ]
  },
  {
    id: 13,
    name: "Dehydration",
    category: "Hydration",
    icon: faGlassWater,
    easy:
      "Dehydration happens when your body loses more fluid than it takes in. You may feel thirsty, tired, dizzy, or notice that you urinate less than usual.",
    medium:
      "Your body needs water and electrolytes to regulate temperature, maintain circulation, and support normal cell function. Dehydration can occur with vomiting, diarrhoea, fever, heavy sweating, or inadequate fluid intake. More serious dehydration can cause confusion, fainting, and circulatory problems.",
    hard:
      "Assessment considers fluid losses, intake, vital signs, urine output, and relevant medical conditions. Blood tests may be needed in more severe cases to assess kidney function and electrolyte disturbances. Management depends on severity and cause: oral rehydration solutions can help replace water and salts in many cases, while severe dehydration may require urgent medical assessment and intravenous fluids.",
    visualSteps: [
      {
        icon: faGlassWater,
        title: "Fluid Loss",
        description:
          "The body loses water through urine, sweat, breathing, vomiting, or diarrhoea."
      },
      {
        icon: faHeartPulse,
        title: "Body Functions Are Affected",
        description:
          "Insufficient fluid can affect circulation, temperature regulation, and electrolyte balance."
      },
      {
        icon: faBookMedical,
        title: "Replace Fluids",
        description:
          "Appropriate fluids and oral rehydration solutions can help replace lost water and salts."
      }
    ]
  },
  {
    id: 14,
    name: "Fever",
    category: "Symptoms",
    icon: faTemperatureHalf,
    easy:
      "A fever is a rise in body temperature, often caused by an infection. It is one way your immune system responds when your body detects a possible threat.",
    medium:
      "Fever can occur with viral or bacterial infections and some non-infectious conditions. You may also experience chills, sweating, headache, or muscle aches. The seriousness of a fever depends on factors such as age, temperature, other symptoms, and the underlying cause.",
    hard:
      "Fever occurs when inflammatory signals alter the hypothalamic temperature set point. Assessment considers the duration and pattern of fever, exposure history, associated symptoms, age, and clinical risk factors. Investigations are guided by the suspected cause. Urgent medical evaluation is important for fever in very young infants and for fever accompanied by warning signs such as difficulty breathing, confusion, or severe dehydration.",
    visualSteps: [
      {
        icon: faTemperatureHalf,
        title: "Temperature Increases",
        description:
          "The body's temperature regulation changes, causing body temperature to rise above its usual range."
      },
      {
        icon: faShieldVirus,
        title: "Immune Response",
        description:
          "Infections and other conditions can trigger signals that lead to fever."
      },
      {
        icon: faBookMedical,
        title: "Assess the Cause",
        description:
          "Temperature, duration, age, and accompanying symptoms help determine whether medical assessment is needed."
      }
    ]
  },
  {
    id: 15,
    name: "DNA",
    category: "Genetics",
    icon: faDna,
    easy:
      "DNA is the molecule that carries genetic instructions in living things. It contains information that helps cells grow, function, and make proteins.",
    medium:
      "DNA stands for deoxyribonucleic acid. It is built from units called nucleotides and usually forms a double helix. Sections of DNA called genes contain instructions used to make functional products, including proteins. DNA is copied when cells divide so that genetic information can be passed on.",
    hard:
      "DNA stores hereditary information through the sequence of its nucleotide bases: adenine, thymine, cytosine, and guanine. Complementary base pairing supports accurate replication, while gene expression involves transcription and, for protein-coding genes, translation. Variants in DNA may be harmless, influence traits, or contribute to disease risk. Genetic test results require interpretation in the context of the individual and the purpose of testing.",
    visualSteps: [
      {
        icon: faDna,
        title: "Genetic Instructions",
        description:
          "DNA stores information in the sequence of its nucleotide bases."
      },
      {
        icon: faMicroscope,
        title: "Genes Guide Cell Activity",
        description:
          "Cells use genetic instructions to produce functional molecules and regulate many biological processes."
      },
      {
        icon: faBookMedical,
        title: "Inheritance and Variation",
        description:
          "DNA is passed from parents to offspring, and differences in DNA contribute to genetic variation."
      }
    ]
  }
];

export default medicalGlossary;
