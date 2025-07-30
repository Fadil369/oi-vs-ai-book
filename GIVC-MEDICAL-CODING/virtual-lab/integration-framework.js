/**
 * Virtual Lab Integration Framework
 * Integrates with EHR systems (MEDITECH, Epic, Oracle Health) and coding platforms
 * Provides sandbox environment for medical coding practice
 */

import { EventEmitter } from 'events';

// EHR System Types
export const EHR_SYSTEMS = {
  MEDITECH_EXPANSE: 'meditech_expanse',
  EPIC_SANDBOX: 'epic_sandbox',
  ORACLE_HEALTH: 'oracle_health',
  INTERNAL_SIMULATOR: 'internal_simulator'
};

// Lab Session States
export const LAB_STATES = {
  INITIALIZING: 'initializing',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ERROR: 'error'
};

// Integration Configuration
const INTEGRATION_CONFIG = {
  meditech_expanse: {
    api_endpoint: process.env.MEDITECH_API_ENDPOINT || 'https://sandbox.meditech.com/api/v1',
    auth_type: 'oauth2',
    sandbox_mode: true,
    timeout: 30000,
    features: ['patient_lookup', 'encounter_coding', 'documentation_review']
  },
  epic_sandbox: {
    api_endpoint: process.env.EPIC_SANDBOX_ENDPOINT || 'https://fhir.epic.com/interconnect-fhir-oauth',
    auth_type: 'fhir_oauth',
    sandbox_mode: true,
    timeout: 25000,
    features: ['fhir_resources', 'clinical_data', 'coding_validation']
  },
  oracle_health: {
    api_endpoint: process.env.ORACLE_HEALTH_ENDPOINT || 'https://sandbox.oracle.com/health/api',
    auth_type: 'api_key',
    sandbox_mode: true,
    timeout: 20000,
    features: ['hl7_integration', 'clinical_decision_support', 'revenue_cycle']
  },
  solventum_encoder: {
    api_endpoint: process.env.SOLVENTUM_API_ENDPOINT || 'https://api.solventum.com/encoder/v2',
    auth_type: 'api_key',
    sandbox_mode: true,
    timeout: 15000,
    features: ['code_validation', 'drg_calculation', 'reimbursement_analysis']
  }
};

/**
 * Virtual Lab Session Manager
 * Manages individual lab sessions with EHR integrations
 */
export class VirtualLabSession extends EventEmitter {
  constructor(config) {
    super();
    this.sessionId = config.sessionId || this.generateSessionId();
    this.studentId = config.studentId;
    this.instructorId = config.instructorId;
    this.labType = config.labType;
    this.ehrSystem = config.ehrSystem || EHR_SYSTEMS.INTERNAL_SIMULATOR;
    this.state = LAB_STATES.INITIALIZING;
    
    // Session data
    this.startTime = new Date();
    this.endTime = null;
    this.sessionData = {
      actions: [],
      codes_entered: [],
      performance_metrics: {},
      screenshots: [],
      audio_recordings: []
    };
    
    // EHR Integration
    this.ehrConnector = null;
    this.currentPatient = null;
    this.currentEncounter = null;
    
    // Performance tracking
    this.performanceTracker = new PerformanceTracker();
    
    this.initialize();
  }
  
  generateSessionId() {
    return `lab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  async initialize() {
    try {
      this.emit('session_initializing', { sessionId: this.sessionId });
      
      // Initialize EHR connector
      await this.initializeEHRConnector();
      
      // Load lab scenario
      await this.loadLabScenario();
      
      // Setup monitoring
      this.setupPerformanceMonitoring();
      
      this.state = LAB_STATES.ACTIVE;
      this.emit('session_started', {
        sessionId: this.sessionId,
        ehrSystem: this.ehrSystem,
        labType: this.labType
      });
      
    } catch (error) {
      this.state = LAB_STATES.ERROR;
      this.emit('session_error', { error: error.message });
      throw error;
    }
  }
  
  async initializeEHRConnector() {
    const config = INTEGRATION_CONFIG[this.ehrSystem];
    if (!config) {
      throw new Error(`Unsupported EHR system: ${this.ehrSystem}`);
    }
    
    switch (this.ehrSystem) {
      case EHR_SYSTEMS.MEDITECH_EXPANSE:
        this.ehrConnector = new MeditechExpanseConnector(config);
        break;
      case EHR_SYSTEMS.EPIC_SANDBOX:
        this.ehrConnector = new EpicSandboxConnector(config);
        break;
      case EHR_SYSTEMS.ORACLE_HEALTH:
        this.ehrConnector = new OracleHealthConnector(config);
        break;
      default:
        this.ehrConnector = new InternalSimulatorConnector(config);
    }
    
    await this.ehrConnector.authenticate();
    this.emit('ehr_connected', { system: this.ehrSystem });
  }
  
  async loadLabScenario() {
    // Load patient scenario based on lab type
    const scenario = await this.getLabScenario(this.labType);
    
    if (scenario.patient_data) {
      this.currentPatient = await this.ehrConnector.loadPatient(scenario.patient_data);
    }
    
    if (scenario.encounter_data) {
      this.currentEncounter = await this.ehrConnector.createEncounter(scenario.encounter_data);
    }
    
    this.emit('scenario_loaded', {
      patient: this.currentPatient?.id,
      encounter: this.currentEncounter?.id
    });
  }
  
  async getLabScenario(labType) {
    // In practice, this would load from a database of scenarios
    const scenarios = {
      'ehr_navigation': {
        title: 'EHR Navigation and Patient Lookup',
        patient_data: {
          id: 'PT001',
          name: 'John Doe',
          dob: '1975-03-15',
          mrn: 'MRN123456'
        },
        learning_objectives: [
          'Navigate EHR interface efficiently',
          'Locate patient information',
          'Access clinical documentation'
        ]
      },
      'inpatient_coding': {
        title: 'Inpatient Coding Scenario',
        patient_data: {
          id: 'PT002',
          name: 'Jane Smith',
          dob: '1968-07-22',
          mrn: 'MRN789012',
          admission_diagnosis: 'Chest pain',
          procedures: ['Cardiac catheterization', 'Angioplasty']
        },
        encounter_data: {
          type: 'inpatient',
          admission_date: '2024-01-15',
          discharge_date: '2024-01-18',
          primary_diagnosis: 'I21.9',
          procedures: ['02703ZZ', '02713ZZ']
        },
        learning_objectives: [
          'Code complex inpatient scenarios',
          'Apply ICD-10-PCS guidelines',
          'Calculate DRG assignments'
        ]
      },
      'outpatient_em': {
        title: 'Outpatient E/M Coding',
        patient_data: {
          id: 'PT003',
          name: 'Ahmed Al-Rashid',
          dob: '1982-11-08',
          mrn: 'MRN345678'
        },
        encounter_data: {
          type: 'outpatient',
          visit_date: '2024-01-20',
          chief_complaint: 'Follow-up diabetes management',
          examination_level: 'detailed',
          mdm_complexity: 'moderate'
        },
        learning_objectives: [
          'Determine appropriate E/M level',
          'Apply 2021 E/M guidelines',
          'Document medical decision making'
        ]
      }
    };
    
    return scenarios[labType] || scenarios['ehr_navigation'];
  }
  
  setupPerformanceMonitoring() {
    // Track user actions
    this.on('user_action', (action) => {
      this.sessionData.actions.push({
        timestamp: new Date(),
        action: action.type,
        details: action.details,
        response_time: action.response_time
      });
      
      this.performanceTracker.recordAction(action);
    });
    
    // Track coding entries
    this.on('code_entered', (code) => {
      this.sessionData.codes_entered.push({
        timestamp: new Date(),
        code: code.value,
        type: code.type,
        context: code.context,
        time_to_enter: code.time_to_enter
      });
      
      this.performanceTracker.recordCode(code);
    });
  }
  
  // Student Actions
  async lookupPatient(criteria) {
    this.emit('user_action', {
      type: 'patient_lookup',
      details: criteria,
      response_time: Date.now()
    });
    
    try {
      const patient = await this.ehrConnector.searchPatient(criteria);
      this.currentPatient = patient;
      
      return {
        success: true,
        patient: patient,
        message: 'Patient found successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async accessClinicalData(dataType) {
    this.emit('user_action', {
      type: 'clinical_data_access',
      details: { dataType, patientId: this.currentPatient?.id },
      response_time: Date.now()
    });
    
    try {
      const data = await this.ehrConnector.getClinicalData(
        this.currentPatient.id,
        dataType
      );
      
      return {
        success: true,
        data: data,
        message: `${dataType} data retrieved`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async enterCode(codeData) {
    const startTime = Date.now();
    
    try {
      // Validate code format
      const validation = await this.validateCode(codeData);
      
      this.emit('code_entered', {
        value: codeData.code,
        type: codeData.type,
        context: codeData.context,
        time_to_enter: Date.now() - startTime,
        validation: validation
      });
      
      return {
        success: true,
        validation: validation,
        message: 'Code entered successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async validateCode(codeData) {
    // Integration with Solventum encoder or internal validation
    if (INTEGRATION_CONFIG.solventum_encoder) {
      return await this.validateWithSolventum(codeData);
    }
    
    return await this.validateInternally(codeData);
  }
  
  async validateWithSolventum(codeData) {
    try {
      const response = await fetch(`${INTEGRATION_CONFIG.solventum_encoder.api_endpoint}/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SOLVENTUM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: codeData.code,
          type: codeData.type,
          context: codeData.context
        })
      });
      
      const result = await response.json();
      
      return {
        valid: result.valid,
        accuracy: result.accuracy,
        suggestions: result.suggestions,
        reimbursement_impact: result.reimbursement_impact
      };
    } catch (error) {
      console.error('Solventum validation error:', error);
      return await this.validateInternally(codeData);
    }
  }
  
  async validateInternally(codeData) {
    // Basic internal validation
    const codePatterns = {
      'ICD10': /^[A-Z]\d{2}(\.\d{1,3})?$/,
      'CPT': /^\d{5}$/,
      'HCPCS': /^[A-Z]\d{4}$/,
      'SCHI': /^SCHI-\d{4,6}$/
    };
    
    const pattern = codePatterns[codeData.type];
    const valid = pattern ? pattern.test(codeData.code) : false;
    
    return {
      valid: valid,
      accuracy: valid ? 0.95 : 0.0,
      suggestions: valid ? [] : [`Check ${codeData.type} format`],
      source: 'internal_validation'
    };
  }
  
  async completeSession() {
    try {
      this.endTime = new Date();
      this.state = LAB_STATES.COMPLETED;
      
      // Calculate final performance metrics
      const performanceResults = this.performanceTracker.calculateResults();
      
      // Generate session report
      const sessionReport = {
        sessionId: this.sessionId,
        studentId: this.studentId,
        labType: this.labType,
        ehrSystem: this.ehrSystem,
        duration: this.endTime - this.startTime,
        performance: performanceResults,
        actions_count: this.sessionData.actions.length,
        codes_entered: this.sessionData.codes_entered.length,
        accuracy_score: performanceResults.coding_accuracy,
        efficiency_score: performanceResults.efficiency_score,
        completed_at: this.endTime
      };
      
      this.emit('session_completed', sessionReport);
      
      // Cleanup EHR connection
      await this.ehrConnector.disconnect();
      
      return sessionReport;
    } catch (error) {
      this.state = LAB_STATES.ERROR;
      this.emit('session_error', { error: error.message });
      throw error;
    }
  }
  
  pause() {
    this.state = LAB_STATES.PAUSED;
    this.emit('session_paused', { sessionId: this.sessionId });
  }
  
  resume() {
    this.state = LAB_STATES.ACTIVE;
    this.emit('session_resumed', { sessionId: this.sessionId });
  }
}

/**
 * Performance Tracker
 * Tracks and analyzes student performance in virtual labs
 */
class PerformanceTracker {
  constructor() {
    this.actions = [];
    this.codes = [];
    this.startTime = Date.now();
  }
  
  recordAction(action) {
    this.actions.push({
      ...action,
      timestamp: Date.now() - this.startTime
    });
  }
  
  recordCode(code) {
    this.codes.push({
      ...code,
      timestamp: Date.now() - this.startTime
    });
  }
  
  calculateResults() {
    const totalTime = Date.now() - this.startTime;
    
    // Calculate coding accuracy
    const validCodes = this.codes.filter(c => c.validation?.valid).length;
    const codingAccuracy = this.codes.length > 0 ? validCodes / this.codes.length : 0;
    
    // Calculate efficiency (actions per minute)
    const efficiency = (this.actions.length / (totalTime / 60000));
    
    // Calculate average response time
    const avgResponseTime = this.actions.length > 0 
      ? this.actions.reduce((sum, a) => sum + (a.response_time || 0), 0) / this.actions.length
      : 0;
    
    return {
      coding_accuracy: codingAccuracy,
      efficiency_score: Math.min(efficiency / 10, 1.0), // Normalize to 0-1
      average_response_time: avgResponseTime,
      total_actions: this.actions.length,
      total_codes: this.codes.length,
      session_duration: totalTime
    };
  }
}

/**
 * EHR Connector Base Class
 */
class EHRConnector {
  constructor(config) {
    this.config = config;
    this.authenticated = false;
  }
  
  async authenticate() {
    throw new Error('authenticate() must be implemented by subclass');
  }
  
  async searchPatient(criteria) {
    throw new Error('searchPatient() must be implemented by subclass');
  }
  
  async loadPatient(patientData) {
    throw new Error('loadPatient() must be implemented by subclass');
  }
  
  async getClinicalData(patientId, dataType) {
    throw new Error('getClinicalData() must be implemented by subclass');
  }
  
  async createEncounter(encounterData) {
    throw new Error('createEncounter() must be implemented by subclass');
  }
  
  async disconnect() {
    return true;
  }
}

/**
 * MEDITECH Expanse Connector
 */
class MeditechExpanseConnector extends EHRConnector {
  async authenticate() {
    // OAuth2 authentication with MEDITECH
    try {
      const response = await fetch(`${this.config.api_endpoint}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: process.env.MEDITECH_CLIENT_ID,
          client_secret: process.env.MEDITECH_CLIENT_SECRET,
          grant_type: 'client_credentials',
          scope: 'patient.read encounter.write'
        })
      });
      
      const auth = await response.json();
      this.accessToken = auth.access_token;
      this.authenticated = true;
      
      return true;
    } catch (error) {
      throw new Error(`MEDITECH authentication failed: ${error.message}`);
    }
  }
  
  async searchPatient(criteria) {
    if (!this.authenticated) await this.authenticate();
    
    const response = await fetch(`${this.config.api_endpoint}/patients/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(criteria)
    });
    
    return await response.json();
  }
  
  async loadPatient(patientData) {
    // Create or load patient in MEDITECH sandbox
    return {
      id: patientData.id,
      name: patientData.name,
      dob: patientData.dob,
      mrn: patientData.mrn,
      system: 'meditech_expanse'
    };
  }
  
  async getClinicalData(patientId, dataType) {
    if (!this.authenticated) await this.authenticate();
    
    const response = await fetch(`${this.config.api_endpoint}/patients/${patientId}/${dataType}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
    
    return await response.json();
  }
  
  async createEncounter(encounterData) {
    if (!this.authenticated) await this.authenticate();
    
    const response = await fetch(`${this.config.api_endpoint}/encounters`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(encounterData)
    });
    
    return await response.json();
  }
}

/**
 * Epic Sandbox Connector
 */
class EpicSandboxConnector extends EHRConnector {
  async authenticate() {
    // FHIR OAuth authentication
    try {
      const response = await fetch(`${this.config.api_endpoint}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.EPIC_CLIENT_ID,
          client_secret: process.env.EPIC_CLIENT_SECRET
        })
      });
      
      const auth = await response.json();
      this.accessToken = auth.access_token;
      this.authenticated = true;
      
      return true;
    } catch (error) {
      throw new Error(`Epic authentication failed: ${error.message}`);
    }
  }
  
  async searchPatient(criteria) {
    if (!this.authenticated) await this.authenticate();
    
    const searchParams = new URLSearchParams();
    if (criteria.name) searchParams.append('name', criteria.name);
    if (criteria.birthdate) searchParams.append('birthdate', criteria.birthdate);
    
    const response = await fetch(`${this.config.api_endpoint}/Patient?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/fhir+json'
      }
    });
    
    const bundle = await response.json();
    return bundle.entry?.[0]?.resource || null;
  }
  
  async loadPatient(patientData) {
    return {
      id: patientData.id,
      name: patientData.name,
      dob: patientData.dob,
      mrn: patientData.mrn,
      system: 'epic_sandbox'
    };
  }
  
  async getClinicalData(patientId, dataType) {
    if (!this.authenticated) await this.authenticate();
    
    const fhirResource = this.mapDataTypeToFHIR(dataType);
    const response = await fetch(`${this.config.api_endpoint}/${fhirResource}?patient=${patientId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/fhir+json'
      }
    });
    
    return await response.json();
  }
  
  mapDataTypeToFHIR(dataType) {
    const mapping = {
      'encounters': 'Encounter',
      'observations': 'Observation',
      'conditions': 'Condition',
      'procedures': 'Procedure',
      'medications': 'MedicationRequest'
    };
    
    return mapping[dataType] || 'Observation';
  }
  
  async createEncounter(encounterData) {
    if (!this.authenticated) await this.authenticate();
    
    const fhirEncounter = {
      resourceType: 'Encounter',
      status: 'finished',
      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: encounterData.type === 'inpatient' ? 'IMP' : 'AMB'
      },
      period: {
        start: encounterData.admission_date,
        end: encounterData.discharge_date
      }
    };
    
    const response = await fetch(`${this.config.api_endpoint}/Encounter`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/fhir+json'
      },
      body: JSON.stringify(fhirEncounter)
    });
    
    return await response.json();
  }
}

/**
 * Oracle Health Connector
 */
class OracleHealthConnector extends EHRConnector {
  async authenticate() {
    // API Key authentication
    this.authenticated = !!process.env.ORACLE_HEALTH_API_KEY;
    return this.authenticated;
  }
  
  async searchPatient(criteria) {
    const response = await fetch(`${this.config.api_endpoint}/patients/search`, {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.ORACLE_HEALTH_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(criteria)
    });
    
    return await response.json();
  }
  
  async loadPatient(patientData) {
    return {
      id: patientData.id,
      name: patientData.name,
      dob: patientData.dob,
      mrn: patientData.mrn,
      system: 'oracle_health'
    };
  }
  
  async getClinicalData(patientId, dataType) {
    const response = await fetch(`${this.config.api_endpoint}/patients/${patientId}/${dataType}`, {
      headers: {
        'X-API-Key': process.env.ORACLE_HEALTH_API_KEY
      }
    });
    
    return await response.json();
  }
  
  async createEncounter(encounterData) {
    const response = await fetch(`${this.config.api_endpoint}/encounters`, {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.ORACLE_HEALTH_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(encounterData)
    });
    
    return await response.json();
  }
}

/**
 * Internal Simulator Connector
 * Fallback when external EHR systems are not available
 */
class InternalSimulatorConnector extends EHRConnector {
  constructor(config) {
    super(config);
    this.mockData = this.initializeMockData();
  }
  
  async authenticate() {
    this.authenticated = true;
    return true;
  }
  
  initializeMockData() {
    return {
      patients: [
        {
          id: 'PT001',
          name: 'John Doe',
          dob: '1975-03-15',
          mrn: 'MRN123456',
          encounters: [
            {
              id: 'ENC001',
              type: 'inpatient',
              admission_date: '2024-01-15',
              discharge_date: '2024-01-18',
              diagnoses: ['I21.9', 'E11.9'],
              procedures: ['02703ZZ']
            }
          ]
        },
        {
          id: 'PT002',
          name: 'Jane Smith',
          dob: '1968-07-22',
          mrn: 'MRN789012',
          encounters: [
            {
              id: 'ENC002',
              type: 'outpatient',
              visit_date: '2024-01-20',
              diagnoses: ['Z00.00'],
              procedures: ['99213']
            }
          ]
        }
      ],
      clinical_data: {
        'PT001': {
          observations: [
            { type: 'vital_signs', value: 'BP: 140/90, HR: 85, Temp: 98.6°F' },
            { type: 'lab_results', value: 'Troponin I: 0.8 ng/mL (elevated)' }
          ],
          conditions: [
            { code: 'I21.9', description: 'Acute myocardial infarction, unspecified' },
            { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }
          ]
        }
      }
    };
  }
  
  async searchPatient(criteria) {
    const patients = this.mockData.patients.filter(p => {
      if (criteria.name && !p.name.toLowerCase().includes(criteria.name.toLowerCase())) {
        return false;
      }
      if (criteria.mrn && p.mrn !== criteria.mrn) {
        return false;
      }
      return true;
    });
    
    return patients[0] || null;
  }
  
  async loadPatient(patientData) {
    return {
      id: patientData.id,
      name: patientData.name,
      dob: patientData.dob,
      mrn: patientData.mrn,
      system: 'internal_simulator'
    };
  }
  
  async getClinicalData(patientId, dataType) {
    return this.mockData.clinical_data[patientId]?.[dataType] || [];
  }
  
  async createEncounter(encounterData) {
    return {
      id: `ENC_${Date.now()}`,
      ...encounterData,
      created_at: new Date(),
      system: 'internal_simulator'
    };
  }
}

/**
 * Virtual Lab Manager
 * Main orchestrator for virtual lab sessions
 */
export class VirtualLabManager extends EventEmitter {
  constructor() {
    super();
    this.activeSessions = new Map();
    this.sessionHistory = [];
  }
  
  async createSession(config) {
    const session = new VirtualLabSession(config);
    
    // Forward session events
    session.on('session_started', (data) => this.emit('session_started', data));
    session.on('session_completed', (data) => {
      this.sessionHistory.push(data);
      this.activeSessions.delete(data.sessionId);
      this.emit('session_completed', data);
    });
    session.on('session_error', (data) => this.emit('session_error', data));
    
    this.activeSessions.set(session.sessionId, session);
    
    return session;
  }
  
  getSession(sessionId) {
    return this.activeSessions.get(sessionId);
  }
  
  getActiveSessions() {
    return Array.from(this.activeSessions.values());
  }
  
  getStudentSessions(studentId) {
    return Array.from(this.activeSessions.values()).filter(
      session => session.studentId === studentId
    );
  }
  
  async terminateSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      await session.completeSession();
      this.activeSessions.delete(sessionId);
    }
  }
  
  getSessionHistory(filters = {}) {
    let history = this.sessionHistory;
    
    if (filters.studentId) {
      history = history.filter(s => s.studentId === filters.studentId);
    }
    
    if (filters.labType) {
      history = history.filter(s => s.labType === filters.labType);
    }
    
    if (filters.dateFrom) {
      history = history.filter(s => new Date(s.completed_at) >= new Date(filters.dateFrom));
    }
    
    return history;
  }
}

// Export singleton instance
export const virtualLabManager = new VirtualLabManager();