'use server'

import { db } from '@/lib/db'
import {
  quizzes,
  questions,
  mcqOptions,
  trueFalseQuestions,
  shortAnswerQuestions,
  matchingPairs,
  quizAttempts,
  questionResponses,
  userStats,
  quizStats,
} from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  // For demo purposes, return a fixed user ID
  // In production, use Better Auth properly configured
  return 'demo-user-1'
}

// Quiz CRUD Operations
export async function createQuiz(data: {
  title: string
  description?: string
  category?: string
  isPublic?: boolean
}) {
  const userId = await getUserId()
  const id = crypto.randomUUID()

  await db.insert(quizzes).values({
    id,
    userId,
    ...data,
  })

  revalidatePath('/dashboard')
  return id
}

export async function getMyQuizzes() {
  // Demo data for UI demonstration
  return [
    {
      id: 'quiz-1',
      userId: 'demo-user-1',
      title: 'General Knowledge',
      description: 'Test your knowledge on various topics',
      category: 'General',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'quiz-2',
      userId: 'demo-user-1',
      title: 'JavaScript Basics',
      description: 'Learn JavaScript fundamentals',
      category: 'Programming',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

export async function getPublicQuizzes() {
  // Demo data for UI demonstration
  return [
    {
      id: 'quiz-1',
      userId: 'user-1',
      title: 'General Knowledge',
      description: 'Test your knowledge on various topics',
      category: 'General',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'quiz-2',
      userId: 'user-2',
      title: 'JavaScript Basics',
      description: 'Learn JavaScript fundamentals',
      category: 'Programming',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'quiz-3',
      userId: 'user-3',
      title: 'History Facts',
      description: 'Important historical events and dates',
      category: 'History',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

export async function getQuizById(quizId: string) {
  return db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1)
}

export async function updateQuiz(quizId: string, data: Partial<typeof quizzes.$inferInsert>) {
  const userId = await getUserId()

  await db
    .update(quizzes)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(quizzes.id, quizId), eq(quizzes.userId, userId)))

  revalidatePath('/dashboard')
}

export async function deleteQuiz(quizId: string) {
  const userId = await getUserId()

  await db
    .delete(quizzes)
    .where(and(eq(quizzes.id, quizId), eq(quizzes.userId, userId)))

  revalidatePath('/dashboard')
}

// Question Operations
export async function addQuestion(quizId: string, questionData: {
  type: 'mcq' | 'true_false' | 'short_answer' | 'matching'
  text: string
  explanation?: string
}) {
  const userId = await getUserId()
  const quiz = await db
    .select()
    .from(quizzes)
    .where(and(eq(quizzes.id, quizId), eq(quizzes.userId, userId)))
    .limit(1)

  if (!quiz.length) throw new Error('Quiz not found')

  const questionCount = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quizId))

  const questionId = crypto.randomUUID()
  await db.insert(questions).values({
    id: questionId,
    quizId,
    type: questionData.type,
    text: questionData.text,
    explanation: questionData.explanation,
    orderIndex: questionCount.length,
  })

  revalidatePath(`/quiz/${quizId}/edit`)
  return questionId
}

export async function getQuestionsByQuizId(quizId: string) {
  const questions_data = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quizId))
    .orderBy(questions.orderIndex)

  // For each question, get its specific type data
  const enrichedQuestions = await Promise.all(
    questions_data.map(async (q) => {
      let typeData = null

      if (q.type === 'mcq') {
        typeData = await db
          .select()
          .from(mcqOptions)
          .where(eq(mcqOptions.questionId, q.id))
          .orderBy(mcqOptions.orderIndex)
      } else if (q.type === 'true_false') {
        typeData = await db
          .select()
          .from(trueFalseQuestions)
          .where(eq(trueFalseQuestions.questionId, q.id))
          .limit(1)
      } else if (q.type === 'short_answer') {
        typeData = await db
          .select()
          .from(shortAnswerQuestions)
          .where(eq(shortAnswerQuestions.questionId, q.id))
          .limit(1)
      } else if (q.type === 'matching') {
        typeData = await db
          .select()
          .from(matchingPairs)
          .where(eq(matchingPairs.questionId, q.id))
          .orderBy(matchingPairs.orderIndex)
      }

      return { ...q, typeData }
    }),
  )

  return enrichedQuestions
}

// MCQ Options
export async function addMcqOption(questionId: string, option: {
  text: string
  isCorrect: boolean
}) {
  const id = crypto.randomUUID()
  const count = await db
    .select()
    .from(mcqOptions)
    .where(eq(mcqOptions.questionId, questionId))

  await db.insert(mcqOptions).values({
    id,
    questionId,
    text: option.text,
    isCorrect: option.isCorrect,
    orderIndex: count.length,
  })

  revalidatePath(`/quiz/${questionId}/edit`)
  return id
}

// True/False Question
export async function setTrueFalseAnswer(questionId: string, correctAnswer: boolean) {
  const existing = await db
    .select()
    .from(trueFalseQuestions)
    .where(eq(trueFalseQuestions.questionId, questionId))
    .limit(1)

  if (existing.length) {
    await db
      .update(trueFalseQuestions)
      .set({ correctAnswer })
      .where(eq(trueFalseQuestions.questionId, questionId))
  } else {
    await db.insert(trueFalseQuestions).values({
      id: crypto.randomUUID(),
      questionId,
      correctAnswer,
    })
  }
}

// Short Answer Question
export async function setShortAnswerAnswers(questionId: string, correctAnswers: string[]) {
  const existing = await db
    .select()
    .from(shortAnswerQuestions)
    .where(eq(shortAnswerQuestions.questionId, questionId))
    .limit(1)

  if (existing.length) {
    await db
      .update(shortAnswerQuestions)
      .set({ correctAnswers: JSON.stringify(correctAnswers) })
      .where(eq(shortAnswerQuestions.questionId, questionId))
  } else {
    await db.insert(shortAnswerQuestions).values({
      id: crypto.randomUUID(),
      questionId,
      correctAnswers: JSON.stringify(correctAnswers),
    })
  }
}

// Matching Pairs
export async function addMatchingPair(
  questionId: string,
  pair: {
    leftText: string
    rightText: string
  },
) {
  const count = await db
    .select()
    .from(matchingPairs)
    .where(eq(matchingPairs.questionId, questionId))

  await db.insert(matchingPairs).values({
    id: crypto.randomUUID(),
    questionId,
    leftText: pair.leftText,
    rightText: pair.rightText,
    orderIndex: count.length,
  })
}

// Quiz Attempts and Scoring
export async function submitQuizAttempt(quizId: string, responses: Record<string, string>, timeSpent?: number) {
  const userId = await getUserId()
  const startTime = new Date()

  // Get all questions for this quiz
  const quizQuestions = await getQuestionsByQuizId(quizId)

  let totalScore = 0
  const maxScore = quizQuestions.length

  const attemptId = crypto.randomUUID()

  // Evaluate each response
  for (const question of quizQuestions) {
    const userResponse = responses[question.id] || ''
    let isCorrect = false
    let score = 0

    if (question.type === 'mcq') {
      const selected = question.typeData.find((opt: any) => opt.text === userResponse)
      isCorrect = selected?.isCorrect || false
    } else if (question.type === 'true_false') {
      isCorrect = userResponse === String(question.typeData[0]?.correctAnswer)
    } else if (question.type === 'short_answer') {
      const correctAnswers = JSON.parse(question.typeData[0]?.correctAnswers || '[]')
      isCorrect = correctAnswers.some(
        (ans: string) => ans.toLowerCase().trim() === userResponse.toLowerCase().trim(),
      )
    } else if (question.type === 'matching') {
      // For matching, userResponse should be JSON of matched pairs
      try {
        const userMatches = JSON.parse(userResponse)
        const pairs = question.typeData
        isCorrect = pairs.every((pair: any) => userMatches[pair.leftText] === pair.rightText)
      } catch {
        isCorrect = false
      }
    }

    if (isCorrect) {
      score = 1
      totalScore += 1
    }

    await db.insert(questionResponses).values({
      id: crypto.randomUUID(),
      attemptId,
      questionId: question.id,
      userResponse,
      isCorrect,
      score,
    })
  }

  const percentage = ((totalScore / maxScore) * 100).toFixed(2)

  await db.insert(quizAttempts).values({
    id: attemptId,
    userId,
    quizId,
    score: totalScore,
    maxScore,
    percentage: parseFloat(percentage),
    startedAt: startTime,
    completedAt: new Date(),
  })

  // Update user stats
  const userStat = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1)

  if (userStat.length) {
    const newCorrect = userStat[0].totalCorrectAnswers + totalScore
    const newTotal = userStat[0].totalQuestionsAnswered + maxScore
    const newAvg = (newCorrect / newTotal) * 100

    await db
      .update(userStats)
      .set({
        totalQuizzesTaken: userStat[0].totalQuizzesTaken + 1,
        totalQuestionsAnswered: newTotal,
        totalCorrectAnswers: newCorrect,
        averageScore: parseFloat(newAvg.toFixed(2)),
        updatedAt: new Date(),
      })
      .where(eq(userStats.userId, userId))
  } else {
    await db.insert(userStats).values({
      id: crypto.randomUUID(),
      userId,
      totalQuizzesTaken: 1,
      totalQuestionsAnswered: maxScore,
      totalCorrectAnswers: totalScore,
      averageScore: parseFloat(percentage),
    })
  }

  // Update quiz stats
  const quizStat = await db
    .select()
    .from(quizStats)
    .where(eq(quizStats.quizId, quizId))
    .limit(1)

  if (quizStat.length) {
    const newAvg =
      (quizStat[0].averageScore * quizStat[0].totalAttempts + parseFloat(percentage)) /
      (quizStat[0].totalAttempts + 1)

    await db
      .update(quizStats)
      .set({
        totalAttempts: quizStat[0].totalAttempts + 1,
        averageScore: parseFloat(newAvg.toFixed(2)),
        totalParticipants: quizStat[0].totalParticipants + 1,
        updatedAt: new Date(),
      })
      .where(eq(quizStats.quizId, quizId))
  } else {
    await db.insert(quizStats).values({
      id: crypto.randomUUID(),
      quizId,
      totalAttempts: 1,
      averageScore: parseFloat(percentage),
      totalParticipants: 1,
    })
  }

  revalidatePath(`/quiz/${quizId}`)
  return { attemptId, score: totalScore, maxScore, percentage: parseFloat(percentage) }
}

export async function getQuizAttempts(quizId: string) {
  const userId = await getUserId()
  return db
    .select()
    .from(quizAttempts)
    .where(and(eq(quizAttempts.quizId, quizId), eq(quizAttempts.userId, userId)))
    .orderBy(desc(quizAttempts.createdAt))
}

export async function getLeaderboard(quizId: string) {
  return db
    .select({
      userId: quizAttempts.userId,
      score: quizAttempts.score,
      percentage: quizAttempts.percentage,
      completedAt: quizAttempts.completedAt,
    })
    .from(quizAttempts)
    .where(eq(quizAttempts.quizId, quizId))
    .orderBy(desc(quizAttempts.percentage), desc(quizAttempts.completedAt))
}

export async function getUserStats() {
  // Demo data for UI demonstration
  return [
    {
      id: 'stats-1',
      userId: 'demo-user-1',
      totalQuizzesTaken: 5,
      totalQuestionsAnswered: 50,
      totalCorrectAnswers: 42,
      averageScore: 84,
      totalTimeSpent: 1800,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

export async function getQuizWithQuestions(quizId: string) {
  const quiz = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, quizId))
    .limit(1)

  if (!quiz.length) return null

  const questionsList = await getQuestionsByQuizId(quizId)
  
  // Enrich questions with their type-specific data
  const enrichedQuestions = questionsList.map((q: any) => {
    if (q.type === 'mcq') {
      return {
        ...q,
        options: q.typeData,
      }
    } else if (q.type === 'true_false') {
      return {
        ...q,
        correctAnswer: q.typeData[0]?.correctAnswer,
      }
    } else if (q.type === 'short_answer') {
      return {
        ...q,
        correctAnswers: q.typeData[0]?.correctAnswers ? JSON.parse(q.typeData[0].correctAnswers) : [],
      }
    } else if (q.type === 'matching') {
      return {
        ...q,
        pairs: q.typeData,
      }
    }
    return q
  })

  return {
    ...quiz[0],
    questions: enrichedQuestions,
  }
}

export async function getAttemptResults(attemptId: string) {
  const attempt = await db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.id, attemptId))
    .limit(1)

  if (!attempt.length) return null

  const responses = await db
    .select()
    .from(questionResponses)
    .where(eq(questionResponses.attemptId, attemptId))

  // Enrich responses with question text
  const enrichedResponses = await Promise.all(
    responses.map(async (r: any) => {
      const q = await db
        .select()
        .from(questions)
        .where(eq(questions.id, r.questionId))
        .limit(1)
      return {
        ...r,
        question: q[0],
      }
    }),
  )

  return {
    ...attempt[0],
    responses: enrichedResponses,
  }
}

export async function getQuizLeaderboard(quizId: string) {
  const allAttempts = await db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.quizId, quizId))

  // Get unique users with their best scores
  const uniqueEntries: Record<string, any> = {}
  for (const attempt of allAttempts) {
    const userId = attempt.userId
    if (!uniqueEntries[userId] || attempt.percentage > uniqueEntries[userId].percentage) {
      uniqueEntries[userId] = {
        score: attempt.score,
        percentage: attempt.percentage,
        maxScore: attempt.maxScore,
      }
    }
  }

  // Get quiz and stats info
  const quiz = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, quizId))
    .limit(1)

  const stats = await db
    .select()
    .from(quizStats)
    .where(eq(quizStats.quizId, quizId))
    .limit(1)

  // Format entries for leaderboard
  const entries = Object.entries(uniqueEntries)
    .map(([userId, data]: [string, any]) => ({
      userId,
      bestScore: data.score,
      percentage: data.percentage,
      totalAttempts: allAttempts.filter((a) => a.userId === userId).length,
    }))
    .sort((a, b) => b.percentage - a.percentage)

  return {
    quiz: quiz[0],
    entries,
    total: Object.keys(uniqueEntries).length,
    averageScore: stats[0]?.averageScore || 0,
  }
}
