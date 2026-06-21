# Good Morning Automation

This repository contains a GitHub Actions cloud automation that sends `早安` every morning at 6:00.

## How it works

- `.github/workflows/good-morning.yml` runs on a daily schedule and can also be triggered manually.
- GitHub Actions cron expressions use UTC, so the workflow uses `0 22 * * *`, which is 06:00 the next day in Asia/Shanghai.
- `scripts/send_good_morning.py` posts a JSON payload to the configured webhook URL:

```json
{"text":"早安"}
```

## Configuration

1. In your GitHub repository, go to **Settings → Secrets and variables → Actions → Secrets**.
2. Add a secret named `GOOD_MORNING_WEBHOOK_URL` with your destination webhook URL.
3. Optional: go to **Variables** and add `GOOD_MORNING_MESSAGE` to customize the message.

If `GOOD_MORNING_WEBHOOK_URL` is not set, the workflow logs the message it would send and exits successfully.
