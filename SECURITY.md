# Security

The `GOOD_MORNING_WEBHOOK_URL` value must be stored in GitHub Actions Secrets and must never be committed to this repository.

If a webhook URL is exposed, rotate or revoke it at the provider immediately and replace the corresponding GitHub Actions secret.
