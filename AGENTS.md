# AGENTS.md

Standing instructions for AI coding agents working in this repository. Read this before every task.

## Project

Tweeter is a Twitter-like web app built for a university software design course. It is graded coursework: the owner must be able to read, explain, and defend every line, so simple and obvious beats clever.

- Language: TypeScript (strict mode). npm workspaces, two modules.
- `tweeter-shared/`: domain classes (`User`, `Status`, `AuthToken`, `Follow`, `PostSegment`) and `FakeData`. Source in `tweeter-shared/src/`, exported through `tweeter-shared/src/index.ts`.
- `tweeter-web/`: React 18 + Vite front end, Model-View-Presenter.
  - `tweeter-web/src/components/`: React components and hooks (the views)
  - `tweeter-web/src/presenter/`: presenters and the view interfaces they talk to
  - `tweeter-web/src/model/service/`: services, the only code that reaches the back end
  - `tweeter-web/test/`: Jest tests, mirroring the `src/` folder layout, named `*.test.ts` or `*.test.tsx`

## Commands

Run from the folder shown. All of them must pass before you report a task as finished.

| Check | Folder | Command |
|---|---|---|
| Build shared module | `tweeter-shared` | `npm run build` |
| Type-check | `tweeter-web` | `npx tsc --noEmit` |
| Tests | `tweeter-web` | `npm test` |
| Build web module | `tweeter-web` | `npm run build` |

- If you change anything in `tweeter-shared`, rebuild it before running the `tweeter-web` checks; `tweeter-web` reads it from `tweeter-shared/dist`.
- There is no lint script. Do not add one.

## Conventions

- Dependencies point one way: components -> presenters -> services -> `tweeter-shared`. Presenters and services never import React or anything from `components/`.
- A presenter extends `Presenter<V>` (or one of its existing subclasses) and talks to its view only through a view interface defined in the presenter's own file.
- Error handling: services throw `Error`. Presenters wrap service calls in `doFailureReportingOperation(operation, operationDescription)`, which reports `Failed to <operationDescription> because of exception: <error>` through `view.displayErrorMessage`. Do not write your own try/catch for this, and never leave a catch block empty.
- Before writing a helper, base class, or hook, look for an existing one and use it.
- Names are full descriptive words (`loggingOutToastId`, not `id` or `x`). Classes and components are PascalCase in a file of the same name; functions and variables are camelCase.
- No comments in code. The single exception is the attribution marker described below.
- No `any`, `as any`, `@ts-ignore`, `@ts-expect-error`, or `eslint-disable`.
- Tests use Jest with `@typestrong/ts-mockito` for presenters and services and `@testing-library/react` with `@testing-library/user-event` for components. Follow the structure of the existing tests in `tweeter-web/test/`.
- Match the formatting of the surrounding code. Do not reformat lines you are not changing.

## Design commandments

All code you write must follow the course's ten design commandments. They apply to the code the task asks for, not to existing code: do not refactor other code to satisfy them, mention it in your report instead.

1. **Keep it simple.** Build only what the task requires now. No classes, parameters, interfaces, or options for a possible future.
2. **Don't repeat code.** Each piece of logic lives in one place. Reuse what exists; use generics when only a type varies and a template method when only a step varies.
3. **Single responsibility.** A class has one responsibility and one reason to change, and a method does one task. If describing it needs the word "and", split it.
4. **Minimize dependencies between modules.** Talk to as few other modules as possible. Pass in only the values needed, and avoid long call chains like `a.getB().getC()`.
5. **Properly decompose.** Split work until each method is short and simple enough to read like an outline. Do not split into pieces that have no meaningful name of their own.
6. **High-quality abstractions.** Names say what something does, not how. Fields are `private` by default and data stays behind methods. Use a type instead of loose primitives when a concept has its own rules.
7. **Depend on abstractions.** When a dependency is needed, depend on an interface or abstract class, the narrowest one that covers the use.
8. **Isolate design choices.** A choice that may change (a data format, a vendor, a storage or network detail) lives in one class, so changing it touches one place.
9. **Write testable code.** Code must be testable in isolation with mocks standing in for its dependencies. Keep logic out of React components and separate from I/O.
10. **Properly report and handle errors.** Code that detects an error must recover, pass it to its caller, or report it. Never swallow an error or let a failure look like success.

When two of these pull against each other, simplicity wins unless there is a present need: a second implementation, a test that needs a mock, or real duplication. If you are unsure which way to go, stop and ask.

## Off-limits

- `node_modules/`, any `dist/` folder, `.idea/`
- `package-lock.json` by hand
- `README.md`, `milestone-2c-report.md`, and this file
- Existing tests: do not delete, skip, or loosen them. If you think a test is wrong, stop and explain why.
- Dependencies: do not add, remove, or upgrade a package without asking first.
- Code the task does not require. No refactoring, renaming, or clean-up outside the task, even if you see something you would improve. Mention it in your report instead.

## How we work

1. Each session you are given one task. Do that task and nothing else.
2. Read the files the task names before changing anything.
3. If the task leaves something undecided, or you find it conflicts with the existing code, stop and ask. Do not pick an answer yourself.
4. Do not run `git add`, `git commit`, `git push`, or change branches. The owner reviews and commits every change.
5. Run every command in the Commands table.
6. Update `AI-ATTRIBUTION.md` (see below).
7. Finish with the report (see below).

## Attribution

Two things are required for every task that changes code.

**Marker.** Every file that contains code you wrote or changed gets this as its first line, if it is not already there:

```
// AI-assisted: see AI-ATTRIBUTION.md
```

**Log.** Add one entry to the end of `AI-ATTRIBUTION.md` in the repository root (create the file if it does not exist). One entry per task, in this format:

```
## <YYYY-MM-DD>: <file path> (<new file | modified>)
- Tool: <the name of the tool you are>
- Task: <one or two sentences on what was asked for>
- Review: TODO
```

- If the task touched several files, list each path in the heading, separated by commas, each with its own `(new file)` or `(modified)`.
- Describe only changes that are actually in the working tree. Do not list anything you planned but did not do, and do not leave out anything you did.
- Always write `Review: TODO` exactly. The owner fills that line in after reviewing.

## Report

End every task with a report containing, in this order:

1. **Summary**: two or three sentences on what you changed.
2. **Files**: every file created, modified, or deleted.
3. **Marker added**: every file that received the `// AI-assisted` line in this task, or "none".
4. **Checks**: each command from the Commands table and its actual result, including the test counts. If a check fails, say so and paste the failure. Do not report a check you did not run.
5. **Questions and assumptions**: anything you were unsure of, anything you assumed, and anything outside the task that you noticed but left alone.
6. **Attribution entry**: the entry you added to `AI-ATTRIBUTION.md`, copied exactly.
