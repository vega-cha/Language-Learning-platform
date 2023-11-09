import {
  Principal,
  Actor,
  createActor,
  Http,
  Random,
  PrincipalIdentity,
  TypeSafe,
  Result,
  TextEncoder,
  TextDecoder,
} from "axle";

type Course = Record<string, {
  id: string;
  name: string;
  description: string;
  createdAt: bigint;
  updatedAt: bigint | null;
}>;

type Flashcard = Record<string, {
  id: string;
  term: string;
  definition: string;
  courseId: string;
  createdAt: bigint;
  updatedAt: bigint | null;
}>;

type Quiz = Record<string, {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  courseId: string;
  createdAt: bigint;
  updatedAt: bigint | null;
}>;

type User = Record<string, {
  id: string;
  name: string;
  email: string;
  courses: string[];
  progress: string;
  goals: string;
  createdAt: bigint;
  updatedAt: bigint | null;
}>;

type CoursePayload = Record<string, {
  name: string;
  description: string;
}>;

type FlashcardPayload = Record<string, {
  term: string;
  definition: string;
  courseId: string;
}>;

type QuizPayload = Record<string, {
  question: string;
  options: string[];
  correctAnswer: string;
  courseId: string;
}>;

type UserPayload = Record<string, {
  name: string;
  email: string;
  progress: string;
  goals: string;
}>;

class MyActor extends Actor {
  courseStorage: TypeSafe<Record<string, Course>>;
  flashcardStorage: TypeSafe<Record<string, Flashcard>>;
  quizStorage: TypeSafe<Record<string, Quiz>>;
  userStorage: TypeSafe<Record<string, User>>;

  constructor() {
    super();
    this.courseStorage = new TypeSafe<Record<string, Course>>(0);
    this.flashcardStorage = new TypeSafe<Record<string, Flashcard>>(1);
    this.quizStorage = new TypeSafe<Record<string, Quiz>>(2);
    this.userStorage = new TypeSafe<Record<string, User>>(3);
  }

  @Http.POST
  createCourse(payload: CoursePayload): Result<Course, string> {
    const course: Course = {
      id: Random.randomUUID(),
      createdAt: Date.now(),
      updatedAt: null,
      ...payload,
    };

    this.courseStorage.set(course.id, course);
    return Result.Ok<Course, string>(course);
  }

  @Http.GET
  getCourse(id: string): Result<Course, string> {
    const course = this.courseStorage.get(id);
    if (course !== null) {
      return Result.Ok<Course, string>(course);
    } else {
      return Result.Err<Course, string>(`Course with ID=${id} not found.`);
    }
  }

  @Http.GET
  getAllCourses(): Result<Course[], string> {
    return Result.Ok(Object.values(this.courseStorage.entries));
  }

  @Http.PUT
  updateCourse(id: string, payload: CoursePayload): Result<Course, string> {
    const existingCourse = this.courseStorage.get(id);
    if (existingCourse !== null) {
      const updatedCourse: Course = {
        ...existingCourse,
        ...payload,
        updatedAt: Date.now(),
      };

      this.courseStorage.set(updatedCourse.id, updatedCourse);
      return Result.Ok<Course, string>(updatedCourse);
    } else {
      return Result.Err<Course, string>(`Course with ID=${id} not found.`);
    }
  }

  @Http.DELETE
  deleteCourse(id: string): Result<Course, string> {
    const existingCourse = this.courseStorage.get(id);
    if (existingCourse !== null) {
      this.courseStorage.delete(id);
      return Result.Ok<Course, string>(existingCourse);
    } else {
      return Result.Err<Course, string>(`Course with ID=${id} not found.`);
    }
  }

  @Http.POST
  createFlashcard(payload: FlashcardPayload): Result<Flashcard, string> {
    const flashcard: Flashcard = {
      id: Random.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...payload,
    };

    this.flashcardStorage.set(flashcard.id, flashcard);
    return Result.Ok<Flashcard, string>(flashcard);
  }

  @Http.GET
  getFlashcard(id: string): Result<Flashcard, string> {
    const flashcard = this.flashcardStorage.get(id);
    if (flashcard !== null) {
      return Result.Ok<Flashcard, string>(flashcard);
    } else {
      return Result.Err<Flashcard, string>(`Flashcard with ID=${id} not found.`);
    }
  }

  @Http.GET
  getFlashcardsForCourse(courseId: string): Result<Flashcard[], string> {
    const flashcards = Object.values(this.flashcardStorage.entries).filter((f) => f.courseId === courseId);
    return Result.Ok(flashcards);
  }

  // Implement other methods for quizzes and users in a similar fashion.
}

createActor(MyActor);
