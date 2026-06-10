import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  primaryKey,
  foreignKey,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Better Auth Tables (required)
export const user = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').notNull().primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  userId: text('userId').notNull(),
})

export const account = pgTable('account', {
  id: text('id').notNull().primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').notNull().primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Quiz Platform Tables
export const quizzes = pgTable('quizzes', {
  id: text('id').notNull().primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'),
  isPublic: boolean('isPublic').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const questions = pgTable('questions', {
  id: text('id').notNull().primaryKey(),
  quizId: text('quizId').notNull(),
  type: text('type').notNull(), // mcq, true_false, short_answer, matching
  text: text('text').notNull(),
  explanation: text('explanation'),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const mcqOptions = pgTable('mcq_options', {
  id: text('id').notNull().primaryKey(),
  questionId: text('questionId').notNull(),
  text: text('text').notNull(),
  isCorrect: boolean('isCorrect').notNull().default(false),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const trueFalseQuestions = pgTable('true_false_questions', {
  id: text('id').notNull().primaryKey(),
  questionId: text('questionId').notNull(),
  correctAnswer: boolean('correctAnswer').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const shortAnswerQuestions = pgTable('short_answer_questions', {
  id: text('id').notNull().primaryKey(),
  questionId: text('questionId').notNull(),
  correctAnswers: text('correctAnswers').notNull(), // JSON array of acceptable answers
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const matchingPairs = pgTable('matching_pairs', {
  id: text('id').notNull().primaryKey(),
  questionId: text('questionId').notNull(),
  leftText: text('leftText').notNull(),
  rightText: text('rightText').notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const quizAttempts = pgTable('quiz_attempts', {
  id: text('id').notNull().primaryKey(),
  userId: text('userId').notNull(),
  quizId: text('quizId').notNull(),
  score: integer('score').notNull(),
  maxScore: integer('maxScore').notNull(),
  percentage: decimal('percentage', { precision: 5, scale: 2 }).notNull(),
  startedAt: timestamp('startedAt').notNull(),
  completedAt: timestamp('completedAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const questionResponses = pgTable('question_responses', {
  id: text('id').notNull().primaryKey(),
  attemptId: text('attemptId').notNull(),
  questionId: text('questionId').notNull(),
  userResponse: text('userResponse').notNull(),
  isCorrect: boolean('isCorrect').notNull(),
  score: integer('score').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const userStats = pgTable('user_stats', {
  id: text('id').notNull().primaryKey(),
  userId: text('userId').notNull().unique(),
  totalQuizzesTaken: integer('totalQuizzesTaken').notNull().default(0),
  totalQuestionsAnswered: integer('totalQuestionsAnswered').notNull().default(0),
  totalCorrectAnswers: integer('totalCorrectAnswers').notNull().default(0),
  averageScore: decimal('averageScore', { precision: 5, scale: 2 }).notNull().default('0'),
  totalTimeSpent: integer('totalTimeSpent').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const quizStats = pgTable('quiz_stats', {
  id: text('id').notNull().primaryKey(),
  quizId: text('quizId').notNull().unique(),
  totalAttempts: integer('totalAttempts').notNull().default(0),
  averageScore: decimal('averageScore', { precision: 5, scale: 2 }).notNull().default('0'),
  totalParticipants: integer('totalParticipants').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Relations
export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
  attempts: many(quizAttempts),
}))

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
  mcqOptions: many(mcqOptions),
  trueFalse: many(trueFalseQuestions),
  shortAnswer: many(shortAnswerQuestions),
  matchingPairs: many(matchingPairs),
}))

export const quizAttemptsRelations = relations(quizAttempts, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
  responses: many(questionResponses),
}))
