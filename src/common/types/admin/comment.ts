export interface SentimentAspectResponse {
    id: string;
    aspect: string;
    sentiment: string;
    opinionWord: string;
    createdAt: string; 
    updatedAt: string;
}

export interface AdminCommentResponse {
    id: string;
    username: string;
    email: string;
    avatarUrl: string;
    content: string;
    rating: number; 
    isActive: boolean;
    sentimentAspects: SentimentAspectResponse[];
    createdAt: string;
    updatedAt: string;
}