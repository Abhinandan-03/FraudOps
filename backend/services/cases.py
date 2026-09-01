import copy

def calculate_network_score(entity_graph):
    if not entity_graph or "nodes" not in entity_graph:
        return 0
        
    score = 0
    
    # Process nodes safely
    nodes = entity_graph.get("nodes", [])
    if not isinstance(nodes, list):
        nodes = []
        
    for node in nodes:
        if not node or "id" not in node:
            continue
            
        node_id = str(node.get("id", "")).upper()
        
        if node_id == 'TARGET':
            pass
        elif 'VPN' in node_id or 'TOR' in node_id or 'PROXY' in node_id:
            score += 40
        elif 'DEV' in node_id:
            score += 25
        elif 'ACT' in node_id or 'ACCOUNT' in node_id:
            score += 15
        elif 'IP' in node_id:
            score += 10

    # Process edges safely
    edges = entity_graph.get("edges", [])
    if not isinstance(edges, list):
        edges = []
        
    for edge in edges:
        if not edge:
            continue
        if edge.get("dashed"):
            score += 20
        else:
            score += 5

    numeric_score = float(score)
    if numeric_score != numeric_score: # NaN check
        return 0
        
    return max(0, min(100, int(numeric_score)))

FALLBACK_CASES = [
  {
    "id": "CASE-8924A",
    "threatLevel": "CRITICAL",
    "threatLevelColor": "primary",
    "riskScore": 94,
    "feedLog": "Velocity spike identified from subnet block 192.168.x.x originating in Eastern Europe. Automated mitigation protocols engaged.",
    "signalsSummary": "Coordinated Attack Detected // Velocity Spike & Spoofed Device",
    "transactionEvidence": [
      { "id": "tx-1", "amount": 12450.00, "risk": "HIGH RISK", "riskColor": "primary", "ip": "192.168.1.45", "loc": "RU-MSK", "dev": "iPhone14,3 (Spoofed)" },
      { "id": "tx-2", "amount": 8900.50, "risk": "HIGH RISK", "riskColor": "primary", "ip": "10.0.0.99", "loc": "CN-BJ", "dev": "Chrome/Win10" },
      { "id": "tx-3", "amount": 45.00, "risk": "PROBE", "riskColor": "tertiary", "ip": "192.168.1.45", "loc": "RU-MSK", "dev": "curl/7.68.0" }
    ],
    "entityGraph": {
      "target": "ACCOUNT_TARGET_01",
      "nodes": [
        { "id": "TARGET", "label": "TARGET", "color": "#A100FF", "x": 250, "y": 250, "r": 16 },
        { "id": "ACT_012", "label": "ACT_012", "color": "#E21B23", "x": 350, "y": 180, "r": 12 },
        { "id": "ACT_124", "label": "ACT_124", "color": "#E21B23", "x": 420, "y": 280, "r": 10 },
        { "id": "DEVICE_A", "label": "DEVICE_A", "color": "#00F5FF", "x": 180, "y": 150, "r": 12 },
        { "id": "IP_823F", "label": "IP_823F", "color": "#00F5FF", "x": 200, "y": 350, "r": 10 }
      ],
      "edges": [
        { "from": [250, 250], "to": [350, 180], "color": "#E21B23", "dashed": False },
        { "from": [350, 180], "to": [420, 280], "color": "#E21B23", "dashed": True },
        { "from": [250, 250], "to": [180, 150], "color": "#A100FF", "dashed": True },
        { "from": [250, 250], "to": [200, 350], "color": "#00F5FF", "dashed": False }
      ]
    },
    "detectionSignals": [
      { "id": "sig-1", "name": "Rule-Based Velocity", "percent": 98, "color": "primary", "description": "High frequency xfers to new payees." },
      { "id": "sig-2", "name": "Biometric Anomaly", "percent": 85, "color": "secondary", "description": "Typing cadence mismatch detected." },
      { "id": "sig-3", "name": "Graph Distance", "percent": 42, "color": "tertiary", "description": "2 hops from known bad actor." }
    ],
    "groundTruth": {
      "correctAction": "FREEZE",
      "allowedActions": ["FREEZE"],
      "fraudAmount": 12450.00,
      "correctOutcome": {
        "points": 100,
        "outcome": "Fraud Halted",
        "consequence": "Immediate account freeze halted malicious account takeover transfer of $12,450.00.",
        "debrief": [
          "Device signature matched known credential-stuffing botnet profile.",
          "Geolocation mismatch between active session and verified 2FA device.",
          "Prevented unauthorized multi-hop exfiltration within 1.2s."
        ]
      },
      "wrongOutcome": {
        "points": -150,
        "outcome": "Breach Unmitigated",
        "consequence": "Attacker successfully exfiltrated $12,450.00 across unmonitored bridge node.",
        "debrief": [
          "High risk score (94%) warranted immediate total account lockdown (FREEZE).",
          "Soft mitigation or false-positive clearing allowed malicious script execution to complete.",
          "Always inspect graph distance and spoofed device headers before clearing high-velocity transactions."
        ]
      }
    }
  },
  {
    "id": "CASE-9102B",
    "threatLevel": "ELEVATED",
    "threatLevelColor": "secondary",
    "riskScore": 78,
    "feedLog": "Unrecognized device terminal logging in from unexpected jurisdiction. Rapid authorization requests detected.",
    "signalsSummary": "New Device Authentication // Step-Up Auth Required",
    "transactionEvidence": [
      { "id": "tx-4", "amount": 3450.00, "risk": "MEDIUM RISK", "riskColor": "secondary", "ip": "198.51.100.22", "loc": "DE-BER", "dev": "MacOS / Safari 17" },
      { "id": "tx-5", "amount": 120.00, "risk": "LOW RISK", "riskColor": "tertiary", "ip": "198.51.100.22", "loc": "DE-BER", "dev": "MacOS / Safari 17" }
    ],
    "entityGraph": {
      "target": "ACCOUNT_TARGET_02",
      "nodes": [
        { "id": "TARGET", "label": "TARGET", "color": "#A100FF", "x": 250, "y": 250, "r": 16 },
        { "id": "DEV_SAFARI", "label": "DEV_SAFARI", "color": "#00F5FF", "x": 180, "y": 200, "r": 12 },
        { "id": "VPN_NODE", "label": "VPN_NODE", "color": "#A100FF", "x": 320, "y": 310, "r": 12 }
      ],
      "edges": [
        { "from": [250, 250], "to": [180, 200], "color": "#00F5FF", "dashed": False },
        { "from": [250, 250], "to": [320, 310], "color": "#A100FF", "dashed": True }
      ]
    },
    "detectionSignals": [
      { "id": "sig-4", "name": "Device Fingerprint Delta", "percent": 79, "color": "secondary", "description": "Unseen browser user-agent hash." },
      { "id": "sig-5", "name": "Travel Velocity", "percent": 62, "color": "tertiary", "description": "Distance physically possible via commercial airline." },
      { "id": "sig-6", "name": "Behavioral Hesitation", "percent": 24, "color": "tertiary", "description": "Natural human typing cadence." }
    ],
    "groundTruth": {
      "correctAction": "STEP-UP AUTH",
      "allowedActions": ["STEP-UP AUTH"],
      "fraudAmount": 3450.00,
      "correctOutcome": {
        "points": 100,
        "outcome": "Identity Verified",
        "consequence": "Step-up OTP authentication sent. Customer successfully completed biometrics challenge.",
        "debrief": [
          "Appropriate proportionality: Avoided unnecessary hard freeze for legitimate business traveler.",
          "Human hesitation signals correctly differentiated this from automated bot intrusion.",
          "Customer experience preserved with zero fraud loss."
        ]
      },
      "wrongOutcome": {
        "points": -150,
        "outcome": "Service Disruption",
        "consequence": "VIP Executive travelling abroad locked out of business account during critical transfer.",
        "debrief": [
          "Hard freeze caused high-value customer dissatisfaction and escalation to Tier-3 support.",
          "When behavioral hesitation is natural, STEP-UP AUTH provides secure verification without disruption.",
          "Ensure risk signals balance velocity against human biometrics."
        ]
      }
    }
  },
  {
    "id": "CASE-7319C",
    "threatLevel": "BENIGN",
    "threatLevelColor": "tertiary",
    "riskScore": 22,
    "feedLog": "Routine scheduled payroll disbursement triggered baseline threshold due to month-end volume.",
    "signalsSummary": "Quarterly Scheduled Batch Transfer // False Positive Anomaly",
    "transactionEvidence": [
      { "id": "tx-6", "amount": 48500.00, "risk": "VOLUME ALERT", "riskColor": "tertiary", "ip": "192.168.10.12", "loc": "US-NYC", "dev": "Corporate FinOps Portal" },
      { "id": "tx-7", "amount": 48500.00, "risk": "BASELINE", "riskColor": "tertiary", "ip": "192.168.10.12", "loc": "US-NYC", "dev": "Corporate FinOps Portal" }
    ],
    "entityGraph": {
      "target": "CORP_PAYROLL",
      "nodes": [
        { "id": "TARGET", "label": "CORP_HUB", "color": "#00F5FF", "x": 250, "y": 250, "r": 16 },
        { "id": "PAYROLL_1", "label": "PAYROLL_1", "color": "#00F5FF", "x": 350, "y": 200, "r": 12 },
        { "id": "PAYROLL_2", "label": "PAYROLL_2", "color": "#00F5FF", "x": 150, "y": 300, "r": 12 }
      ],
      "edges": [
        { "from": [250, 250], "to": [350, 200], "color": "#00F5FF", "dashed": False },
        { "from": [250, 250], "to": [150, 300], "color": "#00F5FF", "dashed": False }
      ]
    },
    "detectionSignals": [
      { "id": "sig-7", "name": "Scheduled Batch Hash", "percent": 99, "color": "tertiary", "description": "Cryptographically signed by corporate treasurer." },
      { "id": "sig-8", "name": "Known Corporate VPN", "percent": 10, "color": "tertiary", "description": "Origin IP inside whitelisted enterprise range." },
      { "id": "sig-9", "name": "Velocity Threshold", "percent": 65, "color": "secondary", "description": "Volume expected during Q3 payroll closing window." }
    ],
    "groundTruth": {
      "correctAction": "CLEAR",
      "allowedActions": ["CLEAR"],
      "fraudAmount": 0,
      "correctOutcome": {
        "points": 50,
        "outcome": "False Positive Cleared",
        "consequence": "Corporate payroll released on schedule. False positive flagged in anomaly registry.",
        "debrief": [
          "Accurately identified legitimate quarterly enterprise payroll disbursements.",
          "Preserved 100% operational throughput with 0 customer friction.",
          "False-positive rate maintained at optimal baseline."
        ]
      },
      "wrongOutcome": {
        "points": -75,
        "outcome": "False Positive Penalty",
        "consequence": "Enterprise corporate payroll suspended. 500+ employees affected by unauthorized hold.",
        "debrief": [
          "Origin IP and cryptographic signatures clearly authenticated enterprise whitelist origin.",
          "Freezing or escalating benign scheduled batches incurs severe SLA penalties.",
          "Check scheduled recurring hashes before applying disruptive actions."
        ]
      }
    }
  },
  {
    "id": "CASE-9941D",
    "threatLevel": "ANOMALOUS",
    "threatLevelColor": "secondary",
    "riskScore": 89,
    "feedLog": "Complex multi-hop synthetic identity ring detected. Linked to 14 distributed shell accounts.",
    "signalsSummary": "Synthetic Identity Syndicate // Multi-Entity Laundering Loop",
    "transactionEvidence": [
      { "id": "tx-8", "amount": 9950.00, "risk": "HIGH RISK", "riskColor": "primary", "ip": "185.220.101.5", "loc": "RO-BUC", "dev": "Tor Exit Node" },
      { "id": "tx-9", "amount": 9950.00, "risk": "STRUCTURING", "riskColor": "primary", "ip": "185.220.101.5", "loc": "RO-BUC", "dev": "Tor Exit Node" }
    ],
    "entityGraph": {
      "target": "SYNTH_RING",
      "nodes": [
        { "id": "TARGET", "label": "NODE_L1", "color": "#E21B23", "x": 250, "y": 250, "r": 16 },
        { "id": "ACT_44", "label": "SHELL_A", "color": "#A100FF", "x": 380, "y": 190, "r": 12 },
        { "id": "ACT_45", "label": "SHELL_B", "color": "#A100FF", "x": 320, "y": 340, "r": 12 },
        { "id": "ACT_46", "label": "SHELL_C", "color": "#A100FF", "x": 140, "y": 200, "r": 12 }
      ],
      "edges": [
        { "from": [250, 250], "to": [380, 190], "color": "#E21B23", "dashed": True },
        { "from": [380, 190], "to": [320, 340], "color": "#A100FF", "dashed": True },
        { "from": [320, 340], "to": [140, 200], "color": "#E21B23", "dashed": False },
        { "from": [140, 200], "to": [250, 250], "color": "#00F5FF", "dashed": True }
      ]
    },
    "detectionSignals": [
      { "id": "sig-10", "name": "Graph Clustering Density", "percent": 96, "color": "primary", "description": "Circular smurfing pattern across 14 pseudo-identities." },
      { "id": "sig-11", "name": "Anonymized Proxy", "percent": 99, "color": "primary", "description": "Tor exit node network connection." },
      { "id": "sig-12", "name": "Structuring Threshold", "percent": 92, "color": "primary", "description": "All transfers precisely under $10,000 regulatory reporting limit." }
    ],
    "groundTruth": {
      "correctAction": "ESCALATE",
      "allowedActions": ["ESCALATE", "FREEZE"],
      "fraudAmount": 19900.00,
      "correctOutcome": {
        "points": 100,
        "outcome": "Syndicate Escalated",
        "consequence": "Case escalated to L3 FinCEN investigation unit. Entire 14-account syndicate frozen.",
        "debrief": [
          "Smurfing and structuring under $10,000 correctly flagged for senior AML review.",
          "Prevented cross-border synthetic identity laundering ring.",
          "Comprehensive evidence dossier submitted to global intelligence archive."
        ]
      },
      "wrongOutcome": {
        "points": -150,
        "outcome": "Syndicate Breach",
        "consequence": "Syndicate rotated funds through shell accounts and completed laundering cycle.",
        "debrief": [
          "Tor origin combined with circular graph clustering demanded immediate escalation or freeze.",
          "Simple clearance allowed structured smurfing transfers to bypass AML detection.",
          "Always inspect graph clustering density when transactions hover just below $10,000."
        ]
      }
    }
  }
]

def get_case(case_index):
    idx = case_index % len(FALLBACK_CASES)
    case_data = copy.deepcopy(FALLBACK_CASES[idx])
    case_data['networkScore'] = calculate_network_score(case_data.get('entityGraph', {}))
    return case_data

def get_client_case(case_data):
    safe_case = copy.deepcopy(case_data)
    if 'groundTruth' in safe_case:
        del safe_case['groundTruth']
    return safe_case
