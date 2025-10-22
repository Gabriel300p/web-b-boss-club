/**
 * 📊 Types para Score System V3
 */

export interface ScoreComponent {
  value: number;
  percentage: number;
  description: string;
  icon?: string;
}

export interface BonusDetails {
  name: string;
  value: number;
  achieved: boolean;
  reason: string;
  progress: number;
  tip?: string;
}

export interface PenaltyDetails {
  name: string;
  value: number;
  applied: boolean;
  reason: string;
  tip?: string;
}

export interface ScoreBreakdownDetailed {
  // Base info
  score: number;
  scoreLevel: "critical" | "good" | "excellent";
  color: "green" | "yellow" | "red";
  lastUpdated: string;

  // Quick breakdown (para tooltip)
  quickBreakdown: {
    rating: ScoreComponent;
    volume: ScoreComponent;
    totalBonuses: number;
    totalPenalties: number;
  };

  // Detailed breakdown (para modal)
  detailedBreakdown: {
    rating: {
      component: ScoreComponent;
      averageRating: number;
      totalReviews: number;
      starDistribution: {
        "5": number;
        "4": number;
        "3": number;
        "2": number;
        "1": number;
      };
    };
    volume: {
      component: ScoreComponent;
      totalAttendances: number;
      targetAttendances: number;
      achievementPercentage: number;
      dailyAverage: number;
    };
    bonuses: {
      recency: BonusDetails;
      consistency: BonusDetails;
      validation: BonusDetails;
      momentum: BonusDetails;
    };
    penalties: {
      lowRating: PenaltyDetails;
      inactivity: PenaltyDetails;
    };
    calculation: {
      formula: string;
      steps: Array<{
        step: number;
        description: string;
        calculation: string;
        result: number;
      }>;
    };
  };

  // History
  history: Array<{
    date: string;
    score: number;
    level: string;
  }>;

  // Insights
  insights: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };

  // V3 specific (retornado pelo backend mas não está no tipo base)
  staffId?: string;
  staffName?: string;
  insufficientData?: boolean;
  insufficientDataReason?: string;
  barbershopSize?: "SMALL" | "MEDIUM" | "LARGE";
  targetAttendances?: number;
  isInRampPeriod?: boolean;
  daysWorking?: number;
}
