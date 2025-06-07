
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Quiz {
  quiz_id: string;
  title: string;
  status: string;
  form_url: string;
}

export interface CreateQuizRequest {
  content: string;
}

export interface CreateQuizResponse {
  quiz_id: string;
  title: string;
  status: string;
  form_url: string;
}

export const quizApi = {
  createQuiz: async (data: CreateQuizRequest): Promise<CreateQuizResponse> => {
    console.log('Creating quiz with data:', data);
    const response = await api.post('/quizzes/', data);
    console.log('Quiz created successfully:', response.data);
    return response.data;
  },

  getAllQuizzes: async (): Promise<Quiz[]> => {
    console.log('Fetching all quizzes...');
    const response = await api.get('/quizzes/');
    console.log('Quizzes fetched:', response.data);
    return response.data;
  },

  getQuizById: async (quizId: string): Promise<Quiz> => {
    console.log('Fetching quiz by ID:', quizId);
    const response = await api.get(`/quizzes/${quizId}`);
    console.log('Quiz details:', response.data);
    return response.data;
  },

  approveQuiz: async (quizId: string): Promise<void> => {
    console.log('Approving quiz:', quizId);
    await api.post(`/quizzes/${quizId}/approve`);
    console.log('Quiz approved successfully');
  },
};

export default api;
