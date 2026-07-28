import { UserDto } from "./user";

export interface CommentResponse {
    commentId: string,
    content: string,
    rating: number,
    user: UserDto,
    sentiments: SentimentAspect[]
    updatedAt: string
}

export interface SentimentAspect {
    aspect: string,
    sentiment: string,
    opinionWord: string
}