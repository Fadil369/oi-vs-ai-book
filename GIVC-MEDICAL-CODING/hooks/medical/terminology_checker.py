#!/usr/bin/env python3
"""
Medical Terminology Checker Hook
Validates medical terminology against WHO EMRO standards and bilingual consistency
Ensures proper Arabic-English medical term alignment
"""

import re
import json
import logging
import requests
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Set
from dataclasses import dataclass
from pathlib import Path
import hashlib
from difflib import SequenceMatcher

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class TerminologyIssue:
    """Represents a terminology validation issue"""
    issue_type: str
    term: str
    language: str
    context: str
    line_number: int
    severity: str  # HIGH, MEDIUM, LOW
    suggestion: str
    who_emro_reference: Optional[str] = None

@dataclass
class TermValidationResult:
    """Results of terminology validation"""
    issues_found: List[TerminologyIssue]
    terminology_compliant: bool
    consistency_score: float
    corrections_applied: bool
    validation_summary: Dict

class MedicalTerminologyChecker:
    """Validates medical terminology against WHO EMRO and bilingual standards"""
    
    def __init__(self, config_path: str = "config/terminology_config.json"):
        self.config_path = Path(config_path)
        self.load_config()
        self.load_terminology_database()
        self.consistency_threshold = 0.90
        self.validation_cache = {}
        
    def load_config(self):
        """Load terminology checking configuration"""
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    self.config = json.load(f)
            else:
                # Default configuration
                self.config = {
                    "who_emro_api_enabled": False,
                    "who_emro_api_key": None,
                    "strict_mode": True,
                    "auto_correct": False,
                    "bilingual_consistency_required": True,
                    "accepted_dialects": ["gcc_standard", "saudi", "uae", "egyptian"],
                    "terminology_sources": [
                        "who_emro", "snomed_ct", "unified_medical_dictionary"
                    ],
                    "exclusion_patterns": [
                        "patient names", "doctor names", "hospital names"
                    ]
                }
                logger.warning("Terminology config not found. Using defaults.")
        except Exception as e:
            logger.error(f"Error loading terminology config: {e}")
            self.config = {}
    
    def load_terminology_database(self):
        """Load medical terminology database"""
        try:
            # Load core medical terminology mappings
            self.terminology_db = {
                # Common medical terms with WHO EMRO alignment
                "diagnosis": {
                    "en": "diagnosis",
                    "ar": "تشخيص",
                    "who_emro_code": "DX001",
                    "category": "clinical_process",
                    "alternatives_ar": ["التشخيص", "تشخيص طبي"]
                },
                "procedure": {
                    "en": "procedure",
                    "ar": "إجراء",
                    "who_emro_code": "PR001",
                    "category": "clinical_process",
                    "alternatives_ar": ["الإجراء", "عملية", "إجراء طبي"]
                },
                "patient": {
                    "en": "patient",
                    "ar": "مريض",
                    "who_emro_code": "PT001",
                    "category": "healthcare_actor",
                    "alternatives_ar": ["المريض", "مريضة", "المريضة"]
                },
                "medical_record": {
                    "en": "medical record",
                    "ar": "السجل الطبي",
                    "who_emro_code": "MR001",
                    "category": "documentation",
                    "alternatives_ar": ["سجل طبي", "الملف الطبي", "ملف طبي"]
                },
                "icd_code": {
                    "en": "ICD code",
                    "ar": "رمز التصنيف الدولي للأمراض",
                    "who_emro_code": "IC001",
                    "category": "coding_system",
                    "alternatives_ar": ["كود ICD", "رمز ICD"]
                },
                "coding_accuracy": {
                    "en": "coding accuracy",
                    "ar": "دقة الترميز",
                    "who_emro_code": "CA001",
                    "category": "quality_measure",
                    "alternatives_ar": ["دقة الترميز الطبي", "دقة الرموز"]
                },
                # Saudi-specific terms
                "schi": {
                    "en": "Saudi Classification of Health Interventions",
                    "ar": "التصنيف السعودي للتدخلات الصحية",
                    "who_emro_code": "SCHI001",
                    "category": "saudi_coding_system",
                    "alternatives_ar": ["SCHI", "تصنيف SCHI"]
                },
                "ccp_ksa": {
                    "en": "Certified Coding Professional - Kingdom of Saudi Arabia",
                    "ar": "محترف الترميز المعتمد - المملكة العربية السعودية",
                    "who_emro_code": "CCP001",
                    "category": "certification",
                    "alternatives_ar": ["CCP-KSA", "شهادة CCP-KSA"]
                },
                # Clinical terms
                "myocardial_infarction": {
                    "en": "myocardial infarction",
                    "ar": "احتشاء عضلة القلب",
                    "who_emro_code": "MI001",
                    "category": "cardiovascular_condition",
                    "alternatives_ar": ["جلطة القلب", "نوبة قلبية"]
                },
                "diabetes_mellitus": {
                    "en": "diabetes mellitus",
                    "ar": "داء السكري",
                    "who_emro_code": "DM001",
                    "category": "endocrine_condition",
                    "alternatives_ar": ["السكري", "مرض السكر"]
                },
                "hypertension": {
                    "en": "hypertension",
                    "ar": "ارتفاع ضغط الدم",
                    "who_emro_code": "HT001",
                    "category": "cardiovascular_condition",
                    "alternatives_ar": ["ضغط الدم المرتفع", "فرط ضغط الدم"]
                }
            }
            
            # Load additional terminology from file if exists
            terminology_file = Path("resources/medical_terminology.json")
            if terminology_file.exists():
                with open(terminology_file, 'r', encoding='utf-8') as f:
                    additional_terms = json.load(f)
                    self.terminology_db.update(additional_terms)
                    logger.info(f"Loaded {len(additional_terms)} additional terms")
                    
        except Exception as e:
            logger.error(f"Error loading terminology database: {e}")
            
    def extract_medical_terms(self, content: str) -> List[Tuple[str, str, int]]:
        """Extract medical terms from content"""
        terms = []
        
        # Patterns for medical terms in both languages
        patterns = {
            "english_medical": [
                r'\b(?:diagnosis|procedure|patient|medical record|coding|icd|cpt|hcpcs)\b',
                r'\b(?:myocardial infarction|diabetes mellitus|hypertension|pneumonia|fracture)\b',
                r'\b(?:surgery|treatment|therapy|medication|prescription)\b'
            ],
            "arabic_medical": [
                r'\b(?:تشخيص|إجراء|مريض|السجل الطبي|ترميز|رمز)\b',
                r'\b(?:احتشاء عضلة القلب|داء السكري|ارتفاع ضغط الدم|التهاب رئوي|كسر)\b',
                r'\b(?:جراحة|علاج|دواء|وصفة طبية)\b'
            ]
        }
        
        lines = content.split('\n')
        for line_num, line in enumerate(lines, 1):
            # Extract English medical terms
            for pattern_type, pattern_list in patterns.items():
                language = "en" if "english" in pattern_type else "ar"
                
                for pattern in pattern_list:
                    matches = re.finditer(pattern, line, re.IGNORECASE | re.UNICODE)
                    for match in matches:
                        terms.append((match.group(0), language, line_num))
        
        return terms
    
    def validate_who_emro_compliance(self, term: str, language: str) -> Dict:
        """Validate term against WHO EMRO standards"""
        # Check against local terminology database first
        for term_key, term_data in self.terminology_db.items():
            if language == "en" and term.lower() == term_data["en"].lower():
                return {
                    "compliant": True,
                    "who_emro_code": term_data.get("who_emro_code"),
                    "category": term_data.get("category"),
                    "reference": f"WHO EMRO: {term_data.get('who_emro_code')}"
                }
            elif language == "ar":
                if (term == term_data["ar"] or 
                    term in term_data.get("alternatives_ar", [])):
                    return {
                        "compliant": True,
                        "who_emro_code": term_data.get("who_emro_code"),
                        "category": term_data.get("category"),
                        "reference": f"WHO EMRO: {term_data.get('who_emro_code')}"
                    }
        
        # If WHO EMRO API is available, check online
        if self.config.get("who_emro_api_enabled") and self.config.get("who_emro_api_key"):
            try:
                api_result = self._check_who_emro_api(term, language)
                if api_result:
                    return api_result
            except Exception as e:
                logger.warning(f"WHO EMRO API check failed: {e}")
        
        return {
            "compliant": False,
            "reason": "Term not found in WHO EMRO database",
            "suggestion": "Verify term against current WHO EMRO terminology"
        }
    
    def _check_who_emro_api(self, term: str, language: str) -> Optional[Dict]:
        """Check term against WHO EMRO API (placeholder implementation)"""
        # This would implement actual WHO EMRO API calls
        # For now, return None to indicate API not available
        return None
    
    def check_bilingual_consistency(self, content: str) -> List[TerminologyIssue]:
        """Check consistency between Arabic and English medical terms"""
        issues = []
        
        # Extract terms from both languages
        english_terms = []
        arabic_terms = []
        
        lines = content.split('\n')
        for line_num, line in enumerate(lines, 1):
            # Find English medical terms
            en_matches = re.finditer(
                r'\b(?:diagnosis|procedure|patient|medical record|coding|treatment)\b',
                line, re.IGNORECASE
            )
            for match in en_matches:
                english_terms.append((match.group(0).lower(), line_num, line))
            
            # Find Arabic medical terms
            ar_matches = re.finditer(
                r'\b(?:تشخيص|إجراء|مريض|السجل الطبي|ترميز|علاج)\b',
                line, re.UNICODE
            )
            for match in ar_matches:
                arabic_terms.append((match.group(0), line_num, line))
        
        # Check for missing translations
        en_terms_set = {term[0] for term in english_terms}
        ar_terms_set = {term[0] for term in arabic_terms}
        
        # Find English terms without Arabic equivalents
        for en_term, line_num, context in english_terms:
            expected_arabic = self._get_arabic_equivalent(en_term)
            if expected_arabic and expected_arabic not in ar_terms_set:
                issues.append(TerminologyIssue(
                    issue_type="missing_arabic_translation",
                    term=en_term,
                    language="en",
                    context=context[:100],
                    line_number=line_num,
                    severity="MEDIUM",
                    suggestion=f"Add Arabic translation: {expected_arabic}",
                    who_emro_reference=self._get_who_emro_reference(en_term)
                ))
        
        # Find Arabic terms without English equivalents
        for ar_term, line_num, context in arabic_terms:
            expected_english = self._get_english_equivalent(ar_term)
            if expected_english and expected_english not in en_terms_set:
                issues.append(TerminologyIssue(
                    issue_type="missing_english_translation",
                    term=ar_term,
                    language="ar",
                    context=context[:100],
                    line_number=line_num,
                    severity="MEDIUM",
                    suggestion=f"Add English translation: {expected_english}",
                    who_emro_reference=self._get_who_emro_reference(ar_term)
                ))
        
        return issues
    
    def _get_arabic_equivalent(self, english_term: str) -> Optional[str]:
        """Get Arabic equivalent for English term"""
        for term_data in self.terminology_db.values():
            if term_data["en"].lower() == english_term.lower():
                return term_data["ar"]
        return None
    
    def _get_english_equivalent(self, arabic_term: str) -> Optional[str]:
        """Get English equivalent for Arabic term"""
        for term_data in self.terminology_db.values():
            if (term_data["ar"] == arabic_term or 
                arabic_term in term_data.get("alternatives_ar", [])):
                return term_data["en"]
        return None
    
    def _get_who_emro_reference(self, term: str) -> Optional[str]:
        """Get WHO EMRO reference for term"""
        for term_data in self.terminology_db.values():
            if (term_data["en"].lower() == term.lower() or 
                term_data["ar"] == term or
                term in term_data.get("alternatives_ar", [])):
                return term_data.get("who_emro_code")
        return None
    
    def validate_terminology_consistency(self, content: str) -> TermValidationResult:
        """Main terminology validation function"""
        try:
            issues = []
            
            # Extract medical terms
            terms = self.extract_medical_terms(content)
            
            if not terms:
                logger.info("No medical terms found for terminology validation")
                return TermValidationResult(
                    issues_found=[],
                    terminology_compliant=True,
                    consistency_score=1.0,
                    corrections_applied=False,
                    validation_summary={
                        "total_terms": 0,
                        "compliant_terms": 0,
                        "issues_found": 0
                    }
                )
            
            # Validate each term against WHO EMRO standards
            compliant_terms = 0
            for term, language, line_num in terms:
                validation_result = self.validate_who_emro_compliance(term, language)
                
                if not validation_result.get("compliant", False):
                    issues.append(TerminologyIssue(
                        issue_type="non_compliant_terminology",
                        term=term,
                        language=language,
                        context=f"Line {line_num}",
                        line_number=line_num,
                        severity="HIGH",
                        suggestion=validation_result.get("suggestion", "Verify against WHO EMRO standards"),
                        who_emro_reference=validation_result.get("who_emro_code")
                    ))
                else:
                    compliant_terms += 1
            
            # Check bilingual consistency
            bilingual_issues = self.check_bilingual_consistency(content)
            issues.extend(bilingual_issues)
            
            # Calculate consistency score
            total_terms = len(terms)
            consistency_score = compliant_terms / total_terms if total_terms > 0 else 1.0
            
            # Determine if terminology is compliant
            terminology_compliant = (
                consistency_score >= self.consistency_threshold and
                len([i for i in issues if i.severity == "HIGH"]) == 0
            )
            
            # Generate validation summary
            validation_summary = {
                "total_terms": total_terms,
                "compliant_terms": compliant_terms,
                "issues_found": len(issues),
                "consistency_score": consistency_score,
                "bilingual_issues": len(bilingual_issues),
                "severity_breakdown": {
                    "high": len([i for i in issues if i.severity == "HIGH"]),
                    "medium": len([i for i in issues if i.severity == "MEDIUM"]),
                    "low": len([i for i in issues if i.severity == "LOW"])
                },
                "validation_timestamp": datetime.now().isoformat(),
                "who_emro_compliance": terminology_compliant
            }
            
            return TermValidationResult(
                issues_found=issues,
                terminology_compliant=terminology_compliant,
                consistency_score=consistency_score,
                corrections_applied=False,
                validation_summary=validation_summary
            )
            
        except Exception as e:
            logger.error(f"Terminology validation error: {e}")
            raise TerminologyValidationError(f"Terminology validation failed: {str(e)}")
    
    def pre_save_hook(self, content: Dict) -> Dict:
        """Main hook function called before content save"""
        try:
            # Extract content text
            content_text = self._extract_text_from_content(content)
            
            # Generate content hash for caching
            content_hash = hashlib.md5(content_text.encode()).hexdigest()
            
            # Check cache first
            if content_hash in self.validation_cache:
                cached_result = self.validation_cache[content_hash]
                logger.info("Using cached terminology validation result")
                content["metadata"] = content.get("metadata", {})
                content["metadata"]["terminology_validation"] = cached_result
                return content
            
            # Validate terminology
            validation_result = self.validate_terminology_consistency(content_text)
            
            # Check if validation passes requirements
            if not validation_result.terminology_compliant:
                high_severity_issues = [
                    issue for issue in validation_result.issues_found 
                    if issue.severity == "HIGH"
                ]
                
                if high_severity_issues and self.config.get("strict_mode", True):
                    issue_summary = "; ".join([
                        f"{issue.term} ({issue.issue_type})" 
                        for issue in high_severity_issues[:3]
                    ])
                    raise TerminologyValidationError(
                        f"Terminology validation failed: {issue_summary}. "
                        f"Consistency score: {validation_result.consistency_score:.2%}"
                    )
            
            # Prepare validation metadata
            validation_metadata = {
                "terminology_compliant": validation_result.terminology_compliant,
                "consistency_score": validation_result.consistency_score,
                "validation_summary": validation_result.validation_summary,
                "issues_count": len(validation_result.issues_found),
                "validated_at": datetime.now().isoformat()
            }
            
            # Add detailed issues if any exist
            if validation_result.issues_found:
                validation_metadata["issues"] = [
                    {
                        "type": issue.issue_type,
                        "term": issue.term,
                        "language": issue.language,
                        "line": issue.line_number,
                        "severity": issue.severity,
                        "suggestion": issue.suggestion,
                        "who_emro_ref": issue.who_emro_reference
                    }
                    for issue in validation_result.issues_found
                ]
            
            # Cache the result
            self.validation_cache[content_hash] = validation_metadata
            
            # Add validation metadata to content
            content["metadata"] = content.get("metadata", {})
            content["metadata"]["terminology_validation"] = validation_metadata
            
            # Log validation results
            logger.info(
                f"Terminology validation completed: {len(validation_result.issues_found)} issues found, "
                f"consistency score: {validation_result.consistency_score:.2%}, "
                f"compliant: {validation_result.terminology_compliant}"
            )
            
            return content
            
        except Exception as e:
            logger.error(f"Terminology validation error: {e}")
            raise TerminologyValidationError(f"Terminology validation failed: {str(e)}")
    
    def _extract_text_from_content(self, content: Dict) -> str:
        """Extract text content for terminology validation"""
        text_parts = []
        
        # Handle different content structures
        if isinstance(content, dict):
            for key, value in content.items():
                if key in ["metadata", "config"]:
                    continue  # Skip metadata
                
                if isinstance(value, str):
                    text_parts.append(value)
                elif isinstance(value, dict):
                    # Extract text from nested dictionaries (bilingual content)
                    for nested_key, nested_value in value.items():
                        if isinstance(nested_value, str):
                            text_parts.append(nested_value)
                elif isinstance(value, list):
                    # Extract text from lists
                    for item in value:
                        if isinstance(item, str):
                            text_parts.append(item)
                        elif isinstance(item, dict):
                            text_parts.append(json.dumps(item))
        
        return "\n".join(text_parts)

class TerminologyValidationError(Exception):
    """Custom exception for terminology validation errors"""
    pass

# Hook entry point for BrainSAIT integration
def run_hook(content: Dict, hook_type: str = "pre_save") -> Dict:
    """Main entry point for the terminology validation hook"""
    checker = MedicalTerminologyChecker()
    
    if hook_type == "pre_save":
        return checker.pre_save_hook(content)
    else:
        logger.warning(f"Unknown hook type: {hook_type}")
        return content

# Command line interface for testing
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Validate medical terminology")
    parser.add_argument("--file", "-f", help="File to validate")
    parser.add_argument("--text", "-t", help="Text to validate")
    parser.add_argument("--config", "-c", help="Config file path")
    
    args = parser.parse_args()
    
    checker = MedicalTerminologyChecker(args.config or "config/terminology_config.json")
    
    if args.file:
        with open(args.file, 'r', encoding='utf-8') as f:
            content = {"content": f.read()}
    elif args.text:
        content = {"content": args.text}
    else:
        # Test content with bilingual medical terms
        content = {
            "content": """
            Patient diagnosis involves careful evaluation of symptoms.
            تشخيص المريض يتطلب تقييماً دقيقاً للأعراض.
            
            Medical coding accuracy is essential for proper reimbursement.
            دقة الترميز الطبي أساسية للحصول على التعويض المناسب.
            
            SCHI procedures follow Saudi healthcare standards.
            إجراءات SCHI تتبع معايير الرعاية الصحية السعودية.
            
            Invalid term: medical codding (should be coding)
            مصطلح غير صحيح: ترميز طبي خاطئ
            """
        }
    
    try:
        result = checker.pre_save_hook(content)
        print("✅ Terminology validation completed!")
        validation_data = result.get("metadata", {}).get("terminology_validation", {})
        print(f"Validation report: {json.dumps(validation_data, indent=2, ensure_ascii=False)}")
        
    except TerminologyValidationError as e:
        print(f"❌ Terminology validation failed: {e}")
    except Exception as e:
        print(f"💥 Error: {e}")