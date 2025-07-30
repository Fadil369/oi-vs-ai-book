#!/usr/bin/env python3
"""
Assessment Scorer Hook
Automated scoring system for medical coding exercises and assessments
Implements partial credit logic and competency-based evaluation
"""

import re
import json
import logging
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from pathlib import Path
import hashlib
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class QuestionType(Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    SCENARIO_BASED = "scenario_based"
    WORD_CONSTRUCTION = "word_construction"
    CASE_ANALYSIS = "case_analysis"
    PRACTICAL_CODING = "practical_coding"
    MATCHING = "matching"
    TRUE_FALSE = "true_false"

@dataclass
class ScoringCriteria:
    """Represents scoring criteria for different question types"""
    question_type: QuestionType
    total_points: float
    partial_credit_enabled: bool
    partial_credit_rules: Dict
    accuracy_weight: float
    speed_weight: float
    complexity_multiplier: float

@dataclass
class StudentAnswer:
    """Represents a student's answer to a question"""
    question_id: str
    question_type: QuestionType
    student_response: Any
    time_taken_seconds: int
    attempt_number: int
    confidence_level: Optional[int] = None

@dataclass
class ScoringResult:
    """Results of scoring an individual question"""
    question_id: str
    points_earned: float
    points_possible: float
    percentage: float
    is_correct: bool
    partial_credit_applied: bool
    feedback: str
    detailed_analysis: Dict

@dataclass
class AssessmentScore:
    """Complete assessment scoring results"""
    student_id: str
    assessment_id: str
    individual_scores: List[ScoringResult]
    total_points_earned: float
    total_points_possible: float
    percentage_score: float
    passed: bool
    competency_scores: Dict[str, float]
    time_taken_minutes: int
    scoring_metadata: Dict

class MedicalCodingAssessmentScorer:
    """Automated assessment scoring system for medical coding"""
    
    def __init__(self, config_path: str = "config/scoring_config.json"):
        self.config_path = Path(config_path)
        self.load_config()
        self.load_scoring_rubrics()
        self.scoring_cache = {}
        
    def load_config(self):
        """Load assessment scoring configuration"""
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    self.config = json.load(f)
            else:
                # Default configuration
                self.config = {
                    "passing_threshold": 0.80,
                    "partial_credit_enabled": True,
                    "time_bonus_enabled": True,
                    "competency_tracking": True,
                    "detailed_feedback": True,
                    "scoring_precision": 2,
                    "question_type_weights": {
                        "multiple_choice": 1.0,
                        "scenario_based": 1.5,
                        "word_construction": 1.2,
                        "case_analysis": 2.0,
                        "practical_coding": 2.5,
                        "matching": 1.0,
                        "true_false": 0.8
                    },
                    "competency_categories": [
                        "medical_terminology",
                        "coding_accuracy",
                        "guideline_application",
                        "clinical_correlation",
                        "regulatory_compliance"
                    ]
                }
                logger.warning("Scoring config not found. Using defaults.")
        except Exception as e:
            logger.error(f"Error loading scoring config: {e}")
            self.config = {}
    
    def load_scoring_rubrics(self):
        """Load detailed scoring rubrics for different question types"""
        self.scoring_rubrics = {
            QuestionType.MULTIPLE_CHOICE: ScoringCriteria(
                question_type=QuestionType.MULTIPLE_CHOICE,
                total_points=1.0,
                partial_credit_enabled=False,
                partial_credit_rules={},
                accuracy_weight=1.0,
                speed_weight=0.1,
                complexity_multiplier=1.0
            ),
            QuestionType.SCENARIO_BASED: ScoringCriteria(
                question_type=QuestionType.SCENARIO_BASED,
                total_points=5.0,
                partial_credit_enabled=True,
                partial_credit_rules={
                    "correct_primary_code": 0.6,
                    "correct_secondary_codes": 0.2,
                    "correct_modifiers": 0.1,
                    "clinical_correlation": 0.1
                },
                accuracy_weight=0.8,
                speed_weight=0.1,
                complexity_multiplier=1.5
            ),
            QuestionType.WORD_CONSTRUCTION: ScoringCriteria(
                question_type=QuestionType.WORD_CONSTRUCTION,
                total_points=2.0,
                partial_credit_enabled=True,
                partial_credit_rules={
                    "correct_prefix": 0.3,
                    "correct_root": 0.4,
                    "correct_suffix": 0.3
                },
                accuracy_weight=0.9,
                speed_weight=0.1,
                complexity_multiplier=1.2
            ),
            QuestionType.CASE_ANALYSIS: ScoringCriteria(
                question_type=QuestionType.CASE_ANALYSIS,
                total_points=10.0,
                partial_credit_enabled=True,
                partial_credit_rules={
                    "diagnosis_identification": 0.3,
                    "procedure_coding": 0.4,
                    "guideline_application": 0.2,
                    "documentation_quality": 0.1
                },
                accuracy_weight=0.7,
                speed_weight=0.1,
                complexity_multiplier=2.0
            ),
            QuestionType.PRACTICAL_CODING: ScoringCriteria(
                question_type=QuestionType.PRACTICAL_CODING,
                total_points=15.0,
                partial_credit_enabled=True,
                partial_credit_rules={
                    "code_accuracy": 0.5,
                    "sequence_correctness": 0.2,
                    "modifier_usage": 0.15,
                    "compliance_check": 0.15
                },
                accuracy_weight=0.8,
                speed_weight=0.1,
                complexity_multiplier=2.5
            ),
            QuestionType.MATCHING: ScoringCriteria(
                question_type=QuestionType.MATCHING,
                total_points=3.0,
                partial_credit_enabled=True,
                partial_credit_rules={
                    "per_correct_match": 1.0  # Points per correct match
                },
                accuracy_weight=1.0,
                speed_weight=0.05,
                complexity_multiplier=1.0
            ),
            QuestionType.TRUE_FALSE: ScoringCriteria(
                question_type=QuestionType.TRUE_FALSE,
                total_points=0.5,
                partial_credit_enabled=False,
                partial_credit_rules={},
                accuracy_weight=1.0,
                speed_weight=0.05,
                complexity_multiplier=0.8
            )
        }
    
    def score_multiple_choice(self, question: Dict, student_answer: StudentAnswer, correct_answer: Any) -> ScoringResult:
        """Score multiple choice questions"""
        rubric = self.scoring_rubrics[QuestionType.MULTIPLE_CHOICE]
        
        is_correct = str(student_answer.student_response).strip().lower() == str(correct_answer).strip().lower()
        points_earned = rubric.total_points if is_correct else 0.0
        
        # Apply time bonus if enabled
        if self.config.get("time_bonus_enabled") and is_correct:
            expected_time = question.get("expected_time_seconds", 60)
            if student_answer.time_taken_seconds < expected_time * 0.75:
                time_bonus = rubric.total_points * 0.1
                points_earned += time_bonus
        
        feedback = "Correct answer!" if is_correct else f"Incorrect. The correct answer is: {correct_answer}"
        
        return ScoringResult(
            question_id=student_answer.question_id,
            points_earned=points_earned,
            points_possible=rubric.total_points,
            percentage=points_earned / rubric.total_points * 100,
            is_correct=is_correct,
            partial_credit_applied=False,
            feedback=feedback,
            detailed_analysis={
                "question_type": "multiple_choice",
                "response_time": student_answer.time_taken_seconds,
                "attempt_number": student_answer.attempt_number
            }
        )
    
    def score_scenario_based(self, question: Dict, student_answer: StudentAnswer, correct_answer: Dict) -> ScoringResult:
        """Score scenario-based coding questions with partial credit"""
        rubric = self.scoring_rubrics[QuestionType.SCENARIO_BASED]
        
        points_earned = 0.0
        partial_credit_breakdown = {}
        
        student_response = student_answer.student_response
        if isinstance(student_response, str):
            try:
                student_response = json.loads(student_response)
            except:
                student_response = {"primary_code": student_response}
        
        # Score primary code
        if student_response.get("primary_code") == correct_answer.get("primary_code"):
            primary_points = rubric.total_points * rubric.partial_credit_rules["correct_primary_code"]
            points_earned += primary_points
            partial_credit_breakdown["primary_code"] = primary_points
        
        # Score secondary codes
        student_secondary = set(student_response.get("secondary_codes", []))
        correct_secondary = set(correct_answer.get("secondary_codes", []))
        
        if correct_secondary and student_secondary:
            secondary_accuracy = len(student_secondary & correct_secondary) / len(correct_secondary)
            secondary_points = rubric.total_points * rubric.partial_credit_rules["correct_secondary_codes"] * secondary_accuracy
            points_earned += secondary_points
            partial_credit_breakdown["secondary_codes"] = secondary_points
        
        # Score modifiers
        student_modifiers = set(student_response.get("modifiers", []))
        correct_modifiers = set(correct_answer.get("modifiers", []))
        
        if correct_modifiers and student_modifiers:
            modifier_accuracy = len(student_modifiers & correct_modifiers) / len(correct_modifiers)
            modifier_points = rubric.total_points * rubric.partial_credit_rules["correct_modifiers"] * modifier_accuracy
            points_earned += modifier_points
            partial_credit_breakdown["modifiers"] = modifier_points
        
        # Score clinical correlation (based on explanation quality)
        explanation = student_response.get("explanation", "")
        if explanation and len(explanation) > 50:  # Basic quality check
            correlation_points = rubric.total_points * rubric.partial_credit_rules["clinical_correlation"]
            points_earned += correlation_points
            partial_credit_breakdown["clinical_correlation"] = correlation_points
        
        is_correct = points_earned >= (rubric.total_points * 0.8)  # 80% threshold for "correct"
        
        feedback = self._generate_scenario_feedback(
            student_response, correct_answer, partial_credit_breakdown
        )
        
        return ScoringResult(
            question_id=student_answer.question_id,
            points_earned=round(points_earned, self.config.get("scoring_precision", 2)),
            points_possible=rubric.total_points,
            percentage=points_earned / rubric.total_points * 100,
            is_correct=is_correct,
            partial_credit_applied=True,
            feedback=feedback,
            detailed_analysis={
                "question_type": "scenario_based",
                "partial_credit_breakdown": partial_credit_breakdown,
                "response_time": student_answer.time_taken_seconds,
                "complexity_score": rubric.complexity_multiplier
            }
        )
    
    def score_word_construction(self, question: Dict, student_answer: StudentAnswer, correct_answer: Dict) -> ScoringResult:
        """Score medical word construction questions"""
        rubric = self.scoring_rubrics[QuestionType.WORD_CONSTRUCTION]
        
        points_earned = 0.0
        partial_credit_breakdown = {}
        
        student_response = student_answer.student_response
        if isinstance(student_response, str):
            # Parse constructed word
            student_response = self._parse_medical_word(student_response)
        
        # Score prefix
        if student_response.get("prefix", "").lower() == correct_answer.get("prefix", "").lower():
            prefix_points = rubric.total_points * rubric.partial_credit_rules["correct_prefix"]
            points_earned += prefix_points
            partial_credit_breakdown["prefix"] = prefix_points
        
        # Score root
        if student_response.get("root", "").lower() == correct_answer.get("root", "").lower():
            root_points = rubric.total_points * rubric.partial_credit_rules["correct_root"]
            points_earned += root_points
            partial_credit_breakdown["root"] = root_points
        
        # Score suffix
        if student_response.get("suffix", "").lower() == correct_answer.get("suffix", "").lower():
            suffix_points = rubric.total_points * rubric.partial_credit_rules["correct_suffix"]
            points_earned += suffix_points
            partial_credit_breakdown["suffix"] = suffix_points
        
        is_correct = points_earned >= (rubric.total_points * 0.8)
        
        feedback = self._generate_word_construction_feedback(
            student_response, correct_answer, partial_credit_breakdown
        )
        
        return ScoringResult(
            question_id=student_answer.question_id,
            points_earned=round(points_earned, self.config.get("scoring_precision", 2)),
            points_possible=rubric.total_points,
            percentage=points_earned / rubric.total_points * 100,
            is_correct=is_correct,
            partial_credit_applied=True,
            feedback=feedback,
            detailed_analysis={
                "question_type": "word_construction",
                "partial_credit_breakdown": partial_credit_breakdown,
                "word_components": student_response
            }
        )
    
    def score_practical_coding(self, question: Dict, student_answer: StudentAnswer, correct_answer: Dict) -> ScoringResult:
        """Score practical coding exercises with comprehensive evaluation"""
        rubric = self.scoring_rubrics[QuestionType.PRACTICAL_CODING]
        
        points_earned = 0.0
        partial_credit_breakdown = {}
        
        student_response = student_answer.student_response
        if isinstance(student_response, str):
            try:
                student_response = json.loads(student_response)
            except:
                # Handle plain text code submissions
                student_response = {"codes": [student_response]}
        
        # Score code accuracy
        student_codes = set(student_response.get("codes", []))
        correct_codes = set(correct_answer.get("codes", []))
        
        if correct_codes:
            code_accuracy = len(student_codes & correct_codes) / len(correct_codes)
            code_points = rubric.total_points * rubric.partial_credit_rules["code_accuracy"] * code_accuracy
            points_earned += code_points
            partial_credit_breakdown["code_accuracy"] = code_points
        
        # Score sequence correctness
        if "sequence" in correct_answer:
            student_sequence = student_response.get("sequence", [])
            correct_sequence = correct_answer.get("sequence", [])
            
            sequence_accuracy = self._calculate_sequence_accuracy(student_sequence, correct_sequence)
            sequence_points = rubric.total_points * rubric.partial_credit_rules["sequence_correctness"] * sequence_accuracy
            points_earned += sequence_points
            partial_credit_breakdown["sequence_correctness"] = sequence_points
        
        # Score modifier usage
        student_modifiers = student_response.get("modifiers", {})
        correct_modifiers = correct_answer.get("modifiers", {})
        
        if correct_modifiers:
            modifier_accuracy = self._calculate_modifier_accuracy(student_modifiers, correct_modifiers)
            modifier_points = rubric.total_points * rubric.partial_credit_rules["modifier_usage"] * modifier_accuracy
            points_earned += modifier_points
            partial_credit_breakdown["modifier_usage"] = modifier_points
        
        # Score compliance check
        compliance_score = self._check_coding_compliance(student_response, question.get("guidelines", {}))
        compliance_points = rubric.total_points * rubric.partial_credit_rules["compliance_check"] * compliance_score
        points_earned += compliance_points
        partial_credit_breakdown["compliance_check"] = compliance_points
        
        is_correct = points_earned >= (rubric.total_points * 0.8)
        
        feedback = self._generate_practical_coding_feedback(
            student_response, correct_answer, partial_credit_breakdown
        )
        
        return ScoringResult(
            question_id=student_answer.question_id,
            points_earned=round(points_earned, self.config.get("scoring_precision", 2)),
            points_possible=rubric.total_points,
            percentage=points_earned / rubric.total_points * 100,
            is_correct=is_correct,
            partial_credit_applied=True,
            feedback=feedback,
            detailed_analysis={
                "question_type": "practical_coding",
                "partial_credit_breakdown": partial_credit_breakdown,
                "compliance_score": compliance_score,
                "complexity_multiplier": rubric.complexity_multiplier
            }
        )
    
    def score_assessment(self, assessment_data: Dict, student_answers: List[StudentAnswer]) -> AssessmentScore:
        """Score complete assessment with all questions"""
        try:
            individual_scores = []
            total_points_earned = 0.0
            total_points_possible = 0.0
            competency_scores = {category: [] for category in self.config.get("competency_categories", [])}
            
            questions = assessment_data.get("questions", [])
            question_map = {q["id"]: q for q in questions}
            
            # Score each question
            for student_answer in student_answers:
                question = question_map.get(student_answer.question_id)
                if not question:
                    logger.warning(f"Question {student_answer.question_id} not found in assessment")
                    continue
                
                correct_answer = question.get("correct_answer")
                question_type = QuestionType(question.get("type", "multiple_choice"))
                
                # Route to appropriate scoring method
                if question_type == QuestionType.MULTIPLE_CHOICE:
                    score_result = self.score_multiple_choice(question, student_answer, correct_answer)
                elif question_type == QuestionType.SCENARIO_BASED:
                    score_result = self.score_scenario_based(question, student_answer, correct_answer)
                elif question_type == QuestionType.WORD_CONSTRUCTION:
                    score_result = self.score_word_construction(question, student_answer, correct_answer)
                elif question_type == QuestionType.PRACTICAL_CODING:
                    score_result = self.score_practical_coding(question, student_answer, correct_answer)
                else:
                    # Default scoring for other types
                    score_result = self.score_multiple_choice(question, student_answer, correct_answer)
                
                individual_scores.append(score_result)
                total_points_earned += score_result.points_earned
                total_points_possible += score_result.points_possible
                
                # Track competency scores
                question_competencies = question.get("competencies", [])
                for competency in question_competencies:
                    if competency in competency_scores:
                        competency_scores[competency].append(score_result.percentage / 100)
            
            # Calculate final metrics
            percentage_score = (total_points_earned / total_points_possible * 100) if total_points_possible > 0 else 0
            passed = percentage_score >= (self.config.get("passing_threshold", 0.80) * 100)
            
            # Calculate competency averages
            final_competency_scores = {}
            for competency, scores in competency_scores.items():
                if scores:
                    final_competency_scores[competency] = sum(scores) / len(scores)
                else:
                    final_competency_scores[competency] = 0.0
            
            # Calculate total time taken
            total_time_minutes = sum(answer.time_taken_seconds for answer in student_answers) // 60
            
            scoring_metadata = {
                "scoring_timestamp": datetime.now().isoformat(),
                "scoring_version": "1.0",
                "total_questions": len(individual_scores),
                "questions_correct": sum(1 for score in individual_scores if score.is_correct),
                "partial_credit_questions": sum(1 for score in individual_scores if score.partial_credit_applied),
                "average_response_time": sum(answer.time_taken_seconds for answer in student_answers) / len(student_answers) if student_answers else 0,
                "passing_threshold": self.config.get("passing_threshold", 0.80) * 100
            }
            
            return AssessmentScore(
                student_id=assessment_data.get("student_id", "unknown"),
                assessment_id=assessment_data.get("id", "unknown"),
                individual_scores=individual_scores,
                total_points_earned=round(total_points_earned, self.config.get("scoring_precision", 2)),
                total_points_possible=round(total_points_possible, self.config.get("scoring_precision", 2)),
                percentage_score=round(percentage_score, self.config.get("scoring_precision", 2)),
                passed=passed,
                competency_scores=final_competency_scores,
                time_taken_minutes=total_time_minutes,
                scoring_metadata=scoring_metadata
            )
            
        except Exception as e:
            logger.error(f"Assessment scoring error: {e}")
            raise AssessmentScoringError(f"Assessment scoring failed: {str(e)}")
    
    def _parse_medical_word(self, word: str) -> Dict:
        """Parse medical word into components"""
        # Simplified medical word parsing
        # In practice, this would use a comprehensive medical dictionary
        common_prefixes = ["pre", "post", "anti", "hyper", "hypo", "inter", "intra", "sub", "super"]
        common_suffixes = ["itis", "osis", "emia", "ology", "pathy", "trophy", "scopy", "tomy"]
        
        word = word.lower().strip()
        parsed = {"prefix": "", "root": word, "suffix": ""}
        
        # Find prefix
        for prefix in common_prefixes:
            if word.startswith(prefix):
                parsed["prefix"] = prefix
                word = word[len(prefix):]
                break
        
        # Find suffix
        for suffix in common_suffixes:
            if word.endswith(suffix):
                parsed["suffix"] = suffix
                word = word[:-len(suffix)]
                break
        
        parsed["root"] = word
        return parsed
    
    def _calculate_sequence_accuracy(self, student_sequence: List, correct_sequence: List) -> float:
        """Calculate accuracy of code sequence"""
        if not correct_sequence:
            return 1.0
        
        if not student_sequence:
            return 0.0
        
        # Use longest common subsequence algorithm
        matches = 0
        for i, correct_item in enumerate(correct_sequence):
            if i < len(student_sequence) and student_sequence[i] == correct_item:
                matches += 1
        
        return matches / len(correct_sequence)
    
    def _calculate_modifier_accuracy(self, student_modifiers: Dict, correct_modifiers: Dict) -> float:
        """Calculate accuracy of modifier usage"""
        if not correct_modifiers:
            return 1.0
        
        if not student_modifiers:
            return 0.0
        
        total_accuracy = 0.0
        for code, correct_mods in correct_modifiers.items():
            student_mods = student_modifiers.get(code, [])
            if isinstance(correct_mods, list) and isinstance(student_mods, list):
                if correct_mods:
                    accuracy = len(set(student_mods) & set(correct_mods)) / len(set(correct_mods))
                    total_accuracy += accuracy
                else:
                    total_accuracy += 1.0 if not student_mods else 0.0
        
        return total_accuracy / len(correct_modifiers) if correct_modifiers else 1.0
    
    def _check_coding_compliance(self, student_response: Dict, guidelines: Dict) -> float:
        """Check coding response against compliance guidelines"""
        # Simplified compliance checking
        # In practice, this would integrate with actual coding guidelines
        compliance_score = 1.0
        
        # Check for required elements
        required_elements = guidelines.get("required_elements", [])
        for element in required_elements:
            if element not in student_response:
                compliance_score -= 0.2
        
        # Check for forbidden combinations
        forbidden_combinations = guidelines.get("forbidden_combinations", [])
        student_codes = set(student_response.get("codes", []))
        for forbidden_combo in forbidden_combinations:
            if set(forbidden_combo).issubset(student_codes):
                compliance_score -= 0.3
        
        return max(0.0, compliance_score)
    
    def _generate_scenario_feedback(self, student_response: Dict, correct_answer: Dict, breakdown: Dict) -> str:
        """Generate detailed feedback for scenario-based questions"""
        feedback_parts = []
        
        if breakdown.get("primary_code", 0) > 0:
            feedback_parts.append("✓ Primary code correct")
        else:
            feedback_parts.append(f"✗ Primary code incorrect. Correct: {correct_answer.get('primary_code')}")
        
        if breakdown.get("secondary_codes", 0) > 0:
            feedback_parts.append("✓ Secondary codes partially correct")
        elif "secondary_codes" in correct_answer:
            feedback_parts.append(f"✗ Secondary codes needed: {', '.join(correct_answer.get('secondary_codes', []))}")
        
        if breakdown.get("modifiers", 0) > 0:
            feedback_parts.append("✓ Modifiers applied correctly")
        elif "modifiers" in correct_answer:
            feedback_parts.append(f"✗ Missing modifiers: {', '.join(correct_answer.get('modifiers', []))}")
        
        return " | ".join(feedback_parts)
    
    def _generate_word_construction_feedback(self, student_response: Dict, correct_answer: Dict, breakdown: Dict) -> str:
        """Generate feedback for word construction questions"""
        feedback_parts = []
        
        components = ["prefix", "root", "suffix"]
        for component in components:
            if breakdown.get(component, 0) > 0:
                feedback_parts.append(f"✓ {component} correct")
            else:
                correct_value = correct_answer.get(component, "")
                if correct_value:
                    feedback_parts.append(f"✗ {component} incorrect. Correct: {correct_value}")
        
        return " | ".join(feedback_parts)
    
    def _generate_practical_coding_feedback(self, student_response: Dict, correct_answer: Dict, breakdown: Dict) -> str:
        """Generate feedback for practical coding questions"""
        feedback_parts = []
        
        if breakdown.get("code_accuracy", 0) > breakdown.get("code_accuracy", 0) * 0.8:
            feedback_parts.append("✓ Code accuracy good")
        else:
            missing_codes = set(correct_answer.get("codes", [])) - set(student_response.get("codes", []))
            if missing_codes:
                feedback_parts.append(f"✗ Missing codes: {', '.join(list(missing_codes)[:3])}")
        
        if breakdown.get("compliance_check", 0) > 0.8:
            feedback_parts.append("✓ Compliance requirements met")
        else:
            feedback_parts.append("✗ Check coding guidelines for compliance")
        
        return " | ".join(feedback_parts)
    
    def post_assessment_hook(self, assessment_result: Dict) -> Dict:
        """Main hook function called after assessment completion"""
        try:
            # Parse assessment data
            assessment_data = assessment_result.get("assessment_data", {})
            student_answers_data = assessment_result.get("student_answers", [])
            
            # Convert to StudentAnswer objects
            student_answers = []
            for answer_data in student_answers_data:
                student_answer = StudentAnswer(
                    question_id=answer_data.get("question_id"),
                    question_type=QuestionType(answer_data.get("question_type", "multiple_choice")),
                    student_response=answer_data.get("response"),
                    time_taken_seconds=answer_data.get("time_taken_seconds", 0),
                    attempt_number=answer_data.get("attempt_number", 1),
                    confidence_level=answer_data.get("confidence_level")
                )
                student_answers.append(student_answer)
            
            # Score the assessment
            assessment_score = self.score_assessment(assessment_data, student_answers)
            
            # Prepare result metadata
            scoring_result = {
                "total_points_earned": assessment_score.total_points_earned,
                "total_points_possible": assessment_score.total_points_possible,
                "percentage_score": assessment_score.percentage_score,
                "passed": assessment_score.passed,
                "competency_scores": assessment_score.competency_scores,
                "time_taken_minutes": assessment_score.time_taken_minutes,
                "individual_question_scores": [
                    {
                        "question_id": score.question_id,
                        "points_earned": score.points_earned,
                        "points_possible": score.points_possible,
                        "percentage": score.percentage,
                        "is_correct": score.is_correct,
                        "feedback": score.feedback
                    }
                    for score in assessment_score.individual_scores
                ],
                "scoring_metadata": assessment_score.scoring_metadata,
                "scored_at": datetime.now().isoformat()
            }
            
            # Add scoring results to assessment
            assessment_result["scoring_results"] = scoring_result
            assessment_result["final_score"] = assessment_score.percentage_score
            assessment_result["passed"] = assessment_score.passed
            
            logger.info(
                f"Assessment scored: {assessment_score.percentage_score:.1f}% "
                f"({assessment_score.total_points_earned}/{assessment_score.total_points_possible} points), "
                f"passed: {assessment_score.passed}"
            )
            
            return assessment_result
            
        except Exception as e:
            logger.error(f"Assessment scoring error: {e}")
            raise AssessmentScoringError(f"Assessment scoring failed: {str(e)}")

class AssessmentScoringError(Exception):
    """Custom exception for assessment scoring errors"""
    pass

# Hook entry point for BrainSAIT integration
def run_hook(assessment_result: Dict, hook_type: str = "post_assessment") -> Dict:
    """Main entry point for the assessment scoring hook"""
    scorer = MedicalCodingAssessmentScorer()
    
    if hook_type == "post_assessment":
        return scorer.post_assessment_hook(assessment_result)
    else:
        logger.warning(f"Unknown hook type: {hook_type}")
        return assessment_result

# Command line interface for testing
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Score medical coding assessment")
    parser.add_argument("--file", "-f", help="Assessment data file to score")
    parser.add_argument("--config", "-c", help="Config file path")
    
    args = parser.parse_args()
    
    scorer = MedicalCodingAssessmentScorer(args.config or "config/scoring_config.json")
    
    if args.file:
        with open(args.file, 'r', encoding='utf-8') as f:
            assessment_data = json.load(f)
    else:
        # Test data
        assessment_data = {
            "assessment_data": {
                "id": "test_assessment_001",
                "student_id": "student_123",
                "questions": [
                    {
                        "id": "q1",
                        "type": "multiple_choice",
                        "correct_answer": "A",
                        "competencies": ["medical_terminology"]
                    },
                    {
                        "id": "q2",
                        "type": "scenario_based",
                        "correct_answer": {
                            "primary_code": "I21.9",
                            "secondary_codes": ["Z95.1"],
                            "modifiers": ["25"]
                        },
                        "competencies": ["coding_accuracy", "clinical_correlation"]
                    }
                ]
            },
            "student_answers": [
                {
                    "question_id": "q1",
                    "question_type": "multiple_choice",
                    "response": "A",
                    "time_taken_seconds": 45,
                    "attempt_number": 1
                },
                {
                    "question_id": "q2",
                    "question_type": "scenario_based",
                    "response": {
                        "primary_code": "I21.9",
                        "secondary_codes": ["Z95.1"],
                        "modifiers": ["25"],
                        "explanation": "Acute myocardial infarction with previous cardiac device"
                    },
                    "time_taken_seconds": 180,
                    "attempt_number": 1
                }
            ]
        }
    
    try:
        result = scorer.post_assessment_hook(assessment_data)
        print("✅ Assessment scoring completed!")
        scoring_results = result.get("scoring_results", {})
        print(f"Final Score: {scoring_results.get('percentage_score', 0):.1f}%")
        print(f"Passed: {scoring_results.get('passed', False)}")
        print(f"Competency Scores: {json.dumps(scoring_results.get('competency_scores', {}), indent=2)}")
        
    except AssessmentScoringError as e:
        print(f"❌ Assessment scoring failed: {e}")
    except Exception as e:
        print(f"💥 Error: {e}")