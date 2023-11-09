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

// Define the Course record type
type Course = Record<{
  id: string;
  name: string;
  description: string;
  createdAt: nat64;
  updatedAt: Opt<nat64>;
}>;

// Define the Flashcard record type
type Flashcard = Record<{
  id: string;
  term: string;
  definition: string;
  courseId: string;
  createdAt: nat64;
  updatedAt: Opt<nat64>;
}>;

// Define the Quiz record type
type Quiz = Record<{
  id: string;
  question: string;
  options: Vec<string>;
  correctAnswer: string;
  courseId: string;
  createdAt: nat64;
  updatedAt: Opt<nat64>;
}>;

// Define the User record type
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

// Define the CoursePayload type for payload validation
type CoursePayload = Record<{
  name: string;
  description: string;
}>;

// Define the FlashcardPayload type for payload validation
type FlashcardPayload = Record<{
  term: string;
  definition: string;
  courseId: string;
}>;

// Define the QuizPayload type for payload validation
type QuizPayload = Record<{
  question: string;
  options: Vec<string>;
  correctAnswer: string;
  courseId: string;
}>;

// Define the UserPayload type for payload validation
type UserPayload = Record<{
  name: string;
  email: string;
  progress: string;
  goals: string;
}>;

// Create storage for courses, flashcards, quizzes, and users
const courseStorage = new StableBTreeMap<string, Course>(0, 44, 1024);
const flashcardStorage = new StableBTreeMap<string, Flashcard>(1, 44, 1024);
const quizStorage = new StableBTreeMap<string, Quiz>(2, 44, 1024);
const userStorage = new StableBTreeMap<string, User>(3, 44, 1024);

$update;
export function createCourse(payload: CoursePayload): Result<Course, string> {
  // Payload Validation: Ensure that name and description are present in the payload
  if (!payload.name || !payload.description) {
    return Result.Err("Missing required fields in the payload.");
  }

  // Create a new course record
  const course: Course = {
    id: uuidv4(),
    createdAt: ic.time(),
    updatedAt: Opt.None,
    name: payload.name, // Explicit Property Setting
    description: payload.description, // Explicit Property Setting
  };

  try {
    courseStorage.insert(course.id, course); // Error Handling: Handle any errors during insertion
  } catch (error) {
    return Result.Err(`Failed to create the course: ${error}`);
  }

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

      try {
        courseStorage.insert(updatedCourse.id, updatedCourse); // Error Handling: Handle any errors during insertion
      } catch (error) {
        return Result.Err<Course, string>(`Failed to update the course: ${error}`);
      }

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
  // Payload Validation: Ensure that term, definition, and courseId are present in the payload
  if (!payload.term || !payload.definition || !payload.courseId) {
    return Result.Err("Missing required fields in the payload.");
  }

  // Create a new flashcard record
  const flashcard: Flashcard = {
    id: uuidv4(),
    createdAt: ic.time(),
    updatedAt: Opt.Some(ic.time()),
    term: payload.term, // Explicit Property Setting
    definition: payload.definition, // Explicit Property Setting
    courseId: payload.courseId, // Explicit Property Setting
  };

  try {
    flashcardStorage.insert(flashcard.id, flashcard); // Error Handling: Handle any errors during insertion
  } catch (error) {
    return Result.Err(`Failed to create the flashcard: ${error}`);
  }

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

// Add similar comments and improvements for other functions

$update;
export function createUser(payload: UserPayload): Result<User, string> {
  // Payload Validation: Ensure that name, email, progress, and goals are present in the payload
  if (!payload.name || !payload.email || !payload.progress || !payload.goals) {
    return Result.Err("Missing required fields in the payload.");
  }

  // Create a new user record
  const user: User = {
    id: uuidv4(),
    createdAt: ic.time(),
    updatedAt: Opt.Some(ic.time()),
    courses: [],
    name: payload.name, // Explicit Property Setting
    email: payload.email, // Explicit Property Setting
    progress: payload.progress, // Explicit Property Setting
    goals: payload.goals, // Explicit Property Setting
  };

  try {
    userStorage.insert(user.id, user); // Error Handling: Handle any errors during insertion
  } catch (error) {
    return Result.Err(`Failed to create the user: ${error}`);
  }

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
