#!/usr/bin/env python3
"""Send a configurable good-morning message to a webhook endpoint."""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request


def main() -> int:
    message = os.getenv("GOOD_MORNING_MESSAGE", "早安")
    webhook_url = os.getenv("GOOD_MORNING_WEBHOOK_URL")

    if not webhook_url:
        print(
            "GOOD_MORNING_WEBHOOK_URL is not configured; "
            f'would have sent: "{message}"'
        )
        return 0

    payload = json.dumps({"text": message}, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        webhook_url,
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            response_body = response.read().decode("utf-8", errors="replace")
            print(f"Webhook responded with HTTP {response.status}: {response_body}")
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        print(f"Webhook failed with HTTP {error.code}: {body}", file=sys.stderr)
        return 1
    except urllib.error.URLError as error:
        print(f"Webhook request failed: {error}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
