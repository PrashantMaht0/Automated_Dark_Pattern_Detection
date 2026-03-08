import datetime

REGULATORY_MAP = {
    # --- CATEGORY 1: SKIPPING ---
    "preselected_invasive_default": {
        "category": "Skipping",
        "pattern_name": "Deceptive Snugness",
        "regulation": "GDPR Art. 25(1) (Data protection by design/default) & Art. 6/4(11)",
        "description": "Pre-selecting the most data-invasive features by default to exploit user inertia.",
        "severity": "High",
        "penalty": 25,
        "remedy": "Leave all non-essential consent checkboxes unchecked by default."
    },
    "visual_distraction": {
        "category": "Skipping",
        "pattern_name": "Look Over There",
        "regulation": "GDPR Art. 5(1)(a) (Transparency), Art. 12(1) & Art. 12(2)",
        "description": "Putting a data protection action in competition with a highly distracting visual element (e.g., a massive 'Accept All' button next to a hidden 'Settings' link).",
        "severity": "High",
        "penalty": 20,
        "remedy": "Provide equal visual weight, size, and contrast for both 'Accept' and 'Reject' options."
    },

    # --- CATEGORY 2: STIRRING ---
    "emotional_steering": {
        "category": "Stirring",
        "pattern_name": "Emotional Steering / Confirmshaming",
        "regulation": "GDPR Art. 5(1)(a), Art. 12(1), Art. 12(2), Art. 8 & Art. 7",
        "description": "Using emotionally manipulative wording to make users feel highly positive or highly negative (anxious/guilty) to influence them to act against their data protection interests.",
        "severity": "Medium",
        "penalty": 15,
        "remedy": "Use neutral, objective language for opt-out buttons (e.g., 'Decline' or 'No, thank you')."
    },
    "hidden_in_plain_sight": {
        "category": "Stirring",
        "pattern_name": "Hidden in Plain Sight",
        "regulation": "GDPR Art. 5(1)(a) (Fairness), Art. 7, Art. 12(1) & Art. 12(2)",
        "description": "Using visual styles like tiny fonts or low contrast to nudge users toward more invasive options by hiding restrictive controls.",
        "severity": "High",
        "penalty": 25,
        "remedy": "Ensure opt-out links meet standard web accessibility contrast ratios and are clearly legible."
    },

    # --- CATEGORY 3: HINDERING & OVERLOADING ---
    "misleading_button": {
        "category": "Hindering",
        "pattern_name": "Misleading Information",
        "regulation": "GDPR Art. 5(1)(a) (Fairness of processing), Art. 12(1) & Art. 7(2)",
        "description": "Creating a discrepancy between expectations and actions (e.g., a 'Continue' button acting as an 'Accept All' mechanism).",
        "severity": "High",
        "penalty": 25,
        "remedy": "Button labels must explicitly and accurately describe their exact resulting action."
    },
    "overwhelming_options": {
        "category": "Overloading",
        "pattern_name": "Too Many Options",
        "regulation": "GDPR Art. 5(1)(a) & Art. 12(1)",
        "description": "Providing an overwhelming amount of choices or massive toggle grids, leading users to overlook settings or give up entirely.",
        "severity": "Medium",
        "penalty": 15,
        "remedy": "Provide a top-level 'Reject All' button alongside granular settings."
    },

    # --- CATEGORY 4: LEFT IN THE DARK ---
    "ambiguous_wording": {
        "category": "Left in the Dark",
        "pattern_name": "Ambiguous Wording or Information",
        "regulation": "GDPR Art. 5(1)(a), Art. 12(1), Art. 7(2) & Art. 13",
        "description": "Using vague terms or double negatives that leave users unsure of how to exercise control over their personal data.",
        "severity": "High",
        "penalty": 20,
        "remedy": "Use clear, plain language without double negatives or deceptive phrasing."
    },

    "deceptive_element": {
        "category": "General Dark Pattern",
        "pattern_name": "Deceptive UI Element",
        "regulation": "GDPR Art. 5(1)(a) (Transparency & Fairness)",
        "description": "An interactive element visually or textually designed to mislead the user or obscure data protection controls.",
        "severity": "High",
        "penalty": 20,
        "remedy": "Ensure clear, transparent, and non-deceptive design with equal visual weight for opt-out options."
    }
}
class ComplianceAuditor:
    def __init__(self, target_url):
        self.target_url = target_url
        self.trust_score = 100
        self.findings = []
        self.regulatory_breakdown = []

    def analyze_detections(self, hf_api_response):
        """
        Takes the raw JSON response from the Hugging Face LayoutLM API.
        Expected input: The full JSON dictionary returned by the HF Space.
        """
        # 1. Extract the array from the API response payload
        ai_predictions = hf_api_response.get("flagged_elements", [])

        for detection in ai_predictions:
            # 2. Update keys to match our deployed app.py
            label = detection.get("predicted_label") 
            bbox = detection.get("box_2d")
            element_text = detection.get("text") 

            # 3. Process if it maps to a regulatory penalty (ignoring safe 'action_button's)
            if label in REGULATORY_MAP:
                rule = REGULATORY_MAP[label]
                
                # Deduct from the overall trust score
                self.trust_score -= rule["penalty"]
                
                # Record the visual finding
                self.findings.append({
                    "type": "Dark Pattern Detected",
                    "element_text": element_text, # Added this so the frontend can display the text!
                    "category": rule["category"],
                    "pattern": rule["pattern_name"],
                    "coordinates": {
                        "x_min": bbox[0], # Mapped to LayoutLM [xmin, ymin, xmax, ymax]
                        "y_min": bbox[1],
                        "x_max": bbox[2],
                        "y_max": bbox[3]
                    },
                    "explanation": rule["description"]
                })

                # Add to the legal breakdown if that specific article hasn't been flagged yet
                if not any(b["article"] == rule["regulation"] for b in self.regulatory_breakdown):
                    self.regulatory_breakdown.append({
                        "article": rule["regulation"],
                        "finding": "FAILED",
                        "impact": rule["description"],
                        "suggested_fix": rule["remedy"]
                    })

        # Ensure trust score doesn't drop below 0
        self.trust_score = max(self.trust_score, 0)
        print(self._generate_final_report()) # DEBUG: Print the final report before returning
        return self._generate_final_report()

    def _generate_final_report(self):
        """Formats the audit into the final JSON response for the React Frontend."""
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