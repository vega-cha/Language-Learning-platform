import {
  $query,
  $update,
  Record,
  StableBTreeMap,
  Vec,
  match,
  Result,
  nat64,
  ic,
  Opt,
} from "azle";
import { v4 as uuidv4 } from "uuid";


type Course = Record<{
  id: string;
  name: string;
  description: string;
  createdAt: nat64;
  updatedAt: Opt<nat64>;
}>;

  type Flashcard = Record<{
  id: string;
  term: string;
  definition: string;
  courseId: string;
  createdAt: nat64;
  updatedAt: Opt<nat64>;
}>;



 type Quiz = Record<{
  id: string;
  question: string;
  options: Vec<string>;
  correctAnswer: string;
  courseId: string;
  createdAt: nat64;
  updatedAt: Opt<nat64>;
}>;


type User = Record<{
id: string;
name: string;
email: string;
courses: Vec<string>;
progress: string;
goals: string;
createdAt: nat64;
updatedAt: Opt<nat64>;
}>;


type CoursePayload = Record<{
  name: string;
  description: string;
}>;


type FlashcardPayload = Record<{
  term: string;
  definition: string;
  courseId: string;
}>;


type QuizPayload = Record<{
  question: string;
  options: Vec<string>;
  correctAnswer: string;
  courseId: string;
}>;

type UserPayload = Record<{
  name: string;
  email: string;
  progress:string;
  goals:string
}>;


const courseStorage = new StableBTreeMap<string, Course>(0, 44, 1024);
const flashcardStorage = new StableBTreeMap<string, Flashcard>(1, 44, 1024);
const quizStorage = new StableBTreeMap<string, Quiz>(2, 44, 1024);
const userStorage = new StableBTreeMap<string, User>(3, 44, 1024);

$update;
export function createCourse(payload: CoursePayload): Result<Course, string> {
  const course: Course = {
    id: uuidv4(),
    createdAt: ic.time(),
    updatedAt: Opt.None,
    ...payload,
  };

  courseStorage.insert(course.id, course);
  return Result.Ok<Course, string>(course);
}

$query;
export function getCourse(id: string): Result<Course, string> {
  return match(courseStorage.get(id), {
    Some: (course) => Result.Ok<Course, string>(course),
    None: () => Result.Err<Course, string>(`Course with ID=${id} not found.`),
  });
}

$query;
export function getAllCourses(): Result<Vec<Course>, string> {
  return Result.Ok(courseStorage.values());
}

$update;
export function updateCourse(id: string, payload: CoursePayload): Result<Course, string> {
  return match(courseStorage.get(id), {
    Some: (existingCourse) => {
      const updatedCourse: Course = {
        ...existingCourse,
        ...payload,
        updatedAt: Opt.Some(ic.time()),
      };

      courseStorage.insert(updatedCourse.id, updatedCourse);
      return Result.Ok<Course, string>(updatedCourse);
    },
    None: () => Result.Err<Course, string>(`Course with ID=${id} not found.`),
  });
}


 $update;
export function deleteCourse(id: string): Result<Course, string> {
  return match(courseStorage.get(id), {
    Some: (existingCourse) => {
      courseStorage.remove(id);
      return Result.Ok<Course, string>(existingCourse);
    },
    None: () => Result.Err<Course, string>(`Course with ID=${id} not found.`),
  });
}


$update;
export function createFlashcard(payload: FlashcardPayload): Result<Flashcard, string> {
  const flashcard: Flashcard = {
    id: uuidv4(),
    createdAt: ic.time(),
    updatedAt: Opt.Some(ic.time()),
    ...payload,
  };

  flashcardStorage.insert(flashcard.id, flashcard);
  return Result.Ok<Flashcard, string>(flashcard);
}

$query;
export function getFlashcard(id: string): Result<Flashcard, string> {
  return match(flashcardStorage.get(id), {
    Some: (flashcard) => Result.Ok<Flashcard, string>(flashcard),
    None: () => Result.Err<Flashcard, string>(`Flashcard with ID=${id} not found.`),
  });
}


$query;
export function getFlashcardsForCourse(courseId: string): Result<Vec<Flashcard>, string> {
  const flashcards = flashcardStorage.values().filter((flashcard) => flashcard.courseId === courseId);
  return Result.Ok(flashcards);
}


$update;
export function createQuiz(payload: QuizPayload): Result<Quiz, string> {
  const quiz: Quiz = {
    id: uuidv4(),
    createdAt: ic.time(),
    updatedAt: Opt.Some(ic.time()),
    ...payload,
  };

  quizStorage.insert(quiz.id, quiz);
  return Result.Ok<Quiz, string>(quiz);
}


$query;
export function getQuiz(id: string): Result<Quiz, string> {
  return match(quizStorage.get(id), {
    Some: (quiz) => Result.Ok<Quiz, string>(quiz),
    None: () => Result.Err<Quiz, string>(`Quiz with ID=${id} not found.`),
  });
}


$query;
export function getQuizzesForCourse(courseId: string): Result<Vec<Quiz>, string> {
  const quizzes = quizStorage.values().filter((quiz) => quiz.courseId === courseId);
  return Result.Ok(quizzes);
}

$update;
export function createUser(payload: UserPayload): Result<User, string> {
  const user: User = {
    id: uuidv4(),
    createdAt: ic.time(),
    updatedAt: Opt.Some(ic.time()),
    courses: [],
    ...payload,
  };

  userStorage.insert(user.id, user);
  return Result.Ok<User, string>(user);
}

$query;
export function getUser(id: string): Result<User, string> {
  return match(userStorage.get(id), {
    Some: (user) => Result.Ok<User, string>(user),
    None: () => Result.Err<User, string>(`User with ID=${id} not found.`),
  });
}

$query;
export function getAllUsers(): Result<Vec<User>, string> {
  return Result.Ok(userStorage.values());
}



$update;
export function setLanguageLearningGoal(userId: string, target: string): Result<User, string> {
  return match(userStorage.get(userId), {
    Some: (user) => {
      user.goals = target;
      userStorage.insert(userId, user);
      return Result.Ok<User, string>(user);
    },
    None: () => Result.Err<User, string>(`User with ID=${userId} not found.`),
  });
}




globalThis.crypto = {
  //@ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
