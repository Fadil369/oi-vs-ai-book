/**
 * 3M Healthcare Software Integration
 * Trusted by 75% of US hospitals and widely adopted in Saudi Arabia
 * Integration with 3M™ Coding and Reimbursement System Plus and CodeAssist™ System
 */

import { EventEmitter } from 'events';

// 3M System Types
export const SYSTEM_TYPES = {
  CRS_PLUS: '3m_crs_plus',           // 3M™ Coding and Reimbursement System Plus
  CODE_ASSIST: '3m_code_assist',     // 3M™ CodeAssist™ System
  ENCODER: '3m_encoder',             // 3M™ Core Grouping Software
  DRG_FINDER: '3m_drg_finder',       // 3M™ DRG Finder
  APR_DRG: '3m_apr_drg',             // 3M™ APR DRG Software
  CLINICAL_FINDER: '3m_clinical_finder' // 3M™ Clinical Data Abstraction System
};

// Saudi-specific configurations
export const SAUDI_CONFIG = {
  ar_drg_version: '11.0',            // Australian Refined DRG version used in Saudi
  currency: 'SAR',
  language_support: ['en', 'ar'],
  nphies_integration: true,
  scfhs_compliance: true,
  moh_reporting: true
};

// Configuration
const THREEM_CONFIG = {
  base_url: process.env.THREEM_BASE_URL || 'https://api.3mhis.com/v2',
  sandbox_url: process.env.THREEM_SANDBOX_URL || 'https://sandbox.3mhis.com/v2',
  client_id: process.env.THREEM_CLIENT_ID,
  client_secret: process.env.THREEM_CLIENT_SECRET,
  api_key: process.env.THREEM_API_KEY,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  timeout: 45000, // 3M systems can be slower
  retry_attempts: 3,
  saudi_locale: 'en-SA' // English for Saudi Arabia
};

/**
 * 3M Healthcare Integration Connector
 * Main interface for 3M healthcare software systems
 */
export class ThreeMConnector extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...THREEM_CONFIG, ...config };
    this.accessToken = null;
    this.tokenExpiry = null;
    this.authenticated = false;
    
    // Service modules
    this.encoderService = new EncoderService(this);
    this.drgService = new DRGService(this);
    this.codeAssistService = new CodeAssistService(this);
    this.clinicalFinderService = new ClinicalFinderService(this);
    this.reimbursementService = new ReimbursementService(this);
    this.educationalService = new EducationalService(this);
  }
  
  get baseURL() {
    return this.config.environment === 'production' 
      ? this.config.base_url 
      : this.config.sandbox_url;
  }
  
  /**
   * Authenticate with 3M systems
   */
  async authenticate() {
    try {
      const response = await fetch(`${this.baseURL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(
            `${this.config.client_id}:${this.config.client_secret}`
          ).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          scope: 'encoder drg coding reimbursement education'
        })
      });
      
      if (!response.ok) {
        throw new Error(`3M authentication failed: ${response.status}`);
      }
      
      const auth = await response.json();
      this.accessToken = auth.access_token;
      this.tokenExpiry = Date.now() + (auth.expires_in * 1000);
      this.authenticated = true;
      
      this.emit('authenticated', {
        system: '3M Healthcare',
        expires_in: auth.expires_in
      });
      
      return true;
    } catch (error) {
      this.emit('auth_error', { error: error.message });
      throw error;
    }
  }
  
  /**
   * Make authenticated request to 3M API
   */
  async makeRequest(endpoint, options = {}) {
    if (!this.authenticated || Date.now() >= this.tokenExpiry - 60000) {
      await this.authenticate();
    }
    
    const config = {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-3M-API-Key': this.config.api_key,
        'X-3M-Locale': this.config.saudi_locale,
        ...options.headers
      },
      timeout: this.config.timeout,
      ...options
    };
    
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    let attempt = 0;
    while (attempt < this.config.retry_attempts) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`3M API Error: ${response.status} - ${errorData}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        
        return await response.text();
      } catch (error) {
        attempt++;
        if (attempt >= this.config.retry_attempts) {
          this.emit('api_error', { endpoint, error: error.message, attempt });
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  /**
   * Encode medical records using 3M encoder
   */
  async encodeRecord(recordData) {
    return await this.encoderService.encodeRecord(recordData);
  }
  
  /**
   * Calculate DRG assignment
   */
  async calculateDRG(patientData) {
    return await this.drgService.calculateARDRG(patientData);
  }
  
  /**
   * Get coding assistance
   */
  async getCodingAssistance(query) {
    return await this.codeAssistService.getCodingHelp(query);
  }
  
  /**
   * Validate codes against 3M standards
   */
  async validateCodes(codes) {
    return await this.encoderService.validateCodes(codes);
  }
}

/**
 * Encoder Service
 * 3M™ Core Grouping Software integration
 */
class EncoderService {
  constructor(connector) {
    this.connector = connector;
  }
  
  async encodeRecord(recordData) {
    const encodingRequest = this.buildEncodingRequest(recordData);
    
    const response = await this.connector.makeRequest('/encoder/encode', {
      method: 'POST',
      body: JSON.stringify(encodingRequest)
    });
    
    return this.parseEncodingResponse(response);
  }
  
  buildEncodingRequest(recordData) {
    return {
      patient: {
        age: recordData.patient_age,
        gender: recordData.patient_gender,
        admission_date: recordData.admission_date,
        discharge_date: recordData.discharge_date,
        length_of_stay: recordData.length_of_stay,
        discharge_status: recordData.discharge_status
      },
      diagnoses: recordData.diagnoses.map(diagnosis => ({
        code: diagnosis.icd10_code,
        description: diagnosis.description,
        present_on_admission: diagnosis.poa || 'U', // Unknown if not specified
        sequence: diagnosis.sequence || 1
      })),
      procedures: recordData.procedures?.map(procedure => ({
        code: procedure.icd10_pcs_code || procedure.schi_code,
        description: procedure.description,
        date: procedure.procedure_date,
        physician: procedure.physician_id
      })) || [],
      external_causes: recordData.external_causes || [],
      configuration: {
        country: 'SA', // Saudi Arabia
        drg_version: SAUDI_CONFIG.ar_drg_version,
        grouper: 'AR-DRG', // Australian Refined DRG
        nphies_compliant: true
      }
    };
  }
  
  parseEncodingResponse(response) {
    return {
      encoding_id: response.encoding_id,
      drg: {
        code: response.drg.code,
        description: response.drg.description,
        description_ar: response.drg.description_ar,
        weight: response.drg.weight,
        type: response.drg.type,
        mdc: response.drg.mdc, // Major Diagnostic Category
        severity_level: response.drg.severity_level
      },
      principal_diagnosis: response.principal_diagnosis,
      secondary_diagnoses: response.secondary_diagnoses,
      procedures: response.procedures,
      complications_comorbidities: response.cc_mcc_list,
      quality_indicators: response.quality_indicators,
      reimbursement: {
        base_rate: response.reimbursement.base_rate,
        currency: SAUDI_CONFIG.currency,
        total_amount: response.reimbursement.total_amount,
        outlier_payments: response.reimbursement.outlier_payments
      },
      validation_messages: response.messages || [],
      nphies_validation: response.nphies_validation || {}
    };
  }
  
  async validateCodes(codes) {
    const validationRequest = {
      codes: codes.map(code => ({
        value: code.value,
        type: code.type, // ICD10, SCHI, CPT
        context: code.context
      })),
      validation_level: 'comprehensive',
      saudi_specific: true,
      nphies_compliant: true
    };
    
    const response = await this.connector.makeRequest('/encoder/validate', {
      method: 'POST',
      body: JSON.stringify(validationRequest)
    });
    
    return response.results.map(result => ({
      code: result.code,
      valid: result.valid,
      confidence: result.confidence,
      suggestions: result.suggestions,
      warnings: result.warnings,
      errors: result.errors,
      saudi_compliant: result.saudi_compliant,
      nphies_valid: result.nphies_valid
    }));
  }
  
  async getCodeSuggestions(partialCode, codeType) {
    const response = await this.connector.makeRequest('/encoder/suggest', {
      method: 'GET',
      headers: {
        'X-Query-Type': 'code_completion'
      }
    }, {
      params: {
        partial: partialCode,
        type: codeType,
        limit: 10,
        saudi_context: true
      }
    });
    
    return response.suggestions.map(suggestion => ({
      code: suggestion.code,
      description: suggestion.description,
      description_ar: suggestion.description_ar,
      confidence: suggestion.confidence,
      usage_frequency: suggestion.usage_frequency,
      last_updated: suggestion.last_updated
    }));
  }
}

/**
 * DRG Service
 * Australian Refined DRG calculations for Saudi healthcare
 */
class DRGService {
  constructor(connector) {
    this.connector = connector;
  }
  
  async calculateARDRG(patientData) {
    const drgRequest = this.buildDRGRequest(patientData);
    
    const response = await this.connector.makeRequest('/drg/calculate', {
      method: 'POST',
      body: JSON.stringify(drgRequest)
    });
    
    return this.parseDRGResponse(response);
  }
  
  buildDRGRequest(patientData) {
    return {
      patient_demographics: {
        age: patientData.age,
        gender: patientData.gender,
        admission_weight: patientData.admission_weight, // Important for neonates
        birth_weight: patientData.birth_weight
      },
      admission_data: {
        admission_date: patientData.admission_date,
        discharge_date: patientData.discharge_date,
        admission_source: patientData.admission_source,
        discharge_destination: patientData.discharge_destination,
        same_day_flag: patientData.same_day_flag
      },
      clinical_data: {
        principal_diagnosis: patientData.principal_diagnosis,
        secondary_diagnoses: patientData.secondary_diagnoses || [],
        procedures: patientData.procedures || [],
        external_causes: patientData.external_causes || []
      },
      configuration: {
        drg_version: SAUDI_CONFIG.ar_drg_version,
        country_code: 'SA',
        cost_weights: 'saudi_2024', // Saudi-specific cost weights
        severity_adjustment: true,
        complexity_adjustment: true
      }
    };
  }
  
  parseDRGResponse(response) {
    return {
      drg_assignment: {
        drg_code: response.drg.code,
        drg_description: response.drg.description,
        drg_description_ar: response.drg.description_ar,
        drg_type: response.drg.type, // Medical, Surgical, Other
        mdc: response.drg.mdc,
        mdc_description: response.drg.mdc_description,
        severity_level: response.drg.severity_level // 1-4 scale
      },
      financial_data: {
        relative_weight: response.financial.relative_weight,
        base_rate_sar: response.financial.base_rate_sar,
        expected_cost_sar: response.financial.expected_cost_sar,
        outlier_threshold: response.financial.outlier_threshold,
        trim_point: response.financial.trim_point
      },
      quality_indicators: {
        length_of_stay: {
          actual: response.quality.los_actual,
          expected: response.quality.los_expected,
          outlier_status: response.quality.los_outlier
        },
        readmission_risk: response.quality.readmission_risk,
        mortality_risk: response.quality.mortality_risk
      },
      complications_comorbidities: {
        cc_count: response.cc_mcc.cc_count,
        mcc_count: response.cc_mcc.mcc_count,
        cc_list: response.cc_mcc.cc_list,
        mcc_list: response.cc_mcc.mcc_list
      },
      validation_messages: response.messages || [],
      grouper_path: response.grouper_path, // Shows decision tree path
      saudi_specific_adjustments: response.saudi_adjustments || {}
    };
  }
  
  async getDRGExplanation(drgCode) {
    const response = await this.connector.makeRequest(`/drg/explain/${drgCode}`, {
      method: 'GET',
      headers: {
        'Accept-Language': 'en,ar'
      }
    });
    
    return {
      drg_code: drgCode,
      title: response.title,
      title_ar: response.title_ar,
      description: response.description,
      description_ar: response.description_ar,
      criteria: response.criteria,
      exclusions: response.exclusions,
      typical_procedures: response.typical_procedures,
      average_los: response.average_los,
      cost_weight: response.cost_weight,
      examples: response.examples.map(example => ({
        scenario: example.scenario,
        scenario_ar: example.scenario_ar,
        codes_used: example.codes_used,
        rationale: example.rationale,
        rationale_ar: example.rationale_ar
      }))
    };
  }
  
  async compareDRGOptions(patientData, alternativeCodings) {
    const comparisons = [];
    
    // Calculate DRG for current coding
    const baseDRG = await this.calculateARDRG(patientData);
    
    // Calculate DRG for each alternative
    for (const alternative of alternativeCodings) {
      const alternativeData = { ...patientData, ...alternative };
      const alternativeDRG = await this.calculateARDRG(alternativeData);
      
      comparisons.push({
        scenario: alternative.scenario_name,
        drg_comparison: {
          base_drg: baseDRG.drg_assignment.drg_code,
          alternative_drg: alternativeDRG.drg_assignment.drg_code,
          weight_difference: alternativeDRG.financial_data.relative_weight - baseDRG.financial_data.relative_weight,
          cost_impact_sar: alternativeDRG.financial_data.expected_cost_sar - baseDRG.financial_data.expected_cost_sar
        },
        coding_changes: alternative.changes,
        recommendation: this.generateRecommendation(baseDRG, alternativeDRG)
      });
    }
    
    return {
      base_scenario: baseDRG,
      comparisons: comparisons,
      best_option: this.selectBestOption(comparisons)
    };
  }
  
  generateRecommendation(baseDRG, alternativeDRG) {
    const weightDiff = alternativeDRG.financial_data.relative_weight - baseDRG.financial_data.relative_weight;
    const costDiff = alternativeDRG.financial_data.expected_cost_sar - baseDRG.financial_data.expected_cost_sar;
    
    if (weightDiff > 0.1) {
      return {
        recommendation: 'Consider alternative coding',
        reason: `Higher DRG weight (${weightDiff.toFixed(3)}) results in increased reimbursement`,
        financial_impact: `+${costDiff.toFixed(2)} SAR`,
        confidence: 'high'
      };
    } else if (weightDiff < -0.1) {
      return {
        recommendation: 'Current coding preferred',
        reason: `Alternative results in lower DRG weight (${Math.abs(weightDiff).toFixed(3)})`,
        financial_impact: `${costDiff.toFixed(2)} SAR`,
        confidence: 'high'
      };
    } else {
      return {
        recommendation: 'Minimal difference',
        reason: 'Both coding options result in similar DRG assignment',
        financial_impact: `${Math.abs(costDiff).toFixed(2)} SAR difference`,
        confidence: 'medium'
      };
    }
  }
  
  selectBestOption(comparisons) {
    return comparisons.reduce((best, current) => {
      return current.drg_comparison.weight_difference > best.drg_comparison.weight_difference 
        ? current 
        : best;
    });
  }
}

/**
 * CodeAssist Service
 * 3M™ CodeAssist™ System integration for coding guidance
 */
class CodeAssistService {
  constructor(connector) {
    this.connector = connector;
  }
  
  async getCodingHelp(query) {
    const assistRequest = {
      query: query.text,
      query_ar: query.text_ar,
      context: query.context || 'general',
      code_systems: query.code_systems || ['ICD10AM', 'SCHI', 'CPT'],
      saudi_specific: true,
      language_preference: query.language || 'en'
    };
    
    const response = await this.connector.makeRequest('/codeassist/query', {
      method: 'POST',
      body: JSON.stringify(assistRequest)
    });
    
    return this.parseAssistResponse(response);
  }
  
  parseAssistResponse(response) {
    return {
      query_id: response.query_id,
      confidence: response.confidence,
      primary_suggestions: response.suggestions.map(suggestion => ({
        code: suggestion.code,
        description: suggestion.description,
        description_ar: suggestion.description_ar,
        code_system: suggestion.code_system,
        confidence: suggestion.confidence,
        rationale: suggestion.rationale,
        rationale_ar: suggestion.rationale_ar,
        guidelines: suggestion.applicable_guidelines,
        examples: suggestion.coding_examples
      })),
      alternative_codes: response.alternatives || [],
      related_concepts: response.related_concepts || [],
      coding_tips: response.coding_tips.map(tip => ({
        tip: tip.text,
        tip_ar: tip.text_ar,
        importance: tip.importance,
        source: tip.guideline_source
      })),
      guideline_references: response.guidelines || [],
      nphies_notes: response.nphies_specific_notes || []
    };
  }
  
  async getSequencingAdvice(diagnoses) {
    const sequencingRequest = {
      diagnoses: diagnoses.map(diagnosis => ({
        code: diagnosis.code,
        description: diagnosis.description,
        present_on_admission: diagnosis.poa,
        clinical_context: diagnosis.context
      })),
      patient_context: {
        age: diagnoses[0]?.patient_age,
        gender: diagnoses[0]?.patient_gender,
        encounter_type: diagnoses[0]?.encounter_type
      },
      saudi_guidelines: true
    };
    
    const response = await this.connector.makeRequest('/codeassist/sequencing', {
      method: 'POST',
      body: JSON.stringify(sequencingRequest)
    });
    
    return {
      recommended_sequence: response.sequence.map((item, index) => ({
        position: index + 1,
        code: item.code,
        description: item.description,
        rationale: item.rationale,
        rationale_ar: item.rationale_ar,
        confidence: item.confidence
      })),
      alternative_sequences: response.alternatives || [],
      sequencing_rules_applied: response.rules_applied,
      warnings: response.warnings || [],
      saudi_specific_considerations: response.saudi_considerations || []
    };
  }
  
  async getModifierGuidance(procedureCode, clinicalContext) {
    const modifierRequest = {
      procedure_code: procedureCode,
      clinical_context: clinicalContext,
      encounter_details: {
        setting: clinicalContext.setting,
        provider_specialty: clinicalContext.provider_specialty,
        bilateral: clinicalContext.bilateral,
        multiple_procedures: clinicalContext.multiple_procedures
      },
      saudi_billing_rules: true
    };
    
    const response = await this.connector.makeRequest('/codeassist/modifiers', {
      method: 'POST',
      body: JSON.stringify(modifierRequest)
    });
    
    return {
      applicable_modifiers: response.modifiers.map(modifier => ({
        modifier_code: modifier.code,
        description: modifier.description,
        description_ar: modifier.description_ar,
        applicability: modifier.applicability,
        reimbursement_impact: modifier.reimbursement_impact,
        usage_rules: modifier.usage_rules,
        saudi_specific: modifier.saudi_specific || false
      })),
      contraindicated_modifiers: response.contraindicated || [],
      usage_examples: response.examples || [],
      billing_notes: response.billing_notes || []
    };
  }
}

/**
 * Clinical Finder Service
 * 3M™ Clinical Data Abstraction System integration
 */
class ClinicalFinderService {
  constructor(connector) {
    this.connector = connector;
  }
  
  async findClinicalIndicators(documentText) {
    const findingRequest = {
      document_text: documentText,
      language: this.detectLanguage(documentText),
      find_types: [
        'diagnoses',
        'procedures', 
        'medications',
        'symptoms',
        'anatomical_sites',
        'temporal_indicators'
      ],
      saudi_medical_terms: true,
      arabic_support: true
    };
    
    const response = await this.connector.makeRequest('/clinical-finder/analyze', {
      method: 'POST',
      body: JSON.stringify(findingRequest)
    });
    
    return this.parseClinicalFindings(response);
  }
  
  detectLanguage(text) {
    // Simple Arabic detection
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text) ? 'ar' : 'en';
  }
  
  parseClinicalFindings(response) {
    return {
      document_id: response.document_id,
      language_detected: response.language,
      findings: {
        diagnoses: response.findings.diagnoses?.map(finding => ({
          text: finding.original_text,
          normalized_term: finding.normalized_term,
          icd10_suggestions: finding.icd10_codes,
          confidence: finding.confidence,
          position: finding.text_position,
          negation_detected: finding.negated,
          temporal_context: finding.temporal_info
        })) || [],
        procedures: response.findings.procedures?.map(finding => ({
          text: finding.original_text,
          normalized_term: finding.normalized_term,
          schi_suggestions: finding.schi_codes,
          cpt_suggestions: finding.cpt_codes,
          confidence: finding.confidence,
          position: finding.text_position,
          anatomical_site: finding.body_site
        })) || [],
        medications: response.findings.medications || [],
        symptoms: response.findings.symptoms || []
      },
      quality_metrics: {
        completeness_score: response.quality.completeness,
        specificity_score: response.quality.specificity,
        coding_potential: response.quality.coding_potential
      },
      recommendations: response.recommendations || []
    };
  }
  
  async suggestDocumentationImprovements(clinicalFindings) {
    const improvementRequest = {
      findings: clinicalFindings,
      improvement_focus: [
        'specificity',
        'completeness',
        'coding_optimization',
        'saudi_documentation_standards'
      ]
    };
    
    const response = await this.connector.makeRequest('/clinical-finder/improvements', {
      method: 'POST',
      body: JSON.stringify(improvementRequest)
    });
    
    return {
      improvement_opportunities: response.opportunities.map(opp => ({
        category: opp.category,
        current_state: opp.current,
        recommended_change: opp.recommended,
        impact: opp.impact,
        priority: opp.priority,
        examples: opp.examples
      })),
      documentation_gaps: response.gaps || [],
      coding_optimization_tips: response.coding_tips || [],
      saudi_specific_recommendations: response.saudi_recommendations || []
    };
  }
}

/**
 * Educational Service
 * 3M integration for medical coding education
 */
class EducationalService {
  constructor(connector) {
    this.connector = connector;
  }
  
  async createEducationalScenario(scenarioData) {
    const educationRequest = {
      scenario_type: scenarioData.type,
      difficulty_level: scenarioData.difficulty,
      learning_objectives: scenarioData.objectives,
      patient_profile: scenarioData.patient,
      clinical_scenario: scenarioData.clinical_data,
      target_competencies: scenarioData.competencies,
      saudi_context: true,
      bilingual_support: true
    };
    
    const response = await this.connector.makeRequest('/education/create-scenario', {
      method: 'POST',
      body: JSON.stringify(educationRequest)
    });
    
    return this.parseEducationalScenario(response);
  }
  
  parseEducationalScenario(response) {
    return {
      scenario_id: response.scenario_id,
      title: response.title,
      title_ar: response.title_ar,
      patient_story: {
        narrative: response.patient_story.narrative,
        narrative_ar: response.patient_story.narrative_ar,
        clinical_details: response.patient_story.clinical_details,
        documentation: response.patient_story.documentation
      },
      coding_challenges: response.challenges.map(challenge => ({
        challenge_type: challenge.type,
        description: challenge.description,
        description_ar: challenge.description_ar,
        hints: challenge.hints,
        expected_codes: challenge.expected_codes,
        common_mistakes: challenge.common_mistakes
      })),
      learning_resources: response.resources || [],
      assessment_criteria: response.assessment || {},
      drg_impact_analysis: response.drg_analysis || null
    };
  }
  
  async validateStudentCoding(scenarioId, studentCodes) {
    const validationRequest = {
      scenario_id: scenarioId,
      student_submission: {
        diagnosis_codes: studentCodes.diagnoses || [],
        procedure_codes: studentCodes.procedures || [],
        modifiers: studentCodes.modifiers || [],
        sequencing: studentCodes.sequence || []
      },
      validation_level: 'comprehensive',
      provide_feedback: true,
      saudi_guidelines: true
    };
    
    const response = await this.connector.makeRequest('/education/validate-coding', {
      method: 'POST',
      body: JSON.stringify(validationRequest)
    });
    
    return this.parseValidationResults(response);
  }
  
  parseValidationResults(response) {
    return {
      overall_score: response.score.overall,
      component_scores: {
        diagnosis_accuracy: response.score.diagnosis,
        procedure_accuracy: response.score.procedure,
        sequencing_accuracy: response.score.sequencing,
        modifier_usage: response.score.modifiers
      },
      detailed_feedback: response.feedback.map(item => ({
        code: item.code,
        status: item.status, // correct, incorrect, missing, unnecessary
        feedback: item.message,
        feedback_ar: item.message_ar,
        improvement_suggestion: item.suggestion,
        reference: item.guideline_reference
      })),
      drg_comparison: response.drg_analysis ? {
        student_drg: response.drg_analysis.student_result,
        expected_drg: response.drg_analysis.expected_result,
        financial_impact: response.drg_analysis.financial_difference
      } : null,
      learning_recommendations: response.recommendations || [],
      competency_assessment: response.competency_progress || {},
      next_steps: response.next_steps || []
    };
  }
  
  async getCodeLearningPath(codeType, currentLevel) {
    const pathRequest = {
      code_system: codeType, // ICD10AM, SCHI, CPT
      current_competency: currentLevel,
      target_proficiency: 'expert',
      saudi_focus: true,
      timeframe_weeks: 12
    };
    
    const response = await this.connector.makeRequest('/education/learning-path', {
      method: 'POST',
      body: JSON.stringify(pathRequest)
    });
    
    return {
      learning_path_id: response.path_id,
      estimated_duration: response.duration_weeks,
      milestones: response.milestones.map(milestone => ({
        week: milestone.week,
        title: milestone.title,
        title_ar: milestone.title_ar,
        objectives: milestone.objectives,
        activities: milestone.activities,
        assessments: milestone.assessments,
        resources: milestone.resources
      })),
      practice_scenarios: response.scenarios || [],
      progress_tracking: response.tracking_metrics || {}
    };
  }
}

/**
 * Reimbursement Service
 * Saudi-specific reimbursement calculations
 */
class ReimbursementService {
  constructor(connector) {
    this.connector = connector;
  }
  
  async calculateReimbursement(claimData) {
    const reimbursementRequest = {
      claim_data: claimData,
      payer_type: claimData.payer_type, // government, private, cash
      facility_type: claimData.facility_type,
      saudi_billing_rates: true,
      ar_drg_rates: true,
      nphies_compliant: true
    };
    
    const response = await this.connector.makeRequest('/reimbursement/calculate', {
      method: 'POST',  
      body: JSON.stringify(reimbursementRequest)
    });
    
    return {
      claim_id: response.claim_id,
      total_reimbursement_sar: response.totals.total_amount,
      breakdown: {
        base_drg_payment: response.breakdown.base_payment,
        outlier_payments: response.breakdown.outlier_payments,
        quality_adjustments: response.breakdown.quality_adjustments,
        saudi_specific_adjustments: response.breakdown.saudi_adjustments
      },
      payment_timeline: response.payment_schedule,
      potential_denials: response.denial_risks || [],
      optimization_opportunities: response.optimization || []
    };
  }
}

// Export main connector and services
export const threeMConnector = new ThreeMConnector();

// Educational Integration Helper
export class ThreeMEducationalIntegration {
  constructor(threeMConnector) {
    this.connector = threeMConnector;
  }
  
  async createComprehensiveLearningModule(moduleData) {
    // Create educational scenarios using 3M
    const scenarios = [];
    for (const scenarioData of moduleData.scenarios) {
      const scenario = await this.connector.educationalService.createEducationalScenario(scenarioData);
      scenarios.push(scenario);
    }
    
    // Generate learning paths for each competency
    const learningPaths = {};
    for (const competency of moduleData.competencies) {
      const path = await this.connector.educationalService.getCodeLearningPath(
        competency.code_system,
        competency.current_level
      );
      learningPaths[competency.id] = path;
    }
    
    return {
      module_id: moduleData.id,
      title: moduleData.title,
      scenarios: scenarios,
      learning_paths: learningPaths,
      threem_integrated: true,
      saudi_compliant: true,
      nphies_aligned: true
    };
  }
  
  async validateStudentProgress(studentId, moduleId, submissions) {
    const validationResults = [];
    
    for (const submission of submissions) {
      const validation = await this.connector.educationalService.validateStudentCoding(
        submission.scenario_id,
        submission.codes
      );
      
      validationResults.push({
        submission_id: submission.id,
        validation: validation,
        timestamp: new Date().toISOString()
      });
    }
    
    // Calculate overall progress
    const overallScore = validationResults.reduce(
      (sum, result) => sum + result.validation.overall_score, 0
    ) / validationResults.length;
    
    return {
      student_id: studentId,
      module_id: moduleId,
      overall_score: overallScore,
      individual_results: validationResults,
      competency_progress: this.calculateCompetencyProgress(validationResults),
      recommendations: this.generateStudentRecommendations(validationResults)
    };
  }
  
  calculateCompetencyProgress(validationResults) {
    const competencyScores = {};
    
    validationResults.forEach(result => {
      Object.entries(result.validation.component_scores).forEach(([competency, score]) => {
        if (!competencyScores[competency]) {
          competencyScores[competency] = [];
        }
        competencyScores[competency].push(score);
      });
    });
    
    // Calculate averages
    const competencyAverages = {};
    Object.entries(competencyScores).forEach(([competency, scores]) => {
      competencyAverages[competency] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });
    
    return competencyAverages;
  }
  
  generateStudentRecommendations(validationResults) {
    const recommendations = [];
    
    // Analyze common mistakes
    const commonErrors = {};
    validationResults.forEach(result => {
      result.validation.detailed_feedback.forEach(feedback => {
        if (feedback.status === 'incorrect') {
          const errorType = feedback.code.substring(0, 3); // Group by code prefix
          commonErrors[errorType] = (commonErrors[errorType] || 0) + 1;
        }
      });
    });
    
    // Generate recommendations based on error patterns
    Object.entries(commonErrors).forEach(([errorType, count]) => {
      if (count >= 2) {
        recommendations.push({
          type: 'focus_area',
          message: `Review coding guidelines for ${errorType} category codes`,
          priority: count >= 3 ? 'high' : 'medium',
          resources: [`3M Encoder guidance for ${errorType}`, `Saudi-specific examples for ${errorType}`]
        });
      }
    });
    
    return recommendations;
  }
}

export const threeMEducationalIntegration = new ThreeMEducationalIntegration(threeMConnector);