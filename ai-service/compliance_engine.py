import datetime
import os
import json
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Initialize the SDK and force strict JSON output to prevent parsing crashes
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
llm_model = genai.GenerativeModel(
    model_name='gemini-2.5-flash',
    generation_config={"response_mime_type": "application/json"}
)

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
        
        legal_framework = "\n".join([f"{i+1}. {k.upper()}: {v['description']}" for i, (k, v) in enumerate(REGULATORY_MAP.items())])
        allowed_categories = "[" + ", ".join(REGULATORY_MAP.keys()) + ", safe]"

        prompt = f"""
        ACT AS: A Senior Digital Rights Attorney and GDPR Auditor.
        
        TASK: Evaluate this specific UI element text flagged by a Vision AI. Is it a genuine "Dark Pattern" (deceptive design) or a normal UI element?
        
        CONTEXT:
        - Element Type: {layout_label}
        - Detected Text: "{element_text}"
        
        LEGAL FRAMEWORK (CATEGORIES):
        {legal_framework}

        CRITICAL: NEGATIVE EXAMPLES (IGNORE THESE - LABEL AS 'safe')
        - Standard navigation ("Home", "About Us", "Contact").
        - Standard actions ("Login", "Submit", "Search", "Read More", "Accept").
        - Cookie banners with fair choices ("Accept All" alongside "Decline All").
        - "No thanks" or "Close" buttons.

        AUDIT RULES:
        - ZERO TOLERANCE FOR FALSE POSITIVES: If the text is standard, polite, or merely descriptive, it MUST be labeled 'safe'.
        - CONTEXT MATTERS: "No thanks" is safe. "No, I prefer to pay more" is emotional_steering.

        OUTPUT FORMAT:
        Return ONLY a JSON object. You MUST provide the "reasoning" key BEFORE the "category" key to ensure logical chain-of-thought analysis.
        {{
            "reasoning": "CHAIN OF THOUGHT: Step-by-step, logically explain why this text violates user intent OR why it is perfectly safe.",
            "category": "one_of_the_categories_below_or_safe"
        }}

        ALLOWED CATEGORIES: {allowed_categories}
        """
        
        try:
            response = llm_model.generate_content(prompt)
            data = json.loads(response.text) # Clean parsing since response_mime_type is JSON
            
            category = data.get("category", "safe")
            reasoning = data.get("reasoning", "No explanation provided.")

            return category, reasoning
            
        except Exception as e:
            print(f"[-] LLM Classification Error: {e}")
            return "safe", "AI failed to generate reasoning."

    def analyze_detections(self, hf_api_response):
        """Orchestrates the two-stage pipeline."""
        
        # Accommodates both old list structure and new dictionary structure
        if isinstance(hf_api_response, list):
            ai_predictions = hf_api_response
        else:
            ai_predictions = hf_api_response.get("flagged_elements", [])
            
        print(f"\n[*] Running Stage 2 LLM Classification on {len(ai_predictions)} flagged elements...")
        
        for detection in ai_predictions:
            # Safely extract data handling potential missing keys from Hugging Face output
            layout_label = detection.get("layoutlm_label", "deceptive_element") 
            bbox = detection.get("box_2d", [0, 0, 0, 0])
            element_text = detection.get("text", "") 

            if element_text:
                print(f"[*] Auditing text: '{element_text}'")
                
                category, reasoning = self._verify_with_llm(element_text, layout_label)
                time.sleep(1.5) # Prevents Gemini API rate limiting

                if category in REGULATORY_MAP:
                    print(f"    [!] Violation Found: {category}")
                    rule = REGULATORY_MAP[category]
                    self.trust_score -= rule["penalty"]
                    
                    self.findings.append({
                        "type": category, 
                        "element_text": element_text, 
                        "category": rule["category"],
                        "pattern": rule["pattern_name"],
                        "explanation": reasoning, 
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