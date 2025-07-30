#!/usr/bin/env python3
"""
Medical Coding Validator Hook
Validates all medical codes before content publication
Ensures 95% accuracy standard compliance
"""

import re
import json
import logging
from datetime import datetime
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class MedicalCode:
    """Represents a medical code found in content"""
    value: str
    type: str  # ICD10, CPT, HCPCS, SCHI, etc.
    position: int
    context: str
    line_number: Optional[int] = None

@dataclass
class ValidationResult:
    """Results of code validation"""
    is_valid: bool
    code: MedicalCode
    error_message: Optional[str] = None
    suggestion: Optional[str] = None
    guideline_reference: Optional[str] = None

class MedicalCodingValidator:
    """Validates coding examples against current guidelines"""
    
    def __init__(self, config_path: str = "config/coding_guidelines.json"):
        self.config_path = Path(config_path)
        self.load_guidelines()
        self.accuracy_threshold = 0.95
        self.validation_cache = {}
        
    def load_guidelines(self):
        """Load current coding guidelines and standards"""
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    self.guidelines = json.load(f)
            else:
                # Default guidelines structure
                self.guidelines = {
                    "icd10_am": {
                        "version": "2024",
                        "valid_patterns": {
                            "diagnosis": r"^[A-Z]\d{2}(\.\d{1,3})?$",
                            "procedure": r"^[0-9]{1,7}-[0-9]{2}$"
                        },
                        "exclusions": [],
                        "common_errors": {}
                    },
                    "schi": {
                        "version": "2024",
                        "valid_patterns": {
                            "procedure": r"^SCHI-\d{4,6}$"
                        },
                        "categories": [],
                        "mapping_rules": {}
                    },
                    "cpt": {
                        "version": "2024",
                        "valid_patterns": {
                            "procedure": r"^\d{5}$",
                            "modifier": r"^[A-Z0-9]{2}$"
                        },
                        "discontinued_codes": [],
                        "new_codes": []
                    }
                }
                logger.warning(f"Guidelines file not found. Using defaults.")
        except Exception as e:
            logger.error(f"Error loading guidelines: {e}")
            self.guidelines = {}
    
    def extract_medical_codes(self, content: str) -> List[MedicalCode]:
        """Extract all medical codes from content"""
        codes = []
        
        # Patterns for different code types
        patterns = {
            "ICD10": [
                r'\b([A-Z]\d{2}(?:\.\d{1,3})?)\b',  # ICD-10-AM diagnosis
                r'\b(\d{1,7}-\d{2})\b'              # ICD-10-AM procedure
            ],
            "CPT": [
                r'\b(\d{5})\b',                     # CPT codes
                r'\b([A-Z0-9]{2})\b(?=\s*modifier)'  # CPT modifiers
            ],
            "SCHI": [
                r'\b(SCHI-\d{4,6})\b'              # Saudi procedures
            ],
            "HCPCS": [
                r'\b([A-Z]\d{4})\b'                # HCPCS Level II
            ]
        }
        
        lines = content.split('\n')
        for line_num, line in enumerate(lines, 1):
            for code_type, type_patterns in patterns.items():
                for pattern in type_patterns:
                    matches = re.finditer(pattern, line, re.IGNORECASE)
                    for match in matches:
                        code = MedicalCode(
                            value=match.group(1),
                            type=code_type,
                            position=match.start(),
                            context=line.strip(),
                            line_number=line_num
                        )
                        codes.append(code)
        
        return codes
    
    def validate_icd10_code(self, code: MedicalCode) -> ValidationResult:
        """Validate ICD-10-AM codes"""
        value = code.value.upper()
        
        # Check cache first
        cache_key = f"ICD10_{value}"
        if cache_key in self.validation_cache:
            cached_result = self.validation_cache[cache_key]
            return ValidationResult(
                is_valid=cached_result['valid'],
                code=code,
                error_message=cached_result.get('error'),
                suggestion=cached_result.get('suggestion')
            )
        
        # Basic format validation
        if not re.match(r'^[A-Z]\d{2}(\.\d{1,3})?$', value):
            if not re.match(r'^\d{1,7}-\d{2}$', value):
                return ValidationResult(
                    is_valid=False,
                    code=code,
                    error_message=f"Invalid ICD-10-AM format: {value}",
                    suggestion="Use format A12.3 for diagnosis or 12345-67 for procedure"
                )
        
        # Check against known invalid codes
        invalid_codes = self.guidelines.get("icd10_am", {}).get("exclusions", [])
        if value in invalid_codes:
            return ValidationResult(
                is_valid=False,
                code=code,
                error_message=f"Discontinued ICD-10-AM code: {value}",
                suggestion="Check latest ICD-10-AM updates for replacement"
            )
        
        # Cache successful validation
        self.validation_cache[cache_key] = {'valid': True}
        
        return ValidationResult(is_valid=True, code=code)
    
    def validate_schi_code(self, code: MedicalCode) -> ValidationResult:
        """Validate SCHI (Saudi Classification of Health Interventions) codes"""
        value = code.value.upper()
        
        # SCHI format validation
        if not re.match(r'^SCHI-\d{4,6}$', value):
            return ValidationResult(
                is_valid=False,
                code=code,
                error_message=f"Invalid SCHI format: {value}",
                suggestion="Use format SCHI-1234 or SCHI-123456"
            )
        
        # Extract numeric part
        numeric_part = value.split('-')[1]
        
        # Basic range validation (example - would need actual SCHI database)
        if len(numeric_part) < 4 or len(numeric_part) > 6:
            return ValidationResult(
                is_valid=False,
                code=code,
                error_message=f"SCHI code length invalid: {value}",
                suggestion="SCHI codes must be 4-6 digits"
            )
        
        return ValidationResult(is_valid=True, code=code)
    
    def validate_cpt_code(self, code: MedicalCode) -> ValidationResult:
        """Validate CPT codes"""
        value = code.value
        
        # CPT format validation
        if not re.match(r'^\d{5}$', value):
            return ValidationResult(
                is_valid=False,
                code=code,
                error_message=f"Invalid CPT format: {value}",
                suggestion="CPT codes must be exactly 5 digits"
            )
        
        # Check against discontinued codes
        discontinued = self.guidelines.get("cpt", {}).get("discontinued_codes", [])
        if value in discontinued:
            return ValidationResult(
                is_valid=False,
                code=code,
                error_message=f"Discontinued CPT code: {value}",
                suggestion="Check AMA CPT updates for replacement codes"
            )
        
        return ValidationResult(is_valid=True, code=code)
    
    def validate_single_code(self, code: MedicalCode) -> ValidationResult:
        """Validate a single medical code"""
        if code.type == "ICD10":
            return self.validate_icd10_code(code)
        elif code.type == "SCHI":
            return self.validate_schi_code(code)
        elif code.type == "CPT":
            return self.validate_cpt_code(code)
        elif code.type == "HCPCS":
            # Basic HCPCS validation
            if not re.match(r'^[A-Z]\d{4}$', code.value):
                return ValidationResult(
                    is_valid=False,
                    code=code,
                    error_message=f"Invalid HCPCS format: {code.value}",
                    suggestion="HCPCS codes format: A1234"
                )
            return ValidationResult(is_valid=True, code=code)
        else:
            return ValidationResult(
                is_valid=False,
                code=code,
                error_message=f"Unknown code type: {code.type}"
            )
    
    def pre_publish_hook(self, content: Dict) -> Dict:
        """Main hook function called before content publication"""
        try:
            # Extract content text
            content_text = self._extract_text_from_content(content)
            
            # Extract all medical codes
            codes = self.extract_medical_codes(content_text)
            
            if not codes:
                logger.info("No medical codes found in content")
                return content
            
            # Validate each code
            validation_results = []
            errors = []
            
            for code in codes:
                result = self.validate_single_code(code)
                validation_results.append(result)
                
                if not result.is_valid:
                    error_msg = f"Line {code.line_number}: {result.error_message}"
                    if result.suggestion:
                        error_msg += f" Suggestion: {result.suggestion}"
                    errors.append(error_msg)
            
            # Calculate accuracy rate
            valid_codes = sum(1 for r in validation_results if r.is_valid)
            accuracy_rate = valid_codes / len(codes) if codes else 1.0
            
            # Check if accuracy meets threshold
            if accuracy_rate < self.accuracy_threshold:
                raise ValidationError(
                    f"Coding accuracy {accuracy_rate:.2%} below required {self.accuracy_threshold:.2%}. "
                    f"Errors: {'; '.join(errors)}"
                )
            
            # Add validation metadata
            content["metadata"] = content.get("metadata", {})
            content["metadata"]["coding_validated"] = datetime.now().isoformat()
            content["metadata"]["validation_accuracy"] = accuracy_rate
            content["metadata"]["codes_validated"] = len(codes)
            content["metadata"]["validation_version"] = {
                "icd10_am": self.guidelines.get("icd10_am", {}).get("version", "2024"),
                "cpt": self.guidelines.get("cpt", {}).get("version", "2024"),
                "schi": self.guidelines.get("schi", {}).get("version", "2024")
            }
            
            # Log successful validation
            logger.info(
                f"Content validation successful: {len(codes)} codes validated "
                f"with {accuracy_rate:.2%} accuracy"
            )
            
            return content
            
        except Exception as e:
            logger.error(f"Validation error: {e}")
            raise ValidationError(f"Content validation failed: {str(e)}")
    
    def _extract_text_from_content(self, content: Dict) -> str:
        """Extract text content for validation"""
        text_parts = []
        
        # Handle different content structures
        if isinstance(content, dict):
            if "content" in content:
                text_parts.append(str(content["content"]))
            if "title" in content:
                text_parts.append(str(content["title"]))
            if "description" in content:
                text_parts.append(str(content["description"]))
            if "objectives" in content:
                text_parts.append(str(content["objectives"]))
            
            # Handle nested structures
            for key, value in content.items():
                if isinstance(value, (dict, list)):
                    text_parts.append(json.dumps(value))
        
        return "\n".join(text_parts)

class ValidationError(Exception):
    """Custom exception for validation errors"""
    pass

# Hook entry point for BrainSAIT integration
def run_hook(content: Dict, hook_type: str = "pre_publish") -> Dict:
    """Main entry point for the coding validation hook"""
    validator = MedicalCodingValidator()
    
    if hook_type == "pre_publish":
        return validator.pre_publish_hook(content)
    else:
        logger.warning(f"Unknown hook type: {hook_type}")
        return content

# Command line interface for testing
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Validate medical codes in content")
    parser.add_argument("--file", "-f", help="File to validate")
    parser.add_argument("--text", "-t", help="Text to validate")
    parser.add_argument("--config", "-c", help="Config file path")
    
    args = parser.parse_args()
    
    validator = MedicalCodingValidator(args.config or "config/coding_guidelines.json")
    
    if args.file:
        with open(args.file, 'r', encoding='utf-8') as f:
            content = {"content": f.read()}
    elif args.text:
        content = {"content": args.text}
    else:
        # Test content
        content = {
            "content": """
            Patient diagnosed with I21.9 acute myocardial infarction.
            Procedure performed: SCHI-1234 cardiac catheterization.
            CPT code 93458 for diagnostic angiography.
            Invalid code: X99.999 should trigger error.
            """
        }
    
    try:
        result = validator.pre_publish_hook(content)
        print("✅ Validation successful!")
        print(f"Metadata: {json.dumps(result.get('metadata', {}), indent=2)}")
    except ValidationError as e:
        print(f"❌ Validation failed: {e}")
    except Exception as e:
        print(f"💥 Error: {e}")