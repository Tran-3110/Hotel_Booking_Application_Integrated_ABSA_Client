export interface BatchPredictResponse {
    totalComments: string;
    processedComments: string;
    successBatches: string;
    failedBatches: string;
    message: string;
}

export interface ReviewAspectResponse {
    id: string;
    content: string;
    aspect: string;
    sentiment: string;
    opinionWord: string; 
    createdAt: string;
}

export interface DashboardResponse {
    id: string;
    totalComments: number;
    commentsPredicted: number;
    reviewAspectsNewest: ReviewAspectResponse[] 
}