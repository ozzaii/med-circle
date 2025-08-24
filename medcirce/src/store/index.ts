import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MedicalBook, UserProgress, AIResponse, StudySession, Note } from '../types';

interface AppState {
  // User state
  user: {
    id: string;
    name: string;
    level: 'student' | 'resident' | 'physician' | 'specialist';
  } | null;
  
  // Books state
  books: MedicalBook[];
  currentBook: MedicalBook | null;
  currentPage: number;
  
  // AI state
  aiHistory: AIResponse[];
  isAILoading: boolean;
  
  // Progress state
  userProgress: UserProgress | null;
  currentSession: StudySession | null;
  
  // UI state
  isSidebarOpen: boolean;
  isPdfViewerOpen: boolean;
  activeTab: 'library' | 'reading' | 'ai-chat' | 'progress';
  
  // Actions
  setUser: (user: AppState['user']) => void;
  setBooks: (books: MedicalBook[]) => void;
  setCurrentBook: (book: MedicalBook | null) => void;
  setCurrentPage: (page: number) => void;
  addAIResponse: (response: AIResponse) => void;
  setAILoading: (loading: boolean) => void;
  updateProgress: (progress: Partial<UserProgress>) => void;
  startStudySession: (bookId: string) => void;
  endStudySession: () => void;
  toggleSidebar: () => void;
  togglePdfViewer: () => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  addNote: (note: Note) => void;
  updateBookProgress: (bookId: string, progress: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      books: [],
      currentBook: null,
      currentPage: 1,
      aiHistory: [],
      isAILoading: false,
      userProgress: null,
      currentSession: null,
      isSidebarOpen: true,
      isPdfViewerOpen: false,
      activeTab: 'library',
      
      // Actions
      setUser: (user) => set({ user }),
      
      setBooks: (books) => set({ books }),
      
      setCurrentBook: (book) => set({ 
        currentBook: book, 
        currentPage: 1,
        isPdfViewerOpen: book !== null 
      }),
      
      setCurrentPage: (page) => {
        const { currentBook } = get();
        if (currentBook) {
          set({ 
            currentPage: page,
            books: get().books.map(b => 
              b.id === currentBook.id 
                ? { ...b, lastAccessed: new Date() }
                : b
            )
          });
        }
      },
      
      addAIResponse: (response) => set((state) => ({
        aiHistory: [...state.aiHistory, response]
      })),
      
      setAILoading: (loading) => set({ isAILoading: loading }),
      
      updateProgress: (progress) => set((state) => ({
        userProgress: state.userProgress 
          ? { ...state.userProgress, ...progress }
          : null
      })),
      
      startStudySession: (bookId) => {
        const sessionId = `session-${Date.now()}`;
        set({
          currentSession: {
            id: sessionId,
            startTime: new Date(),
            endTime: new Date(),
            bookId,
            pagesRead: 0,
            notesCreated: 0,
            aiInteractions: 0,
          }
        });
      },
      
      endStudySession: () => {
        const { currentSession, userProgress } = get();
        if (currentSession && userProgress) {
          const endedSession = {
            ...currentSession,
            endTime: new Date(),
          };
          
          set({
            currentSession: null,
            userProgress: {
              ...userProgress,
              totalStudyTime: userProgress.totalStudyTime + 
                (endedSession.endTime.getTime() - endedSession.startTime.getTime()) / 1000 / 60,
              studyHistory: [...userProgress.studyHistory, endedSession],
            }
          });
        }
      },
      
      toggleSidebar: () => set((state) => ({ 
        isSidebarOpen: !state.isSidebarOpen 
      })),
      
      togglePdfViewer: () => set((state) => ({ 
        isPdfViewerOpen: !state.isPdfViewerOpen 
      })),
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      addNote: (note) => {
        const { currentBook } = get();
        if (currentBook) {
          set({
            books: get().books.map(b => 
              b.id === currentBook.id 
                ? { ...b, notes: [...(b.notes || []), note] }
                : b
            ),
            currentBook: {
              ...currentBook,
              notes: [...(currentBook.notes || []), note]
            }
          });
        }
      },
      
      updateBookProgress: (bookId, progress) => {
        set({
          books: get().books.map(b => 
            b.id === bookId 
              ? { ...b, progress }
              : b
          )
        });
        
        const { currentBook } = get();
        if (currentBook?.id === bookId) {
          set({ currentBook: { ...currentBook, progress } });
        }
      },
    }),
    {
      name: 'medai-storage',
      partialize: (state) => ({
        user: state.user,
        books: state.books,
        userProgress: state.userProgress,
        aiHistory: state.aiHistory.slice(-50), // Keep only last 50 AI interactions
      }),
    }
  )
);