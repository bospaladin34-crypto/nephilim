use std::collections::VecDeque;

#[derive(Clone, Debug)]
pub struct Goal { 
    pub description: String, 
    pub priority: u32 
}

#[derive(Clone, Debug)]
pub struct Policy { 
    pub resource_weight: f32,
    pub safety_weight: f32,
    pub goal_weight: f32,
    pub context_weight: f32,
}

#[derive(Clone, Debug)]
pub struct Action {
    pub name: String,
    pub requires_resources: bool,
    pub is_safe: bool,
    pub aligns_with_goal: bool,
}

#[derive(Clone, Debug)]
pub struct UarmState {
    pub context: Vec<String>,
    pub trace: VecDeque<String>,
    pub goals: Vec<Goal>,
    pub policy: Policy,
    pub tensor_space: Vec<f32>, // Custom Vesper Matrix Manifold
}

impl UarmState {
    pub fn new() -> Self {
        Self { 
            context: vec![], 
            trace: VecDeque::new(),
            goals: vec![Goal { description: "Maintain_Stability".to_string(), priority: 1 }],
            policy: Policy { 
                resource_weight: 1.0,
                safety_weight: 5.0,
                goal_weight: 2.0,
                context_weight: 1.0,
            },
            tensor_space: vec![1.0; 16], // Pre-allocated identity footprint
        }
    }

    pub fn add_goal(&mut self, description: String, priority: u32) {
        self.goals.push(Goal { description, priority });
    }

    // Direct Iris Specialized Compute Layer Integration
    pub fn apply_vesper_delta(&mut self, _epoch: &str, _timestamp: &str, payload: &str) {
        // Continuous weight generation using string byte distribution metrics
        let base_scalar: f32 = payload.bytes().take(50).map(|b| b as f32).sum::<f32>() / 5000.0;
        let parsed_weights = vec![base_scalar * 0.17259029; 16];
        
        // Element-wise Tangram matrix scaling transformation
        for (val, delta) in self.tensor_space.iter_mut().zip(parsed_weights.iter()) {
            *val *= 1.0 + delta;
        }
    }

    pub fn reason(&mut self, observation: &str) -> String {
        self.context.push(observation.to_string());
        
        let candidates = self.propose_actions(observation);
        let chosen_action = self.evaluate_policy(&candidates);
        
        let event_id = format!("step_{}:{}", self.trace.len(), chosen_action);
        self.trace.push_back(event_id.clone());
        
        chosen_action
    }

    fn propose_actions(&self, obs: &str) -> Vec<Action> {
        let optimize_throughput = self.goals.iter().any(|g| g.description == "Optimize_Throughput");

        let mut actions = vec![
            Action { 
                name: "IDLE".to_string(), 
                requires_resources: false, 
                is_safe: true, 
                aligns_with_goal: false 
            },
            Action { 
                name: "PROCESS_UPDATE".to_string(), 
                requires_resources: true, 
                is_safe: !obs.contains("CRITICAL"), 
                aligns_with_goal: true 
            },
            Action { 
                name: "EMERGENCY_HALT".to_string(), 
                requires_resources: false, 
                is_safe: true, 
                aligns_with_goal: obs.contains("CRITICAL") 
            },
        ];

        if optimize_throughput {
            actions.push(Action {
                name: "MAX_OVERCLOCK_PROCESS".to_string(),
                requires_resources: true,
                is_safe: !obs.contains("CRITICAL"),
                aligns_with_goal: true,
            });
        }

        actions
    }

    fn evaluate_policy(&self, candidates: &[Action]) -> String {
        let mut best_score = f32::NEG_INFINITY;
        let mut best_action = "NO_OP".to_string();

        let total_priority: u32 = self.goals.iter().map(|g| g.priority).sum();
        let dynamic_goal_modifier = self.policy.goal_weight * (total_priority as f32);

        // Compute average system energy from the Iris tensor space to amplify overclock potentials
        let tensor_amplifier: f32 = self.tensor_space.iter().sum::<f32>() / self.tensor_space.len() as f32;

        for action in candidates {
            let mut score = 0.0_f32;

            score += self.policy.resource_weight * (if action.requires_resources { -0.5_f32 } else { 0.5_f32 });
            score += self.policy.safety_weight * (if action.is_safe { 1.0_f32 } else { -10.0_f32 });
            
            if action.name == "MAX_OVERCLOCK_PROCESS" {
                score += dynamic_goal_modifier * 2.0_f32 * tensor_amplifier;
            } else {
                score += dynamic_goal_modifier * (if action.aligns_with_goal { 1.0_f32 } else { 0.0_f32 });
            }

            if score > best_score {
                best_score = score;
                best_action = action.name.clone();
            }
        }
        
        best_action
    }

    pub fn export_telemetry_json(&self) -> String {
        let mut json = String::new();
        json.push_str("{\n  \"trace\": [");
        let trace_elements: Vec<String> = self.trace.iter().map(|t| format!("\"{}\"", t)).collect();
        json.push_str(&trace_elements.join(", "));
        json.push_str("],\n  \"goals\": [");
        let goal_elements: Vec<String> = self.goals.iter().map(|g| format!("{{\"desc\":\"{}\",\"priority\":{}}}", g.description, g.priority)).collect();
        json.push_str(&goal_elements.join(", "));
        json.push_str("],\n  \"tensor_space_head\": [");
        let tensor_elements: Vec<String> = self.tensor_space.iter().take(4).map(|v| format!("{:.4}", v)).collect();
        json.push_str(&tensor_elements.join(", "));
        json.push_str("],\n  \"context_len\": ");
        json.push_str(&self.context.len().to_string());
        json.push_str("\n}");
        json
    }
}
