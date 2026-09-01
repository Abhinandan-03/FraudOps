/**
 * FraudOps API Service Layer
 * 
 * Centralized API client for all backend communication:
 * - Case retrieval (getNextCase)
 * - Decision submission & evaluation (submitDecision)
 * - Session state management (getSessionState, initSession, resetSession)
 * 
 * Features:
 * - Robust error handling, network failure resilience, and request timeouts
 * - Seamless fallback simulator with rich realistic datasets when backend server is offline
 * - Single source of truth for evaluation outcomes, scoring, consequences, and debriefs
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const DEFAULT_TIMEOUT_MS = 6000;

// Fallback dataset of realistic fraud operation scenarios
const FALLBACK_CASES = [
  {
    id: "CASE-8924A",
    sessionId: "8x7F9A2B",
    threatLevel: "CRITICAL",
    threatLevelColor: "primary",
    riskScore: 94,
    feedLog: "Velocity spike identified from subnet block 192.168.x.x originating in Eastern Europe. Automated mitigation protocols engaged.",
    signalsSummary: "Coordinated Attack Detected // Velocity Spike & Spoofed Device",
    transactionEvidence: [
      { id: "tx-1", amount: 12450.00, risk: "HIGH RISK", riskColor: "primary", ip: "192.168.1.45", loc: "RU-MSK", dev: "iPhone14,3 (Spoofed)" },
      { id: "tx-2", amount: 8900.50, risk: "HIGH RISK", riskColor: "primary", ip: "10.0.0.99", loc: "CN-BJ", dev: "Chrome/Win10" },
      { id: "tx-3", amount: 45.00, risk: "PROBE", riskColor: "tertiary", ip: "192.168.1.45", loc: "RU-MSK", dev: "curl/7.68.0" }
    ],
    entityGraph: {
      target: "ACCOUNT_TARGET_01",
      nodes: [
        { id: "TARGET", label: "TARGET", color: "#A100FF", x: 250, y: 250, r: 16 },
        { id: "ACT_012", label: "ACT_012", color: "#E21B23", x: 350, y: 180, r: 12 },
        { id: "ACT_124", label: "ACT_124", color: "#E21B23", x: 420, y: 280, r: 10 },
        { id: "DEVICE_A", label: "DEVICE_A", color: "#00F5FF", x: 180, y: 150, r: 12 },
        { id: "IP_823F", label: "IP_823F", color: "#00F5FF", x: 200, y: 350, r: 10 }
      ],
      edges: [
        { from: [250, 250], to: [350, 180], color: "#E21B23", dashed: false },
        { from: [350, 180], to: [420, 280], color: "#E21B23", dashed: true },
        { from: [250, 250], to: [180, 150], color: "#A100FF", dashed: true },
        { from: [250, 250], to: [200, 350], color: "#00F5FF", dashed: false }
      ]
    },
    detectionSignals: [
      { id: "sig-1", name: "Rule-Based Velocity", percent: 98, color: "primary", description: "High frequency xfers to new payees." },
      { id: "sig-2", name: "Biometric Anomaly", percent: 85, color: "secondary", description: "Typing cadence mismatch detected." },
      { id: "sig-3", name: "Graph Distance", percent: 42, color: "tertiary", description: "2 hops from known bad actor." }
    ],
    groundTruth: {
      correctAction: "FREEZE",
      allowedActions: ["FREEZE"],
      fraudAmount: 12450.00,
      correctOutcome: {
        points: 100,
        outcome: "Fraud Halted",
        consequence: "Immediate account freeze halted malicious account takeover transfer of $12,450.00.",
        debrief: [
          "Device signature matched known credential-stuffing botnet profile.",
          "Geolocation mismatch between active session and verified 2FA device.",
          "Prevented unauthorized multi-hop exfiltration within 1.2s."
        ]
      },
      wrongOutcome: {
        points: -150,
        outcome: "Breach Unmitigated",
        consequence: "Attacker successfully exfiltrated $12,450.00 across unmonitored bridge node.",
        debrief: [
          "High risk score (94%) warranted immediate total account lockdown (FREEZE).",
          "Soft mitigation or false-positive clearing allowed malicious script execution to complete.",
          "Always inspect graph distance and spoofed device headers before clearing high-velocity transactions."
        ]
      }
    }
  },
  {
    id: "CASE-9102B",
    sessionId: "8x7F9A2B",
    threatLevel: "ELEVATED",
    threatLevelColor: "secondary",
    riskScore: 78,
    feedLog: "Unrecognized device terminal logging in from unexpected jurisdiction. Rapid authorization requests detected.",
    signalsSummary: "New Device Authentication // Step-Up Auth Required",
    transactionEvidence: [
      { id: "tx-4", amount: 3450.00, risk: "MEDIUM RISK", riskColor: "secondary", ip: "198.51.100.22", loc: "DE-BER", dev: "MacOS / Safari 17" },
      { id: "tx-5", amount: 120.00, risk: "LOW RISK", riskColor: "tertiary", ip: "198.51.100.22", loc: "DE-BER", dev: "MacOS / Safari 17" }
    ],
    entityGraph: {
      target: "ACCOUNT_TARGET_02",
      nodes: [
        { id: "TARGET", label: "TARGET", color: "#A100FF", x: 250, y: 250, r: 16 },
        { id: "DEV_SAFARI", label: "DEV_SAFARI", color: "#00F5FF", x: 180, y: 200, r: 12 },
        { id: "VPN_NODE", label: "VPN_NODE", color: "#A100FF", x: 320, y: 310, r: 12 }
      ],
      edges: [
        { from: [250, 250], to: [180, 200], color: "#00F5FF", dashed: false },
        { from: [250, 250], to: [320, 310], color: "#A100FF", dashed: true }
      ]
    },
    detectionSignals: [
      { id: "sig-4", name: "Device Fingerprint Delta", percent: 79, color: "secondary", description: "Unseen browser user-agent hash." },
      { id: "sig-5", name: "Travel Velocity", percent: 62, color: "tertiary", description: "Distance physically possible via commercial airline." },
      { id: "sig-6", name: "Behavioral Hesitation", percent: 24, color: "tertiary", description: "Natural human typing cadence." }
    ],
    groundTruth: {
      correctAction: "STEP-UP AUTH",
      allowedActions: ["STEP-UP AUTH"],
      fraudAmount: 3450.00,
      correctOutcome: {
        points: 100,
        outcome: "Identity Verified",
        consequence: "Step-up OTP authentication sent. Customer successfully completed biometrics challenge.",
        debrief: [
          "Appropriate proportionality: Avoided unnecessary hard freeze for legitimate business traveler.",
          "Human hesitation signals correctly differentiated this from automated bot intrusion.",
          "Customer experience preserved with zero fraud loss."
        ]
      },
      wrongOutcome: {
        points: -150,
        outcome: "Service Disruption",
        consequence: "VIP Executive travelling abroad locked out of business account during critical transfer.",
        debrief: [
          "Hard freeze caused high-value customer dissatisfaction and escalation to Tier-3 support.",
          "When behavioral hesitation is natural, STEP-UP AUTH provides secure verification without disruption.",
          "Ensure risk signals balance velocity against human biometrics."
        ]
      }
    }
  },
  {
    id: "CASE-7319C",
    sessionId: "8x7F9A2B",
    threatLevel: "BENIGN",
    threatLevelColor: "tertiary",
    riskScore: 22,
    feedLog: "Routine scheduled payroll disbursement triggered baseline threshold due to month-end volume.",
    signalsSummary: "Quarterly Scheduled Batch Transfer // False Positive Anomaly",
    transactionEvidence: [
      { id: "tx-6", amount: 48500.00, risk: "VOLUME ALERT", riskColor: "tertiary", ip: "192.168.10.12", loc: "US-NYC", dev: "Corporate FinOps Portal" },
      { id: "tx-7", amount: 48500.00, risk: "BASELINE", riskColor: "tertiary", ip: "192.168.10.12", loc: "US-NYC", dev: "Corporate FinOps Portal" }
    ],
    entityGraph: {
      target: "CORP_PAYROLL",
      nodes: [
        { id: "TARGET", label: "CORP_HUB", color: "#00F5FF", x: 250, y: 250, r: 16 },
        { id: "PAYROLL_1", label: "PAYROLL_1", color: "#00F5FF", x: 350, y: 200, r: 12 },
        { id: "PAYROLL_2", label: "PAYROLL_2", color: "#00F5FF", x: 150, y: 300, r: 12 }
      ],
      edges: [
        { from: [250, 250], to: [350, 200], color: "#00F5FF", dashed: false },
        { from: [250, 250], to: [150, 300], color: "#00F5FF", dashed: false }
      ]
    },
    detectionSignals: [
      { id: "sig-7", name: "Scheduled Batch Hash", percent: 99, color: "tertiary", description: "Cryptographically signed by corporate treasurer." },
      { id: "sig-8", name: "Known Corporate VPN", percent: 10, color: "tertiary", description: "Origin IP inside whitelisted enterprise range." },
      { id: "sig-9", name: "Velocity Threshold", percent: 65, color: "secondary", description: "Volume expected during Q3 payroll closing window." }
    ],
    groundTruth: {
      correctAction: "CLEAR",
      allowedActions: ["CLEAR"],
      fraudAmount: 0,
      correctOutcome: {
        points: 100,
        outcome: "False Positive Cleared",
        consequence: "Corporate payroll released on schedule. False positive flagged in anomaly registry.",
        debrief: [
          "Accurately identified legitimate quarterly enterprise payroll disbursements.",
          "Preserved 100% operational throughput with 0 customer friction.",
          "False-positive rate maintained at optimal baseline."
        ]
      },
      wrongOutcome: {
        points: -150,
        outcome: "False Positive Penalty",
        consequence: "Enterprise corporate payroll suspended. 500+ employees affected by unauthorized hold.",
        debrief: [
          "Origin IP and cryptographic signatures clearly authenticated enterprise whitelist origin.",
          "Freezing or escalating benign scheduled batches incurs severe SLA penalties.",
          "Check scheduled recurring hashes before applying disruptive actions."
        ]
      }
    }
  },
  {
    id: "CASE-9941D",
    sessionId: "8x7F9A2B",
    threatLevel: "ANOMALOUS",
    threatLevelColor: "secondary",
    riskScore: 89,
    feedLog: "Complex multi-hop synthetic identity ring detected. Linked to 14 distributed shell accounts.",
    signalsSummary: "Synthetic Identity Syndicate // Multi-Entity Laundering Loop",
    transactionEvidence: [
      { id: "tx-8", amount: 9950.00, risk: "HIGH RISK", riskColor: "primary", ip: "185.220.101.5", loc: "RO-BUC", dev: "Tor Exit Node" },
      { id: "tx-9", amount: 9950.00, risk: "STRUCTURING", riskColor: "primary", ip: "185.220.101.5", loc: "RO-BUC", dev: "Tor Exit Node" }
    ],
    entityGraph: {
      target: "SYNTH_RING",
      nodes: [
        { id: "TARGET", label: "NODE_L1", color: "#E21B23", x: 250, y: 250, r: 16 },
        { id: "ACT_44", label: "SHELL_A", color: "#A100FF", x: 380, y: 190, r: 12 },
        { id: "ACT_45", label: "SHELL_B", color: "#A100FF", x: 320, y: 340, r: 12 },
        { id: "ACT_46", label: "SHELL_C", color: "#A100FF", x: 140, y: 200, r: 12 }
      ],
      edges: [
        { from: [250, 250], to: [380, 190], color: "#E21B23", dashed: true },
        { from: [380, 190], to: [320, 340], color: "#A100FF", dashed: true },
        { from: [320, 340], to: [140, 200], color: "#E21B23", dashed: false },
        { from: [140, 200], to: [250, 250], color: "#00F5FF", dashed: true }
      ]
    },
    detectionSignals: [
      { id: "sig-10", name: "Graph Clustering Density", percent: 96, color: "primary", description: "Circular smurfing pattern across 14 pseudo-identities." },
      { id: "sig-11", name: "Anonymized Proxy", percent: 99, color: "primary", description: "Tor exit node network connection." },
      { id: "sig-12", name: "Structuring Threshold", percent: 92, color: "primary", description: "All transfers precisely under $10,000 regulatory reporting limit." }
    ],
    groundTruth: {
      correctAction: "ESCALATE",
      allowedActions: ["ESCALATE", "FREEZE"],
      fraudAmount: 19900.00,
      correctOutcome: {
        points: 100,
        outcome: "Syndicate Escalated",
        consequence: "Case escalated to L3 FinCEN investigation unit. Entire 14-account syndicate frozen.",
        debrief: [
          "Smurfing and structuring under $10,000 correctly flagged for senior AML review.",
          "Prevented cross-border synthetic identity laundering ring.",
          "Comprehensive evidence dossier submitted to global intelligence archive."
        ]
      },
      wrongOutcome: {
        points: -150,
        outcome: "Syndicate Breach",
        consequence: "Syndicate rotated funds through shell accounts and completed laundering cycle.",
        debrief: [
          "Tor origin combined with circular graph clustering demanded immediate escalation or freeze.",
          "Simple clearance allowed structured smurfing transfers to bypass AML detection.",
          "Always inspect graph clustering density when transactions hover just below $10,000."
        ]
      }
    }
  }
];

// Local state keeper for fallback simulator
let localCaseIndex = 0;
let localSessionState = {
  score: 1240,
  streak: 3,
  difficulty: "ELITE",
  cryoTokens: 3,
  casesCompleted: 3,
  detectionAccuracy: 92.4,
  falsePositiveRate: 1.2,
  avgResponseTime: 1.2,
  fraudPrevented: 124500,
  activeCaseId: FALLBACK_CASES[0].id
};

/**
 * Execute HTTP request with timeout and error wrapping
 */
async function fetchWithTimeout(endpoint, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * API Service Export
 */
export const fraudOpsApi = {
  /**
   * Get the current or next investigation case
   */
  async getNextCase(difficulty = "ELITE") {
    try {
      // Try real backend endpoint first
      const data = await fetchWithTimeout(`cases/next?difficulty=${encodeURIComponent(difficulty)}`, {
        method: 'GET'
      });
      return data;
    } catch (networkErr) {
      // Fallback to internal simulation engine
      console.info('[FraudOps API] Running in resilient fallback mode for getNextCase:', networkErr.message);
      
      const currentCase = FALLBACK_CASES[localCaseIndex % FALLBACK_CASES.length];
      localCaseIndex++;
      localSessionState.activeCaseId = currentCase.id;

      // Small simulated latency for production feel
      await new Promise((res) => setTimeout(res, 200));

      return {
        ...currentCase,
        activeCaseNumber: localCaseIndex,
        totalAvailableCases: FALLBACK_CASES.length
      };
    }
  },

  /**
   * Submit an operative decision on a specific case
   */
  async submitDecision(caseId, action, { responseTime = 1.2 } = {}) {
    if (!caseId || !action) {
      throw new Error("Invalid submission: caseId and action are required.");
    }

    try {
      // Try real backend endpoint first
      const data = await fetchWithTimeout('cases/decision', {
        method: 'POST',
        body: JSON.stringify({
          caseId,
          action,
          responseTime
        })
      });
      return data;
    } catch (networkErr) {
      // Fallback to internal simulation engine
      console.info('[FraudOps API] Running in resilient fallback mode for submitDecision:', networkErr.message);

      // Small simulated latency for production feel
      await new Promise((res) => setTimeout(res, 350));

      const targetCase = FALLBACK_CASES.find(c => c.id === caseId) || FALLBACK_CASES[0];
      const isCorrect = targetCase.groundTruth.allowedActions.includes(action.toUpperCase());
      const outcomeData = isCorrect 
        ? targetCase.groundTruth.correctOutcome 
        : targetCase.groundTruth.wrongOutcome;

      // Calculate dynamic score and streak
      const points = outcomeData.points;
      const newScore = Math.max(0, localSessionState.score + points);
      const newStreak = isCorrect ? localSessionState.streak + 1 : 0;
      
      localSessionState.score = newScore;
      localSessionState.streak = newStreak;
      localSessionState.casesCompleted += 1;
      if (isCorrect && targetCase.groundTruth.fraudAmount > 0) {
        localSessionState.fraudPrevented += targetCase.groundTruth.fraudAmount;
      }

      return {
        caseId,
        action,
        correct: isCorrect,
        points: points,
        totalScore: newScore,
        streak: newStreak,
        outcome: outcomeData.outcome,
        consequence: outcomeData.consequence,
        debrief: outcomeData.debrief,
        responseTime: responseTime || 1.2,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Get the current session state (score, streak, metrics)
   */
  async getSessionState() {
    try {
      const data = await fetchWithTimeout('session/state', { method: 'GET' });
      return data;
    } catch (networkErr) {
      console.info('[FraudOps API] Running in resilient fallback mode for getSessionState:', networkErr.message);
      return { ...localSessionState };
    }
  },

  /**
   * Initialize a new session
   */
  async initSession(config = {}) {
    try {
      const data = await fetchWithTimeout('session/init', {
        method: 'POST',
        body: JSON.stringify(config)
      });
      return data;
    } catch (networkErr) {
      console.info('[FraudOps API] Initializing local session:', networkErr.message);
      localSessionState = {
        score: 1000,
        streak: 0,
        difficulty: config.difficulty || "ELITE",
        cryoTokens: config.cryoTokens || 3,
        casesCompleted: 0,
        detectionAccuracy: 95.0,
        falsePositiveRate: 1.0,
        avgResponseTime: 1.0,
        fraudPrevented: 0,
        activeCaseId: FALLBACK_CASES[0].id
      };
      localCaseIndex = 0;
      return { ...localSessionState };
    }
  },

  /**
   * Reset session
   */
  async resetSession() {
    return this.initSession({ difficulty: "ELITE" });
  }
};

export default fraudOpsApi;
