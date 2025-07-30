/**
 * NPHIES (National Platform for Health Information Exchange Services) Integration
 * Saudi Arabia's healthcare digital transformation cornerstone
 * Handles both Taameen (insurance) and Sehey (clinical) services
 */

import { EventEmitter } from 'events';

// NPHIES Service Types
export const NPHIES_SERVICES = {
  TAAMEEN: 'taameen', // Insurance services
  SEHEY: 'sehey',     // Clinical services
  VALIDATION: 'validation',
  BILLING: 'billing'
};

// NPHIES Standards
export const NPHIES_STANDARDS = {
  HL7_FHIR: 'R4.0.1',
  MDS_VERSION: 'v3.1',
  UCAF_DCAF: '2.0',
  ICD10_AM: 'ICD-10-AM',
  SCHI: 'Saudi Classification of Health Interventions',
  CPT_ACHI: 'CPT/ACHI'
};

// Configuration
const NPHIES_CONFIG = {
  sandbox_endpoint: process.env.NPHIES_SANDBOX_ENDPOINT || 'https://sandbox.nphies.sa/api/v1',
  production_endpoint: process.env.NPHIES_PROD_ENDPOINT || 'https://api.nphies.sa/v1',
  client_id: process.env.NPHIES_CLIENT_ID,
  client_secret: process.env.NPHIES_CLIENT_SECRET,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  timeout: 30000,
  retry_attempts: 3
};

/**
 * NPHIES Integration Connector
 * Main interface for NPHIES platform integration
 */
export class NPHIESConnector extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...NPHIES_CONFIG, ...config };
    this.accessToken = null;
    this.tokenExpiry = null;
    this.authenticated = false;
    
    // Service connectors
    this.taameenService = new TaameenService(this);
    this.seheyService = new SeheyService(this);
    this.validationService = new ValidationService(this);
    this.billingService = new BillingService(this);
  }
  
  get baseURL() {
    return this.config.environment === 'production' 
      ? this.config.production_endpoint 
      : this.config.sandbox_endpoint;
  }
  
  /**
   * Authenticate with NPHIES using OAuth2
   */
  async authenticate() {
    try {
      const response = await fetch(`${this.baseURL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.client_id,
          client_secret: this.config.client_secret,
          scope: 'taameen.read taameen.write sehey.read sehey.write validation.execute'
        })
      });
      
      if (!response.ok) {
        throw new Error(`NPHIES authentication failed: ${response.status} ${response.statusText}`);
      }
      
      const auth = await response.json();
      this.accessToken = auth.access_token;
      this.tokenExpiry = Date.now() + (auth.expires_in * 1000);
      this.authenticated = true;
      
      this.emit('authenticated', {
        token_type: auth.token_type,
        expires_in: auth.expires_in
      });
      
      return true;
    } catch (error) {
      this.emit('auth_error', { error: error.message });
      throw error;
    }
  }
  
  /**
   * Check if token is valid and refresh if needed
   */
  async ensureAuthenticated() {
    if (!this.authenticated || Date.now() >= this.tokenExpiry - 60000) { // Refresh 1 minute before expiry
      await this.authenticate();
    }
  }
  
  /**
   * Make authenticated request to NPHIES API
   */
  async makeRequest(endpoint, options = {}) {
    await this.ensureAuthenticated();
    
    const config = {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json',
        'X-NPHIES-Version': NPHIES_STANDARDS.HL7_FHIR,
        ...options.headers
      },
      timeout: this.config.timeout,
      ...options
    };
    
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`NPHIES API Error: ${response.status} - ${errorData}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      this.emit('api_error', { endpoint, error: error.message });
      throw error;
    }
  }
  
  /**
   * Validate FHIR resource against NPHIES standards
   */
  async validateFHIRResource(resource, resourceType) {
    return await this.validationService.validateResource(resource, resourceType);
  }
  
  /**
   * Submit claim to NPHIES
   */
  async submitClaim(claimData) {
    return await this.billingService.submitClaim(claimData);
  }
  
  /**
   * Check eligibility through Taameen
   */
  async checkEligibility(patientData) {
    return await this.taameenService.checkEligibility(patientData);
  }
  
  /**
   * Submit clinical data through Sehey
   */
  async submitClinicalData(clinicalData) {
    return await this.seheyService.submitClinicalData(clinicalData);
  }
}

/**
 * Taameen Service - Insurance Services
 */
class TaameenService {
  constructor(connector) {
    this.connector = connector;
  }
  
  async checkEligibility(patientData) {
    const eligibilityRequest = this.buildEligibilityRequest(patientData);
    
    const response = await this.connector.makeRequest('/taameen/eligibility', {
      method: 'POST',
      body: JSON.stringify(eligibilityRequest)
    });
    
    return this.parseEligibilityResponse(response);
  }
  
  buildEligibilityRequest(patientData) {
    return {
      resourceType: 'CoverageEligibilityRequest',
      id: `eligibility-${Date.now()}`,
      status: 'active',
      purpose: ['validation'],
      patient: {
        reference: `Patient/${patientData.id}`,
        identifier: {
          system: 'https://nphies.sa/identifier/patient-id',
          value: patientData.nphies_id || patientData.national_id
        }
      },
      insurer: {
        reference: `Organization/${patientData.insurance_company_id}`
      },
      insurance: [{
        focal: true,
        coverage: {
          reference: `Coverage/${patientData.policy_number}`
        }
      }],
      created: new Date().toISOString()
    };
  }
  
  parseEligibilityResponse(response) {
    return {
      eligible: response.outcome === 'complete',
      coverage_details: response.insurance?.[0]?.item || [],
      benefits: response.insurance?.[0]?.benefitBalance || [],
      errors: response.error || []
    };
  }
  
  async submitPreauthorization(serviceData) {
    const preAuthRequest = this.buildPreAuthRequest(serviceData);
    
    return await this.connector.makeRequest('/taameen/preauthorization', {
      method: 'POST',
      body: JSON.stringify(preAuthRequest)
    });
  }
  
  buildPreAuthRequest(serviceData) {
    return {
      resourceType: 'CoverageEligibilityRequest',
      id: `preauth-${Date.now()}`,
      status: 'active',
      purpose: ['auth-requirements'],
      patient: {
        reference: `Patient/${serviceData.patient_id}`
      },
      servicedDate: serviceData.service_date,
      item: serviceData.services.map(service => ({
        category: {
          coding: [{
            system: 'https://nphies.sa/terminology/benefit-category',
            code: service.category
          }]
        },
        productOrService: {
          coding: [{
            system: service.coding_system, // ICD-10-AM, SCHI, CPT
            code: service.code,
            display: service.description
          }]
        },
        quantity: {
          value: service.quantity || 1
        }
      }))
    };
  }
}

/**
 * Sehey Service - Clinical Services
 */
class SeheyService {
  constructor(connector) {
    this.connector = connector;
  }
  
  async submitClinicalData(clinicalData) {
    const bundle = this.buildClinicalBundle(clinicalData);
    
    const response = await this.connector.makeRequest('/sehey/clinical-data', {
      method: 'POST',
      body: JSON.stringify(bundle)
    });
    
    return this.parseClinicalResponse(response);
  }
  
  buildClinicalBundle(clinicalData) {
    const bundle = {
      resourceType: 'Bundle',
      id: `clinical-${Date.now()}`,
      type: 'transaction',
      entry: []
    };
    
    // Add Patient resource
    if (clinicalData.patient) {
      bundle.entry.push({
        resource: this.buildPatientResource(clinicalData.patient),
        request: {
          method: 'PUT',
          url: `Patient/${clinicalData.patient.id}`
        }
      });
    }
    
    // Add Encounter resource
    if (clinicalData.encounter) {
      bundle.entry.push({
        resource: this.buildEncounterResource(clinicalData.encounter),
        request: {
          method: 'POST',
          url: 'Encounter'
        }
      });
    }
    
    // Add Condition resources (Diagnoses with ICD-10-AM)
    if (clinicalData.diagnoses) {
      clinicalData.diagnoses.forEach(diagnosis => {
        bundle.entry.push({
          resource: this.buildConditionResource(diagnosis),
          request: {
            method: 'POST',
            url: 'Condition'
          }
        });
      });
    }
    
    // Add Procedure resources (with SCHI codes)
    if (clinicalData.procedures) {
      clinicalData.procedures.forEach(procedure => {
        bundle.entry.push({
          resource: this.buildProcedureResource(procedure),
          request: {
            method: 'POST',
            url: 'Procedure'
          }
        });
      });
    }
    
    return bundle;
  }
  
  buildPatientResource(patientData) {
    return {
      resourceType: 'Patient',
      id: patientData.id,
      identifier: [{
        system: 'https://nphies.sa/identifier/national-id',
        value: patientData.national_id
      }],
      name: [{
        use: 'official',
        family: patientData.family_name,
        given: [patientData.given_name],
        extension: [{
          url: 'https://nphies.sa/fhir/StructureDefinition/extension-name-arabic',
          valueString: `${patientData.given_name_ar} ${patientData.family_name_ar}`
        }]
      }],
      gender: patientData.gender,
      birthDate: patientData.birth_date,
      address: [{
        use: 'home',
        city: patientData.city,
        state: patientData.region,
        country: 'SA'
      }]
    };
  }
  
  buildConditionResource(diagnosis) {
    return {
      resourceType: 'Condition',
      id: `condition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      clinicalStatus: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: 'active'
        }]
      },
      code: {
        coding: [{
          system: 'https://nphies.sa/terminology/CodeSystem/icd-10-am',
          code: diagnosis.icd10_code,
          display: diagnosis.description
        }]
      },
      subject: {
        reference: `Patient/${diagnosis.patient_id}`
      },
      encounter: {
        reference: `Encounter/${diagnosis.encounter_id}`
      },
      onsetDateTime: diagnosis.onset_date,
      category: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-category',
          code: diagnosis.category || 'encounter-diagnosis'
        }]
      }]
    };
  }
  
  buildProcedureResource(procedure) {
    return {
      resourceType: 'Procedure',
      id: `procedure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'completed',
      code: {
        coding: [{
          system: 'https://nphies.sa/terminology/CodeSystem/schi',
          code: procedure.schi_code,
          display: procedure.description
        }]
      },
      subject: {
        reference: `Patient/${procedure.patient_id}`
      },
      encounter: {
        reference: `Encounter/${procedure.encounter_id}`
      },
      performedDateTime: procedure.performed_date,
      bodySite: procedure.body_site ? [{
        coding: [{
          system: 'http://snomed.info/sct',
          code: procedure.body_site.code,
          display: procedure.body_site.display
        }]
      }] : undefined
    };
  }
  
  parseClinicalResponse(response) {
    const results = {
      success: response.resourceType === 'Bundle',
      bundle_id: response.id,
      entries_processed: 0,
      errors: [],
      warnings: []
    };
    
    if (response.entry) {
      response.entry.forEach(entry => {
        if (entry.response) {
          results.entries_processed++;
          
          if (entry.response.status.startsWith('2')) {
            // Success
          } else {
            results.errors.push({
              resource: entry.resource?.resourceType,
              status: entry.response.status,
              outcome: entry.response.outcome
            });
          }
        }
      });
    }
    
    return results;
  }
}

/**
 * Validation Service - NPHIES Compliance Validation
 */
class ValidationService {
  constructor(connector) {
    this.connector = connector;
    this.mdsRequirements = this.loadMDSRequirements();
  }
  
  loadMDSRequirements() {
    // Minimum Data Set v3.1 requirements
    return {
      Patient: {
        required: ['identifier', 'name', 'gender', 'birthDate'],
        conditional: ['address', 'telecom']
      },
      Encounter: {
        required: ['status', 'class', 'subject', 'period'],
        conditional: ['diagnosis', 'hospitalization']
      },
      Condition: {
        required: ['clinicalStatus', 'code', 'subject'],
        conditional: ['encounter', 'onsetDateTime']
      },
      Procedure: {
        required: ['status', 'code', 'subject'],
        conditional: ['encounter', 'performedDateTime']
      },
      Claim: {
        required: ['status', 'type', 'use', 'patient', 'created', 'provider', 'priority', 'insurance'],
        conditional: ['diagnosis', 'procedure', 'item']
      }
    };
  }
  
  async validateResource(resource, resourceType) {
    const validationResult = {
      valid: true,
      errors: [],
      warnings: [],
      mds_compliant: true
    };
    
    // MDS Validation
    const mdsValidation = this.validateMDS(resource, resourceType);
    validationResult.mds_compliant = mdsValidation.compliant;
    validationResult.errors.push(...mdsValidation.errors);
    validationResult.warnings.push(...mdsValidation.warnings);
    
    // FHIR Structure Validation
    const fhirValidation = await this.validateFHIRStructure(resource, resourceType);
    validationResult.valid = validationResult.valid && fhirValidation.valid;
    validationResult.errors.push(...fhirValidation.errors);
    
    // Code System Validation
    const codeValidation = await this.validateCodeSystems(resource, resourceType);
    validationResult.valid = validationResult.valid && codeValidation.valid;
    validationResult.errors.push(...codeValidation.errors);
    
    return validationResult;
  }
  
  validateMDS(resource, resourceType) {
    const requirements = this.mdsRequirements[resourceType];
    const result = {
      compliant: true,
      errors: [],
      warnings: []
    };
    
    if (!requirements) {
      result.warnings.push(`No MDS requirements defined for ${resourceType}`);
      return result;
    }
    
    // Check required fields
    requirements.required.forEach(field => {
      if (!this.hasField(resource, field)) {
        result.compliant = false;
        result.errors.push(`Required MDS field missing: ${field}`);
      }
    });
    
    // Check conditional fields
    requirements.conditional.forEach(field => {
      if (!this.hasField(resource, field)) {
        result.warnings.push(`Conditional MDS field missing: ${field}`);
      }
    });
    
    return result;
  }
  
  hasField(obj, fieldPath) {
    const fields = fieldPath.split('.');
    let current = obj;
    
    for (const field of fields) {
      if (!current || !current.hasOwnProperty(field)) {
        return false;
      }
      current = current[field];
    }
    
    return current !== null && current !== undefined;
  }
  
  async validateFHIRStructure(resource, resourceType) {
    try {
      const response = await this.connector.makeRequest('/validation/fhir-structure', {
        method: 'POST',
        body: JSON.stringify({
          resource: resource,
          resourceType: resourceType,
          profile: `https://nphies.sa/fhir/StructureDefinition/${resourceType}`
        })
      });
      
      return {
        valid: response.issue?.length === 0,
        errors: response.issue?.filter(i => i.severity === 'error').map(i => i.diagnostics) || []
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`FHIR validation failed: ${error.message}`]
      };
    }
  }
  
  async validateCodeSystems(resource, resourceType) {
    const result = {
      valid: true,
      errors: []
    };
    
    // Validate coding systems based on resource type
    if (resourceType === 'Condition' && resource.code?.coding) {
      const icd10Validation = await this.validateICD10AM(resource.code.coding);
      if (!icd10Validation.valid) {
        result.valid = false;
        result.errors.push(...icd10Validation.errors);
      }
    }
    
    if (resourceType === 'Procedure' && resource.code?.coding) {
      const schiValidation = await this.validateSCHI(resource.code.coding);
      if (!schiValidation.valid) {
        result.valid = false;
        result.errors.push(...schiValidation.errors);
      }
    }
    
    return result;
  }
  
  async validateICD10AM(codings) {
    const icd10Codings = codings.filter(c => 
      c.system === 'https://nphies.sa/terminology/CodeSystem/icd-10-am'
    );
    
    if (icd10Codings.length === 0) {
      return { valid: false, errors: ['ICD-10-AM coding required for diagnosis'] };
    }
    
    // Validate each ICD-10-AM code
    for (const coding of icd10Codings) {
      if (!this.isValidICD10AMFormat(coding.code)) {
        return { 
          valid: false, 
          errors: [`Invalid ICD-10-AM code format: ${coding.code}`] 
        };
      }
    }
    
    return { valid: true, errors: [] };
  }
  
  async validateSCHI(codings) {
    const schiCodings = codings.filter(c => 
      c.system === 'https://nphies.sa/terminology/CodeSystem/schi'
    );
    
    if (schiCodings.length === 0) {
      return { valid: false, errors: ['SCHI coding required for procedures'] };
    }
    
    // Validate each SCHI code
    for (const coding of schiCodings) {
      if (!this.isValidSCHIFormat(coding.code)) {
        return { 
          valid: false, 
          errors: [`Invalid SCHI code format: ${coding.code}`] 
        };
      }
    }
    
    return { valid: true, errors: [] };
  }
  
  isValidICD10AMFormat(code) {
    // ICD-10-AM format: Letter followed by 2 digits, optional decimal and up to 3 more digits
    return /^[A-Z]\d{2}(\.\d{1,3})?$/.test(code);
  }
  
  isValidSCHIFormat(code) {
    // SCHI format: SCHI- followed by 4-6 digits
    return /^SCHI-\d{4,6}$/.test(code);
  }
}

/**
 * Billing Service - Claims and Billing
 */
class BillingService {
  constructor(connector) {
    this.connector = connector;
  }
  
  async submitClaim(claimData) {
    const claimResource = this.buildClaimResource(claimData);
    
    const response = await this.connector.makeRequest('/billing/claim', {
      method: 'POST',
      body: JSON.stringify(claimResource)
    });
    
    return this.parseClaimResponse(response);
  }
  
  buildClaimResource(claimData) {
    return {
      resourceType: 'Claim',
      id: `claim-${Date.now()}`,
      status: 'active',
      type: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/claim-type',
          code: claimData.type || 'institutional'
        }]
      },
      use: 'claim',
      patient: {
        reference: `Patient/${claimData.patient_id}`
      },
      created: new Date().toISOString(),
      provider: {
        reference: `Organization/${claimData.provider_id}`
      },
      priority: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/processpriority',
          code: claimData.priority || 'normal'
        }]
      },
      insurance: [{
        sequence: 1,
        focal: true,
        coverage: {
          reference: `Coverage/${claimData.coverage_id}`
        }
      }],
      diagnosis: claimData.diagnoses?.map((diagnosis, index) => ({
        sequence: index + 1,
        diagnosisCodeableConcept: {
          coding: [{
            system: 'https://nphies.sa/terminology/CodeSystem/icd-10-am',
            code: diagnosis.code,
            display: diagnosis.description
          }]
        },
        type: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/ex-diagnosistype',
            code: diagnosis.type || 'principal'
          }]
        }]
      })) || [],
      procedure: claimData.procedures?.map((procedure, index) => ({
        sequence: index + 1,
        date: procedure.date,
        procedureCodeableConcept: {
          coding: [{
            system: 'https://nphies.sa/terminology/CodeSystem/schi',
            code: procedure.code,
            display: procedure.description
          }]
        }
      })) || [],
      item: claimData.items?.map((item, index) => ({
        sequence: index + 1,
        productOrService: {
          coding: [{
            system: item.coding_system,
            code: item.code,
            display: item.description
          }]
        },
        quantity: {
          value: item.quantity || 1
        },
        unitPrice: {
          value: item.unit_price,
          currency: 'SAR'
        },
        net: {
          value: (item.quantity || 1) * item.unit_price,
          currency: 'SAR'
        }
      })) || []
    };
  }
  
  parseClaimResponse(response) {
    return {
      claim_id: response.id,
      status: response.status,
      outcome: response.outcome,
      adjudication: response.item?.map(item => ({
        sequence: item.sequence,
        adjudication: item.adjudication
      })) || [],
      total: response.total,
      errors: response.error || []
    };
  }
  
  async getClaimStatus(claimId) {
    const response = await this.connector.makeRequest(`/billing/claim/${claimId}/status`);
    
    return {
      claim_id: claimId,
      status: response.status,
      last_updated: response.meta?.lastUpdated,
      outcome: response.outcome,
      payment_status: response.payment?.status
    };
  }
}

// Export singleton instance
export const nphiesConnector = new NPHIESConnector();

// Educational Integration Helper
export class NPHIESEducationalIntegration {
  constructor(nphiesConnector) {
    this.connector = nphiesConnector;
  }
  
  /**
   * Create educational scenario for students
   */
  async createEducationalScenario(scenarioData) {
    // Generate synthetic patient data compliant with NPHIES
    const syntheticPatient = this.generateSyntheticPatient(scenarioData);
    
    // Create FHIR-compliant resources for practice
    const practiceBundle = await this.createPracticeBundle(syntheticPatient, scenarioData);
    
    // Validate against NPHIES standards
    const validation = await this.connector.validateFHIRResource(practiceBundle, 'Bundle');
    
    return {
      scenario_id: `edu-${Date.now()}`,
      patient: syntheticPatient,
      practice_bundle: practiceBundle,
      validation_results: validation,
      learning_objectives: scenarioData.learning_objectives,
      expected_codes: scenarioData.expected_codes
    };
  }
  
  generateSyntheticPatient(scenarioData) {
    return {
      id: `synthetic-${Date.now()}`,
      national_id: `2${Math.random().toString().substr(2, 9)}`, // Synthetic ID starting with 2
      given_name: scenarioData.patient_name || 'Patient',
      family_name: scenarioData.patient_family || 'Synthetic',
      given_name_ar: scenarioData.patient_name_ar || 'مريض',
      family_name_ar: scenarioData.patient_family_ar || 'وهمي',
      gender: scenarioData.gender || 'unknown',
      birth_date: scenarioData.birth_date || '1980-01-01',
      city: scenarioData.city || 'Riyadh',
      region: scenarioData.region || 'Riyadh Province'
    };
  }
  
  async createPracticeBundle(patient, scenarioData) {
    const bundle = {
      resourceType: 'Bundle',
      id: `practice-${Date.now()}`,
      type: 'collection',
      entry: []
    };
    
    // Add patient
    bundle.entry.push({
      resource: {
        resourceType: 'Patient',
        id: patient.id,
        identifier: [{
          system: 'https://nphies.sa/identifier/national-id',
          value: patient.national_id
        }],
        name: [{
          use: 'official',
          family: patient.family_name,
          given: [patient.given_name]
        }],
        gender: patient.gender,
        birthDate: patient.birth_date
      }
    });
    
    // Add encounter
    if (scenarioData.encounter) {
      bundle.entry.push({
        resource: {
          resourceType: 'Encounter',
          id: `encounter-${Date.now()}`,
          status: 'finished',
          class: {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: scenarioData.encounter.type
          },
          subject: {
            reference: `Patient/${patient.id}`
          },
          period: {
            start: scenarioData.encounter.start,
            end: scenarioData.encounter.end
          }
        }
      });
    }
    
    return bundle;
  }
  
  /**
   * Validate student coding submission against NPHIES standards
   */
  async validateStudentSubmission(submissionData) {
    const validationResults = {
      overall_score: 0,
      nphies_compliant: false,
      detailed_feedback: []
    };
    
    // Validate each coded element
    if (submissionData.diagnoses) {
      for (const diagnosis of submissionData.diagnoses) {
        const validation = await this.connector.validationService.validateICD10AM([{
          system: 'https://nphies.sa/terminology/CodeSystem/icd-10-am',
          code: diagnosis.code
        }]);
        
        validationResults.detailed_feedback.push({
          element: 'diagnosis',
          code: diagnosis.code,
          valid: validation.valid,
          errors: validation.errors
        });
      }
    }
    
    if (submissionData.procedures) {
      for (const procedure of submissionData.procedures) {
        const validation = await this.connector.validationService.validateSCHI([{
          system: 'https://nphies.sa/terminology/CodeSystem/schi',
          code: procedure.code
        }]);
        
        validationResults.detailed_feedback.push({
          element: 'procedure',
          code: procedure.code,
          valid: validation.valid,
          errors: validation.errors
        });
      }
    }
    
    // Calculate overall score
    const totalElements = validationResults.detailed_feedback.length;
    const validElements = validationResults.detailed_feedback.filter(f => f.valid).length;
    validationResults.overall_score = totalElements > 0 ? validElements / totalElements : 0;
    validationResults.nphies_compliant = validationResults.overall_score >= 0.95;
    
    return validationResults;
  }
}

export const nphiesEducationalIntegration = new NPHIESEducationalIntegration(nphiesConnector);