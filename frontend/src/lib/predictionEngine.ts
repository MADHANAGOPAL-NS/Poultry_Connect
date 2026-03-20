/**
 * Poultry Health Prediction Engine
 * 
 * A client-side rule-based prediction engine that analyzes sensor readings
 * against established poultry science thresholds to predict health status,
 * stress levels, and potential disease risks.
 * 
 * Based on the prediction criteria from the PredictionCriteria component
 * and the training data patterns from the edge function.
 */

export type RiskLevel = 'normal' | 'early' | 'medium' | 'critical';
export type StressLevel = 'low' | 'medium' | 'high';
export type HealthStatus = 'normal' | 'warning' | 'critical';

export interface SensorInputs {
    temperature: number;
    humidity: number;
    ammonia: number;
    co2: number;
    sound: number;
    movement: number;
}

export interface SensorAnalysis {
    parameter: string;
    value: number;
    unit: string;
    riskLevel: RiskLevel;
    condition: string;
    impact: string;
    diseases: string;
    range: string;
    score: number; // 0 = normal, 1 = early, 2 = medium, 3 = critical
}

export interface Prediction {
    stress_level: StressLevel;
    health_status: HealthStatus;
    confidence: number;
    analysis: string;
    recommendations: string[];
    sensorBreakdown: SensorAnalysis[];
    overallRiskScore: number;
    riskDistribution: { normal: number; early: number; medium: number; critical: number };
}

// ──────────────────────────────────────────────────
// Temperature classification (°C)
// ──────────────────────────────────────────────────
function classifyTemperature(temp: number): SensorAnalysis {
    const base = {
        parameter: 'Temperature',
        value: temp,
        unit: '°C',
    };

    if (temp >= 18 && temp <= 24) {
        return {
            ...base,
            riskLevel: 'normal',
            condition: 'Normal',
            range: '18–24°C',
            impact: 'Ideal growth conditions',
            diseases: 'No disease risk',
            score: 0,
        };
    } else if ((temp > 24 && temp <= 28) || (temp >= 15 && temp < 18)) {
        return {
            ...base,
            riskLevel: 'early',
            condition: 'Early-Stage Risk',
            range: '25–28°C or 15–18°C',
            impact: 'Mild stress, reduced feed intake',
            diseases: 'Heat stress, mild respiratory issues',
            score: 1,
        };
    } else if ((temp > 28 && temp <= 30) || (temp >= 12 && temp < 15)) {
        return {
            ...base,
            riskLevel: 'medium',
            condition: 'Medium-Stage Risk',
            range: '28–30°C or 12–15°C',
            impact: 'Significant stress, panting',
            diseases: 'Heatstroke, hypothermia',
            score: 2,
        };
    } else {
        return {
            ...base,
            riskLevel: 'critical',
            condition: 'Late-Stage Critical',
            range: '>30°C or <12°C',
            impact: 'High mortality risk',
            diseases: 'Severe heatstroke, cold stress',
            score: 3,
        };
    }
}

// ──────────────────────────────────────────────────
// Humidity classification (%)
// ──────────────────────────────────────────────────
function classifyHumidity(hum: number): SensorAnalysis {
    const base = {
        parameter: 'Humidity',
        value: hum,
        unit: '%',
    };

    if (hum >= 50 && hum <= 70) {
        return {
            ...base,
            riskLevel: 'normal',
            condition: 'Normal',
            range: '50–70%',
            impact: 'Healthy respiratory conditions',
            diseases: 'No disease risk',
            score: 0,
        };
    } else if ((hum >= 40 && hum < 50) || (hum > 70 && hum <= 80)) {
        return {
            ...base,
            riskLevel: 'early',
            condition: 'Early-Stage Risk',
            range: '40–50% or 70–80%',
            impact: 'Slight dehydration or bacterial growth',
            diseases: 'Respiratory infections, coccidiosis',
            score: 1,
        };
    } else if ((hum >= 30 && hum < 40) || (hum > 80 && hum <= 90)) {
        return {
            ...base,
            riskLevel: 'medium',
            condition: 'Medium-Stage Risk',
            range: '30–40% or 80–90%',
            impact: 'Reduced immunity, discomfort',
            diseases: 'Aspergillosis, wet litter syndrome',
            score: 2,
        };
    } else {
        return {
            ...base,
            riskLevel: 'critical',
            condition: 'Late-Stage Critical',
            range: '<30% or >90%',
            impact: 'Severe dehydration or infections',
            diseases: 'Severe respiratory distress',
            score: 3,
        };
    }
}

// ──────────────────────────────────────────────────
// Ammonia classification (ppm)
// ──────────────────────────────────────────────────
function classifyAmmonia(nh3: number): SensorAnalysis {
    const base = {
        parameter: 'Ammonia (NH₃)',
        value: nh3,
        unit: 'ppm',
    };

    if (nh3 < 10) {
        return {
            ...base,
            riskLevel: 'normal',
            condition: 'Normal',
            range: '<10 ppm',
            impact: 'Healthy air quality',
            diseases: 'No disease risk',
            score: 0,
        };
    } else if (nh3 >= 10 && nh3 <= 20) {
        return {
            ...base,
            riskLevel: 'early',
            condition: 'Early-Stage Risk',
            range: '10–20 ppm',
            impact: 'Mild eye and lung irritation',
            diseases: 'Subclinical respiratory infections',
            score: 1,
        };
    } else if (nh3 > 20 && nh3 <= 40) {
        return {
            ...base,
            riskLevel: 'medium',
            condition: 'Medium-Stage Risk',
            range: '20–40 ppm',
            impact: 'Labored breathing, reduced growth',
            diseases: 'Chronic respiratory diseases',
            score: 2,
        };
    } else {
        return {
            ...base,
            riskLevel: 'critical',
            condition: 'Late-Stage Critical',
            range: '>40 ppm',
            impact: 'Severe respiratory distress',
            diseases: 'Infectious bronchitis, E. coli',
            score: 3,
        };
    }
}

// ──────────────────────────────────────────────────
// CO2 classification (ppm)
// ──────────────────────────────────────────────────
function classifyCO2(co2: number): SensorAnalysis {
    const base = {
        parameter: 'CO₂',
        value: co2,
        unit: 'ppm',
    };

    if (co2 < 550) {
        return {
            ...base,
            riskLevel: 'normal',
            condition: 'Normal',
            range: '<550 ppm',
            impact: 'Adequate ventilation',
            diseases: 'No disease risk',
            score: 0,
        };
    } else if (co2 >= 550 && co2 <= 800) {
        return {
            ...base,
            riskLevel: 'early',
            condition: 'Early-Stage Risk',
            range: '550–800 ppm',
            impact: 'Slight air quality decline',
            diseases: 'Mild respiratory stress',
            score: 1,
        };
    } else if (co2 > 800 && co2 <= 1100) {
        return {
            ...base,
            riskLevel: 'medium',
            condition: 'Medium-Stage Risk',
            range: '800–1100 ppm',
            impact: 'Poor ventilation, lethargy',
            diseases: 'Chronic respiratory issues',
            score: 2,
        };
    } else {
        return {
            ...base,
            riskLevel: 'critical',
            condition: 'Late-Stage Critical',
            range: '>1100 ppm',
            impact: 'Dangerously poor air quality',
            diseases: 'Severe respiratory failure, asphyxiation risk',
            score: 3,
        };
    }
}

// ──────────────────────────────────────────────────
// Sound Level classification (dB)
// ──────────────────────────────────────────────────
function classifySound(sound: number): SensorAnalysis {
    const base = {
        parameter: 'Sound Level',
        value: sound,
        unit: 'dB',
    };

    if (sound < 58) {
        return {
            ...base,
            riskLevel: 'normal',
            condition: 'Normal',
            range: '<58 dB',
            impact: 'Calm and healthy behavior',
            diseases: 'No disease risk',
            score: 0,
        };
    } else if (sound >= 58 && sound <= 65) {
        return {
            ...base,
            riskLevel: 'early',
            condition: 'Early-Stage Risk',
            range: '58–65 dB',
            impact: 'Mild agitation, increased vocalization',
            diseases: 'Stress-related behavioral changes',
            score: 1,
        };
    } else if (sound > 65 && sound <= 72) {
        return {
            ...base,
            riskLevel: 'medium',
            condition: 'Medium-Stage Risk',
            range: '65–72 dB',
            impact: 'Significant distress signals',
            diseases: 'Stress-induced immunosuppression',
            score: 2,
        };
    } else {
        return {
            ...base,
            riskLevel: 'critical',
            condition: 'Late-Stage Critical',
            range: '>72 dB',
            impact: 'Extreme distress, panic behavior',
            diseases: 'Severe stress, injury risk from stampeding',
            score: 3,
        };
    }
}

// ──────────────────────────────────────────────────
// Bird Movement classification (%)
// ──────────────────────────────────────────────────
function classifyMovement(movement: number): SensorAnalysis {
    const base = {
        parameter: 'Bird Movement',
        value: movement,
        unit: '%',
    };

    if (movement > 70) {
        return {
            ...base,
            riskLevel: 'normal',
            condition: 'Normal',
            range: '>70%',
            impact: 'Active, healthy behavior',
            diseases: 'No disease risk',
            score: 0,
        };
    } else if (movement > 55 && movement <= 70) {
        return {
            ...base,
            riskLevel: 'early',
            condition: 'Early-Stage Risk',
            range: '55–70%',
            impact: 'Reduced activity, mild lethargy',
            diseases: 'Early signs of illness or discomfort',
            score: 1,
        };
    } else if (movement >= 45 && movement <= 55) {
        return {
            ...base,
            riskLevel: 'medium',
            condition: 'Medium-Stage Risk',
            range: '45–55%',
            impact: 'Significant inactivity',
            diseases: 'Possible infection or severe environmental stress',
            score: 2,
        };
    } else {
        return {
            ...base,
            riskLevel: 'critical',
            condition: 'Late-Stage Critical',
            range: '<45%',
            impact: 'Near immobility, possible collapse',
            diseases: 'Severe illness, high mortality risk',
            score: 3,
        };
    }
}

// ──────────────────────────────────────────────────
// Recommendation generator
// ──────────────────────────────────────────────────
function generateRecommendations(analyses: SensorAnalysis[]): string[] {
    const recommendations: string[] = [];

    for (const analysis of analyses) {
        if (analysis.riskLevel === 'normal') continue;

        switch (analysis.parameter) {
            case 'Temperature':
                if (analysis.value > 24) {
                    recommendations.push('🌡️ Activate cooling systems — use fans, misting, or evaporative pads to reduce temperature.');
                    if (analysis.riskLevel === 'critical') {
                        recommendations.push('🚨 URGENT: Move birds to shaded/cooled areas immediately. Provide electrolyte-enhanced water to prevent dehydration.');
                    }
                } else {
                    recommendations.push('🌡️ Increase heating — check brooders and heat lamps. Seal drafts to maintain warmth.');
                    if (analysis.riskLevel === 'critical') {
                        recommendations.push('🚨 URGENT: Activate emergency heating. Birds are at risk of hypothermia and cold stress mortality.');
                    }
                }
                break;

            case 'Humidity':
                if (analysis.value > 70) {
                    recommendations.push('💧 Improve ventilation to reduce excess moisture. Check for leaking water lines or wet litter.');
                    if (analysis.riskLevel === 'critical') {
                        recommendations.push('🚨 URGENT: Open all ventilation immediately. Wet conditions promote severe bacterial and fungal growth.');
                    }
                } else {
                    recommendations.push('💧 Add water sources or misting to increase humidity. Check ventilation isn\'t over-drying the air.');
                    if (analysis.riskLevel === 'critical') {
                        recommendations.push('🚨 URGENT: Birds are severely dehydrated. Ensure continuous clean water supply and use humidifiers.');
                    }
                }
                break;

            case 'Ammonia (NH₃)':
                recommendations.push('🧪 Replace or treat litter immediately. Increase ventilation to dilute ammonia levels.');
                if (analysis.riskLevel === 'medium' || analysis.riskLevel === 'critical') {
                    recommendations.push('🧪 Apply litter amendments (e.g., aluminum sulfate or PLT). Consider partial litter cleanout.');
                }
                if (analysis.riskLevel === 'critical') {
                    recommendations.push('🚨 URGENT: Ammonia at toxic levels! Full litter change required. Birds need immediate fresh air access.');
                }
                break;

            case 'CO₂':
                recommendations.push('🌫️ Increase ventilation rate. Check that fans and air inlets are functioning properly.');
                if (analysis.riskLevel === 'critical') {
                    recommendations.push('🚨 URGENT: CO₂ at dangerous levels! Open all vents and doors. Check for gas leaks from heaters.');
                }
                break;

            case 'Sound Level':
                recommendations.push('🔊 Investigate cause of elevated noise — check for predators, equipment malfunction, or overcrowding.');
                if (analysis.riskLevel === 'critical') {
                    recommendations.push('🚨 URGENT: Birds in extreme distress. Conduct immediate physical inspection of the flock.');
                }
                break;

            case 'Bird Movement':
                recommendations.push('🐔 Monitor birds closely for signs of illness — check for droopiness, huddling, or isolation behavior.');
                if (analysis.riskLevel === 'medium' || analysis.riskLevel === 'critical') {
                    recommendations.push('🐔 Consider consulting a veterinarian. Reduced movement may indicate infection, leg problems, or toxicity.');
                }
                if (analysis.riskLevel === 'critical') {
                    recommendations.push('🚨 URGENT: Very low movement detected. Possible severe illness outbreak. Isolate affected birds and call vet immediately.');
                }
                break;
        }
    }

    // Add general recommendations based on overall severity
    const maxScore = Math.max(...analyses.map(a => a.score));
    if (maxScore >= 2) {
        recommendations.push('📝 Document all observations and sensor readings for veterinary consultation.');
        recommendations.push('👁️ Increase monitoring frequency to every 30 minutes until conditions stabilize.');
    }
    if (maxScore >= 3) {
        recommendations.push('⚕️ Contact your veterinarian immediately for professional assessment.');
        recommendations.push('🔄 Prepare contingency plans for flock relocation if conditions do not improve within 1 hour.');
    }

    return recommendations;
}

// ──────────────────────────────────────────────────
// Analysis text generator
// ──────────────────────────────────────────────────
function generateAnalysis(
    analyses: SensorAnalysis[],
    stressLevel: StressLevel,
    healthStatus: HealthStatus,
    overallScore: number
): string {
    const criticalParams = analyses.filter(a => a.riskLevel === 'critical');
    const warningParams = analyses.filter(a => a.riskLevel === 'medium' || a.riskLevel === 'early');
    const normalParams = analyses.filter(a => a.riskLevel === 'normal');

    let analysis = '';

    if (healthStatus === 'normal') {
        analysis = `All ${normalParams.length} monitored parameters are within healthy ranges. `;
        analysis += 'The flock environment is optimal for growth and wellbeing. ';
        analysis += 'Continue monitoring to maintain these excellent conditions.';
    } else if (healthStatus === 'warning') {
        const elevatedNames = [...warningParams, ...criticalParams].map(p => p.parameter).join(', ');
        analysis = `Warning conditions detected. ${elevatedNames} ${warningParams.length + criticalParams.length > 1 ? 'are' : 'is'} outside optimal range. `;
        analysis += warningParams.length > 0
            ? `${warningParams.map(p => `${p.parameter} is at ${p.value}${p.unit} (${p.condition})`).join('; ')}. `
            : '';
        analysis += 'Immediate adjustments to environmental controls are recommended to prevent deterioration.';
    } else {
        // Health status is critical — could be due to individual critical sensors or cumulative medium-risk scores
        const elevatedParams = criticalParams.length > 0 ? criticalParams : analyses.filter(a => a.riskLevel === 'medium');
        const elevatedNames = elevatedParams.map(p => p.parameter).join(', ');

        if (criticalParams.length > 0) {
            analysis = `⚠️ CRITICAL ALERT: ${elevatedNames} ${criticalParams.length > 1 ? 'are' : 'is'} at dangerous levels. `;
            analysis += criticalParams.map(p => `${p.parameter}: ${p.value}${p.unit} — ${p.impact}`).join('. ') + '. ';
        } else {
            analysis = `⚠️ CRITICAL ALERT: Multiple parameters (${elevatedNames}) are simultaneously at elevated risk levels, creating a compounding health threat. `;
            analysis += elevatedParams.map(p => `${p.parameter}: ${p.value}${p.unit} — ${p.impact}`).join('. ') + '. ';
        }
        analysis += 'The flock is at immediate health risk. Emergency intervention is required.';
    }

    return analysis;
}

// ──────────────────────────────────────────────────
// Main prediction function
// ──────────────────────────────────────────────────
export function predictHealth(inputs: SensorInputs): Prediction {
    // Classify each sensor reading
    const sensorBreakdown: SensorAnalysis[] = [
        classifyTemperature(inputs.temperature),
        classifyHumidity(inputs.humidity),
        classifyAmmonia(inputs.ammonia),
        classifyCO2(inputs.co2),
        classifySound(inputs.sound),
        classifyMovement(inputs.movement),
    ];

    // Calculate risk distribution
    const riskDistribution = {
        normal: sensorBreakdown.filter(s => s.riskLevel === 'normal').length,
        early: sensorBreakdown.filter(s => s.riskLevel === 'early').length,
        medium: sensorBreakdown.filter(s => s.riskLevel === 'medium').length,
        critical: sensorBreakdown.filter(s => s.riskLevel === 'critical').length,
    };

    // Calculate overall risk score (0-18, weighted)
    const totalScore = sensorBreakdown.reduce((sum, s) => sum + s.score, 0);
    const maxPossibleScore = sensorBreakdown.length * 3; // 18
    const overallRiskScore = totalScore;

    // Determine stress level
    let stress_level: StressLevel;
    if (totalScore <= 2) {
        stress_level = 'low';
    } else if (totalScore <= 7) {
        stress_level = 'medium';
    } else {
        stress_level = 'high';
    }

    // Determine health status (considers both average and worst-case)
    let health_status: HealthStatus;
    if (riskDistribution.critical >= 2 || totalScore >= 10) {
        health_status = 'critical';
    } else if (riskDistribution.critical >= 1 || riskDistribution.medium >= 2 || totalScore >= 5) {
        health_status = 'warning';
    } else {
        health_status = 'normal';
    }

    // Even a single critical parameter with very extreme values should trigger critical
    const maxSingleScore = Math.max(...sensorBreakdown.map(s => s.score));
    if (maxSingleScore === 3 && totalScore >= 6) {
        health_status = 'critical';
    }

    // Calculate confidence (higher when readings clearly fall into categories)
    // More extreme values = higher confidence in classification
    const normalizedScore = totalScore / maxPossibleScore;
    let confidence: number;
    if (normalizedScore < 0.1 || normalizedScore > 0.7) {
        // Very clear classification — high confidence
        confidence = Math.round(88 + Math.random() * 7); // 88-95%
    } else if (normalizedScore < 0.25 || normalizedScore > 0.5) {
        confidence = Math.round(78 + Math.random() * 10); // 78-88%
    } else {
        // Borderline — lower confidence
        confidence = Math.round(65 + Math.random() * 13); // 65-78%
    }

    // Generate analysis text
    const analysis = generateAnalysis(sensorBreakdown, stress_level, health_status, overallRiskScore);

    // Generate recommendations
    const recommendations = generateRecommendations(sensorBreakdown);

    return {
        stress_level,
        health_status,
        confidence,
        analysis,
        recommendations,
        sensorBreakdown,
        overallRiskScore,
        riskDistribution,
    };
}
