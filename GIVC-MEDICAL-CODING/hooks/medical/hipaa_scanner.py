#!/usr/bin/env python3
"""
HIPAA Compliance Scanner Hook
Ensures no PHI (Protected Health Information) is present in educational content
Maintains compliance with HIPAA Security Rule and No Surprises Act
"""

import re
import json
import logging
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Set
from dataclasses import dataclass
from pathlib import Path
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class PHIViolation:
    """Represents a potential PHI violation found in content"""
    violation_type: str
    pattern: str
    context: str
    line_number: int
    severity: str  # HIGH, MEDIUM, LOW
    suggestion: str

@dataclass
class ScanResult:
    """Results of PHI scanning"""
    violations_found: List[PHIViolation]
    content_clean: bool
    auto_redacted: bool
    manual_review_required: bool
    scan_summary: Dict

class HIPAAComplianceScanner:
    """Ensures no PHI in educational content"""
    
    def __init__(self, config_path: str = "config/hipaa_config.json"):
        self.config_path = Path(config_path)
        self.load_config()
        self.redaction_char = "X"
        self.scan_cache = {}
        
    def load_config(self):
        """Load HIPAA scanning configuration"""
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    self.config = json.load(f)
            else:
                # Default configuration
                self.config = {
                    "auto_redact": True,
                    "strict_mode": True,
                    "allowed_patterns": [],
                    "whitelist_terms": [
                        "patient", "doctor", "physician", "nurse", 
                        "healthcare", "medical", "hospital"
                    ],
                    "severity_thresholds": {
                        "high": ["ssn", "full_name", "address", "phone", "email"],
                        "medium": ["date_of_birth", "medical_record_number"],
                        "low": ["age_over_89", "rare_condition"]
                    }
                }
                logger.warning("HIPAA config not found. Using defaults.")
        except Exception as e:
            logger.error(f"Error loading HIPAA config: {e}")
            self.config = {}
    
    def get_phi_patterns(self) -> Dict[str, Dict]:
        """Define PHI detection patterns"""
        return {
            "ssn": {
                "pattern": r'\b\d{3}-\d{2}-\d{4}\b',
                "description": "Social Security Number",
                "severity": "HIGH",
                "suggestion": "Remove or replace with XXX-XX-XXXX"
            },
            "full_name": {
                "pattern": r'\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b',
                "description": "Full name (first and last)",
                "severity": "HIGH",
                "suggestion": "Use generic names like 'Patient A' or 'John D.'"
            },
            "phone_number": {
                "pattern": r'\b(?:\+1-?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b',
                "description": "Phone number",
                "severity": "HIGH",
                "suggestion": "Remove or use (XXX) XXX-XXXX format"
            },
            "email_address": {
                "pattern": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
                "description": "Email address",
                "severity": "HIGH",
                "suggestion": "Remove or use example@domain.com"
            },
            "date_of_birth": {
                "pattern": r'\b(?:born|dob|birth.*date).*?(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b',
                "description": "Date of birth",
                "severity": "MEDIUM",
                "suggestion": "Use age ranges instead of specific dates"
            },
            "specific_date": {
                "pattern": r'\b\d{1,2}[-/]\d{1,2}[-/]\d{4}\b',
                "description": "Specific date",
                "severity": "MEDIUM",
                "suggestion": "Use relative dates like 'last month' or 'in 2023'"
            },
            "medical_record_number": {
                "pattern": r'\b(?:mrn|medical record|patient id)[\s:]*\d+\b',
                "description": "Medical record number",
                "severity": "HIGH",
                "suggestion": "Remove or replace with generic MRN123456"
            },
            "address": {
                "pattern": r'\b\d+\s+[A-Za-z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd)\b',
                "description": "Street address",
                "severity": "HIGH",
                "suggestion": "Use city/state only or generic address"
            },
            "zip_code": {
                "pattern": r'\b\d{5}(?:-\d{4})?\b',
                "description": "ZIP code",
                "severity": "MEDIUM",
                "suggestion": "Use first 3 digits only (e.g., 123XX)"
            },
            "age_over_89": {
                "pattern": r'\b(?:age|aged)\s+(?:9[0-9]|[1-9]\d{2,})\b',
                "description": "Age over 89 (HIPAA safe harbor)",
                "severity": "LOW",
                "suggestion": "Use '>89 years old' instead of specific age"
            },
            "insurance_id": {
                "pattern": r'\b(?:insurance|policy|member)[\s:]*(id|number)[\s:]*[a-z0-9]+\b',
                "description": "Insurance ID or policy number",
                "severity": "HIGH",
                "suggestion": "Remove or replace with generic ID"
            },
            "arabic_names": {
                "pattern": r'\b(?:محمد|أحمد|فاطمة|عائشة|علي|عبدالله|سارة|مريم)\s+[أ-ي]+\b',
                "description": "Arabic full names",
                "severity": "HIGH",
                "suggestion": "Use generic Arabic names or Patient A/المريض أ"
            }
        }
    
    def scan_for_phi(self, content: str) -> List[PHIViolation]:
        """Scan content for potential PHI violations"""
        violations = []
        phi_patterns = self.get_phi_patterns()
        
        # Split content into lines for better context
        lines = content.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            # Skip empty lines
            if not line.strip():
                continue
            
            # Check against each PHI pattern
            for violation_type, pattern_info in phi_patterns.items():
                pattern = pattern_info["pattern"]
                matches = re.finditer(pattern, line, re.IGNORECASE)
                
                for match in matches:
                    # Check if this is a whitelisted term
                    if self._is_whitelisted(match.group(0)):
                        continue
                    
                    violation = PHIViolation(
                        violation_type=violation_type,
                        pattern=match.group(0),
                        context=line.strip(),
                        line_number=line_num,
                        severity=pattern_info["severity"],
                        suggestion=pattern_info["suggestion"]
                    )
                    violations.append(violation)
        
        return violations
    
    def _is_whitelisted(self, text: str) -> bool:
        """Check if text is in whitelist of allowed terms"""
        whitelist = self.config.get("whitelist_terms", [])
        text_lower = text.lower()
        
        # Check exact matches
        if text_lower in [term.lower() for term in whitelist]:
            return True
        
        # Check if it's a generic example
        generic_patterns = [
            r'^patient\s*[a-z]?$',
            r'^john\s*d\.?$',
            r'^jane\s*doe$',
            r'^example@',
            r'xxx-xx-xxxx',
            r'\(xxx\)\s*xxx-xxxx'
        ]
        
        for pattern in generic_patterns:
            if re.match(pattern, text_lower):
                return True
        
        return False
    
    def redact_phi(self, content: str, violations: List[PHIViolation]) -> Tuple[str, List[str]]:
        """Auto-redact PHI violations from content"""
        redacted_content = content
        redaction_log = []
        
        # Sort violations by position (reverse order to maintain positions)
        violations_by_line = {}
        for violation in violations:
            if violation.line_number not in violations_by_line:
                violations_by_line[violation.line_number] = []
            violations_by_line[violation.line_number].append(violation)
        
        lines = redacted_content.split('\n')
        
        for line_num, line_violations in violations_by_line.items():
            if line_num <= len(lines):
                original_line = lines[line_num - 1]
                modified_line = original_line
                
                # Sort violations by position in reverse order
                line_violations.sort(key=lambda v: v.pattern, reverse=True)
                
                for violation in line_violations:
                    # Determine redaction strategy based on violation type
                    redaction = self._get_redaction(violation)
                    
                    # Replace the violation with redaction
                    modified_line = modified_line.replace(violation.pattern, redaction)
                    
                    redaction_log.append(
                        f"Line {line_num}: Redacted {violation.violation_type} "
                        f"'{violation.pattern}' -> '{redaction}'"
                    )
                
                lines[line_num - 1] = modified_line
        
        return '\n'.join(lines), redaction_log
    
    def _get_redaction(self, violation: PHIViolation) -> str:
        """Get appropriate redaction for violation type"""
        redaction_map = {
            "ssn": "XXX-XX-XXXX",
            "phone_number": "(XXX) XXX-XXXX",
            "email_address": "patient@example.com",
            "medical_record_number": "MRN123456",
            "zip_code": "XXXXX",
            "insurance_id": "ID123456",
            "specific_date": "MM/DD/YYYY",
            "date_of_birth": "MM/DD/YYYY"
        }
        
        if violation.violation_type in redaction_map:
            return redaction_map[violation.violation_type]
        elif violation.violation_type in ["full_name", "arabic_names"]:
            return "Patient A" if "Patient" in violation.context else "[Patient Name]"
        elif violation.violation_type == "address":
            return "[Street Address]"
        elif violation.violation_type == "age_over_89":
            return ">89 years"
        else:
            # Generic redaction
            return "[REDACTED]"
    
    def generate_scan_report(self, violations: List[PHIViolation], redacted: bool) -> Dict:
        """Generate comprehensive scan report"""
        violation_counts = {}
        severity_counts = {"HIGH": 0, "MEDIUM": 0, "LOW": 0}
        
        for violation in violations:
            # Count by type
            if violation.violation_type not in violation_counts:
                violation_counts[violation.violation_type] = 0
            violation_counts[violation.violation_type] += 1
            
            # Count by severity
            severity_counts[violation.severity] += 1
        
        report = {
            "scan_timestamp": datetime.now().isoformat(),
            "total_violations": len(violations),
            "violation_types": violation_counts,
            "severity_breakdown": severity_counts,
            "content_status": "CLEAN" if not violations else "VIOLATIONS_FOUND",
            "auto_redacted": redacted,
            "compliance_status": "COMPLIANT" if not violations or redacted else "NON_COMPLIANT",
            "recommendations": self._generate_recommendations(violations)
        }
        
        return report
    
    def _generate_recommendations(self, violations: List[PHIViolation]) -> List[str]:
        """Generate recommendations based on violations found"""
        recommendations = []
        
        if not violations:
            recommendations.append("Content is PHI-compliant and ready for publication.")
            return recommendations
        
        high_severity = [v for v in violations if v.severity == "HIGH"]
        if high_severity:
            recommendations.append(
                f"CRITICAL: {len(high_severity)} high-severity PHI violations found. "
                "Manual review required before publication."
            )
        
        medium_severity = [v for v in violations if v.severity == "MEDIUM"]
        if medium_severity:
            recommendations.append(
                f"WARNING: {len(medium_severity)} medium-severity violations found. "
                "Consider additional de-identification."
            )
        
        # Specific recommendations by violation type
        violation_types = set(v.violation_type for v in violations)
        
        if "full_name" in violation_types or "arabic_names" in violation_types:
            recommendations.append(
                "Replace specific names with generic identifiers (Patient A, John D., etc.)"
            )
        
        if "specific_date" in violation_types:
            recommendations.append(
                "Use relative dates or date ranges instead of specific dates"
            )
        
        if "age_over_89" in violation_types:
            recommendations.append(
                "For patients over 89, use '>89 years' to comply with HIPAA Safe Harbor"
            )
        
        return recommendations
    
    def pre_save_hook(self, content: Dict) -> Dict:
        """Main hook function called before content save"""
        try:
            # Extract content text
            content_text = self._extract_text_from_content(content)
            
            # Generate content hash for caching
            content_hash = hashlib.md5(content_text.encode()).hexdigest()
            
            # Check cache first
            if content_hash in self.scan_cache:
                cached_result = self.scan_cache[content_hash]
                logger.info("Using cached PHI scan result")
                content["metadata"] = content.get("metadata", {})
                content["metadata"]["phi_scan"] = cached_result
                return content
            
            # Scan for PHI violations
            violations = self.scan_for_phi(content_text)
            
            # Determine if manual review is required
            high_severity_violations = [v for v in violations if v.severity == "HIGH"]
            manual_review_required = len(high_severity_violations) > 0
            
            # Auto-redact if configured and no high-severity violations
            auto_redacted = False
            redaction_log = []
            
            if violations and self.config.get("auto_redact", False) and not manual_review_required:
                redacted_content, redaction_log = self.redact_phi(content_text, violations)
                
                # Update content with redacted version
                self._update_content_text(content, redacted_content)
                auto_redacted = True
                
                # Re-scan to verify redaction
                remaining_violations = self.scan_for_phi(redacted_content)
                violations = remaining_violations
                logger.info(f"Auto-redacted {len(redaction_log)} PHI instances")
            
            # Generate scan report
            scan_report = self.generate_scan_report(violations, auto_redacted)
            
            # Add detailed violation info if any remain
            if violations:
                scan_report["violations"] = [
                    {
                        "type": v.violation_type,
                        "line": v.line_number,
                        "severity": v.severity,
                        "suggestion": v.suggestion,
                        "context": v.context[:100] + "..." if len(v.context) > 100 else v.context
                    }
                    for v in violations
                ]
            
            if redaction_log:
                scan_report["redaction_log"] = redaction_log
            
            # Cache the result
            self.scan_cache[content_hash] = scan_report
            
            # Add scan metadata to content
            content["metadata"] = content.get("metadata", {})
            content["metadata"]["phi_scan"] = scan_report
            content["metadata"]["hipaa_compliant"] = len(violations) == 0
            
            # Raise error if high-severity violations found and auto-redact failed
            if high_severity_violations and not auto_redacted:
                violation_summary = ", ".join([
                    f"{v.violation_type} (line {v.line_number})" 
                    for v in high_severity_violations[:5]
                ])
                raise HIPAAViolationError(
                    f"HIGH SEVERITY PHI violations found: {violation_summary}. "
                    f"Manual review required. Total violations: {len(violations)}"
                )
            
            # Log scan results
            if violations:
                logger.warning(
                    f"PHI scan completed: {len(violations)} violations found, "
                    f"auto-redacted: {auto_redacted}, manual review: {manual_review_required}"
                )
            else:
                logger.info("PHI scan completed: No violations found")
            
            return content
            
        except Exception as e:
            logger.error(f"PHI scanning error: {e}")
            raise HIPAAViolationError(f"PHI scan failed: {str(e)}")
    
    def _extract_text_from_content(self, content: Dict) -> str:
        """Extract text content for PHI scanning"""
        text_parts = []
        
        # Handle different content structures
        if isinstance(content, dict):
            for key, value in content.items():
                if key in ["metadata", "config"]:
                    continue  # Skip metadata
                
                if isinstance(value, str):
                    text_parts.append(value)
                elif isinstance(value, dict):
                    # Extract text from nested dictionaries
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
    
    def _update_content_text(self, content: Dict, new_text: str):
        """Update content with redacted text"""
        # This is a simplified implementation
        # In practice, you'd need to map the redacted text back to the original structure
        if "content" in content:
            content["content"] = new_text

class HIPAAViolationError(Exception):
    """Custom exception for HIPAA violations"""
    pass

# Hook entry point for BrainSAIT integration
def run_hook(content: Dict, hook_type: str = "pre_save") -> Dict:
    """Main entry point for the HIPAA compliance hook"""
    scanner = HIPAAComplianceScanner()
    
    if hook_type == "pre_save":
        return scanner.pre_save_hook(content)
    else:
        logger.warning(f"Unknown hook type: {hook_type}")
        return content

# Command line interface for testing
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Scan content for PHI violations")
    parser.add_argument("--file", "-f", help="File to scan")
    parser.add_argument("--text", "-t", help="Text to scan")
    parser.add_argument("--config", "-c", help="Config file path")
    parser.add_argument("--redact", "-r", action="store_true", help="Auto-redact violations")
    
    args = parser.parse_args()
    
    scanner = HIPAAComplianceScanner(args.config or "config/hipaa_config.json")
    if args.redact:
        scanner.config["auto_redact"] = True
    
    if args.file:
        with open(args.file, 'r', encoding='utf-8') as f:
            content = {"content": f.read()}
    elif args.text:
        content = {"content": args.text}
    else:
        # Test content with PHI
        content = {
            "content": """
            Patient John Smith (SSN: 123-45-6789) was seen on 01/15/2024.
            He lives at 123 Main Street, Anytown, 12345.
            Contact: john.smith@email.com or (555) 123-4567.
            Medical Record Number: MRN789456
            The 92-year-old patient has diabetes.
            """
        }
    
    try:
        result = scanner.pre_save_hook(content)
        print("✅ PHI scan completed!")
        scan_report = result.get("metadata", {}).get("phi_scan", {})
        print(f"Scan report: {json.dumps(scan_report, indent=2)}")
        
        if "content" in result:
            print("\n📄 Content after processing:")
            print(result["content"][:500] + "..." if len(result["content"]) > 500 else result["content"])
            
    except HIPAAViolationError as e:
        print(f"❌ HIPAA violation detected: {e}")
    except Exception as e:
        print(f"💥 Error: {e}")