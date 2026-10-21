export type MealPlanStatus =
    | 'AI_DRAFT'
    | 'PENDING_REVIEW'
    | 'APPROVED'
    | 'REJECTED';

export type ReviewMeal = {
    mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
    menuName: string;
    reason: string;
    estimatedCalories?: number;
    estimatedSodiumMg?: number;
};

export type DietPlanReview = {
    id?: string;
    patientId: string;
    status: MealPlanStatus;
    dailySummary: string;
    meals: ReviewMeal[];
    warningMessage?: string;
    reviewNote: string;
};