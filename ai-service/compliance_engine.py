import datetime
import os
import json
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Initialize the stable google-generativeai SDK
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
llm_model = genai.GenerativeModel('gemini-2.5-flash')

REGULATORY_MAP = {
    "preselected_invasive_default": {
        "category": "Skipping",
        "pattern_name": "Deceptive Snugness",
        "regulation": "GDPR Art. 25(1)",
        "description": "Pre-selecting the most data-invasive features by default to exploit user inertia.",
        "penalty": 25,
        "remedy": "Leave all non-essential consent checkboxes unchecked by default."
    },
    "visual_distraction": {
        "category": "Skipping",
        "pattern_name": "Look Over There",
        "regulation": "GDPR Art. 5(1)(a)",
        "description": "Putting a data protection action in competition with a highly distracting visual element.",
        "penalty": 20,
        "remedy": "Provide equal visual weight, size, and contrast for both 'Accept' and 'Reject' options."
    },
    "emotional_steering": {
        "category": "Stirring",
        "pattern_name": "Emotional Steering / Confirmshaming",
        "regulation": "GDPR Art. 5(1)(a)",
        "description": "Using emotionally manipulative wording to make users feel guilty to influence them.",
        "penalty": 15,
        "remedy": "Use neutral, objective language for opt-out buttons (e.g., 'Decline')."
    },
    "hidden_in_plain_sight": {
        "category": "Stirring",
        "pattern_name": "Hidden in Plain Sight",
        "regulation": "GDPR Art. 5(1)(a)",
        "description": "Using visual styles like tiny fonts or low contrast to hide restrictive controls.",
        "penalty": 25,
        "remedy": "Ensure opt-out links meet standard web accessibility contrast ratios."
    },
    "misleading_button": {
        "category": "Hindering",
        "pattern_name": "Misleading Information",
        "regulation": "GDPR Art. 5(1)(a)",
        "description": "Creating a discrepancy between expectations and actions.",
        "penalty": 25,
        "remedy": "Button labels must explicitly and accurately describe their resulting action."
    },
    "overwhelming_options": {
        "category": "Overloading",
        "pattern_name": "Too Many Options",
        "regulation": "GDPR Art. 5(1)(a)",
        "description": "Providing an overwhelming amount of choices or massive toggle grids.",
        "penalty": 15,
        "remedy": "Provide a top-level 'Reject All' button alongside granular settings."
    },
    "ambiguous_wording": {
        "category": "Left in the Dark",
        "pattern_name": "Ambiguous Wording",
        "regulation": "GDPR Art. 12(1)",
        "description": "Using vague terms or double negatives.",
        "penalty": 20,
        "remedy": "Use clear, plain language without double negatives."
    }
}

class ComplianceAuditor:
    def __init__(self, target_url):
        self.target_url = target_url
        self.trust_score = 100
        self.findings = []
        self.regulatory_breakdown = []

    def _verify_with_llm(self, element_text, layout_label):
        """The Stage 2 Classifier: Asks Gemini to legally categorize the text using dynamic map data."""
        
        # 1. Dynamically build the legal framework text directly from your REGULATORY_MAP!
        legal_framework = "\n".join([f"{i+1}. {k.upper()}: {v['description']}" for i, (k, v) in enumerate(REGULATORY_MAP.items())])
        
        # 2. Dynamically extract the exact category keys the LLM is allowed to use
        allowed_categories = "[" + ", ".join(REGULATORY_MAP.keys()) + ", safe]"

        prompt = f"""
        ACT AS: A Senior Digital Rights Attorney and GDPR Auditor specialized in the Digital Services Act (DSA) Article 25 & 27.
        
        TASK: Conduct a high-stakes audit on a specific UI element to determine if it constitutes a "Dark Pattern" (deceptive design).
        
        CONTEXT:
        - Element Type: {layout_label}
        - Detected Text: "{element_text}"
        
        LEGAL REFERENCE FRAMEWORK:
        {legal_framework}

        AUDIT RULES:
        - ZERO TOLERANCE FOR FALSE POSITIVES: If the text is standard, polite, or merely descriptive (e.g., "We use cookies", "Learn More", "Accept"), it MUST be labeled 'safe'.
        - CONTEXT MATTERS: "No thanks" is safe. "No, I prefer to pay more" is emotional_steering.
        - DEFAULT TO SAFE: If you are less than 95% certain a pattern exists, return 'safe'.

        STEP-BY-STEP REASONING:
        1. Analyze the literal meaning of the text.
        2. Evaluate the psychological intent (Is it steering, shaming, or confusing?).
        3. Compare against the legal frameworks above.
        
        OUTPUT FORMAT:
        You must return a raw JSON object with this exact structure:
        {{
            "reasoning": "A 1-sentence legal justification for your decision.",
            "category": "one_of_the_categories_below_or_safe"
        }}

        CATEGORIES:
        {allowed_categories}
        """
        
        try:
            response = llm_model.generate_content(prompt)
            result_text = response.text.replace('```json', '').replace('```', '').strip()
            data = json.loads(result_text)
            
            # Safely extract BOTH the category and the reasoning
            category = data.get("category", "safe")
            reasoning = data.get("reasoning", "No explanation provided.")
            
            
            # FIX: Return BOTH variables so Python can unpack them!
            return category, reasoning
            
        except Exception as e:
            print(f"[-] LLM Classification Error: {e}")
            # FIX: Return BOTH variables here too!
            return "safe", "AI failed to generate reasoning."

    def analyze_detections(self, hf_api_response):
        """Orchestrates the two-stage pipeline."""
        ai_predictions = hf_api_response.get("flagged_elements", [])
        print("\n[*] Running Stage 2 LLM Classification on flagged elements...")
        
        for detection in ai_predictions:
            layout_label = detection.get("predicted_label") 
            bbox = detection.get("box_2d") or [0, 0, 0, 0] # Added safeguard
            element_text = detection.get("text", "") 

            if layout_label in ["action_button", "overlay_content", "deceptive_element"]:
                print(f"[*] Auditing text: '{element_text}'")
                
                # This unpacking will now work perfectly!
                category, reasoning = self._verify_with_llm(element_text, layout_label)
                
                # Sleep for 1.5 seconds to prevent Google API rate limiting (429 errors)
                time.sleep(1.5)

                if category in REGULATORY_MAP:
                    rule = REGULATORY_MAP[category]
                    self.trust_score -= rule["penalty"]
                    
                    self.findings.append({
                        "type": category, 
                        "element_text": element_text, 
                        "category": rule["category"],
                        "pattern": rule["pattern_name"],
                        "explanation": reasoning, # Injects the dynamic reasoning into the table!
                        "regulation": rule["regulation"],
                        "recommendation": rule["remedy"],
                        "coordinates": {
                            "x_min": bbox[0], "y_min": bbox[1], "x_max": bbox[2], "y_max": bbox[3]
                        }
                    })

                    if not any(b["article"] == rule["regulation"] for b in self.regulatory_breakdown):
                        self.regulatory_breakdown.append({
                            "article": rule["regulation"],
                            "finding": "FAILED",
                            "impact": rule["description"],
                            "suggested_fix": rule["remedy"]
                        })

        self.trust_score = max(self.trust_score, 0)
        return self._generate_final_report()

    def _generate_final_report(self):
        status = "Compliant" if self.trust_score >= 80 else "Non-Compliant"
        return {
            "report_summary": {
                "target_url": self.target_url,
                "trust_score": self.trust_score,
                "status": status,
                "audit_timestamp": datetime.datetime.utcnow().isoformat() + "Z",
                "total_violations": len(self.findings)
            },
            "visual_audit": {
                "detections": self.findings
            },
            "regulatory_breakdown": self.regulatory_breakdown
        }