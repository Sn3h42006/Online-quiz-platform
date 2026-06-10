# QuizHub - Online Quiz Platform

## Overview
A comprehensive online quiz platform built with Next.js 16, Neon PostgreSQL, and Better Auth. The platform supports multiple question types (MCQ, True/False, Short Answer, Matching), user authentication, quiz creation, taking, analytics, and leaderboards.

## Project Structure

### Key Directories
```
app/
├── layout.tsx                          # Root layout with styling
├── page.tsx                            # Home page (redirects to dashboard)
├── dashboard/page.tsx                  # User dashboard
├── quiz/
│   ├── new/page.tsx                   # Create new quiz
│   ├── [id]/
│   │   ├── take/page.tsx              # Quiz taking interface
│   │   ├── edit/page.tsx              # Quiz editor
│   │   ├── results/[attemptId]/page.tsx # Results page
│   └── [id]/page.tsx                  # Quiz detail view
├── quizzes/page.tsx                   # Browse all public quizzes
├── leaderboard/[quizId]/page.tsx      # Quiz leaderboard
└── api/auth/[...all]/route.ts         # Auth endpoints

components/
├── ui/                                 # shadcn/ui components
├── dashboard/
│   ├── header.tsx                     # Dashboard header with user info
│   ├── user-stats-card.tsx            # User statistics card
│   └── quiz-browser.tsx               # Quiz browser component
├── quiz/
│   ├── creation-form.tsx              # Quiz creation form
│   ├── editor.tsx                     # Quiz editor main component
│   ├── question-form.tsx              # Question form wrapper
│   ├── question-list.tsx              # List of questions in editor
│   ├── question-renderer.tsx          # Renders all question types during quiz
│   └── question-types/
│       ├── mcq-form.tsx               # MCQ question editor
│       ├── true-false-form.tsx        # True/False editor
│       ├── short-answer-form.tsx      # Short answer editor
│       └── matching-form.tsx          # Matching pairs editor

lib/
├── auth.ts                            # Better Auth configuration
├── auth-client.ts                     # Client-side auth
├── db/
│   ├── index.ts                       # Drizzle ORM setup with pg Pool
│   └── schema.ts                      # Drizzle schema definitions
└── auth-simple.ts                     # Demo auth mock

app/actions/
└── quizzes.ts                         # Server actions for all quiz operations
```

## Database Schema

### Tables
1. **user** - Better Auth users table
2. **session** - Better Auth sessions
3. **account** - Better Auth accounts
4. **verification** - Better Auth email verification
5. **quizzes** - Quiz metadata (id, userId, title, description, category, isPublic)
6. **questions** - Questions (id, quizId, type, text, explanation, orderIndex)
7. **mcq_options** - MCQ options (id, questionId, text, isCorrect, orderIndex)
8. **true_false_questions** - True/False answers (id, questionId, correctAnswer)
9. **short_answer_questions** - Short answer keys (id, questionId, correctAnswers JSON)
10. **matching_pairs** - Matching pairs (id, questionId, leftText, rightText)
11. **quiz_attempts** - User attempts (id, userId, quizId, score, maxScore, percentage)
12. **question_responses** - Individual question responses
13. **user_stats** - User statistics (totalQuizzesTaken, avgScore, etc.)
14. **quiz_stats** - Quiz statistics (totalAttempts, avgScore, totalParticipants)

## Features

### Core Functionality
✅ **Quiz Creation**
- Create unlimited quizzes
- Add multiple question types
- Set descriptions and categories
- Publish/unpublish quizzes

✅ **Quiz Taking**
- Answer 4 question types:
  - Multiple Choice (MCQ)
  - True/False
  - Short Answer
  - Matching Pairs
- Track progress with progress bar
- Navigate between questions
- Submit and get immediate scoring

✅ **Analytics & Leaderboards**
- User dashboard with stats
- Personal quiz history
- Quiz-specific leaderboards
- Average scores and participation rates
- User performance tracking

✅ **User Management**
- User registration and login
- User profiles
- Session management
- User statistics and history

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library

### Backend
- **Next.js API Routes** - Serverless functions
- **Server Actions** - Direct database mutations

### Database
- **Neon PostgreSQL** - Managed Postgres
- **Drizzle ORM** - Type-safe SQL query builder

### Authentication
- **Better Auth** - Modern auth solution
- **Session-based** - Secure session management

## Installation & Setup

### Prerequisites
```bash
Node.js 18+ 
pnpm (or npm/yarn)
```

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Create `.env.local`:
```
DATABASE_URL=postgresql://user:password@host/dbname
BETTER_AUTH_SECRET=your-secret-key-here (generate with: openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3000 (in production, use your domain)
```

### 3. Set Up Database
```bash
# Create tables (run SQL from the schema migrations)
pnpm exec drizzle-kit push:pg
```

### 4. Run Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000`

## API & Server Actions

### Quiz Operations (`app/actions/quizzes.ts`)

**Create Quiz**
```typescript
const quizId = await createQuiz({
  title: 'Sample Quiz',
  description: 'Test quiz',
  category: 'Education',
  isPublic: true
})
```

**Get Quizzes**
```typescript
const myQuizzes = await getMyQuizzes() // User's own quizzes
const publicQuizzes = await getPublicQuizzes() // All public quizzes
const quiz = await getQuizWithQuestions(id) // Quiz with questions
```

**Create Questions**
```typescript
const questionId = await addQuestion(quizId, {
  type: 'mcq',
  text: 'What is 2+2?',
  explanation: 'The answer is 4'
})
```

**Submit Quiz Attempt**
```typescript
const result = await submitQuizAttempt(quizId, answers, timeSpent)
// Returns: { attemptId, score, maxScore, percentage }
```

**Get Results**
```typescript
const results = await getAttemptResults(attemptId)
const leaderboard = await getQuizLeaderboard(quizId)
```

## Styling & Design

### Color Palette
- **Primary**: Indigo/Blue (oklch(0.52 0.225 264.376))
- **Secondary**: Orange (oklch(0.49 0.195 10.015))
- **Accent**: Golden (oklch(0.68 0.189 29.234))
- **Neutrals**: Light & dark modes with proper contrast

### Typography
- **Headings**: System fonts
- **Body**: System sans-serif
- **Monospace**: System mono fonts

## Key Components

### Dashboard
- Displays user stats (quizzes taken, average score)
- Lists user's created quizzes
- Quick action buttons (Create Quiz, Browse Quizzes)

### Quiz Taker
- Full-screen quiz interface
- Progress bar
- Question navigation
- Real-time scoring
- Results display with detailed review

### Quiz Editor
- Drag-to-reorder questions
- Add/edit/delete questions
- Question-type specific editors
- MCQ option management
- Matching pair configuration

### Leaderboard
- Ranked users by score
- Top 3 with medals
- Multiple attempt tracking
- Average scores

## Security Considerations

1. **Authentication**: Better Auth handles password hashing & sessions
2. **Authorization**: userId scoping on all user-specific queries
3. **SQL Injection Prevention**: Drizzle ORM parameterized queries
4. **CSRF**: Next.js built-in CSRF protection
5. **Session Security**: HttpOnly cookies, same-site settings

## Performance Optimizations

1. **Server Components** - Default for better performance
2. **Server Actions** - Direct database access without API overhead
3. **Image Optimization** - Next.js Image component
4. **Caching**: React.cache() for request deduplication
5. **Code Splitting**: Automatic Next.js code splitting

## Deployment

### To Vercel
```bash
# Connect your GitHub repo
vercel link

# Deploy
vercel deploy
```

### Environment Setup on Vercel
1. Go to Project Settings → Environment Variables
2. Add `DATABASE_URL` from Neon
3. Add `BETTER_AUTH_SECRET`
4. Add `BETTER_AUTH_URL=https://your-domain.vercel.app`

## Future Enhancements

1. **Real-time Collaboration** - Live quiz creation with others
2. **Advanced Analytics** - Charts, trends, insights
3. **Quiz Templates** - Pre-built quiz templates
4. **Integration** - Slack, Discord bot, LMS
5. **Mobile App** - React Native version
6. **Social Features** - Quiz sharing, comments, ratings
7. **AI Features** - Auto-generate questions from text
8. **Payments** - Premium features, custom branding

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Neon project is active
- Ensure firewall allows connections

### Authentication Issues
- Verify `BETTER_AUTH_SECRET` is set
- Check `BETTER_AUTH_URL` matches domain
- Clear cookies and try again

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Check Node version: `node -v` (should be 18+)

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **Better Auth**: https://www.better-auth.com
- **Neon**: https://neon.tech/docs
- **Tailwind CSS**: https://tailwindcss.com

## License

MIT - Free to use and modify

---

Built with ❤️ using v0 and modern web technologies
