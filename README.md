# Language Learning Platform

Welcome to our Language Learning Platform! This web application is designed to elevate your language learning journey, providing a comprehensive and user-centric experience. Whether you're a beginner or an advanced learner, our platform offers a range of features to support your language learning goals.

`dfx` is the tool you will use to interact with the IC locally and on mainnet. If you don't already have it installed:

```bash
npm run dfx_install
```

Next you will want to start a replica, which is a local instance of the IC that you can deploy your canisters to:

```bash
npm run replica_start
```

If you ever want to stop the replica:

```bash
npm run replica_stop
```

Now you can deploy your canister locally:

```bash
npm install
npm run canister_deploy_local
```

## Usage
The Language Learning Platform provides a user-friendly interface for language learning. Explore the different sections, create courses, add flashcards, and engage in interactive practice sessions. Customize your learning plan and track your progress effortlessly.

## Interacting With Backend Using DFX tool
The backend of the Language Learning Platform is powered by IC. Below are some key methods that can be interacted using dfx:

**Create a Course:**

You can replace Course Name and Course Description in your own freewill.

```bash
dfx canister call Language_Learning_Platform createCourse '(record { name="Course Name"; description= "Course Description" })'
```

**Get a Course:**

Provide course Id to get a course

```bash
dfx canister call Language_Learning_Platform getCourse '("CourseID")'
```

**Get All Courses:**

To get All available courses 

```bash
dfx canister call Language_Learning_Platform getAllCourses
```


Assuming you have [created a cycles wallet](https://internetcomputer.org/docs/current/developer-docs/quickstart/network-quickstart) and funded it with cycles, you can deploy to mainnet like this:

```bash
dfx deploy --ic
```



License
This project is licensed under the MIT License.