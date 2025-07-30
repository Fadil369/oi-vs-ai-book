/**
 * Virtual Lab Launcher Component
 * Integrates with the virtual lab framework to provide hands-on medical coding practice
 */

import { virtualLabManager } from '../virtual-lab/integration-framework.js';

export default function VirtualLabLauncher({ lessonId, labType, ehrSystem, studentId }) {
  const launchVirtualLab = async (labConfiguration) => {
    try {
      // Show loading state
      const launcher = document.getElementById('virtual-lab-launcher');
      launcher.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
          <p>Initializing Virtual Lab Environment...</p>
          <p style="font-size: 0.9rem; color: #666;">Setting up ${labConfiguration.ehrSystem} integration</p>
        </div>
      `;

      // Create virtual lab session
      const session = await virtualLabManager.createSession({
        studentId: labConfiguration.studentId,
        labType: labConfiguration.labType,
        ehrSystem: labConfiguration.ehrSystem
      });

      // Listen for session events
      session.on('session_started', (data) => {
        console.log('Virtual lab session started:', data);
        renderLabInterface(session);
      });

      session.on('session_error', (error) => {
        console.error('Virtual lab error:', error);
        renderError(error.error);
      });

      session.on('code_entered', (codeData) => {
        updateCodingProgress(codeData);
      });

      session.on('user_action', (action) => {
        trackUserInteraction(action);
      });

    } catch (error) {
      console.error('Failed to launch virtual lab:', error);
      renderError('Failed to initialize virtual lab. Please try again.');
    }
  };

  const renderLabInterface = (session) => {
    const launcher = document.getElementById('virtual-lab-launcher');
    launcher.innerHTML = `
      <div class="virtual-lab-interface">
        <!-- Lab Header -->
        <div class="lab-header" style="
          background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
          color: white;
          padding: 1rem 2rem;
          border-radius: 8px 8px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <h3 style="margin: 0; color: white;">Virtual Lab Session</h3>
            <p style="margin: 0; opacity: 0.9; font-size: 0.9rem;">
              Session ID: ${session.sessionId}
            </p>
          </div>
          <div style="display: flex; gap: 1rem; align-items: center;">
            <div id="session-timer" style="font-family: monospace; font-size: 1.1rem;">
              00:00:00
            </div>
            <button onclick="pauseSession('${session.sessionId}')" 
                    style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
              ⏸️ Pause
            </button>
          </div>
        </div>

        <!-- Lab Content Area -->
        <div class="lab-content" style="
          border: 1px solid #e0e0e0;
          border-top: none;
          min-height: 500px;
          background: white;
          display: flex;
          flex-direction: column;
        ">
          <!-- EHR Simulation Frame -->
          <div class="ehr-frame" style="flex: 1; position: relative;">
            <iframe id="ehr-simulator" 
                    src="/virtual-lab/ehr-simulator.html?session=${session.sessionId}" 
                    style="width: 100%; height: 100%; border: none;"
                    sandbox="allow-scripts allow-same-origin allow-forms">
            </iframe>
            
            <!-- Coding Assistant Panel -->
            <div class="coding-assistant" style="
              position: absolute;
              right: 0;
              top: 0;
              width: 300px;
              height: 100%;
              background: #f8f9fa;
              border-left: 1px solid #e0e0e0;
              padding: 1rem;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
            ">
              <h4 style="margin-top: 0; color: #1976d2;">Coding Assistant</h4>
              
              <!-- Quick Reference -->
              <div class="quick-reference" style="margin-bottom: 1rem;">
                <h5>Quick References</h5>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  <button class="ref-btn" onclick="openReference('icd10')" 
                          style="background: #e3f2fd; border: 1px solid #2196f3; padding: 0.5rem; border-radius: 4px; cursor: pointer;">
                    ICD-10-CM
                  </button>
                  <button class="ref-btn" onclick="openReference('cpt')"
                          style="background: #e8f5e8; border: 1px solid #4caf50; padding: 0.5rem; border-radius: 4px; cursor: pointer;">
                    CPT 2024
                  </button>
                  <button class="ref-btn" onclick="openReference('snomed')"
                          style="background: #fff3e0; border: 1px solid #ff9800; padding: 0.5rem; border-radius: 4px; cursor: pointer;">
                    SNOMED CT
                  </button>
                </div>
              </div>

              <!-- Code Entry -->
              <div class="code-entry" style="margin-bottom: 1rem;">
                <h5>Enter Codes</h5>
                <form onsubmit="submitCode(event, '${session.sessionId}')" style="display: flex; flex-direction: column; gap: 0.5rem;">
                  <select id="code-type" style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
                    <option value="ICD10">ICD-10-CM</option>
                    <option value="CPT">CPT</option>
                    <option value="HCPCS">HCPCS</option>
                    <option value="SCHI">SCHI</option>
                  </select>
                  <input type="text" id="code-value" placeholder="Enter code" 
                         style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" required>
                  <input type="text" id="code-context" placeholder="Context/Description" 
                         style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
                  <button type="submit" 
                          style="background: #1976d2; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">
                    Submit Code
                  </button>
                </form>
              </div>

              <!-- Coding Progress -->
              <div class="coding-progress" style="flex: 1;">
                <h5>Session Progress</h5>
                <div id="progress-indicators">
                  <div style="margin-bottom: 0.5rem;">
                    <small>Codes Entered: <span id="codes-count">0</span></small>
                  </div>
                  <div style="margin-bottom: 0.5rem;">
                    <small>Accuracy: <span id="accuracy-score">--</span>%</small>
                  </div>
                  <div style="margin-bottom: 1rem;">
                    <small>Actions: <span id="actions-count">0</span></small>
                  </div>
                </div>
                
                <div id="code-feedback" style="
                  background: #f0f0f0; 
                  padding: 0.5rem; 
                  border-radius: 4px; 
                  font-size: 0.9rem;
                  min-height: 100px;
                  overflow-y: auto;
                ">
                  <em>Code validation feedback will appear here...</em>
                </div>
              </div>
            </div>
          </div>

          <!-- Lab Controls -->
          <div class="lab-controls" style="
            background: #f8f9fa;
            padding: 1rem 2rem;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <div style="display: flex; gap: 1rem;">
              <button onclick="resetSession('${session.sessionId}')" 
                      style="background: #ff9800; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                🔄 Reset
              </button>
              <button onclick="saveProgress('${session.sessionId}')" 
                      style="background: #4caf50; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                💾 Save Progress
              </button>
            </div>
            <div style="display: flex; gap: 1rem;">
              <button onclick="requestHelp('${session.sessionId}')" 
                      style="background: #2196f3; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                🆘 Get Help
              </button>
              <button onclick="completeSession('${session.sessionId}')" 
                      style="background: #f44336; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                ✅ Complete Session
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Start session timer
    startSessionTimer();
    
    // Initialize progress tracking
    updateProgressIndicators({
      codes_count: 0,
      accuracy_score: null,
      actions_count: 0
    });
  };

  const renderError = (errorMessage) => {
    const launcher = document.getElementById('virtual-lab-launcher');
    launcher.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #f44336;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">❌</div>
        <h3>Virtual Lab Error</h3>
        <p>${errorMessage}</p>
        <button onclick="location.reload()" 
                style="background: #1976d2; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-top: 1rem;">
          Try Again
        </button>
      </div>
    `;
  };

  const updateCodingProgress = (codeData) => {
    const codesCount = document.getElementById('codes-count');
    const accuracyScore = document.getElementById('accuracy-score');
    const feedback = document.getElementById('code-feedback');

    if (codesCount) {
      codesCount.textContent = parseInt(codesCount.textContent) + 1;
    }

    if (accuracyScore && codeData.validation) {
      const currentAccuracy = parseFloat(accuracyScore.textContent) || 0;
      const newAccuracy = Math.round((currentAccuracy + codeData.validation.accuracy * 100) / 2);
      accuracyScore.textContent = newAccuracy;
    }

    if (feedback) {
      const feedbackHtml = `
        <div style="margin-bottom: 0.5rem; padding: 0.5rem; background: ${codeData.validation?.valid ? '#e8f5e8' : '#ffebee'}; border-radius: 4px;">
          <div style="font-weight: bold; color: ${codeData.validation?.valid ? '#4caf50' : '#f44336'};">
            ${codeData.type}: ${codeData.value} ${codeData.validation?.valid ? '✓' : '❌'}
          </div>
          <div style="font-size: 0.8rem; color: #666;">
            ${codeData.validation?.suggestions?.[0] || 'Code validated'}
          </div>
        </div>
      `;
      feedback.innerHTML = feedbackHtml + feedback.innerHTML;
    }
  };

  const trackUserInteraction = (action) => {
    const actionsCount = document.getElementById('actions-count');
    if (actionsCount) {
      actionsCount.textContent = parseInt(actionsCount.textContent) + 1;
    }
  };

  const startSessionTimer = () => {
    const startTime = Date.now();
    const timer = document.getElementById('session-timer');
    
    setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = String(Math.floor(elapsed / 3600000)).padStart(2, '0');
      const minutes = String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, '0');
      const seconds = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
      
      if (timer) {
        timer.textContent = `${hours}:${minutes}:${seconds}`;
      }
    }, 1000);
  };

  const updateProgressIndicators = (progress) => {
    const codesCount = document.getElementById('codes-count');
    const accuracyScore = document.getElementById('accuracy-score');
    const actionsCount = document.getElementById('actions-count');

    if (codesCount) codesCount.textContent = progress.codes_count;
    if (accuracyScore) accuracyScore.textContent = progress.accuracy_score || '--';
    if (actionsCount) actionsCount.textContent = progress.actions_count;
  };

  // Global functions for lab controls
  window.submitCode = async (event, sessionId) => {
    event.preventDefault();
    
    const session = virtualLabManager.getSession(sessionId);
    if (!session) return;

    const codeType = document.getElementById('code-type').value;
    const codeValue = document.getElementById('code-value').value;
    const codeContext = document.getElementById('code-context').value;

    try {
      const result = await session.enterCode({
        type: codeType,
        code: codeValue,
        context: codeContext
      });

      // Clear form
      event.target.reset();
      
      // Show success feedback
      if (result.success) {
        console.log('Code submitted successfully:', result);
      }
    } catch (error) {
      console.error('Failed to submit code:', error);
    }
  };

  window.pauseSession = (sessionId) => {
    const session = virtualLabManager.getSession(sessionId);
    if (session) {
      session.pause();
    }
  };

  window.resetSession = (sessionId) => {
    if (confirm('Are you sure you want to reset the current session? All progress will be lost.')) {
      location.reload();
    }
  };

  window.saveProgress = async (sessionId) => {
    const session = virtualLabManager.getSession(sessionId);
    if (session) {
      // In a real implementation, this would save to a backend
      localStorage.setItem(`lab_progress_${sessionId}`, JSON.stringify({
        timestamp: Date.now(),
        sessionData: session.sessionData
      }));
      
      // Show success message
      const feedback = document.getElementById('code-feedback');
      if (feedback) {
        feedback.innerHTML = `
          <div style="background: #e8f5e8; padding: 0.5rem; border-radius: 4px; color: #4caf50;">
            💾 Progress saved successfully!
          </div>
        ` + feedback.innerHTML;
      }
    }
  };

  window.requestHelp = (sessionId) => {
    const helpModal = document.createElement('div');
    helpModal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      ">
        <div style="
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
        ">
          <h3>Virtual Lab Help</h3>
          <div style="margin: 1rem 0;">
            <h4>Quick Tips:</h4>
            <ul>
              <li>Use the coding assistant panel to enter codes</li>
              <li>Check code validation feedback for accuracy</li>
              <li>Access quick references for ICD-10, CPT, and SNOMED</li>
              <li>Save your progress regularly</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 1rem;">
            <button onclick="contactInstructor('${sessionId}')" 
                    style="background: #2196f3; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
              Contact Instructor
            </button>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                    style="background: #666; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
              Close
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(helpModal);
  };

  window.completeSession = async (sessionId) => {
    if (confirm('Are you sure you want to complete this virtual lab session?')) {
      const session = virtualLabManager.getSession(sessionId);
      if (session) {
        try {
          const report = await session.completeSession();
          showSessionReport(report);
        } catch (error) {
          console.error('Failed to complete session:', error);
        }
      }
    }
  };

  const showSessionReport = (report) => {
    const reportModal = document.createElement('div');
    reportModal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      ">
        <div style="
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        ">
          <h2 style="color: #1976d2; margin-top: 0;">Session Complete! 🎉</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 1rem 0;">
            <div style="text-align: center; padding: 1rem; background: #f0f0f0; border-radius: 8px;">
              <div style="font-size: 1.5rem; font-weight: bold; color: #1976d2;">${report.duration ? Math.round(report.duration / 60000) : 0}m</div>
              <div style="font-size: 0.9rem; color: #666;">Duration</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: #f0f0f0; border-radius: 8px;">
              <div style="font-size: 1.5rem; font-weight: bold; color: #4caf50;">${report.codes_entered || 0}</div>
              <div style="font-size: 0.9rem; color: #666;">Codes Entered</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: #f0f0f0; border-radius: 8px;">
              <div style="font-size: 1.5rem; font-weight: bold; color: #ff9800;">${Math.round((report.accuracy_score || 0) * 100)}%</div>
              <div style="font-size: 0.9rem; color: #666;">Accuracy</div>
            </div>
            <div style="text-align: center; padding: 1rem; background: #f0f0f0; border-radius: 8px;">
              <div style="font-size: 1.5rem; font-weight: bold; color: #9c27b0;">${report.actions_count || 0}</div>
              <div style="font-size: 0.9rem; color: #666;">Actions</div>
            </div>
          </div>

          <div style="margin: 2rem 0;">
            <h3>Performance Summary:</h3>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
              <p><strong>Coding Accuracy:</strong> ${Math.round((report.accuracy_score || 0) * 100)}%</p>
              <p><strong>Efficiency Score:</strong> ${Math.round((report.efficiency_score || 0) * 100)}%</p>
              <p><strong>Lab Type:</strong> ${report.labType || 'General Practice'}</p>
              <p><strong>EHR System:</strong> ${report.ehrSystem || 'Internal Simulator'}</p>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 1rem;">
            <button onclick="downloadReport(${JSON.stringify(report).replace(/"/g, '&quot;')})" 
                    style="background: #4caf50; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
              Download Report
            </button>
            <button onclick="this.parentElement.parentElement.parentElement.remove(); location.reload();" 
                    style="background: #1976d2; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
              Close
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(reportModal);
  };

  window.downloadReport = (report) => {
    const reportData = typeof report === 'string' ? JSON.parse(report) : report;
    const reportText = `
GIVC Virtual Lab Session Report
===============================

Session ID: ${reportData.sessionId}
Student ID: ${reportData.studentId}
Lab Type: ${reportData.labType}
EHR System: ${reportData.ehrSystem}
Duration: ${reportData.duration ? Math.round(reportData.duration / 60000) : 0} minutes
Completed: ${new Date(reportData.completed_at).toLocaleString()}

Performance Metrics:
- Codes Entered: ${reportData.codes_entered}
- Coding Accuracy: ${Math.round((reportData.accuracy_score || 0) * 100)}%
- Efficiency Score: ${Math.round((reportData.efficiency_score || 0) * 100)}%
- Total Actions: ${reportData.actions_count}

Generated by GIVC Medical Coding Platform
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab-report-${reportData.sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Return the component's render function
  return `
    <div class="virtual-lab-launcher" id="virtual-lab-launcher">
      <div class="lab-preview" style="
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        border: 2px dashed #2196f3;
      ">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🏥</div>
        <h3 style="color: #1976d2; margin-bottom: 1rem;">Virtual Medical Coding Lab</h3>
        <p style="color: #424242; margin-bottom: 1.5rem;">
          Practice medical coding in a realistic EHR environment with real-time feedback and validation.
        </p>
        <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">
            <strong>EHR:</strong> ${ehrSystem || 'Internal Simulator'}
          </div>
          <div style="background: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">
            <strong>Type:</strong> ${labType || 'General Practice'}
          </div>
        </div>
        <button onclick="launchLab()" style="
          background: #1976d2;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 4px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        " onmouseover="this.style.background='#1565c0'" onmouseout="this.style.background='#1976d2'">
          🚀 Launch Virtual Lab
        </button>
      </div>
    </div>

    <script>
      window.launchLab = () => {
        ${launchVirtualLab.toString()}
        launchVirtualLab({
          studentId: '${studentId || 'demo-student'}',
          labType: '${labType || 'ehr_navigation'}',
          ehrSystem: '${ehrSystem || 'internal_simulator'}'
        });
      };
    </script>
  `;
}