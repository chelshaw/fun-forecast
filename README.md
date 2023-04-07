# ~ 🌞 ~ Fun Forecast ~ 🌞 ~

This webapp tells you when is the best time to do the things you love to do outside.

- Check the [backend README](./backend/README.md) for instructions on running the backend
- Run the frontend locally with `cd frontend; yarn start` ([README here](./frontend/README.md))

## Development Process

- Check out a branch based off main for your work `git checkout -b descriptive-branch-name`
- Open a PR against the `main` branch
- Once approved and smoke tested, **squash** merge the PR
- When we're ready to release a set of changes from development, we will open a PR from `main` to `release/beta` and **merge** it (not squash). This will automatically kick off deployment to AWS for backend and frontend. 
 